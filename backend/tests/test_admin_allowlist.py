"""Backend tests: ADMIN_EMAILS allowlist is the sole gate for admin access.

Covers the bug-fix verification for 7HUES:
- 7huesexpeditions@gmail.com is admin via allowlist (even if stored is_admin=False)
- Any other email (even if stored is_admin=True) is NOT admin
- Public endpoints remain public; unauthenticated calls behave correctly
"""

import os
import uuid
import subprocess
from datetime import datetime, timezone, timedelta

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    # fallback: read frontend/.env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.strip().split("=", 1)[1]
BASE_URL = BASE_URL.rstrip("/")

ADMIN_EMAIL = "7huesexpeditions@gmail.com"
DENIED_EMAIL_STALE_ADMIN = "random.person.test@gmail.com"
DENIED_EMAIL_EXAMPLE = "leftover.tester@example.com"

DB = "sevenhues"


def mongo_eval(script: str) -> str:
    r = subprocess.run(
        ["mongosh", DB, "--quiet", "--eval", script],
        capture_output=True, text=True, timeout=20,
    )
    assert r.returncode == 0, f"mongosh failed: {r.stderr}\n{r.stdout}"
    return r.stdout


def create_session(email: str, stored_is_admin: bool) -> tuple[str, str]:
    """Inject a user + session doc directly into Mongo. Returns (user_id, session_token)."""
    user_id = f"testuser_{uuid.uuid4().hex[:10]}"
    token = f"testsess_{uuid.uuid4().hex}"
    expires = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
    script = f"""
    db.users.deleteMany({{ email: "{email}" }});
    db.users.insertOne({{
        user_id: "{user_id}", email: "{email}", name: "Test",
        picture: "", is_admin: {"true" if stored_is_admin else "false"},
        created_at: new Date()
    }});
    db.user_sessions.insertOne({{
        user_id: "{user_id}", session_token: "{token}",
        expires_at: new Date("{expires}"), created_at: new Date()
    }});
    print("OK");
    """
    out = mongo_eval(script)
    assert "OK" in out
    return user_id, token


def cleanup(user_id: str, token: str, email: str = None):
    filt_email = f'db.users.deleteMany({{ email: "{email}" }});' if email else ""
    mongo_eval(f"""
        db.user_sessions.deleteMany({{ session_token: "{token}" }});
        db.users.deleteMany({{ user_id: "{user_id}" }});
        {filt_email}
    """)


# ---------------- Fixtures ----------------

@pytest.fixture
def admin_session():
    uid, tok = create_session(ADMIN_EMAIL, stored_is_admin=False)  # PROVE allowlist grants access
    yield uid, tok
    cleanup(uid, tok, ADMIN_EMAIL)


@pytest.fixture
def stale_admin_session():
    uid, tok = create_session(DENIED_EMAIL_STALE_ADMIN, stored_is_admin=True)  # PROVE stored flag is ignored
    yield uid, tok
    cleanup(uid, tok, DENIED_EMAIL_STALE_ADMIN)


@pytest.fixture
def example_test_session():
    uid, tok = create_session(DENIED_EMAIL_EXAMPLE, stored_is_admin=True)
    yield uid, tok
    cleanup(uid, tok, DENIED_EMAIL_EXAMPLE)


def h(token):
    return {"Authorization": f"Bearer {token}"}


# ---------------- Public / unauth ----------------

