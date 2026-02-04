from jose import jwt, JWTError
from app.core.config import SUPABASE_JWT_SECRET, ALGORITHM

def verify_jwt(token: str) -> dict:
    try:
        payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None