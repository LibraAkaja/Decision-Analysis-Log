from pydantic import BaseModel, Field
from datetime import date
from uuid import UUID

class DecisionCreate(BaseModel):
    title: str
    context: str
    domain: str
    confidence_level: int = Field(ge=1, le=5)
    decision_date: date
    status: str

class DecisionResponse(DecisionCreate):
    id: UUID