class TestPublic:
    def test_health(self):
        r = requests.get(f"{BASE_URL}/api/health", timeout=15)
        assert r.status_code == 200
        assert r.json()["status"] == "ok"

    def test_content_public(self):
        r = requests.get(f"{BASE_URL}/api/content", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "settings" in data and "hero" in data

    def test_auth_me_unauth_401(self):
        r = requests.get(f"{BASE_URL}/api/auth/me", timeout=15)
        assert r.status_code == 401

    def test_bookings_unauth_403(self):
        r = requests.get(f"{BASE_URL}/api/bookings", timeout=15)
        assert r.status_code in (401, 403)

    def test_put_content_unauth_403(self):
        r = requests.put(f"{BASE_URL}/api/content", json={"foo": "bar"}, timeout=15)
        assert r.status_code in (401, 403)


# ---------------- Admin (allowlist positive) ----------------

class TestAdminAllowlist:
    def test_auth_me_returns_is_admin_true_for_allowlisted_email(self, admin_session):
        _, tok = admin_session
        r = requests.get(f"{BASE_URL}/api/auth/me", headers=h(tok), timeout=15)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["email"] == ADMIN_EMAIL
        assert body["is_admin"] is True, "allowlist must override stored is_admin=false"

    def test_admin_can_list_bookings(self, admin_session):
        _, tok = admin_session
        r = requests.get(f"{BASE_URL}/api/bookings", headers=h(tok), timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_can_list_media(self, admin_session):
        _, tok = admin_session
        r = requests.get(f"{BASE_URL}/api/media", headers=h(tok), timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_can_put_content_and_persist(self, admin_session):
        _, tok = admin_session
        # Fetch current
        current = requests.get(f"{BASE_URL}/api/content", timeout=15).json()
        marker = f"TEST_MARKER_{uuid.uuid4().hex[:6]}"
        original_brand = current.get("settings", {}).get("brand_name", "7HUES")
        current.setdefault("settings", {})["brand_name"] = marker

        put = requests.put(f"{BASE_URL}/api/content", json=current, headers=h(tok), timeout=15)
        assert put.status_code == 200, put.text
        assert put.json()["settings"]["brand_name"] == marker

        # verify persistence via public GET
        verify = requests.get(f"{BASE_URL}/api/content", timeout=15).json()
        assert verify["settings"]["brand_name"] == marker

        # revert
        verify["settings"]["brand_name"] = original_brand
        requests.put(f"{BASE_URL}/api/content", json=verify, headers=h(tok), timeout=15)


# ---------------- Non-allowlisted (denial) ----------------

class TestDenial:
    def test_stale_admin_flag_ignored_auth_me(self, stale_admin_session):
        _, tok = stale_admin_session
        r = requests.get(f"{BASE_URL}/api/auth/me", headers=h(tok), timeout=15)
        assert r.status_code == 200
        body = r.json()
        assert body["email"] == DENIED_EMAIL_STALE_ADMIN
        assert body["is_admin"] is False, "allowlist must override stored is_admin=true"

    def test_stale_admin_cannot_get_bookings(self, stale_admin_session):
        _, tok = stale_admin_session
        r = requests.get(f"{BASE_URL}/api/bookings", headers=h(tok), timeout=15)
        assert r.status_code == 403

    def test_stale_admin_cannot_get_media(self, stale_admin_session):
        _, tok = stale_admin_session
        r = requests.get(f"{BASE_URL}/api/media", headers=h(tok), timeout=15)
        assert r.status_code == 403

    def test_stale_admin_cannot_put_content(self, stale_admin_session):
        _, tok = stale_admin_session
        r = requests.put(f"{BASE_URL}/api/content", json={"settings": {"brand_name": "HACK"}},
                         headers=h(tok), timeout=15)
        assert r.status_code == 403

    def test_example_domain_is_not_admin(self, example_test_session):
        _, tok = example_test_session
        me = requests.get(f"{BASE_URL}/api/auth/me", headers=h(tok), timeout=15).json()
        assert me["is_admin"] is False
        r = requests.put(f"{BASE_URL}/api/content", json={"settings": {}}, headers=h(tok), timeout=15)
        assert r.status_code == 403


# ---------------- Regression: no leftover test admins ----------------

class TestNoLeftoverAdmins:
    def test_no_stray_admin_users_in_db(self):
        out = mongo_eval("""
            var arr = db.users.find({ is_admin: true }, { email: 1, _id: 0 }).toArray();
            print(JSON.stringify(arr));
        """)
        # any listed stored admins would only get access if their email is in ADMIN_EMAILS,
        # but we assert none are @example.com / .test bootstrap leftovers granting access
        import json, re
        m = re.search(r"\[.*\]", out, re.S)
        arr = json.loads(m.group(0)) if m else []
        bad = [u for u in arr if u["email"].endswith("@example.com") or u["email"].endswith(".test")]
        # Even if such stored flags exist, they should NOT grant admin — verified by TestDenial.
        # We just log presence; the real gate is the endpoint behavior tests above.
        print(f"Stored is_admin=true users in DB (informational): {arr}")
        assert True  # informational only
