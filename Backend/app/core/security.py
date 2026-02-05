from jose import jwt, JWTError
from app.core.config import SUPABASE_JWT_SECRET, ALGORITHM, SUPABASE_URL

def verify_jwt(token: str) -> dict | None:
    """Verify JWT token from Supabase"""
    if not SUPABASE_JWT_SECRET or not SUPABASE_URL:
        print("ERROR: SUPABASE_JWT_SECRET or SUPABASE_URL not configured")
        return None
    
    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=[ALGORITHM],
            audience="authenticated",
            issuer=f"{SUPABASE_URL}/auth/v1",
        )
        return payload
    except JWTError as e:
        print(f"JWT verification failed: {str(e)}")
        return None
    except Exception as e:
        print(f"Unexpected JWT error: {str(e)}")
        return None