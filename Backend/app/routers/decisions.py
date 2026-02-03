from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.decision import DecisionCreate, DecisionResponse
from app.models.decision import Decision
from app.dependencies import get_db, get_current_user_id

router = APIRouter()

@router.post("/", response_model=DecisionResponse)
def create_decision(
    decision: DecisionCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    new_decision = Decision(
        user_id=user_id,
        **decision.dict()
    )
    db.add(new_decision)
    db.commit()
    db.refresh(new_decision)
    return new_decision

@router.get("/", response_model=list[DecisionResponse])
def list_decisions(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    return db.query(Decision).filter(
        Decision.user_id == user_id
    ).all()