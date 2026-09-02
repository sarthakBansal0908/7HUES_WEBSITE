import os
import uuid
import json
import logging
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Optional, List, Any, Dict

import requests
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, UploadFile, File, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sevenhues")

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# ---------------------------------------------------------------------------
# Object storage (Emergent)
# ---------------------------------------------------------------------------
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "sevenhues"
storage_key: Optional[str] = None

MIME_TYPES = {
    "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "gif": "image/gif",
    "webp": "image/webp", "mp4": "video/mp4", "webm": "video/webm", "mov": "video/quicktime",
    "svg": "image/svg+xml", "ico": "image/x-icon",
}


def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=180,
    )
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data, timeout=180,
        )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=120)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=120)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(title="7HUES Expeditions API")
api = APIRouter(prefix="/api")


def now_iso():
    return datetime.now(timezone.utc).isoformat()


# ---------------------------------------------------------------------------
# Auth (Emergent Google OAuth)
# ---------------------------------------------------------------------------
ADMIN_EMAILS = [e.strip().lower() for e in (os.environ.get("ADMIN_EMAILS") or "").split(",") if e.strip()]


class User(BaseModel):
    user_id: str
    email: str
    name: str = ""
    picture: str = ""
    is_admin: bool = False


async def get_current_user(request: Request, authorization: Optional[str] = Header(None)) -> Optional[User]:
    token = request.cookies.get("session_token")
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
    if not token:
        return None
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        return None
    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None
    user_doc = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user_doc:
        return None
    return User(**user_doc)


def is_admin_email(email: Optional[str]) -> bool:
    return bool(email) and email.strip().lower() in ADMIN_EMAILS


async def require_admin(user: Optional[User] = Depends(get_current_user)) -> User:
    # Admin access is controlled EXCLUSIVELY by the ADMIN_EMAILS allowlist.
    if not user or not is_admin_email(user.email):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


@api.post("/auth/session")
async def process_session(request: Request, response: Response):
    body = await request.json()
    session_id = body.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    r = requests.get(
        "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
        headers={"X-Session-ID": session_id}, timeout=30,
    )
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session")
    data = r.json()
    email = (data.get("email") or "").lower()
    # Admin is determined ONLY by the explicit allowlist (no first-login bootstrap).
    is_admin = is_admin_email(email)

    user_doc = await db.users.find_one({"email": email}, {"_id": 0})
    if user_doc:
        user_id = user_doc["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": data.get("name", ""), "picture": data.get("picture", ""),
                      "is_admin": is_admin}},
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id, "email": email, "name": data.get("name", ""),
            "picture": data.get("picture", ""), "is_admin": is_admin, "created_at": now_iso(),
        })

    session_token = data.get("session_token") or f"tok_{uuid.uuid4().hex}"
    expires = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.insert_one({
        "user_id": user_id, "session_token": session_token,
        "expires_at": expires, "created_at": now_iso(),
    })
    response.set_cookie("session_token", session_token, httponly=True, secure=True,
                        samesite="none", path="/", max_age=7 * 24 * 3600)
    return {"user_id": user_id, "email": email, "name": data.get("name", ""),
            "picture": data.get("picture", ""), "is_admin": is_admin}


