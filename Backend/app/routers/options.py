from fastapi import APIRouter, Depends, HTTPException, status
from app.db.supabase import supabase
from app.deps.auth import get_current_user
from app.schemas.options import OptionCreate, OptionUpdate

router = APIRouter(prefix="/options", tags=["options"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def add_option(
    data: OptionCreate,
    user_id: str = Depends(get_current_user),
):
    """Add a new option to a decision"""
    try:
        # Ensure decision belongs to current user
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

        # Validate rating if provided
        if data.rating is not None and (data.rating < 1 or data.rating > 5):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Rating must be between 1 and 5",
            )

        # Insert option
        option_response = (
            supabase
            .table("decision_options")
            .insert({
                "decision_id": str(data.decision_id),
                "option_text": data.option_text,
                "rating": data.rating,
            })
            .execute()
        )

        if not option_response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create option",
            )

        return option_response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get("/{decision_id}")
def get_options(
    decision_id: str,
    user_id: str = Depends(get_current_user),
):
    """Get all options for a decision"""
    try:
        # Ownership check
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

        # Fetch options
        options_response = (
            supabase
            .table("decision_options")
            .select("*")
            .eq("decision_id", decision_id)
            .order("created_at", desc=False)
            .execute()
        )

        return options_response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.patch("/{option_id}")
def update_option(
    option_id: str,
    data: OptionUpdate,
    user_id: str = Depends(get_current_user),
):
    """Update an option"""
    try:
        # 1️⃣ Find option and its decision
        option_res = (
            supabase
            .table("decision_options")
            .select("id, decision_id")
            .eq("id", option_id)
            .single()
            .execute()
        )

        if not option_res.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Option not found",
            )

        decision_id = option_res.data["decision_id"]

        # 2️⃣ Ensure decision belongs to current user
        decision_res = (
            supabase
            .table("decisions")
            .select("id")
            .eq("id", decision_id)
            .eq("owner_id", user_id)
            .single()
            .execute()
        )

        if not decision_res.data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to update this option",
            )

        # 3️⃣ Prepare update data
        update_data = {}
        if data.option_text is not None:
            update_data["option_text"] = data.option_text
        if data.rating is not None:
            if data.rating < 1 or data.rating > 5:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Rating must be between 1 and 5",
                )
            update_data["rating"] = data.rating

        if not update_data:
            # Return existing option if nothing to update
            return option_res.data[0]

        # 4️⃣ Update option
        updated_res = (
            supabase
            .table("decision_options")
            .update(update_data)
            .eq("id", option_id)
            .select("*")
            .execute()
        )

        if not updated_res.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update option",
            )

        return updated_res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete("/{option_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_option(
    option_id: str,
    user_id: str = Depends(get_current_user),
):
    """Delete an option"""
    try:
        # 1️⃣ Find option and its decision
        option_res = (
            supabase
            .table("decision_options")
            .select("id, decision_id")
            .eq("id", option_id)
            .single()
            .execute()
        )

        if not option_res.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Option not found",
            )

        decision_id = option_res.data["decision_id"]

        # 2️⃣ Ensure decision belongs to current user
        decision_res = (
            supabase
            .table("decisions")
            .select("id")
            .eq("id", decision_id)
            .eq("owner_id", user_id)
            .single()
            .execute()
        )

        if not decision_res.data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this option",
            )

        # 3️⃣ Delete option
        delete_res = (
            supabase
            .table("decision_options")
            .delete()
            .eq("id", option_id)
            .execute()
        )

        if not delete_res.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Option not found",
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )