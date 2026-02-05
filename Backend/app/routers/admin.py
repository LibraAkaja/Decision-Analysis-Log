from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.db.supabase import supabase
from app.deps.roles import get_current_admin

router = APIRouter(prefix="/admin", tags=["admin"])


class UserRoleUpdate(BaseModel):
    role: str  # 'user' or 'admin'


class UserListResponse(BaseModel):
    id: str
    email: str
    role: str
    created_at: str


@router.get("/users", response_model=list[UserListResponse])
def get_all_users(admin_id: str = Depends(get_current_admin)):
    """Get all users (admin only)"""
    try:
        response = supabase.table("users").select("*").execute()
        return response.data if response.data else []
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.patch("/users/{user_id}/role", response_model=UserListResponse)
def update_user_role(
    user_id: str,
    data: UserRoleUpdate,
    admin_id: str = Depends(get_current_admin),
):
    """Update user role (admin only)"""
    try:
        if data.role not in ["user", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role must be 'user' or 'admin'",
            )

        response = (
            supabase
            .table("users")
            .update({"role": data.role})
            .eq("id", user_id)
            .select("*")
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: str,
    admin_id: str = Depends(get_current_admin),
):
    """Delete user and all their data (admin only)"""
    try:
        # Delete user from auth (this will cascade to users table via ON DELETE CASCADE)
        supabase.auth.admin.delete_user(user_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


class DashboardStats(BaseModel):
    total_users: int
    total_admins: int
    total_decisions: int
    total_options: int


@router.get("/dashboard", response_model=DashboardStats)
def admin_dashboard(admin_id: str = Depends(get_current_admin)):
    """Admin dashboard stats (admin only)"""
    try:
        users_response = supabase.table("users").select("id", count="exact").execute()
        admins_response = (
            supabase.table("users").select("id", count="exact").eq("role", "admin").execute()
        )
        decisions_response = (
            supabase.table("decisions").select("id", count="exact").execute()
        )
        options_response = (
            supabase.table("decision_options").select("id", count="exact").execute()
        )

        return {
            "total_users": users_response.count or 0,
            "total_admins": admins_response.count or 0,
            "total_decisions": decisions_response.count or 0,
            "total_options": options_response.count or 0,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
