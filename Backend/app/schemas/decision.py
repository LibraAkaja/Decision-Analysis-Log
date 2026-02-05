from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class DecisionCreate(BaseModel):
    title: str
    description: Optional[str] = None

class DecisionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class DecisionOut(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    owner_id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime

class DecisionWithOptions(DecisionOut):
    options: list = []