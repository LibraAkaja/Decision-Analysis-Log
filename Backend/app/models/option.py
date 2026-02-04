from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base

class DecisionOption(Base):
    __tablename__ = "decision_options"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    decision_id = Column(UUID(as_uuid=True), ForeignKey("decisions.id"), nullable=False)
    option_text = Column(String, nullable=False)