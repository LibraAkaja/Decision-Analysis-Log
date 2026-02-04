from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.decision import Decision
from app.schemas.decision import DecisionCreate, DecisionResponse

router = APIRouter(prefix="/decisions", tags=["Decisions"])


@router.post("/", response_model=DecisionResponse)
def create_decision(
    data: DecisionCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    decision = Decision(
        user_id=user.id,
        title=data.title,
        context=data.context,
        domain=data.domain,
        confidence_level=data.confidence_level,
        decision_date=data.decision_date,
        status=data.status,
    )

    db.add(decision)
    db.commit()
    db.refresh(decision)

    return decision


@router.get("/", response_model=list[DecisionResponse])
def get_my_decisions(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return (
        db.query(Decision)
        .filter(Decision.user_id == user.id)
        .all()
    )


@router.delete("/{decision_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_decision(
    decision_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
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

    db.delete(decision)
    db.commit()