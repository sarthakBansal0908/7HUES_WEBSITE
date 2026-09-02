"""Backend tests for booking flow: public POST, admin GET/PATCH."""
import os
import uuid
import time
from datetime import datetime, timedelta, timezone

import pytest
import requests
from pymongo import MongoClient

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://road-unfolds.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "sevenhues")
ADMIN_EMAIL = "7huesexpeditions@gmail.com"


@pytest.fixture(scope="session")
def admin_token():
    """Inject admin user + session into Mongo and return session_token."""
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]
    user_id = str(uuid.uuid4())
    token = f"test-admin-{uuid.uuid4()}"
    now = datetime.now(timezone.utc)
    db.users.update_one(
        {"email": ADMIN_EMAIL},
        {"$setOnInsert": {"user_id": user_id, "created_at": now},
         "$set": {"email": ADMIN_EMAIL, "name": "Test Admin", "picture": "", "is_admin": True}},
        upsert=True,
    )
    u = db.users.find_one({"email": ADMIN_EMAIL})
    db.user_sessions.insert_one({
        "user_id": u.get("user_id", user_id),
        "session_token": token,
        "expires_at": now + timedelta(days=1),
        "created_at": now,
    })
    yield token
    db.user_sessions.delete_one({"session_token": token})
    client.close()


@pytest.fixture
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


UNIQUE = uuid.uuid4().hex[:8]
UNIQUE_NAME = f"TEST Rider {UNIQUE}"
UNIQUE_EMAIL = f"test_{UNIQUE}@example.com"


def test_health():
    r = requests.get(f"{API}/health", timeout=15)
    assert r.status_code == 200


def test_create_booking_public():
    payload = {
        "name": UNIQUE_NAME,
        "phone": "+91 9999999999",
        "email": UNIQUE_EMAIL,
        "city": "Bengaluru",
        "expedition": "Spiti Loop",
        "preferred_dates": "May 2026",
        "motorcycle": "Own KTM 390 ADV",
        "experience": "Experienced tourer",
        "riders": "2 riders",
        "message": f"Backend test booking {UNIQUE}",
    }
    r = requests.post(f"{API}/bookings", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data.get("ok") is True
    assert "id" in data
    pytest.booking_id = data["id"]


def test_list_bookings_requires_admin():
    r = requests.get(f"{API}/bookings", timeout=15)
    assert r.status_code in (401, 403)


def test_list_bookings_admin_contains_our_booking(admin_headers):
    r = requests.get(f"{API}/bookings", headers=admin_headers, timeout=15)
    assert r.status_code == 200, r.text
    items = r.json()
    assert isinstance(items, list)
    match = [b for b in items if b.get("email") == UNIQUE_EMAIL]
    assert match, f"Our booking {UNIQUE_EMAIL} not found among {len(items)}"
    b = match[0]
    assert b["name"] == UNIQUE_NAME
    assert b["status"] == "new"
    assert b["expedition"] == "Spiti Loop"
    assert "_id" not in b


def test_patch_booking_status_requires_admin():
    bid = getattr(pytest, "booking_id", None)
    assert bid
    r = requests.patch(f"{API}/bookings/{bid}", json={"status": "contacted"}, timeout=15)
    assert r.status_code in (401, 403)


def test_patch_booking_status_valid(admin_headers):
    bid = getattr(pytest, "booking_id", None)
    assert bid
    r = requests.patch(f"{API}/bookings/{bid}", json={"status": "contacted"}, headers=admin_headers, timeout=15)
    assert r.status_code == 200, r.text
    # verify persistence
    r2 = requests.get(f"{API}/bookings", headers=admin_headers, timeout=15)
    b = next(x for x in r2.json() if x["id"] == bid)
    assert b["status"] == "contacted"


def test_patch_booking_status_invalid(admin_headers):
    bid = getattr(pytest, "booking_id", None)
    r = requests.patch(f"{API}/bookings/{bid}", json={"status": "bogus"}, headers=admin_headers, timeout=15)
    assert r.status_code == 400


def test_patch_booking_not_found(admin_headers):
    r = requests.patch(f"{API}/bookings/does-not-exist-xyz", json={"status": "closed"}, headers=admin_headers, timeout=15)
    assert r.status_code == 404
