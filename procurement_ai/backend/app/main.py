# file: backend/app/main.py
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.observability import CorrelationIdMiddleware
from app.api import ingestion, review, webhooks
from app.core.database import init_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/docs",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set CORS origins for Next.js UI connection - Allow all in development mode for bulletproof local file testing
if settings.ENVIRONMENT.lower() == "development":
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=".*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
app.add_middleware(CorrelationIdMiddleware)

# Register endpoints
app.include_router(ingestion.router, prefix=f"{settings.API_V1_STR}/ingestion", tags=["Ingestion"])
app.include_router(webhooks.router, prefix=f"{settings.API_V1_STR}/webhooks", tags=["Webhooks"])
app.include_router(review.router, prefix=f"{settings.API_V1_STR}/review", tags=["Review"])

frontend_dir = Path(__file__).resolve().parents[3] / "drumilportfolio"
if not frontend_dir.exists():
    frontend_dir = Path(__file__).resolve().parents[2] / "frontend"
if frontend_dir.exists():
    app.mount("/ui", StaticFiles(directory=str(frontend_dir), html=True), name="ui")

@app.on_event("startup")
def startup_init_db():
    if settings.ENVIRONMENT.lower() == "development" and settings.DATABASE_URL.startswith("sqlite"):
        init_db()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "platform": settings.PROJECT_NAME,
        "region": "Gujarat, India SME Cluster",
        "documentation": "/docs"
    }
