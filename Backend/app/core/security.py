from jose import jwt, JWTError
from app.core.config import SUPABASE_JWT_SECRET, ALGORITHM, SUPABASE_URL

def verify_jwt(token: str) -> dict | None:
    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=[ALGORITHM],
            audience="authenticated",
            issuer=f"{SUPABASE_URL}/auth/v1",
        )
        return payload
    except JWTError:
        return None