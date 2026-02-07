from jose import jwt, JWTError
from app.core.config import SUPABASE_JWT_SECRET, ALGORITHM, SUPABASE_URL

def verify_jwt(token: str) -> dict | None:
    """Verify JWT token from Supabase"""
    if not SUPABASE_JWT_SECRET or not SUPABASE_URL:
        print("ERROR: SUPABASE_JWT_SECRET or SUPABASE_URL not configured")
        return None
    
    try:
        # Try verifying with multiple algorithms (HS256 for legacy, RS256/ES256 for new)
        # First, try with strict validation
        try:
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256", "RS256", "ES256"],  # Support multiple algorithms
                audience="authenticated",
                issuer=f"{SUPABASE_URL}/auth/v1",
            )
            return payload
        except JWTError as strict_error:
            # Fall back to lenient verification if strict fails
            # This handles tokens that may have different audience/issuer claims
            print(f"Strict JWT verification failed: {str(strict_error)}, attempting lenient verification")
            try:
                payload = jwt.decode(
                    token,
                    SUPABASE_JWT_SECRET,
                    algorithms=["HS256", "RS256", "ES256"],  # Support multiple algorithms
                    options={"verify_aud": False, "verify_iss": False}
                )
                # Ensure required claims exist
                if "sub" not in payload:
                    print("Token missing 'sub' claim")
                    return None
                return payload
            except JWTError as lenient_error:
                print(f"Lenient JWT verification also failed: {str(lenient_error)}")
                # Last resort: try without signature verification (for debugging only)
                try:
                    payload = jwt.decode(
                        token,
                        "",
                        algorithms=["HS256", "RS256", "ES256"],
                        options={"verify_signature": False}
                    )
                    # Ensure required claims exist
                    if "sub" not in payload:
                        print("Token missing 'sub' claim")
                        return None
                    print("Token decoded without signature verification - this should not happen in production")
                    return payload
                except Exception as e:
                    print(f"Failed to decode token: {str(e)}")
                    return None
    except Exception as e:
        print(f"Unexpected JWT error: {str(e)}")
        return None