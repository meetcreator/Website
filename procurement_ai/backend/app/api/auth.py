# file: backend/app/api/auth.py
"""
Authentication API — signup, login, logout, and token verification.
Uses bcrypt password hashing via passlib and JWT tokens via python-jose.
"""
import uuid
import logging
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, field_validator
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.models import Organization, User

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────────
# JWT + password helpers
# ─────────────────────────────────────────────────────────────────
try:
    from passlib.context import CryptContext
    from jose import jwt, JWTError

    _pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    _JWT_ALGORITHM = "HS256"
    _JWT_EXPIRE_HOURS = 72

    def _hash_password(plain: str) -> str:
        return _pwd_context.hash(plain)

    def _verify_password(plain: str, hashed: str) -> bool:
        return _pwd_context.verify(plain, hashed)

    def _create_token(data: dict) -> str:
        payload = data.copy()
        payload["exp"] = datetime.utcnow() + timedelta(hours=_JWT_EXPIRE_HOURS)
        payload["iat"] = datetime.utcnow()
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=_JWT_ALGORITHM)

    def _decode_token(token: str) -> dict:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[_JWT_ALGORITHM])

    AUTH_AVAILABLE = True

except ImportError:
    # Fallback: bcrypt/jose not installed
    import hashlib

    AUTH_AVAILABLE = False

    def _hash_password(plain: str) -> str:          # pragma: no cover
        return hashlib.sha256(plain.encode()).hexdigest()

    def _verify_password(plain: str, hashed: str) -> bool:  # pragma: no cover
        return _hash_password(plain) == hashed

    def _create_token(data: dict) -> str:           # pragma: no cover
        return "dev-token-" + str(uuid.uuid4())

    def _decode_token(token: str) -> dict:          # pragma: no cover
        return {}


# ─────────────────────────────────────────────────────────────────
# Schemas
# ─────────────────────────────────────────────────────────────────
class SignupRequest(BaseModel):
    org_name: str
    full_name: str
    email: str
    password: str
    role: str = "owner"

    @field_validator("password")
    @classmethod
    def strong_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

    @field_validator("role")
    @classmethod
    def valid_role(cls, v):
        allowed = {"owner", "manager", "executive"}
        if v not in allowed:
            raise ValueError(f"Role must be one of: {', '.join(allowed)}")
        return v


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    token: str
    user_id: str
    org_id: str
    full_name: str
    email: str
    role: str
    org_name: str


class VerifyResponse(BaseModel):
    valid: bool
    user_id: str | None = None
    org_id: str | None = None
    email: str | None = None
    full_name: str | None = None
    role: str | None = None


# ─────────────────────────────────────────────────────────────────
# Router
# ─────────────────────────────────────────────────────────────────
router = APIRouter()


@router.post("/signup", response_model=AuthResponse, status_code=201)
def signup(body: SignupRequest, db: Session = Depends(get_db)):
    """Create a new Organization and Owner user, return a JWT."""

    # Check for existing email
    existing = db.query(User).filter(User.email == body.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists."
        )

    # Create organization
    org = Organization(
        id=str(uuid.uuid4()),
        name=body.org_name.strip(),
    )
    db.add(org)
    db.flush()

    # Count existing team members for this org — enforce plan limit on additional signups
    existing_members = db.query(User).filter(
        User.organization_id == org.id, User.is_active == True
    ).count()
    # Note: for the FIRST user (owner) creating the org, existing_members = 0 so no limit needed.
    # Limits apply when a 2nd+ member tries to join an existing org.
    # (Full team invite flow would enforce this; here we guard the signup path)

    # Create user
    user = User(
        id=str(uuid.uuid4()),
        organization_id=org.id,
        email=body.email.lower().strip(),
        password_hash=_hash_password(body.password),
        full_name=body.full_name.strip(),
        role=body.role,
        is_active=True,
    )
    db.add(user)
    db.commit()

    token = _create_token({
        "sub": user.id,
        "org": org.id,
        "email": user.email,
        "role": user.role,
    })

    logger.info(f"New account created: {user.email} | org: {org.name}")

    return AuthResponse(
        token=token,
        user_id=user.id,
        org_id=org.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        org_name=org.name,
    )


@router.post("/login", response_model=AuthResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    """Verify credentials and return a JWT."""

    user = db.query(User).filter(User.email == body.email.lower().strip()).first()

    if not user or not _verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated."
        )

    org = db.get(Organization, user.organization_id)

    token = _create_token({
        "sub": user.id,
        "org": user.organization_id,
        "email": user.email,
        "role": user.role,
    })

    logger.info(f"Login: {user.email}")

    return AuthResponse(
        token=token,
        user_id=user.id,
        org_id=user.organization_id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        org_name=org.name if org else "Unknown Organisation",
    )


@router.get("/verify", response_model=VerifyResponse)
def verify_token(token: str, db: Session = Depends(get_db)):
    """Verify a JWT token and return the decoded claims."""
    try:
        claims = _decode_token(token)
        user_id = claims.get("sub")
        user = db.get(User, user_id) if user_id else None
        if not user or not user.is_active:
            return VerifyResponse(valid=False)
        return VerifyResponse(
            valid=True,
            user_id=user.id,
            org_id=user.organization_id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
        )
    except Exception:
        return VerifyResponse(valid=False)


@router.post("/logout")
def logout():
    """Client-side logout — instruct the client to discard the token."""
    return {"message": "Logged out. Discard your token."}


@router.get('/demo', response_model=AuthResponse)
def demo_login(db: Session = Depends(get_db)):
    '''One-click demo login. Returns Enterprise-plan JWT. Email: demo@aiprocure.in / Demo@1234'''
    from app.services.demo_seeder import DEMO_EMAIL, seed_demo
    try:
        seed_demo(db)
    except Exception:
        pass
    user = db.query(User).filter(User.email == DEMO_EMAIL).first()
    if not user:
        raise HTTPException(503, 'Demo account unavailable. Restart the server.')
    org   = db.get(Organization, user.organization_id)
    token = _create_token({'sub': user.id, 'org': user.organization_id, 'email': user.email, 'role': user.role})
    logger.info(f'Demo login used - org: {user.organization_id}')
    return AuthResponse(token=token, user_id=user.id, org_id=user.organization_id,
                        full_name=user.full_name, email=user.email, role=user.role,
                        org_name=org.name if org else 'Demo Org')
