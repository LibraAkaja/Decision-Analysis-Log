from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.option import DecisionOption
from app.models.decision import Decision
from app.schemas.option import OptionCreate, OptionResponse

router = APIRouter(prefix="/options", tags=["Options"])


@router.post("/", response_model=OptionResponse)
def add_option(
    data: OptionCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    # Ensure decision belongs to current user
    decision = (
        db.query(Decision)
        .filter(
            Decision.id == data.decision_id,
            Decision.user_id == user.id,
        )
        .first()
    )

    if not decision:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Decision not found",
        )

    option = DecisionOption(
        decision_id=data.decision_id,
        option_text=data.option_text,
    )

    db.add(option)
    db.commit()
    db.refresh(option)

    return option


@router.get("/{decision_id}", response_model=list[OptionResponse])
def get_options(
    decision_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    # Ownership check
    decision = (
        db.query(Decision)
        .filter(
            Decision.id == decision_id,
            Decision.user_id == user.id,
        )
        .first()
    )

    if not decision:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Decision not found",
        )

    return (
        db.query(DecisionOption)
        .filter(DecisionOption.decision_id == decision_id)
        .all()
    )