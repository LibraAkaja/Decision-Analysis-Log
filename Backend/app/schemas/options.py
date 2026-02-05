from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional
from datetime import datetime

class OptionCreate(BaseModel):
    decision_id: UUID
    option_text: str
    rating: Optional[int] = Field(None, ge=1, le=5)

class OptionUpdate(BaseModel):
    option_text: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)

class OptionResponse(BaseModel):
    id: UUID
    decision_id: UUID
    option_text: str
    rating: Optional[int]
    created_at: datetime
    updated_at: datetime