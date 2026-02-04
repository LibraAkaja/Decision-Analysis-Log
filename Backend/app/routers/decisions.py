from fastapi import APIRouter, Depends, HTTPException, status
from app.db.supabase import supabase
from app.deps.auth import get_current_user
from app.schemas.decision import DecisionCreate

router = APIRouter(prefix="/decisions", tags=["Decisions"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_decision(
    data: DecisionCreate,
    user_id: str = Depends(get_current_user),
):
    response = (
        supabase
        .table("decisions")
        .insert({
            "title": data.title,
            "description": data.description,
            "owner_id": user_id,
        })
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create decision",
        )

    return response.data[0]


@router.get("/")
def get_my_decisions(
    user_id: str = Depends(get_current_user),
):
    response = (
        supabase
        .table("decisions")
        .select("*")
        .eq("owner_id", user_id)
        .execute()
    )

    return response.data


@router.delete("/{decision_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_decision(
    decision_id: str,
    user_id: str = Depends(get_current_user),
):
    response = (
        supabase
        .table("decisions")
        .delete()
        .eq("id", decision_id)
        .eq("owner_id", user_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Decision not found",
        )