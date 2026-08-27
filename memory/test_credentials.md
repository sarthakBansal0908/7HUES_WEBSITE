# 7HUES Expeditions — Test Credentials

## Admin / CMS Access
- Auth method: Emergent-managed Google OAuth (no app-managed passwords).
- Admin bootstrap rule: If `ADMIN_EMAILS` in backend/.env is empty AND no admin exists yet,
  the FIRST Google account to log in automatically becomes admin.
- To lock admin to specific accounts, set `ADMIN_EMAILS` (comma-separated) in backend/.env.

## Backend session testing (for testing agent)
Create a session directly in Mongo (db: sevenhues):
- users: { user_id, email, name, picture, is_admin: true, created_at }
- user_sessions: { user_id, session_token, expires_at (Date +7d), created_at }
Then call `/api/auth/me` with `Authorization: Bearer <session_token>` or cookie `session_token`.

## Notes
- No password-based credentials (Google OAuth).
- Admin CMS UI is not built yet (V1 = homepage first). Backend admin endpoints exist:
  PUT /api/content, POST/GET /api/media, GET /api/bookings (all require admin).
