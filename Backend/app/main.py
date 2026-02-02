from fastapi import FastAPI
from app.routers import auth, decisions

app = FastAPI(title="Decision Analysis LOG API")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(decisions.router, prefix="/decisions", tags=["decisions"])