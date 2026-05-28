# file: backend/app/main.py
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.observability import CorrelationIdMiddleware
from app.api import ingestion, review, webhooks, auth, subscriptions, outbound_webhooks, razorpay_billing, team
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
app.include_router(auth.router,              prefix=f"{settings.API_V1_STR}/auth",              tags=["Auth"])
app.include_router(subscriptions.router,     prefix=f"{settings.API_V1_STR}/subscriptions",     tags=["Subscriptions"])
app.include_router(razorpay_billing.router,  prefix=f"{settings.API_V1_STR}/subscriptions",     tags=["Billing"])
app.include_router(outbound_webhooks.router, prefix=f"{settings.API_V1_STR}/webhooks",          tags=["OutboundWebhooks"])
app.include_router(team.router,              prefix=f"{settings.API_V1_STR}/team",              tags=["Team"])
app.include_router(ingestion.router,         prefix=f"{settings.API_V1_STR}/ingestion",         tags=["Ingestion"])
app.include_router(webhooks.router,          prefix=f"{settings.API_V1_STR}/webhooks",          tags=["Webhooks"])
app.include_router(review.router,            prefix=f"{settings.API_V1_STR}/review",            tags=["Review"])

frontend_dir = Path(__file__).resolve().parents[2] / "frontend"
if frontend_dir.exists():
    app.mount("/ui", StaticFiles(directory=str(frontend_dir), html=True), name="ui")

@app.on_event("startup")
def startup_init_db():
    """Ensure all tables exist on every startup (create_all is idempotent)."""
    from app.core.database import engine, SessionLocal
    from app.models import Base
    Base.metadata.create_all(bind=engine)
    import logging
    logging.getLogger(__name__).info("DB tables verified / created at startup.")
    # Seed demo account
    db = SessionLocal()
    try:
        from app.services.demo_seeder import seed_demo
        seed_demo(db)
    except Exception as e:
        logging.getLogger(__name__).warning(f"Demo seeder failed (non-critical): {e}")
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "platform": settings.PROJECT_NAME,
        "region": "Gujarat, India SME Cluster",
        "documentation": "/docs",
        "ui": {
            "landing":    "/ui/home.html",
            "dashboard":  "/ui/index.html",
            "operations": "/ui/operations.html",
            "pricing":    "/ui/pricing.html",
        },
        "demo": {
            "email":    "demo@aiprocure.in",
            "password": "Demo@1234",
            "note":     "Pre-loaded with Enterprise plan, 7 workflows, 5 vendors, HITL drafts, and audit trail."
        }
    }
