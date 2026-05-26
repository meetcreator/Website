# file: backend/app/core/database.py
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
from app.core.config import settings

logger = logging.getLogger(__name__)

DATABASE_URL = settings.DATABASE_URL
engine = None
Base = declarative_base()

# --------------------------------------------------
# RESILIENT DATABASE ENGINE CONNECTION (Priority 4 Fallback)
# --------------------------------------------------
try:
    if DATABASE_URL and DATABASE_URL.startswith("postgresql"):
        logger.info("Attempting connection to primary PostgreSQL / Supabase cluster...")
        engine = create_engine(
            DATABASE_URL,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True
        )
        # Test connection immediately to trigger error if port is closed / offline
        with engine.connect() as conn:
            logger.info("Successfully connected to primary PostgreSQL database.")
    else:
        raise ConnectionRefusedError("Configured URL is not PostgreSQL.")
except Exception as e:
    # Capture Connection Refused (OperationalError) and fallback safely
    logger.warning(
        f"PostgreSQL connection failed: {e}. "
        "Enforcing safety fallbacks: Switching context to local SQLite ('sqlite:///./procurement_ai.db')."
    )
    DATABASE_URL = "sqlite:///./procurement_ai.db"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@contextmanager
def get_db_session():
    """Provides a transactional database session scope with automatic rollback and close."""
    session: Session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        logger.error(f"Database transaction failure: {e}")
        raise e
    finally:
        session.close()

def get_db():
    """FastAPI dependency generator yielding a database session context with automatic transaction commit on success."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Transaction rolled back due to endpoint exception: {e}")
        raise e
    finally:
        db.close()

def init_db():
    """Creates base metadata tables (called automatically under SQLite fallbacks)."""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database schemas and enums successfully initialized.")
    except Exception as e:
        logger.error(f"Error during metadata tables initialization: {e}")

# Automatically initialize tables when falling back to SQLite to prevent table-not-found crashes
if DATABASE_URL.startswith("sqlite"):
    init_db()
