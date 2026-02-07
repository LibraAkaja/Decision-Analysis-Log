import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
ALGORITHM = "HS256"

# Validate required environment variables
if not SUPABASE_URL:
    print("⚠️  WARNING: SUPABASE_URL environment variable not set")
else:
    print(f"✓ SUPABASE_URL configured: {SUPABASE_URL[:30]}...")

if not SUPABASE_SERVICE_ROLE_KEY:
    print("⚠️  WARNING: SUPABASE_SERVICE_ROLE_KEY environment variable not set")
else:
    print(f"✓ SUPABASE_SERVICE_ROLE_KEY configured: {len(SUPABASE_SERVICE_ROLE_KEY)} chars")

if not SUPABASE_JWT_SECRET:
    print("⚠️  WARNING: SUPABASE_JWT_SECRET environment variable not set")
else:
    print(f"✓ SUPABASE_JWT_SECRET configured: {len(SUPABASE_JWT_SECRET)} chars")