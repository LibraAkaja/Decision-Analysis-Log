from fastapi import FastAPI
from app.routers import decisions, options
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Decision API")

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=["*"],
    allow_headers=["*"],
)

app.include_router(decisions.router, prefix="/api/v1")
app.include_router(options.router, prefix="/api/v1")

@app.get("/")
def health_check():
    return {"status": "ok"}