from fastapi import APIRouter, Depends
from app.db.supabase import supabase
from app.deps.auth import get_current_user
from app.schemas.option import OptionCreate

router = APIRouter(prefix="/options", tags=["Options"])

@router.post("/")
def add_option(
    data: OptionCreate,
    user_id: str = Depends(get_current_user),
):
    response = supabase.table("decision_options").insert({
        "decision_id": str(data.decision_id),
        "option_text": data.option_text
    }).execute()

    return response.data[0]


@router.get("/{decision_id}")
def get_options(decision_id: str, user_id: str = Depends(get_current_user)):
    response = (
        supabase
        .table("decision_options")
        .select("*")
        .eq("decision_id", decision_id)
        .execute()
    )
    return response.data