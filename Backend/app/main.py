from fastapi import FastAPI
from app.routers import decisions, options

app = FastAPI(title="Decision API")

app.include_router(decisions.router)
app.include_router(options.router)

@app.get("/")
def health_check():
    return {"status": "ok"}