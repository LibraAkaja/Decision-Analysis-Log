from fastapi import APIRouter, Depends, HTTPException, status
from app.db.supabase import supabase
from app.deps.auth import get_current_user
from app.schemas.decision import DecisionCreate, DecisionUpdate, DecisionWithOptions

router = APIRouter(prefix="/decisions", tags=["decisions"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_decision(
    data: DecisionCreate,
    user_id: str = Depends(get_current_user),
):
    """Create a new decision"""
    try:
        response = (
            supabase
            .table("decisions")
            .insert({
                "title": data.title,
                "description": data.description,
                "owner_id": user_id,
                "is_active": True,
            })
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create decision",
            )

        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get("/")
def get_my_decisions(
    user_id: str = Depends(get_current_user),
):
    """Get all decisions for the current user"""
    try:
        response = (
            supabase
            .table("decisions")
            .select("*")
            .eq("owner_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )

        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get("/{decision_id}")
def get_decision_with_options(
    decision_id: str,
    user_id: str = Depends(get_current_user),
):
    """Get a single decision with all its options"""
    try:
        # Get decision
        decision_response = (
            supabase
            .table("decisions")
            .select("*")
            .eq("id", decision_id)
            .eq("owner_id", user_id)
            .single()
            .execute()
        )

        if not decision_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Decision not found",
            )

        decision = decision_response.data

        # Get options
        options_response = (
            supabase
            .table("decision_options")
            .select("*")
            .eq("decision_id", decision_id)
            .order("created_at", desc=False)
            .execute()
        )

        decision["options"] = options_response.data if options_response.data else []

        return decision
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.patch("/{decision_id}")
def update_decision(
    decision_id: str,
    data: DecisionUpdate,
    user_id: str = Depends(get_current_user),
):
    """Update a decision"""
    try:
        # Ownership check
        check = (
            supabase
            .table("decisions")
            .select("id")
            .eq("id", decision_id)
            .eq("owner_id", user_id)
            .execute()
        )
        if not check.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Decision not found",
            )

        update_data = {}
        if data.title is not None:
            update_data["title"] = data.title
        if data.description is not None:
            update_data["description"] = data.description

        if not update_data:
            return check.data[0]

        updated = (
            supabase
            .table("decisions")
            .update(update_data)
            .eq("id", decision_id)
            .eq("owner_id", user_id)
            .select("*")
            .execute()
        )

        if not updated.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update decision",
            )

        return updated.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete("/{decision_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_decision(
    decision_id: str,
    user_id: str = Depends(get_current_user),
):
    """Delete a decision (cascades to delete all options)"""
    try:
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )