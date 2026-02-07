# Step-by-Step Testing Guide

## Phase 1: Pre-Deployment Checks (Local)

### 1.1 Verify Backend Environment

```bash
# Check backend environment variables are set
echo "SUPABASE_URL: $SUPABASE_URL"
echo "SUPABASE_JWT_SECRET: $SUPABASE_JWT_SECRET" 
echo "SUPABASE_SERVICE_ROLE_KEY exists: $([ -z "$SUPABASE_SERVICE_ROLE_KEY" ] && echo 'NO' || echo 'YES')"

# All three should be set
```

### 1.2 Start Backend Locally

```bash
cd Backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
✓ SUPABASE_URL configured: https://xxxx...
✓ SUPABASE_SERVICE_ROLE_KEY configured: 256 chars
✓ SUPABASE_JWT_SECRET configured: 274 chars
INFO: Uvicorn running on http://0.0.0.0:8000
```

### 1.3 Start Frontend Locally

```bash
cd Frontend
npm install
npm run dev
```

**Expected Output:**
```
VITE v4.x.x ready in xxx ms
➜ Local:   http://localhost:5173/
```

### 1.4 Verify API Connection

In browser console:
```javascript
fetch('http://localhost:8000/api/v1')
    .then(r => r.json())
    .then(d => console.log('API Status:', d))
    .catch(e => console.log('API Error:', e))
// Should log: API Status: {status: "ok"}
```

---

## Phase 2: Registration Flow Test

### Test: Register New Account

**Steps:**
1. Navigate to http://localhost:5173/register
2. Open DevTools (F12)
3. Go to Console tab
4. Enter email: `test-user-${Date.now()}@example.com`
5. Enter password: `TestPassword123!`
6. Click "Register"

**Expected Console Logs:**
```
[AuthContext] Attempting register for: test-user-xxx@example.com
[API] Request with token: false method POST url: /auth/register
[AuthContext] Register successful, storing tokens
[API] Response success: status 200
[AuthContext] Got user: {id: "uuid...", email: "test-user-xxx@example.com", role: "user"}
```

**Expected Browser Behavior:**
- Should redirect to dashboard
- Should show user's email in header (if implemented)

**Check localStorage:**
```javascript
// In console:
console.log({
    accessToken: localStorage.getItem('accessToken')?.substring(0, 50) + '...',
    refreshToken: localStorage.getItem('refreshToken')?.substring(0, 50) + '...',
    userId: localStorage.getItem('userId'),
    userRole: localStorage.getItem('userRole')
})
```

**Expected Output:**
```javascript
{
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    userRole: "user"
}
```

---

## Phase 3: Dashboard & Decisions Test

### Test: View Decisions (Protected Route)

**Steps:**
1. Still logged in from previous test
2. Should already be on /dashboard or navigate there
3. Open Network tab in DevTools
4. Look for GET request to `/api/v1/decisions`

**Expected Network Request:**
```
GET /api/v1/decisions HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json

[]  // Empty array (first time)
```

**Console Logs:**
```
[API] Request with token: method GET url: /decisions hasToken true tokenLength 637
[API] Response success: status 200 url: /decisions
```

**Expected Behavior:**
- Decisions list shown (empty on first login)
- No 401 errors
- No network errors

### Test: Create Decision

**Steps:**
1. On dashboard, find "Create Decision" button
2. Click it to open form
3. Enter:
   - Title: "Test Decision"
   - Description: "Testing the 401 fix"
4. Click "Create"

**Expected Console Logs:**
```
[API] Request with token: method POST url: /decisions hasToken true tokenLength 637
[DECISION] Creating decision for user: 550e8400-e29b-41d4-a716-446655440000
[DECISION] Decision data: {title: "Test Decision", description: "Testing the 401 fix"}
[API] Response success: status 201 url: /decisions
[DECISION] Successfully created decision: {id: "uuid...", title: "Test Decision", ...}
```

**Expected Network Response:**
```
POST /api/v1/decisions
Status: 201 Created

{
    "id": "uuid...",
    "title": "Test Decision",
    "description": "Testing the 401 fix",
    "owner_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2024-...",
    "is_active": true
}
```

**Expected UI:**
- Decision appears in list
- No errors shown
- Form closes or resets

---

## Phase 4: Login Flow Test

### Test: Logout and Login

**Steps:**
1. Click "Logout" button
2. Check console logs
3. Verify redirected to login page

**Expected Console Logs:**
```
[AuthContext] Attempting logout
[API] Request with token: method POST url: /auth/logout hasToken true
[AuthContext] Logout API call failed (continuing with local logout): AxiosError...
  (This error is OK - just means token expired)
[AuthContext] (cleanup logs)
```

**Verify localStorage Cleared:**
```javascript
console.log(localStorage.length) // Should be 0
```

**Steps: Login Again**
1. On login page, enter the SAME email and password
2. Check console

**Expected Console Logs:**
```
[AuthContext] Attempting login for: test-user-xxx@example.com
[API] Request with token: method POST url: /auth/login
[AuthContext] Login successful, storing tokens
[API] Response success: status 200 url: /auth/login
```

**Expected Behavior:**
- Should redirect to dashboard
- Should be able to see previous decision
- Dashboard loads without 401 errors

---

## Phase 5: Token Expiration Test

### Test: Let Token Expire (Optional)

**Note:** Tokens last ~1 hour, so this test is optional for local testing

**Alternative Test: Manually Expire Token**
```javascript
// Manually corrupt token to test error handling
localStorage.setItem('accessToken', 'invalid-token-string');

// Try to make request
fetch('http://localhost:5173/dashboard')
// Should get 401 error and redirect to login
```

---

## Phase 6: Production Deployment Test

### Before Deploying:

