from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.db.supabase import supabase
from app.deps.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


class UserRegister(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user_id: str
    email: str
    role: str


class UserProfile(BaseModel):
    id: str
    email: str
    role: str
    user_metadata: dict | None = None


@router.post("/register", response_model=AuthResponse)
def register(data: UserRegister):
    """Register a new user"""
    try:
        response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
        })

        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to register user",
            )

        # Check if session exists (may be None if email confirmation is required)
        if not response.session:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email confirmation required. Please check your email to verify your account.",
            )

        # Create user record with default 'user' role
        try:
            supabase.table("users").insert({
                "id": response.user.id,
                "email": response.user.email,
                "role": "user",
            }).execute()
        except Exception as e:
            # If user creation fails, still return the auth response
            pass

        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user_id": response.user.id,
            "email": response.user.email,
            "role": "user",
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/login", response_model=AuthResponse)
def login(data: UserLogin):
    """Login user"""
    try:
        response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password,
        })

        if not response.user or not response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )

        # Get user role
        user_role = "user"
        try:
            user_data = (
                supabase
                .table("users")
                .select("role")
                .eq("id", response.user.id)
                .single()
                .execute()
            )
            if user_data.data:
                user_role = user_data.data["role"]
        except Exception:
            pass

        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user_id": response.user.id,
            "email": response.user.email,
            "role": user_role,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )


@router.post("/refresh")
def refresh_token(data: dict):
    """Refresh access token"""
    try:
        refresh_token_value = data.get("refresh_token")
        if not refresh_token_value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Refresh token not provided",
            )
        
        response = supabase.auth.refresh_session(refresh_token_value)

        if not response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to refresh token",
        )


@router.get("/me", response_model=UserProfile)
def get_current_user_profile(
    user_id: str = Depends(get_current_user),
):
    """Get current user profile"""
    try:
        response = supabase.auth.admin.get_user(user_id)

        # Get user role
        user_role = "user"
        try:
            user_data = (
                supabase
                .table("users")
                .select("role")
                .eq("id", user_id)
                .single()
                .execute()
            )
            if user_data.data:
                user_role = user_data.data["role"]
        except Exception:
            pass

        return {
            "id": response.user.id,
            "email": response.user.email,
            "role": user_role,
            "user_metadata": response.user.user_metadata,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )


@router.post("/logout")
def logout(user_id: str = Depends(get_current_user)):
    """Logout user (sign out)"""
    try:
        # Note: Supabase doesn't require explicit server-side logout for stateless JWT tokens
        # The client-side removal of the token is sufficient
        # However, we could implement token blacklisting here if needed in the future
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to logout",
        )
