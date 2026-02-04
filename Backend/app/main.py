from fastapi import FastAPI
from app.routers import decisions, options

app = FastAPI(title="Decision API")

from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=["*"],
    allow_headers=["*"],
)

app.include_router(decisions.router)
app.include_router(options.router)

@app.get("/")
def health_check():
    return {"status": "ok"}