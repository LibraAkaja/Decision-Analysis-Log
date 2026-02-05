from fastapi import Depends, HTTPException, status
from app.db.supabase import supabase
from app.deps.auth import get_current_user


async def get_current_admin(user_id: str = Depends(get_current_user)):
    """Dependency to check if user is admin"""
    try:
        response = (
            supabase
            .table("users")
            .select("role")
            .eq("id", user_id)
            .single()
            .execute()
        )

        if not response.data or response.data["role"] != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required",
            )

        return user_id
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


async def get_user_role(user_id: str = Depends(get_current_user)):
    """Get the role of the current user"""
    try:
        response = (
            supabase
            .table("users")
            .select("role")
            .eq("id", user_id)
            .single()
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return response.data["role"]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
