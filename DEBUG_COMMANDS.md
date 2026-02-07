# Quick Debug Commands & Queries

## Browser DevTools Console Commands

### Check Authentication Status
```javascript
// Check if tokens exist
console.log('Access Token:', localStorage.getItem('accessToken') ? 'EXISTS' : 'MISSING');
console.log('Refresh Token:', localStorage.getItem('refreshToken') ? 'EXISTS' : 'MISSING');
console.log('User ID:', localStorage.getItem('userId'));
console.log('User Role:', localStorage.getItem('userRole'));

// Check token expiration
const token = localStorage.getItem('accessToken');
if (token) {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    console.log('Token Expires:', new Date(payload.exp * 1000));
    console.log('Token Expired:', Date.now() > payload.exp * 1000);
    console.log('User ID (sub):', payload.sub);
}
```

### Check Request Headers
```javascript
// Fetch any protected endpoint to see the request
fetch('https://decision-analysis-log-backend.onrender.com/api/v1/decisions', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
})
.then(r => r.json())
.then(data => console.log('Response:', data))
.catch(err => console.log('Error:', err));
```

### Manual Token Verification
```javascript
// Decode JWT payload (frontend only - doesn't verify signature)
const token = localStorage.getItem('accessToken');
if (token) {
    try {
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1]));
        console.log('Full Payload:', payload);
        console.log('Claims:');
        console.log('  - sub (user ID):', payload.sub);
        console.log('  - email:', payload.email);
        console.log('  - aud (audience):', payload.aud);
        console.log('  - iss (issuer):', payload.iss);
        console.log('  - exp (expiration):', payload.exp);
        console.log('  - iat (issued at):', payload.iat);
    } catch (e) {
        console.log('Invalid token format:', e.message);
    }
}
```

### Watch Network Requests
```javascript
// See all API calls with headers
const originalFetch = window.fetch;
window.fetch = function(...args) {
    console.log('[FETCH]', args[0], args[1]?.headers);
    return originalFetch.apply(this, args);
};
```

### Clear All Auth Data
```javascript
// Completely reset authentication
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('userId');
localStorage.removeItem('userRole');
console.log('Auth data cleared. Refresh page.');
location.reload();
```

---

## Backend Commands (Terminal/SSH)

### Check Environment Variables
```bash
# See all auth-related variables
printenv | grep SUPABASE

# Check specific variable
echo $SUPABASE_JWT_SECRET
echo $SUPABASE_SERVICE_ROLE_KEY
echo $SUPABASE_URL
```

### View Backend Logs (Render.com)
```bash
# Via Render.com Dashboard
# Go to Service → Logs tab
# Filter for [DECISION] logs to see decision creation flow
# Filter for ERROR to see exceptions
```

### Test Token Verification
```bash
# Get a valid token first (from login), then:
curl -X GET https://decision-analysis-log-backend.onrender.com/api/v1/decisions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"

# Expected:
# - 200: Request succeeded (token is valid)
# - 401: Token is invalid or expired
# - 403: User lacks permission
```

### Check Supabase Connection
```bash
# Python - Test Supabase connection
python3 << 'EOF'
from supabase import create_client
import os

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(url, key)
result = supabase.table("users").select("count", count="exact").execute()
print(f"Users in database: {result.count}")
EOF
```

---

## Network Tab Analysis

### What to Check in Browser DevTools → Network Tab

#### Successful Request (200/201)
```
Request Headers:
  authorization: Bearer eyJhbGciOiJIUzI1NiIs...
  content-type: application/json
  
Request Body:
  {"title": "My Decision", "description": "Test"}
  
Response Headers:
  content-type: application/json
  
Response Body:
  {"id": "uuid...", "title": "My Decision", ...}
```

#### Failed Request (401)
```
Request Headers:
  authorization: Bearer eyJhbGciOiJIUzI1NiIs...
  (token IS present)
  
Response Status: 401 Unauthorized
Response Body:
  {"detail": "Invalid or expired token"}
  
Possible Causes:
  1. SUPABASE_JWT_SECRET is wrong
  2. Token is expired (check exp claim)
  3. Token was signed with different secret
```

#### Failed Request (Missing Token)
```
Request Headers:
  (NO authorization header)
  
Response Status: 401 Unauthorized
Response Body:
  {"detail": "No authorization header"}
  
Fix: Ensure localStorage has accessToken
```

---

## Supabase Dashboard Queries

### Check User Tokens
```sql
-- See when users authenticated (can't see tokens)
SELECT id, email, created_at, last_sign_in_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check Decisions Table
```sql
-- See all decisions
SELECT id, owner_id, title, description, created_at 
FROM decisions 
ORDER BY created_at DESC 
LIMIT 10;

-- See decisions for specific user
SELECT id, title, description, created_at 
FROM decisions 
WHERE owner_id = 'USER_ID_HERE'
ORDER BY created_at DESC;
```

### Check RLS Policies
```sql
-- Verify RLS is enabled on decisions table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'decisions';
-- Should show: TRUE in rowsecurity column

-- Check decision policies
SELECT * FROM pg_policies 
WHERE tablename = 'decisions';
```

---

## Logging Filters

### In Browser Console
```javascript
// Filter to see only API logs
console.clear();
// Now filter by "[API]" in console search

// Filter to see only auth logs
// Filter by "[AuthContext]"

