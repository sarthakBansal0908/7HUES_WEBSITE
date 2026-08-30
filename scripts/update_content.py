from pymongo import MongoClient
import os

client = MongoClient(os.environ.get("MONGO_URL", "mongodb://localhost:27017"))
db = client[os.environ.get("DB_NAME", "sevenhues")]
doc = db.site_content.find_one({"_id": "homepage"}) or {}

sets = {
    "about": {
        "index": "01",
        "title": "ABOUT US",
        "body": "7HUES began with a simple belief — that the best journeys are lived, not booked.\nWe design motorcycle expeditions for people who want the road to mean something.",
        "cta_label": "BEGIN THE JOURNEY",
        "cta_href": "/book",
        "image": "https://images.unsplash.com/photo-1598683308075-3ec9bc7e54e0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    },
    "what_we_do.index": "02",
    "what_we_do.title": "WHAT WE DO?",
    "how_we_deliver.index": "03",
    "how_we_deliver.title": "HOW WE DELIVER?",
    "why": {
        "index": "04",
        "title": "WHY 7HUES?",
        "image": (doc.get("why", {}) or {}).get("image") or "https://images.unsplash.com/photo-1552306062-29a5560e1c31?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
        "items": [
            {"title": "SMALL GROUPS", "body": "More connection. More attention."},
            {"title": "AUTHENTIC EXPERIENCES", "body": "Beyond tourist trails."},
            {"title": "BEST VALUE", "body": "Premium experiences, honest pricing."},
            {"title": "SAFETY FIRST", "body": "Planning and support throughout the journey."},
        ],
    },
    "experiences": {
        "index": "05",
        "title": "EXPERIENCE",
        "intro": "Five threads of a single journey — the ride, the land, the nights, the people and the stories you carry home.",
        "cta_label": "DISCOVER THE EXPERIENCE",
        "cta_href": "/experiences",
        "items": [
            {"label": "THE RIDE", "image": "https://images.unsplash.com/photo-1610950486363-3dbb1c29320c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600"},
            {"label": "THE PLACES", "image": "https://images.unsplash.com/photo-1705219310890-873721b9b122?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"},
            {"label": "THE STAYS", "image": "https://images.unsplash.com/photo-1757838814382-b0034fcc30f0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"},
            {"label": "THE PEOPLE", "image": "https://images.unsplash.com/photo-1609788063095-d71bf3c1f01f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"},
            {"label": "THE STORIES", "image": "https://images.unsplash.com/photo-1667862224967-a25abfb769a1?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"},
        ],
    },
    "from_the_road.index": "06",
    "journal.index": "07",
}

db.site_content.update_one({"_id": "homepage"}, {"$set": sets})
print("updated content structure")
print("keys:", list(db.site_content.find_one({"_id": "homepage"}).keys()))
