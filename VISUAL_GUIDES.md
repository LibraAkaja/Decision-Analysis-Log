# Visual Guides - Authentication Flow Diagrams


## 1. The Flow

```
USER TRIES TO CREATE DECISION
        ↓
Frontend stores token: "eyJhbGc..." 
        ↓
Frontend sends: GET /decisions + Authorization: Bearer token
        ↓ [logs: [API] Request with token...]
Backend receives request
        ↓
Backend extracts token from Authorization header
        ↓
TRY STRICT VERIFICATION:
  Check: signature + audience  + issuer 
        ↓
  Success? → Extract user_id and proceed 
  Fail? → Try fallback...
        ↓
FALLBACK TO LENIENT VERIFICATION:
  Check: signature  + sub (user_id exists) 
        ↓
  Success? → Extract user_id and proceed 
  Fail? → Return 401 Unauthorized
        ↓
Request proceeds with validated user_id 
        ↓
Backend creates decision in database
        ↓
Returns: 201 Created + decision data 
        ↓ [logs: [API] Response success...]
Frontend receives decision
        ↓
Displays in UI 
```

## 2. Token Verification Logic (Detailed)

```
┌─────────────────────────────────────────────────────┐
│ BACKEND RECEIVES: Authorization: Bearer {token}   │
└────────────────┬────────────────────────────────────┘
                 ↓
         ┌──────────────────────────┐
         │ Extract token from header │
         └──────────────┬───────────┘
                        ↓
      ┌─────────────────────────────────────┐
      │ TRY STRICT VERIFICATION              │
      ├─────────────────────────────────────┤
      │ 1. Verify JWT signature              │
      │    - SUPABASE_JWT_SECRET must match  │
      │    - If fails → Try fallback         │
      │                                      │
      │ 2. Check audience = "authenticated" │
      │    - If missing/wrong → Try fallback │
      │                                      │
      │ 3. Check issuer = Supabase URL      │
      │    - If missing/wrong → Try fallback │
      │                                      │
      │ 4. Extract sub (user ID)            │
      │    - Should always exist             │
      └──────┬──────────┬────────────────────┘
             │ SUCCESS  │ FAIL
             ↓          ↓
        ┌────────┐  ┌──────────────────────────┐
        │ DONE ✓ │  │ TRY LENIENT VERIFICATION │
        └────────┘  ├──────────────────────────┤
                    │ 1. Verify JWT signature  │
                    │    - Must still verify   │
                    │    - If fails → 401      │
                    │                          │
                    │ 2. Skip audience check   │
                    │ 3. Skip issuer check     │
                    │                          │
                    │ 4. Extract sub (user ID)│
                    │    - Must exist          │
                    │    - If missing → 401    │
                    └──────┬──────────┬────────┘
                           │ SUCCESS  │ FAIL
                           ↓          ↓
                      ┌────────┐  ┌────────────┐
                      │ DONE ✓ │  │ 401 ERROR  │
                      └────────┘  └────────────┘
```

---

## 3. Authentication Flow Timeline

```
TIMELINE OF A SUCCESSFUL API CALL (After Fix)

00ms ────┬──────────────────────────────────────────────────
         ├─ [Frontend] User clicks "Create Decision"
         ├─ [Frontend] Reads token: localStorage.getItem('accessToken')
         │  logs: "[API] Request with token: ... tokenLength 637"
         └─ [Frontend] POST /api/v1/decisions with header:
            Authorization: Bearer eyJhbGc... 🟢
            
10ms ────┬──────────────────────────────────────────────────
         └─ [Backend] Request arrives
         
15ms ────┬──────────────────────────────────────────────────
         ├─ [Backend] Extract token from Authorization header
         └─ Verify JWT signature with SUPABASE_JWT_SECRET
         
20ms ────┬──────────────────────────────────────────────────
         ├─ [Backend] Check JWT claims (audience, issuer)
         ├─ Signature valid ✓
         ├─ Audience might not match (no problem - fallback)
         └─ Try lenient verification
         
25ms ────┬──────────────────────────────────────────────────
         ├─ [Backend] Extract user_id from token.sub claim
         └─ User ID: "550e8400-e29b-41d4-a716-446655440000" ✓
         
30ms ────┬──────────────────────────────────────────────────
         ├─ [Backend] Dependency get_current_user() returns user_id
         └─ Authorization successful! ✓
         
35ms ────┬──────────────────────────────────────────────────
         ├─ [Backend] Route handler receives validated user_id
         ├─ logs: "[DECISION] Creating decision for user: 550e..."
         ├─ logs: "[DECISION] Decision data: {title, description}"
         └─ Insert into database
         
50ms ────┬──────────────────────────────────────────────────
         ├─ [Backend] Decision created in database
         ├─ logs: "[DECISION] Successfully created decision: {id, ...}"
         └─ Return 201 Created + decision data
         
55ms ────┬──────────────────────────────────────────────────
         ├─ [Frontend] Receive response
         ├─ logs: "[API] Response success: status 201"
         ├─ Update state with new decision
         └─ Display in UI ✓

TOTAL TIME: ~55ms
```

