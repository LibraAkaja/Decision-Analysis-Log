from pydantic import BaseModel
from uuid import UUID

class OptionCreate(BaseModel):
    decision_id: UUID
    option_text: str

class OptionOut(BaseModel):
    id: UUID
    option_text: str