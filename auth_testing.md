# Auth Testing Playbook (Emergent Google OAuth) — 7HUES

Admin CMS uses Emergent Google OAuth. No app-managed passwords.

## Create test user + session (Mongo db: sevenhues)
```
mongosh sevenhues --eval '
var uid="test-user-"+Date.now();
var tok="test_session_"+Date.now();
db.users.insertOne({user_id:uid, email:"test."+Date.now()+"@example.com", name:"Test Admin", picture:"", is_admin:true, created_at:new Date()});
db.user_sessions.insertOne({user_id:uid, session_token:tok, expires_at:new Date(Date.now()+7*24*3600*1000), created_at:new Date()});
print("token "+tok);'
```

## Test backend
```
curl -s $URL/api/auth/me -H "Authorization: Bearer <token>"
curl -s $URL/api/bookings -H "Authorization: Bearer <token>"   # admin only
curl -s -X PUT $URL/api/content -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"settings":{...}}'
```

## Browser
Set cookie session_token (httpOnly, secure, sameSite None) then navigate to /admin (once built).

## Rules
- Callback detection via useLocation().hash.
- session_token in httpOnly cookie (7d). Backend checks cookie then Authorization header.
- First login becomes admin if ADMIN_EMAILS empty and no admin exists; else must be in ADMIN_EMAILS.
