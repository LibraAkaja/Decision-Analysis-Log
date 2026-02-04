from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class DecisionCreate(BaseModel):
    title: str
    description: Optional[str] = None

class DecisionOut(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    is_active: bool