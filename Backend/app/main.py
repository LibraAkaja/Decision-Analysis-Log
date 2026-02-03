from fastapi import FastAPI
from app.routers import auth, decisions
from app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Decision Analysis LOG API")

app.include_router(decisions.router, prefix="/decisions", tags=["decisions"])