// Filter to see only errors
// Filter by "AxiosError" or "Error"
```

### In Backend Logs (Render.com)
```
Useful filters:
[DECISION]              - See all decision-related logs
ERROR                   - See all errors
JWT verification failed - JWT issues
401 Unauthorized        - Auth failures
```

---

## Quick Diagnostics Script

### All-in-One Check (Browser Console)
```javascript
(function diagnoseAuth() {
    console.log('=== AUTHENTICATION DIAGNOSTICS ===\n');
    
    // 1. Token Status
    console.log('1. TOKEN STATUS:');
    const token = localStorage.getItem('accessToken');
    console.log('   Access Token:', token ? `EXISTS (${token.length} chars)` : 'MISSING ❌');
    console.log('   Refresh Token:', localStorage.getItem('refreshToken') ? 'EXISTS' : 'MISSING');
    console.log('   User ID:', localStorage.getItem('userId') || 'MISSING');
    console.log('   User Role:', localStorage.getItem('userRole') || 'MISSING');
    
    // 2. Token Validity
    console.log('\n2. TOKEN VALIDITY:');
    if (token) {
        try {
            const parts = token.split('.');
            const payload = JSON.parse(atob(parts[1]));
            const expiresAt = new Date(payload.exp * 1000);
            const now = new Date();
            const expired = now > expiresAt;
            
            console.log('   Expires:', expiresAt.toLocaleString());
            console.log('   Status:', expired ? 'EXPIRED ❌' : 'VALID ✅');
            console.log('   User ID (sub):', payload.sub);
        } catch (e) {
            console.log('   Error decoding token:', e.message);
        }
    } else {
        console.log('   No token to validate');
    }
    
    // 3. API Availability
    console.log('\n3. API AVAILABILITY:');
    const apiUrl = 'https://decision-analysis-log-backend.onrender.com/api/v1';
    fetch(`${apiUrl}/auth/me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(r => {
        console.log('   Backend Status:', r.status === 200 ? '✅ OK' : `❌ Error ${r.status}`);
        return r.json();
    })
    .then(data => {
        console.log('   Current User:', data.email || data.id || data);
    })
    .catch(e => {
        console.log('   Backend Error:', e.message);
    });
    
    console.log('\n=== END DIAGNOSTICS ===');
})();
```

### Run All Tests (Python - Backend)
```python
#!/usr/bin/env python3
import os
import jwt
from datetime import datetime

print("=== BACKEND AUTHENTICATION DIAGNOSTICS ===\n")

# 1. Environment Variables
print("1. ENVIRONMENT VARIABLES:")
env_vars = ['SUPABASE_URL', 'SUPABASE_JWT_SECRET', 'SUPABASE_SERVICE_ROLE_KEY']
for var in env_vars:
    value = os.getenv(var)
    if value:
        print(f"   ✅ {var}: {len(value)} chars")
    else:
        print(f"   ❌ {var}: NOT SET")

# 2. JWT Secret validity
print("\n2. JWT SECRET VALIDITY:")
secret = os.getenv('SUPABASE_JWT_SECRET')
if secret:
    try:
        print(f"   ✅ JWT Secret length: {len(secret)}")
        print(f"   ✅ Looks valid (not too short)")
    except Exception as e:
        print(f"   ❌ Invalid: {e}")
else:
    print("   ❌ JWT Secret not set - Auth will fail!")

print("\n=== END DIAGNOSTICS ===")
```

---

## Common Issues Quick Fixes

### Issue: 401 on all requests
**Check 1:** Token exists
```javascript
localStorage.getItem('accessToken') // Should not be null
```
**Check 2:** Token has exp claim
```javascript
const token = localStorage.getItem('accessToken');
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
payload.exp // Should be a number (timestamp)
```
**Check 3:** SUPABASE_JWT_SECRET is set on backend
```bash
echo $SUPABASE_JWT_SECRET // Should print something
```

### Issue: Can login but not create decision
**Check 1:** Token is being sent in request
```javascript
// In Network tab, find POST /decisions request
// Look for Authorization header with Bearer token
```
**Check 2:** Backend can verify token
- Check logs for "JWT verification failed"
- If yes, SUPABASE_JWT_SECRET is wrong

### Issue: Token verification failing
**Most common cause:** SUPABASE_JWT_SECRET mismatch
```bash
# On backend, this should match your Supabase JWT Secret exactly
echo $SUPABASE_JWT_SECRET

# Compare with:
# Supabase Dashboard → Settings → API → JWT Secret
```

---

## Performance Debugging

### Check Auth Performance
```javascript
// Time login process
console.time('Login');
const result = await loginUser({email, password});
console.timeEnd('Login');
// Should be < 2 seconds

// Time decision creation
console.time('Create Decision');
const decision = await createDecision({title, description});
console.timeEnd('Create Decision');
// Should be < 1 second
```

### Monitor Token Refresh
```javascript
// Check if token auto-refresh is working
setInterval(() => {
    const token = localStorage.getItem('accessToken');
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token expires in:', Math.round((payload.exp * 1000 - Date.now()) / 1000), 'seconds');
}, 60000); // Every minute
```

---

## Production Debugging

### Enable Verbose Logging
In production, modify these files to add extra logging:

**Backend** - Add to main.py before running:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
```

**Frontend** - Add to main.jsx:
```javascript
// Enable all console logs (even in production)
if (true) { // Change to: if (import.meta.env.DEV)
    window.__DEBUG__ = true;
}
```

### Monitor in Real-Time
Use these tools:
- **Backend Logs:** Render.com Dashboard → Logs tab
- **Frontend Console:** User opens DevTools → Console tab
- **Network Monitoring:** Browser DevTools → Network tab

---

## When to Involve Supabase Support

Create a support ticket if:
1. ✅ You've verified SUPABASE_JWT_SECRET is correct
2. ✅ You've verified backend logs show the JWT verification attempt
3. ✅ The error message doesn't match any common issues above
4. ✅ The issue only happens with specific user accounts

When creating ticket, include:
- Exact error message from backend logs
- Base64 decoded JWT payload (safe to share)
- Steps to reproduce
- Environment (dev/staging/production)