@api.get("/auth/me")
async def auth_me(user: Optional[User] = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    # Always reflect the current allowlist, regardless of any stored flag.
    return {**user.model_dump(), "is_admin": is_admin_email(user.email)}


@api.post("/auth/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get("session_token")
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie("session_token", path="/")
    return {"ok": True}


# ---------------------------------------------------------------------------
# Media library
# ---------------------------------------------------------------------------
@api.post("/media/upload")
async def upload_media(file: UploadFile = File(...), alt: str = Query(""), admin: User = Depends(require_admin)):
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "bin"
    content_type = file.content_type or MIME_TYPES.get(ext, "application/octet-stream")
    media_id = str(uuid.uuid4())
    path = f"{APP_NAME}/media/{media_id}.{ext}"
    data = await file.read()
    result = put_object(path, data, content_type)
    doc = {
        "id": media_id, "storage_path": result["path"], "original_filename": file.filename,
        "content_type": content_type, "size": result.get("size", len(data)), "alt": alt,
        "kind": "video" if content_type.startswith("video") else "image",
        "is_deleted": False, "created_at": now_iso(),
    }
    await db.media.insert_one(doc)
    doc.pop("_id", None)
    doc["url"] = f"/api/files/{result['path']}"
    return doc


@api.get("/media")
async def list_media(admin: User = Depends(require_admin)):
    items = await db.media.find({"is_deleted": False}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for it in items:
        it["url"] = f"/api/files/{it['storage_path']}"
    return items


@api.delete("/media/{media_id}")
async def delete_media(media_id: str, admin: User = Depends(require_admin)):
    await db.media.update_one({"id": media_id}, {"$set": {"is_deleted": True}})
    return {"ok": True}


@api.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.media.find_one({"storage_path": path, "is_deleted": False}, {"_id": 0})
    data, content_type = get_object(path)
    media_type = record.get("content_type", content_type) if record else content_type
    return Response(content=data, media_type=media_type,
                    headers={"Cache-Control": "public, max-age=31536000, immutable"})


# ---------------------------------------------------------------------------
# Site content (singleton, CMS-driven)
# ---------------------------------------------------------------------------
@api.get("/content")
async def get_content():
    doc = await db.site_content.find_one({"_id": "homepage"})
    if not doc:
        doc = default_content()
        await db.site_content.replace_one({"_id": "homepage"}, {"_id": "homepage", **doc}, upsert=True)
    doc.pop("_id", None)
    return doc


@api.put("/content")
async def update_content(request: Request, admin: User = Depends(require_admin)):
    body = await request.json()
    body.pop("_id", None)
    body["updated_at"] = now_iso()
    await db.site_content.update_one({"_id": "homepage"}, {"$set": body}, upsert=True)
    doc = await db.site_content.find_one({"_id": "homepage"})
    doc.pop("_id", None)
    return doc


# ---------------------------------------------------------------------------
# Bookings / enquiries
# ---------------------------------------------------------------------------
class Booking(BaseModel):
    name: str
    phone: str
    email: str
    city: str = ""
    expedition: str = ""
    preferred_dates: str = ""
    motorcycle: str = ""
    experience: str = ""
    riders: str = ""
    message: str = ""


@api.post("/bookings")
async def create_booking(booking: Booking):
    doc = {"id": str(uuid.uuid4()), **booking.model_dump(), "status": "new", "created_at": now_iso()}
    await db.bookings.insert_one(doc)
    doc.pop("_id", None)
    return {"ok": True, "id": doc["id"]}


@api.get("/bookings")
async def list_bookings(admin: User = Depends(require_admin)):
    items = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items


class BookingStatusUpdate(BaseModel):
    status: str


@api.patch("/bookings/{booking_id}")
async def update_booking_status(booking_id: str, update: BookingStatusUpdate, admin: User = Depends(require_admin)):
    if update.status not in ("new", "contacted", "closed"):
        raise HTTPException(status_code=400, detail="Invalid status")
    res = await db.bookings.update_one({"id": booking_id}, {"$set": {"status": update.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"ok": True}


@api.get("/health")
async def health():
    return {"status": "ok", "time": now_iso()}


# ---------------------------------------------------------------------------
# Default seed content
# ---------------------------------------------------------------------------
def _load_info_faq_seed() -> Dict[str, Any]:
    try:
        with open(ROOT_DIR / "info_faq_seed.json", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def default_content() -> Dict[str, Any]:
    img = lambda u: u
    return {
        "settings": {
            "logo": "/logo.png",
            "brand_name": "7HUES",
            "brand_suffix": "EXPEDITIONS",
            "contact_email": "ride@7hues.com",
            "whatsapp": "+919000000000",
            "phone": "+91 90000 00000",
            "booking_cta_label": "BOOK YOUR RIDE",
            "motorcycle": "/moto.png",
        },
        "social": {
            "instagram": "https://instagram.com",
            "youtube": "https://youtube.com",
            "facebook": "https://facebook.com",
        },
        "nav": [
            {"label": "EXPERIENCES", "href": "/experiences"},
            {"label": "INFO & FAQ", "href": "/info"},
            {"label": "JOURNAL", "href": "/journal"},
        ],
        "hero": {
            "eyebrow": "THIS IS 7HUES",
            "line1": "NOT JUST A RIDE.",
            "line2": "AN EXPERIENCE",
            "line3": "YOU CARRY BACK.",
            "video_url": "https://videos.pexels.com/video-files/5364572/5364572-uhd_2560_1440_25fps.mp4",
            "poster": "https://images.unsplash.com/photo-1609202748711-feef2cdc7da3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920",
            "runtime": "01:24",
            "cta_label": "BOOK YOUR RIDE",
            "cta_href": "/book",
        },
        "about": {
            "index": "01",
            "title": "ABOUT US",
            "body": "7HUES began with a simple belief — that the best journeys are lived, not booked.\nWe design motorcycle expeditions for people who want the road to mean something.",
            "cta_label": "BEGIN THE JOURNEY",
            "cta_href": "/book",
            "image": "https://images.unsplash.com/photo-1598683308075-3ec9bc7e54e0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
            "team_title": "THE PEOPLE BEHIND THE RIDES",
            "team": [
                {"name": "Arjun Mehra", "role": "Founder & Lead Rider", "image": "https://images.unsplash.com/photo-1718814457409-0d91c163739c?crop=entropy&cs=srgb&fm=jpg&q=85&w=500"},
                {"name": "Kabir Rao", "role": "Route & Logistics", "image": "https://images.unsplash.com/photo-1752778312055-3b7798f167b1?crop=entropy&cs=srgb&fm=jpg&q=85&w=500"},
                {"name": "Meera Nair", "role": "Experience Curator", "image": "https://images.unsplash.com/photo-1748943490522-83785be71c26?crop=entropy&cs=srgb&fm=jpg&q=85&w=500"},
                {"name": "Devan Iyer", "role": "Films & Photography", "image": "https://images.unsplash.com/photo-1657280846596-2d27d1533249?crop=entropy&cs=srgb&fm=jpg&q=85&w=500"},
            ],
        },
        "what_we_do": {
            "index": "02",
            "title": "WHAT WE DO?",
            "body": "We curate motorcycle expeditions across extraordinary landscapes — combining roads, stays, people, culture and stories into journeys worth carrying home.",
            "cta_label": "EXPLORE EXPEDITIONS",
            "cta_href": "/expeditions",
            "image": "https://images.unsplash.com/photo-1661318977466-5fbd41d8ed83?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
            "points": [
                {"title": "Expedition-first, not tourism", "body": "Routes built around experience, not checklists."},
                {"title": "Crafted end to end", "body": "Roads, stays, food and stories, curated as one."},
                {"title": "Captured cinematically", "body": "Every journey documented in film and photography."},
            ],
        },
        "how_we_deliver": {
            "index": "03",
            "title": "HOW WE DELIVER?",
            "items": [
                {"icon": "route", "title": "CURATED ROUTES", "body": "Scenic, raw and memorable roads."},
                {"icon": "shield", "title": "EXPERT SUPPORT", "body": "Experienced ride leaders, backup support and mechanics."},
                {"icon": "bed", "title": "HANDPICKED STAYS", "body": "Properties chosen as part of the experience."},
                {"icon": "film", "title": "CINEMATIC STORYTELLING", "body": "We capture journeys through film and photography."},
            ],
        },
        "experiences": {
            "index": "05",
            "title": "EXPERIENCES",
            "intro": "A catalogue of everything a 7HUES expedition is made of.",
            "items": [
                {"title": "The Ride", "tags": "ROADS • PASSES • TERRAIN", "image": "https://images.unsplash.com/photo-1610950486363-3dbb1c29320c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400"},
                {"title": "The Places", "tags": "VALLEYS • DESERTS • PEAKS", "image": "https://images.unsplash.com/photo-1705219310890-873721b9b122?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400"},
                {"title": "The Stays", "tags": "CAMPS • HERITAGE • BOUTIQUE", "image": "https://images.unsplash.com/photo-1757838814382-b0034fcc30f0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400"},
                {"title": "The People", "tags": "RIDERS • LOCALS • FRIENDS", "image": "https://images.unsplash.com/photo-1609788063095-d71bf3c1f01f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400"},
                {"title": "The Stories", "tags": "FILM • PHOTOS • JOURNALS", "image": "https://images.unsplash.com/photo-1667862224967-a25abfb769a1?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400"},
                {"title": "The Culture", "tags": "FOOD • RITUAL • CRAFT", "image": "https://images.unsplash.com/photo-1666907418714-1b5f85aaf146?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400"},
            ],
        },
        "why": {
            "index": "04",
            "title": "WHY 7HUES?",
            "image": "https://images.unsplash.com/photo-1552306062-29a5560e1c31?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
            "items": [
                {"title": "SMALL GROUPS", "body": "More connection. More attention."},
                {"title": "AUTHENTIC EXPERIENCES", "body": "Beyond tourist trails."},
                {"title": "BEST VALUE", "body": "Premium experiences, honest pricing."},
                {"title": "SAFETY FIRST", "body": "Planning and support throughout the journey."},
            ],
        },
        "people": {
            "index": "05",
            "title": "OUR PEOPLE",
            "body": "Strangers on the road.\nFriends for life.\nA community built one journey at a time.",
            "cta_label": "MEET THE COMMUNITY",
            "cta_href": "/community",
            "image": "https://images.unsplash.com/photo-1552306062-29a5560e1c31?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
            "avatars": [
                "https://images.unsplash.com/photo-1718814457409-0d91c163739c?crop=entropy&cs=srgb&fm=jpg&q=85&w=200",
                "https://images.unsplash.com/photo-1752778312055-3b7798f167b1?crop=entropy&cs=srgb&fm=jpg&q=85&w=200",
                "https://images.unsplash.com/photo-1748943490522-83785be71c26?crop=entropy&cs=srgb&fm=jpg&q=85&w=200",
                "https://images.unsplash.com/photo-1657280846596-2d27d1533249?crop=entropy&cs=srgb&fm=jpg&q=85&w=200",
            ],
            "testimonials": [
                {"quote": "The kind of ride that quietly changes how you see the world.", "name": "Aarav M.", "location": "Ladakh 2025"},
                {"quote": "Every corner felt curated. Every night felt earned.", "name": "Priya K.", "location": "Spiti 2025"},
            ],
        },
        "from_the_road": {
            "index": "06",
            "title": "FROM THE ROAD",
            "posts": [
                {"platform": "instagram", "title": "High passes, low light", "caption": "Somewhere above 4,000m.", "thumbnail": "https://images.unsplash.com/photo-1598683308075-3ec9bc7e54e0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000", "url": "https://instagram.com", "location": "Khardung La"},
                {"platform": "youtube", "title": "The Spiti Film", "caption": "A 7-day expedition, in seven minutes.", "thumbnail": "https://images.unsplash.com/photo-1705851965698-e575ac246cda?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000", "url": "https://youtube.com", "location": "Spiti Valley"},
                {"platform": "instagram", "title": "Camp nights", "caption": "Strangers become family.", "thumbnail": "https://images.unsplash.com/photo-1609788063095-d71bf3c1f01f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000", "url": "https://instagram.com", "location": "Sarchu"},
            ],
        },
        "journal": {
            "index": "07",
            "title": "JOURNAL",
            "body": "Stories from the road.\nRaw moments.\nTimeless memories.",
            "cta_label": "EXPLORE JOURNAL",
            "cta_href": "/journal",
            "posts": [
                {"category": "LADAKH", "title": "A Ride to Remember", "image": "https://images.unsplash.com/photo-1619190272926-4a1eef483aa8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000", "slug": "a-ride-to-remember"},
                {"category": "HIMALAYAS", "title": "Packing for a High-Altitude Ride", "image": "https://images.unsplash.com/photo-1758826138422-a002270a9d53?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000", "slug": "packing-high-altitude"},
                {"category": "FROM THE ROAD", "title": "What a 7HUES Expedition Really Feels Like", "image": "https://images.unsplash.com/photo-1786510076328-8aedd996a212?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000", "slug": "what-it-feels-like"},
            ],
        },
        "footer": {
            "statement_line1": "THE WORLD IS CALLING.",
            "statement_line2": "ANSWER IT.",
            "cta_label": "BOOK YOUR EXPEDITION",
            "cta_href": "/book",
            "image": "https://images.unsplash.com/photo-1550149550-33b46c745e03?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920",
            "copyright": "© 2026 7HUES Expeditions. All rights reserved.",
        },
        "info_faq": _load_info_faq_seed(),
    }


@app.on_event("startup")
async def startup():
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
    existing = await db.site_content.find_one({"_id": "homepage"})
    if not existing:
        await db.site_content.replace_one({"_id": "homepage"}, {"_id": "homepage", **default_content()}, upsert=True)
        logger.info("Seeded default homepage content")


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
