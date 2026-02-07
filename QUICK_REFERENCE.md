# Quick Reference Card - 401 Fix

## The Problem
```
✗ GET /decisions → 401 Unauthorized
✗ POST /decisions → 401 Unauthorized  
✗ POST /logout → 401 Unauthorized
✓ POST /register → 200 OK
✓ POST /login → 200 OK
```

## The Root Cause
JWT token verification was too strict, rejecting valid tokens.

## The Fix (In 3 Steps)
```
Step 1: Set SUPABASE_JWT_SECRET on Render.com
Step 2: Deploy code (automatic)
Step 3: Test using TESTING_GUIDE.md
```

---

## Critical Checklist

### Before Deploying:
- [ ] Read SOLUTION_PACKAGE.md (5 min)
- [ ] Copy SUPABASE_JWT_SECRET from Supabase Dashboard
- [ ] Set on Render.com backend → Environment
- [ ] Commit all code changes

### After Deploying:
- [ ] Check backend logs for: `✓ SUPABASE_JWT_SECRET configured`
- [ ] Test register → works?
- [ ] Test create decision → 201 response? (was 401 before)
- [ ] Test create decision → appears in list?
- [ ] Test logout → works?
- [ ] Test login → can access decision again?
- [ ] Check console for [API] and [AuthContext] logs

---

## Quick Commands

### Browser Console (Check Token)
```javascript
localStorage.getItem('accessToken') // Should not be null
const token = localStorage.getItem('accessToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expires:', new Date(payload.exp * 1000));
```

### Backend Check
```bash
echo $SUPABASE_JWT_SECRET  # Should print something
```

### Test API Call
```bash
curl -X GET https://decision-analysis-log-backend.onrender.com/api/v1/decisions \
  -H "Authorization: Bearer YOUR_TOKEN"
# Should return 200, not 401
```

---

## Files to Review

| Document | Purpose | Time |
|----------|---------|------|
| SOLUTION_PACKAGE.md | Overview | 5 min |
| ENVIRONMENT_SETUP.md | Env vars | 5 min |
| TESTING_GUIDE.md | Testing | 20 min |
| DEBUG_COMMANDS.md | Debugging | As needed |

---

## What Was Changed

### Backend (5 files)
- JWT verification now has fallback
- Config validation added
- Better error messages
- Fixed logout endpoint
- Added [DECISION] logging

### Frontend (2 files)  
- Added [API] request logging
- Added [AuthContext] auth logging

---

## Most Important Variable

```
SUPABASE_JWT_SECRET
├─ From: Supabase Dashboard → Settings → API → JWT Secret
├─ Set on: Render.com → Backend Service → Environment
├─ Check: Backend logs should show "✓ configured: 274 chars"
└─ If wrong: All tokens rejected with 401
```

---

## Testing Sequence

```
1. Register new account
   └─ Should see [AuthContext] logs
   
2. Create decision
   └─ Should see [API] and [DECISION] logs
   └─ Should get 201 Created (not 401)
   
3. View decision list
   └─ Decision should appear
   └─ Should get 200 OK (not 401)
   
4. Logout
   └─ Tokens should clear
   └─ Should redirect to login
   
5. Login again
   └─ Should see previous decision
   └─ Should get 200 OK (not 401)
```

---

## If Still Getting 401

```
1. Verify SUPABASE_JWT_SECRET is set
   Go to: Render.com → Backend → Environment
   
2. Verify value matches Supabase Dashboard
   Supabase: Settings → API → JWT Secret
   
3. Check for extra spaces
   No trailing spaces!
   
4. Redeploy after change
   Render.com auto-redeploys on env change
   
5. Check backend logs
   Render.com → Logs → Look for error message
   
6. Run debug commands
   See: DEBUG_COMMANDS.md
```

---

## Success Criteria

✅ Create decisions returns 201 (not 401)
✅ Get decisions returns 200 (not 401)
✅ Logout works without 401
✅ Console shows [API] logs
✅ Console shows [AuthContext] logs
✅ Backend logs show [DECISION] logs
✅ No "Invalid token" errors

---

## Time Estimate

- Deploy: 15 minutes
- Test: 30 minutes
- Debug (if needed): 15 minutes
- **Total: ~45 minutes**

---

## Files Modified

```
Backend/app/core/security.py
Backend/app/core/config.py
Backend/app/deps/auth.py
Backend/app/routers/auth.py
Backend/app/routers/decisions.py
Frontend/src/api/client.js
Frontend/src/context/AuthContext.jsx
```

---

## Documentation Provided

```
SOLUTION_PACKAGE.md
RESOLUTION_SUMMARY.md
AUTHENTICATION_FIX_SUMMARY.md
ENVIRONMENT_SETUP.md
VERIFICATION_CHECKLIST.md
TESTING_GUIDE.md
DEBUG_COMMANDS.md
VISUAL_GUIDES.md
README_FIXES.md
CHANGES_SUMMARY.md
FINAL_SUMMARY.md
```

---

## Start Here
1. Read SOLUTION_PACKAGE.md (5 min)
2. Set environment variable (5 min)
3. Deploy code (auto)
4. Run tests (30 min)

**Done!** ✅

---

## Support

**Still getting 401?**
→ Check ENVIRONMENT_SETUP.md SUPABASE_JWT_SECRET section

**How to test?**
→ See TESTING_GUIDE.md

**What was changed?**
→ Read RESOLUTION_SUMMARY.md

**Need to debug?**
→ Use DEBUG_COMMANDS.md

**Still stuck?**
→ Read AUTHENTICATION_FIX_SUMMARY.md technical details

---

**Need more detail? Every document is linked in README_FIXES.md**