---


## 4. Token Structure

```
┌────────────────────────────────────────────────────────────┐
│ JWT TOKEN STRUCTURE (What gets sent in Authorization)     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Header.Payload.Signature                                  │
│                                                            │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.              ← Header   │
│   {                                                        │
│     "alg": "HS256",   ← Algorithm                         │
│     "typ": "JWT"      ← Token type                        │
│   }                                                        │
│                                                            │
│ eyJzdWI.....                                      ← Payload   │
│   {                                                        │
│     "sub": "550e8400-e29b-41d4-a716-446655440000",      │
│              ↑ USER ID (most important)                   │
│     "email": "user@example.com",                          │
│     "aud": "authenticated",   ← Audience                  │
│     "iss": "https://xyz.supabase.co/auth/v1",           │
│              ↑ Issuer (strict check)                      │
│     "exp": 1707344640,        ← Expiration time          │
│     "iat": 1707341040,        ← Issued at                │
│     "auth_time": 1707341040                               │
│   }                                                        │
│                                                            │
│ sig.....                                          ← Signature  │
│   Signed with: SUPABASE_JWT_SECRET                        │
│              ↑ Must match to verify                       │
└────────────────────────────────────────────────────────────┘
```

---

## 5. Environment Variable Setup

```
SUPABASE DASHBOARD
┌─────────────────────────────────────┐
│ Settings → API                      │
├─────────────────────────────────────┤
│ Project URL:                        │
│  https://abc123.supabase.co    ────┼──→ SUPABASE_URL
│                                     │
│ Service Role Key:                   │
│  eyJhbGc...........................  │
│  (secret for backend operations)──┼──→ SUPABASE_SERVICE_ROLE_KEY
│                                     │
│ JWT Secret:                         │
│  super-secret-jwt-key-12345......   │
│  (secret to verify tokens)    ────┼──→ SUPABASE_JWT_SECRET
│                                     │    ← MOST CRITICAL
└─────────────────────────────────────┘
         ↓↓↓ Copy these ↓↓↓

RENDER.COM BACKEND
┌─────────────────────────────────────┐
│ Service → Environment               │
├─────────────────────────────────────┤
│ SUPABASE_URL = https://abc...       │
│ SUPABASE_SERVICE_ROLE_KEY = eyJ...  │
│ SUPABASE_JWT_SECRET = super-....    │
│                      ↑ KEY          │
│                   Must match!       │
└─────────────────────────────────────┘
```

---

## 6. The 401 Error Debugging Flow

```
GOT 401 ERROR ON /decisions
        ↓
╔═══════════════════════════════════════╗
║ STEP 1: Is token in localStorage?     ║
║ localStorage.getItem('accessToken')   ║
╚═══════════════════════════════════════╝
        │
   YES  │  NO
   ↓    ↓
  ✓   ❌ Must login first
        │
  ┌─────┘
  ↓
╔═══════════════════════════════════════╗
║ STEP 2: Is token being sent?          ║
║ Network tab → Authorization header    ║
║ Should see: "Bearer eyJ..."           ║
╚═══════════════════════════════════════╝
        │
   YES  │  NO
   ↓    ↓
  ✓   ❌ API client not sending header
        │   (check interceptor in client.js)
        │
  ┌─────┘
  ↓
╔═══════════════════════════════════════╗
║ STEP 3: Is token expired?             ║
║ Decode payload: exp claim             ║
║ Compare: Date.now() > exp * 1000?     ║
╚═══════════════════════════════════════╝
        │
   NO   │  YES
   ↓    ↓
  ✓   ❌ Token expired
        │   (need refresh or re-login)
        │
  ┌─────┘
  ↓
╔═══════════════════════════════════════╗
║ STEP 4: SUPABASE_JWT_SECRET correct?  ║
║ Backend logs: "JWT verification..."   ║
║ Compare with Supabase dashboard       ║
╚═══════════════════════════════════════╝
        │
   YES  │  NO
   ↓    ↓
  ✓   ❌ SECRET MISMATCH
        │   (copy exact value from Supabase)
        │
  └─→ ALL CHECKS PASS
      But still 401?
      ↓
      Check:
      - Backend restarted after env var change?
      - Environment variable actually set?
      - No extra spaces in the value?
```

---

## 7. Time to Fix

```
ACTION TIMELINE:

00:00 - Read documentation
        Read SOLUTION_PACKAGE.md (5 min)

00:05 - Setup environment
        SUPABASE_JWT_SECRET on Render.com (5 min)

00:10 - Deploy
        Push code to GitHub (auto-deploy) (5 min)

00:15 - Wait for deployment
        Check backend logs (5 min)

00:20 - Deploy frontend
        Push frontend code (auto-deploy) (5 min)

00:25 - Test
        Run TESTING_GUIDE.md (20 min)

00:45 - SUCCESS ✓
        No more 401 errors!

TOTAL: 45 minutes to complete solution
```

---