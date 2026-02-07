# Environment Variables Setup Guide

## Critical: SUPABASE_JWT_SECRET

This is the **most important** variable for fixing your 401 errors.

### Where to Find It

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Settings → API
4. Look for **JWT Secret** (NOT Service Role Key)
5. Copy the entire secret value

**Important:** This is different from Service Role Key!
- `SUPABASE_JWT_SECRET` = Used to VERIFY tokens (needed for backend)
- `SUPABASE_SERVICE_ROLE_KEY` = Used to CREATE/MODIFY data (admin key)

### Setting in Production (Render.com)

1. Go to your Render.com backend service
2. Click "Environment"
3. Add or update variable:
   ```
   Key: SUPABASE_JWT_SECRET
   Value: [paste the JWT secret from Supabase]
   ```
4. Click "Save Changes"
5. Service will automatically redeploy

### Verifying It's Set Correctly

After deployment, check the backend logs:
```
✓ SUPABASE_JWT_SECRET configured: 274 chars
```

If you see:
```
⚠️ WARNING: SUPABASE_JWT_SECRET environment variable not set
```

Then the variable is not set - repeat steps above.

## All Required Variables for Backend

```
SUPABASE_URL
├─ What: Your Supabase project URL
├─ From: Supabase Dashboard → Settings → API → Project URL
├─ Looks like: https://xxxxxxxxxxxx.supabase.co
└─ Example: SUPABASE_URL=https://abcdef123456.supabase.co

SUPABASE_SERVICE_ROLE_KEY  
├─ What: Admin key for backend operations
├─ From: Supabase Dashboard → Settings → API → Service Role Key
├─ Looks like: eyJhbGc... (long JWT-like string)
└─ Used by: Backend to access database tables

SUPABASE_JWT_SECRET
├─ What: Secret to verify user tokens
├─ From: Supabase Dashboard → Settings → API → JWT Secret
├─ Looks like: super-secret-jwt-token-xxxxxx
└─ Used by: Backend to verify login tokens
```

## All Required Variables for Frontend

```
VITE_API_URL
├─ What: Backend API URL
├─ From: Your backend service URL
├─ Production: https://decision-analysis-log-backend.onrender.com/api/v1
├─ Local dev: http://localhost:8000/api/v1
└─ Set in: Vercel environment variables or .env.local
```

## Local Development Setup

Create `.env` file in `Backend/` folder:

```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (your service role key)
SUPABASE_JWT_SECRET=super-secret-jwt-token-...
```

Create `.env.local` file in `Frontend/` folder:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

**Never commit these files!** They're already in `.gitignore`.

## Production Deployment Checklist

### Step 1: Get Values from Supabase
- [ ] Copy SUPABASE_URL
- [ ] Copy SUPABASE_SERVICE_ROLE_KEY  
- [ ] Copy SUPABASE_JWT_SECRET ← **CRITICAL**

### Step 2: Set Backend Variables (Render.com)
- [ ] Go to backend service settings
- [ ] Environment → Add variables:
  - [ ] SUPABASE_URL = `https://...supabase.co`
  - [ ] SUPABASE_SERVICE_ROLE_KEY = `eyJhbGc...`
  - [ ] SUPABASE_JWT_SECRET = `super-secret-...` ← **MUST SET**
- [ ] Save and wait for redeploy

### Step 3: Verify Backend Logs
After redeploy, check logs show:
```
✓ SUPABASE_URL configured: https://xxxxxxxxxxxx...
✓ SUPABASE_SERVICE_ROLE_KEY configured: 256 chars
✓ SUPABASE_JWT_SECRET configured: 274 chars
```

### Step 4: Set Frontend Variables (Vercel)
- [ ] Go to Vercel project settings
- [ ] Environment Variables
- [ ] Add: VITE_API_URL = `https://decision-analysis-log-backend.onrender.com/api/v1`
- [ ] Redeploy

### Step 5: Test
- [ ] Try to register new account
- [ ] Try to login
- [ ] Try to create a decision
- [ ] Check browser console for `[API]` logs showing token

## Troubleshooting

### Problem: Still getting 401 after setting SUPABASE_JWT_SECRET

**Cause:** JWT Secret mismatch

**Solution:**
1. Double-check the value matches exactly (copy/paste again)
2. Check for extra spaces at beginning or end
3. Verify it's the **JWT Secret**, not Service Role Key
4. Restart/redeploy the backend service

### Problem: Can login but can't access decisions

**Cause:** One of the three variables is missing

**Check:**
```bash
# SSH into backend or check logs
echo $SUPABASE_URL      # Should print https://...
echo $SUPABASE_SERVICE_ROLE_KEY  # Should print eyJhbGc...
echo $SUPABASE_JWT_SECRET       # Should print super-secret-...
```

If any returns empty → Set that variable

### Problem: Logs show "WARNING: environment variable not set"

**Cause:** Variable name typo or not actually set in environment

**Fix:**
1. Check exact spelling: `SUPABASE_JWT_SECRET` (not `JWT_SECRET` or `JWT_SECRET_KEY`)
2. Verify in Render/Vercel dashboard it shows in list
3. Redeploy after saving

## Security Notes

⚠️ **NEVER:**
- Share these values in chat, email, or public places
- Commit them to Git
- Expose them in client-side code

✅ **DO:**
- Use environment variables exclusively
- Rotate secrets if accidentally exposed
- Use different values for dev/staging/production
- Restrict who can access your Supabase dashboard

## Quick Test Command

After setting all variables and redeploying, test with:

```bash
# Get a token from login first, then:
curl -X GET https://decision-analysis-log-backend.onrender.com/api/v1/decisions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Should return 200 with decisions, not 401
```

If you get 401, the JWT_SECRET is wrong or token is invalid.
