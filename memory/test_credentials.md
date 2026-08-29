# 7HUES Expeditions — Test Credentials

## Admin / CMS Access
- Auth method: Emergent-managed Google OAuth (no app-managed passwords).
- Admin control: EXPLICIT ALLOWLIST via `ADMIN_EMAILS` in backend/.env. NO first-login bootstrap.
- Primary admin: **7huesexpeditions@gmail.com** (set in ADMIN_EMAILS).
- `require_admin` and `/api/auth/me` both derive is_admin SOLELY from the allowlist (stored is_admin flag is ignored),
  so only allowlisted Google accounts can access /admin or admin APIs.

## Testing the gated dashboard (testing agent)
Inject a session in Mongo db `sevenhues`:
- users:  { user_id, email, name, picture, is_admin, created_at }
- user_sessions: { user_id, session_token, expires_at (Date +N), created_at }
Then set cookie `session_token` (httpOnly, secure, sameSite None, domain <preview-host>, path /),
or call APIs with `Authorization: Bearer <session_token>`.
- To test ADMIN access: use email `7huesexpeditions@gmail.com` (is_admin flag value does NOT matter — allowlist decides).
- To test DENIAL: use any other email (even with is_admin:true) → /api/auth/me returns is_admin:false, admin APIs return 403, and /admin shows "NOT AUTHORISED".

## Notes
- No password-based credentials (Google OAuth).
- Admin CMS UI at /admin. Admin APIs: PUT /api/content, POST/GET/DELETE /api/media, GET /api/bookings.
