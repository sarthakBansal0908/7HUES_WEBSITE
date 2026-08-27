"""Backend API tests for 7HUES Expeditions"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/") or "https://road-unfolds.preview.emergentagent.com"
API = f"{BASE_URL}/api"


# Health
def test_health():
    r = requests.get(f"{API}/health", timeout=30)
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# Content
def test_content_structure():
    r = requests.get(f"{API}/content", timeout=30)
    assert r.status_code == 200
    data = r.json()
    for key in ["settings", "hero", "what_we_do", "how_we_deliver", "experiences",
                "why", "people", "from_the_road", "journal", "footer", "nav", "social"]:
        assert key in data, f"missing {key}"
    hero = data["hero"]
    assert hero["line1"] == "NOT JUST A RIDE."
    assert hero["line2"] == "AN EXPERIENCE"
    assert hero["line3"] == "YOU CARRY BACK."
    assert hero["eyebrow"] == "THIS IS 7HUES"
    assert len(data["how_we_deliver"]["items"]) == 4
    assert len(data["experiences"]["items"]) == 6
    assert len(data["why"]["items"]) == 5
    assert len(data["journal"]["posts"]) == 3


# Bookings (public POST)
def test_booking_create():
    payload = {"name": "TEST_Rider", "phone": "+911234567890", "email": "TEST_rider@example.com",
               "city": "Bengaluru", "expedition": "Spiti", "message": "Test enquiry"}
    r = requests.post(f"{API}/bookings", json=payload, timeout=30)
    assert r.status_code == 200
    body = r.json()
    assert body.get("ok") is True
    assert "id" in body


def test_booking_missing_required():
    r = requests.post(f"{API}/bookings", json={"name": "x"}, timeout=30)
    assert r.status_code == 422


# Admin endpoints must be 403 without auth
@pytest.mark.parametrize("method,path", [
    ("GET", "/bookings"),
    ("PUT", "/content"),
    ("GET", "/media"),
])
def test_admin_endpoints_forbidden(method, path):
    r = requests.request(method, f"{API}{path}", json={} if method == "PUT" else None, timeout=30)
    assert r.status_code in (401, 403), f"expected 401/403 for {method} {path}, got {r.status_code}"


def test_auth_me_unauthenticated():
    r = requests.get(f"{API}/auth/me", timeout=30)
    assert r.status_code == 401
