from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import decisions, options, auth, admin

app = FastAPI(title="Decision Analyzer API")

# CORS Configuration
origins = [
    "https://decision-analysis-log.vercel.app",
    "https://decision-analyzer-log.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(decisions.router, prefix="/api/v1")
app.include_router(options.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")

@app.get("/")
def health_check():
    return {"status": "ok"}