**Step 1: Verify Environment Variables on Render.com**
1. Go to Render.com backend service
2. Click "Environment"
3. Verify these are set:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_JWT_SECRET` ← **CRITICAL**

**Step 2: Deploy Backend**
1. Commit and push code to GitHub
2. Render.com automatically deploys
3. Wait for "Deploy successful" message

**Step 3: Check Backend Logs**
```
View Logs → should see:
✓ SUPABASE_URL configured: https://...
✓ SUPABASE_SERVICE_ROLE_KEY configured: 256 chars
✓ SUPABASE_JWT_SECRET configured: 274 chars
```

If you see ⚠️ warnings → Stop, set the variables, and redeploy

**Step 4: Verify Frontend Environment**
1. Go to Vercel project
2. Settings → Environment Variables
3. Verify `VITE_API_URL` is set to `https://decision-analysis-log-backend.onrender.com/api/v1`

**Step 5: Deploy Frontend**
1. Commit and push code to GitHub
2. Vercel automatically deploys
3. Wait for "Ready" status

### Post-Deployment Testing:

**Test 1: Register Account**
1. Go to https://decision-analysis-log.vercel.app/register
2. Create new account with test email
3. Check browser console for logs

**Expected:**
- No 401 errors
- Redirects to dashboard
- Tokens in localStorage

**Test 2: Create Decision**
1. On dashboard, create a decision
2. Check Network tab for request

**Expected:**
- POST /api/v1/decisions returns 201
- Authorization header is present
- Decision appears in list

**Test 3: Logout**
1. Click logout
2. Verify redirects to login
3. Check localStorage is cleared

**Expected:**
- Clean logout flow
- Can't access dashboard without logging back in

**Test 4: Login Again**
1. Login with same credentials
2. Create another decision
3. Verify both decisions shown

**Expected:**
- All previous decisions still exist
- Can create new decisions
- No authentication errors

---

## Phase 7: Debugging If Tests Fail

### 401 on Create Decision

**Follow this checklist:**

```
1. Is localStorage.accessToken set?
   → localStorage.getItem('accessToken') should return long string
   → If null/undefined → Problem with registration/login
   
2. Is token being sent in request?
   → Network tab → POST /decisions → Headers
   → Should have: Authorization: Bearer eyJ...
   → If missing → API client not sending header
   
3. Is token valid?
   → Decode in console: JSON.parse(atob(token.split('.')[1]))
   → Check exp claim → Convert to date → Should be future
   → If past date → Token expired, need refresh or re-login
   
4. Is SUPABASE_JWT_SECRET correct?
   → Backend logs should show "JWT verification failed"
   → Compare backend secret with Supabase dashboard
   → Should match exactly (no extra spaces)
   
5. Is backend running?
   → Try fetching http://localhost:8000/ (or Render URL)
   → Should get {"status": "ok"}
   → If error → Backend not running or URL is wrong
```

### Step-by-Step Debugging Command

Run this in browser console:

```javascript
async function debugAuth() {
    console.log('=== DEBUGGING FAILED REQUEST ===\n');
    
    // 1. Check token
    const token = localStorage.getItem('accessToken');
    console.log('1. Token Present:', !!token);
    if (!token) {
        console.log('   FIX: Need to login first');
        return;
    }
    
    // 2. Check token validity
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    const expired = Date.now() > payload.exp * 1000;
    console.log('2. Token Expired:', expired);
    if (expired) {
        console.log('   FIX: Token is expired, need to refresh or re-login');
        return;
    }
    
    // 3. Try the request manually
    console.log('3. Trying request...');
    const response = await fetch('http://localhost:8000/api/v1/decisions', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    console.log('   Status:', response.status);
    const data = await response.json();
    console.log('   Response:', data);
    
    if (response.status === 401) {
        console.log('\n   Problem: Token verification failed on backend');
        console.log('   Possible causes:');
        console.log('     - SUPABASE_JWT_SECRET is wrong on backend');
        console.log('     - Token was created with different secret');
        console.log('   Fix: Check SUPABASE_JWT_SECRET matches Supabase dashboard');
    }
}

debugAuth();
```

---

## Final Verification Checklist

After all tests pass, verify these boxes:

- [ ] Registration creates new account
- [ ] Login authenticates user
- [ ] localStorage has tokens after login
- [ ] Decisions GET request returns 200 (not 401)
- [ ] Decisions POST request returns 201 (not 401)
- [ ] Decision appears in UI after creation
- [ ] Logout clears tokens and redirects
- [ ] Can't access dashboard after logout
- [ ] Login again works with same account
- [ ] Previous decisions still exist after re-login
- [ ] Console shows [API] and [AuthContext] logs
- [ ] No "401" or "Unauthorized" errors in console
- [ ] Backend logs show ✓ environment variables on startup
- [ ] Backend logs show [DECISION] logs when creating decisions

---

## Success Criteria

✅ **You're done when all of these work:**

1. **Registration Flow**
   - Can create new account
   - Tokens stored in localStorage
   - Redirects to dashboard

2. **Login Flow**
   - Can login with credentials
   - Tokens stored in localStorage
   - Redirects to dashboard

3. **Protected Routes**
   - GET /decisions returns 200 (not 401)
   - Can view personal decisions
   - Cannot view other users' decisions

4. **Create Decision**
   - POST /decisions returns 201
   - Decision saved to database
   - Decision appears in UI

5. **Logout Flow**
   - Logout succeeds
   - Tokens cleared from localStorage
   - Redirects to login page
   - Cannot access dashboard

6. **Debugging Info**
   - Console shows [API] logs
   - Console shows [AuthContext] logs
   - Backend logs show configuration
   - No "Invalid token" errors

🎉 **If all above pass, the 401 issue is completely fixed!**
