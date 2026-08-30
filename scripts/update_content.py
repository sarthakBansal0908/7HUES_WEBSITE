from pymongo import MongoClient
import os

client = MongoClient(os.environ.get("MONGO_URL", "mongodb://localhost:27017"))
db = client[os.environ.get("DB_NAME", "sevenhues")]

sets = {
    "about.team_title": "THE PEOPLE BEHIND THE RIDES",
    "about.team": [
        {"name": "Arjun Mehra", "role": "Founder & Lead Rider", "image": "https://images.unsplash.com/photo-1718814457409-0d91c163739c?crop=entropy&cs=srgb&fm=jpg&q=85&w=500"},
        {"name": "Kabir Rao", "role": "Route & Logistics", "image": "https://images.unsplash.com/photo-1752778312055-3b7798f167b1?crop=entropy&cs=srgb&fm=jpg&q=85&w=500"},
        {"name": "Meera Nair", "role": "Experience Curator", "image": "https://images.unsplash.com/photo-1748943490522-83785be71c26?crop=entropy&cs=srgb&fm=jpg&q=85&w=500"},
        {"name": "Devan Iyer", "role": "Films & Photography", "image": "https://images.unsplash.com/photo-1657280846596-2d27d1533249?crop=entropy&cs=srgb&fm=jpg&q=85&w=500"},
    ],
    "what_we_do.points": [
        {"title": "Expedition-first, not tourism", "body": "Routes built around experience, not checklists."},
        {"title": "Crafted end to end", "body": "Roads, stays, food and stories, curated as one."},
        {"title": "Captured cinematically", "body": "Every journey documented in film and photography."},
    ],
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
}

db.site_content.update_one({"_id": "homepage"}, {"$set": sets})
print("content synced")
