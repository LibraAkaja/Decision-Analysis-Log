# 401 Authentication Fix - Verification Checklist

## Pre-Deployment Verification

### Environment Variables (Backend)
- [ ] `SUPABASE_URL` is set and correct
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set 
- [ ] `SUPABASE_JWT_SECRET` is set and matches Supabase dashboard
- [ ] No typos in environment variable names

### Frontend Configuration
- [ ] `VITE_API_URL` points to correct backend (https://decision-analysis-log-backend.onrender.com/api/v1 for production)
- [ ] localStorage is not disabled in browser
- [ ] CORS is properly configured on backend

### Database & Supabase
- [ ] Users table exists with proper schema
- [ ] Decisions table exists with owner_id foreign key
- [ ] Row Level Security (RLS) policies are enabled
- [ ] RLS policies allow users to access their own data

## Testing Checklist

### 1. Registration Flow
- [ ] Go to /register page
- [ ] Enter valid email and password
- [ ] Check browser DevTools → Application → localStorage
  - [ ] `accessToken` exists
  - [ ] `refreshToken` exists  
  - [ ] `userId` exists
  - [ ] `userRole` is 'user'
- [ ] Check Console for `[AuthContext] Register successful` message
- [ ] Should redirect to dashboard after registration

### 2. Login Flow
- [ ] Go to /login page
- [ ] Enter valid email and password
- [ ] Check localStorage for tokens (same as registration)
- [ ] Check Console for `[AuthContext] Login successful` message
- [ ] Should redirect to dashboard after login

### 3. Authentication on Protected Routes
- [ ] Navigate to dashboard/user dashboard
- [ ] Open DevTools Network tab
- [ ] Look for GET /api/v1/decisions/ request
- [ ] Check Request Headers:
  - [ ] `Authorization: Bearer {token}` header is present
  - [ ] Token is not empty or "null"
- [ ] Check Response:
  - [ ] Status is 200 (not 401)
  - [ ] Returns array of decisions for user

### 4. Creating a Decision
- [ ] On dashboard, try creating a new decision
- [ ] Check Console for logs:
  - [ ] `[API] Request with token:` should show
  - [ ] `[API] Response success:` should follow
- [ ] Check Network tab:
  - [ ] POST /api/v1/decisions/ request
  - [ ] Status 201 (Created)
  - [ ] Authorization header present
- [ ] Decision should appear in the list

### 5. Logout Flow
- [ ] Click logout button
- [ ] Check Console:
  - [ ] May see "Logout API call failed" (this is OK if token is expired)
  - [ ] `[AuthContext]` logs should show cleanup
- [ ] Check localStorage:
  - [ ] `accessToken` should be removed
  - [ ] `refreshToken` should be removed
  - [ ] Should redirect to login page

### 6. Token Expiration Handling
- [ ] Let token expire (usually 1 hour)
- [ ] Try making a request
- [ ] Should get 401 error
- [ ] Try refreshing token:
  - [ ] Use refreshToken to get new accessToken
  - [ ] Or force re-login

## Debugging if Tests Fail

### 401 on /decisions but login works

**Step 1: Check token in localStorage**
```javascript
// In DevTools Console
const token = localStorage.getItem('accessToken');
console.log('Token exists:', !!token);
console.log('Token length:', token?.length);
console.log('First 50 chars:', token?.substring(0, 50));
```

**Step 2: Check request headers**
- DevTools → Network → Any failed request
- Headers tab → Request Headers
- Should see `authorization: Bearer eyJhbG...` 

**Step 3: Check backend logs**
```
✓ SUPABASE_JWT_SECRET configured: 274 chars
✓ SUPABASE_URL configured: https://...
```

If JWT_SECRET shows 0 chars → Environment variable not set!

**Step 4: Decode token to inspect claims**
```javascript
// In DevTools Console
const token = localStorage.getItem('accessToken');
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log('Token claims:', payload);
console.log('User ID (sub):', payload.sub);
console.log('Expiration:', new Date(payload.exp * 1000));
```

### 401 on Logout

This is **expected** if token is expired. The logout endpoint will:
1. Try to verify the token (fails with 401 if expired)
2. Frontend catches the error and continues
3. Frontend clears localStorage anyway

This is correct behavior - you're logged out either way.

### Cannot read property 'data' of undefined

Usually means the API response structure is wrong. Check:
- Backend is returning JSON (not HTML error)
- Response has expected fields: `access_token`, `refresh_token`, `user_id`, `email`, `role`

## Performance & Monitoring

### Monitoring Logs
Enable these in production backend:
- `[DECISION]` logs - shows decision creation flow
- `[API]` logs in frontend - shows request/response details
- Auth flow logs - track login/register/logout

### Expected Log Output

**Successful Login:**
```
[AuthContext] Attempting login for: user@example.com
[API] Request with token: (no token on login request)
[AuthContext] Login successful, storing tokens
[API] Response success: status 200 url: /auth/login
[AuthContext] Got user: {id: '...', email: '...', role: 'user'}
```

**Creating Decision:**
```
[API] Request with token: method POST url: /decisions hasToken true tokenLength 637
[DECISION] Creating decision for user: 550e8400-e29b-41d4-a716-446655440000
[DECISION] Decision data: {...}
[API] Response success: status 201 url: /decisions
[DECISION] Successfully created decision: {...}
```

## Deployment Verification

Before deploying to production:

### Backend (Render.com)
- [ ] Environment variables set in dashboard
- [ ] View logs during a test request
- [ ] Verify no ERROR or WARNING messages on startup
- [ ] Test actual requests through frontend

### Frontend (Vercel)
- [ ] Build succeeds without errors
- [ ] Environment variable `VITE_API_URL` is set
- [ ] Test login/register/decisions workflow
- [ ] Check DevTools Console for any errors

### Cross-Origin Check
- [ ] Backend CORS allows frontend domain
- [ ] Test request shows correct headers
- [ ] No "CORS error" messages in console

## Success Criteria

✅ **All tests pass when you can:**

1. Register a new account
2. See tokens stored in localStorage
3. Login to existing account
4. Create a decision (POST succeeds with 201)
5. View decisions (GET succeeds with 200)
6. Logout without errors
7. Cannot access protected routes without login
