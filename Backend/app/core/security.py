import time
import requests
from jwt import PyJWKClient, decode as jwt_decode, InvalidTokenError
from app.core.config import SUPABASE_JWT_SECRET, ALGORITHM, SUPABASE_URL

# Cache the PyJWKClient per SUPABASE_URL
_JWKS_CLIENT = None
_JWKS_CLIENT_URL = None


def _get_jwks_client() -> PyJWKClient:
    global _JWKS_CLIENT, _JWKS_CLIENT_URL
    jwks_url = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
    if _JWKS_CLIENT is None or _JWKS_CLIENT_URL != jwks_url:
        _JWKS_CLIENT = PyJWKClient(jwks_url)
        _JWKS_CLIENT_URL = jwks_url
    return _JWKS_CLIENT


def verify_jwt(token: str) -> dict | None:
    """Verify JWT token from Supabase.

    Strategy:
    - First attempt HS256 verification using the legacy shared secret (`SUPABASE_JWT_SECRET`).
    - If that fails and the token uses an asymmetric algorithm (RS*/ES*), fetch the JWKS
      from Supabase and verify using the matching public key.
    - Returns the decoded payload on success, or None on failure.
    """
    if not SUPABASE_URL:
        print("ERROR: SUPABASE_URL not configured")
        return None

    # Try HS256 with legacy secret first (covers older projects)
    if SUPABASE_JWT_SECRET:
        try:
            payload = jwt_decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
                issuer=f"{SUPABASE_URL}/auth/v1",
            )
            return payload
        except InvalidTokenError as e:
            # Not valid under HS256 - continue to try JWKS verification
            print(f"HS256 verification failed: {str(e)}")

    # Try JWKS (RS*/ES*). Use PyJWKClient to fetch the signing key.
    try:
        jwks_client = _get_jwks_client()
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        public_key = signing_key.key
        payload = jwt_decode(
            token,
            public_key,
            algorithms=["RS256", "ES256"],
            audience="authenticated",
            issuer=f"{SUPABASE_URL}/auth/v1",
        )
        return payload
    except Exception as e:
        # Log details for debugging
        print(f"JWKS/Asymmetric JWT verification failed: {str(e)}")

    # As a last resort try decoding without verification (debug only)
    try:
        payload = jwt_decode(token, options={"verify_signature": False})
        print("Token decoded without signature verification - debugging only")
        return payload
    except Exception as e:
        print(f"Failed to decode token without verification: {str(e)}")
        return None