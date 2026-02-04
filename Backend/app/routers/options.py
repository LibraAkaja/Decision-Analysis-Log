from fastapi import APIRouter, Depends, HTTPException, status
from app.db.supabase import supabase
from app.deps.auth import get_current_user
from app.schemas.option import OptionCreate

router = APIRouter(prefix="/options", tags=["Options"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def add_option(
    data: OptionCreate,
    user_id: str = Depends(get_current_user),
):
    # 1️⃣ Ensure decision belongs to current user
    decision_response = (
        supabase
        .table("decisions")
        .select("id")
        .eq("id", str(data.decision_id))
        .eq("owner_id", user_id)
        .single()
        .execute()
    )

    if not decision_response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Decision not found",
        )

    # 2️⃣ Insert option
    option_response = (
        supabase
        .table("decision_options")
        .insert({
            "decision_id": str(data.decision_id),
            "option_text": data.option_text,
        })
        .execute()
    )

    if not option_response.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create option",
        )

    return option_response.data[0]


@router.get("/{decision_id}")
def get_options(
    decision_id: str,
    user_id: str = Depends(get_current_user),
):
    # 1️⃣ Ownership check
    decision_response = (
        supabase
        .table("decisions")
        .select("id")
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

    # 2️⃣ Fetch options
    options_response = (
        supabase
        .table("decision_options")
        .select("*")
        .eq("decision_id", decision_id)
        .execute()
    )

    return options_response.data