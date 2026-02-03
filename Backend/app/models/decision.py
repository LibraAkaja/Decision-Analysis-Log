import uuid
from sqlalchemy import Column, String, Date, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class Decision(Base):
    __tablename__ = "decisions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)

    title = Column(String, nullable=False)
    context = Column(String, nullable=False)
    domain = Column(String, nullable=False)

    confidence_level = Column(Integer, nullable=False)
    decision_date = Column(Date, nullable=False)
    status = Column(String, nullable=False)