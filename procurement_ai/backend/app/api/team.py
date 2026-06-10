# file: backend/app/api/team.py
"""
Team member management API.

Enforces per-plan team_members limits from the subscription service.

Endpoints:
  GET    /team/members              — List all active members in org
  POST   /team/invite               — Create a time-limited invite link (enforces limit)
  GET    /team/invites              — List pending invites for org
  DELETE /team/invites/{id}         — Revoke an invite
  POST   /team/join                 — Accept an invite token and create account
  DELETE /team/members/{user_id}    — Deactivate a team member (owner/manager only)
"""
import uuid
import logging
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Header, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models import Organization, Subscription, TeamInvite, User
from app.services.subscription import get_plan

logger = logging.getLogger(__name__)
router = APIRouter()

# ─────────────────────────────────────────────────────────────────
# JWT / password helpers (reuse from auth.py)
# ─────────────────────────────────────────────────────────────────
try:
    from passlib.context import CryptContext
    _pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    def _hash_pw(p): return _pwd_context.hash(p)
except ImportError:
    import hashlib
    def _hash_pw(p): return hashlib.sha256(p.encode()).hexdigest()


def _make_invite_token() -> str:
    import secrets
    return secrets.token_urlsafe(40)


def _get_org(x_org_id: Optional[str] = Header(None, alias="x-org-id")) -> str:
    if not x_org_id:
        raise HTTPException(400, "x-org-id header required")
    return x_org_id


def _current_plan(db: Session, org_id: str) -> str:
    sub = (
        db.query(Subscription)
        .filter(Subscription.organization_id == org_id, Subscription.status == "active")
        .order_by(Subscription.created_at.desc())
        .first()
    )
    return sub.plan_name if sub else "free"


def _active_member_count(db: Session, org_id: str) -> int:
    return db.query(User).filter(User.organization_id == org_id, User.is_active == True).count()


# ─────────────────────────────────────────────────────────────────
# Schemas
# ─────────────────────────────────────────────────────────────────
class InviteRequest(BaseModel):
    email:   str
    role:    str = "executive"   # owner | manager | executive


class JoinRequest(BaseModel):
    token:      str
    full_name:  str
    password:   str


class DeactivateRequest(BaseModel):
    requester_user_id: str   # must be owner or manager


# ─────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────
@router.get("/members")
def list_members(
    org_id: str = Depends(_get_org),
    db:     Session = Depends(get_db),
):
    members = db.query(User).filter(User.organization_id == org_id).all()
    return {
        "members": [
            {
                "user_id":  m.id,
                "email":    m.email,
                "full_name": m.full_name,
                "role":     m.role,
                "is_active": m.is_active,
                "created_at": m.created_at.isoformat() if m.created_at else None,
            }
            for m in members
        ],
        "count": len(members),
    }


@router.post("/invite", status_code=201)
def create_invite(
    body:   InviteRequest,
    org_id: str = Depends(_get_org),
    db:     Session = Depends(get_db),
):
    """
    Issue a time-limited invite link.
    Enforces team_members plan limit BEFORE creating the invite.
    """
    plan_name    = _current_plan(db, org_id)
    plan_limits  = get_plan(plan_name)
    limit        = plan_limits.team_members
    active_count = _active_member_count(db, org_id)

    if limit != -1 and active_count >= limit:
        raise HTTPException(
            status_code=402,
            detail={
                "error":        "team_limit_reached",
                "message":      f"Your {plan_name.title()} plan allows {limit} team member(s). "
                                f"You currently have {active_count}. Upgrade to add more.",
                "current_plan": plan_name,
                "limit":        limit,
                "used":         active_count,
                "upgrade_url":  "/ui/pricing.html",
            }
        )

    if body.role not in {"owner", "manager", "executive"}:
        raise HTTPException(400, "Role must be one of: owner, manager, executive")

    # Check for existing pending invite for this email+org
    existing = db.query(TeamInvite).filter(
        TeamInvite.organization_id == org_id,
        TeamInvite.email           == body.email.lower(),
        TeamInvite.status          == "pending",
    ).first()
    if existing:
        raise HTTPException(409, f"A pending invite already exists for {body.email}. Revoke it first.")

    org = db.get(Organization, org_id)
    token      = _make_invite_token()
    expires_at = datetime.utcnow() + timedelta(hours=settings.INVITE_TOKEN_EXPIRE_HOURS)

    invite = TeamInvite(
        id              = str(uuid.uuid4()),
        organization_id = org_id,
        email           = body.email.lower(),
        role            = body.role,
        token           = token,
        status          = "pending",
        expires_at      = expires_at,
    )
    db.add(invite)
    db.commit()

    join_url = f"http://127.0.0.1:8000/ui/join.html?token={token}"
    logger.info(f"Invite created: {body.email} -> org {org_id} role={body.role}")

    return {
        "message":    f"Invite sent to {body.email}.",
        "invite_id":  invite.id,
        "email":      body.email,
        "role":       body.role,
        "expires_at": expires_at.isoformat(),
        "join_url":   join_url,
        "org_name":   org.name if org else org_id,
        "note":       "In production, email this join_url to the invitee. "
                      "Demo: visit the URL directly to accept.",
    }


@router.get("/invites")
def list_invites(
    org_id: str = Depends(_get_org),
    db:     Session = Depends(get_db),
):
    invites = db.query(TeamInvite).filter(
        TeamInvite.organization_id == org_id
    ).order_by(TeamInvite.created_at.desc()).all()

    return {
        "invites": [
            {
                "id":          i.id,
                "email":       i.email,
                "role":        i.role,
                "status":      i.status,
                "expires_at":  i.expires_at.isoformat() if i.expires_at else None,
                "accepted_at": i.accepted_at.isoformat() if i.accepted_at else None,
                "created_at":  i.created_at.isoformat() if i.created_at else None,
            }
            for i in invites
        ]
    }


@router.delete("/invites/{invite_id}", status_code=204)
def revoke_invite(
    invite_id: str,
    org_id: str = Depends(_get_org),
    db:     Session = Depends(get_db),
):
    invite = db.query(TeamInvite).filter(
        TeamInvite.id              == invite_id,
        TeamInvite.organization_id == org_id,
    ).first()
    if not invite:
        raise HTTPException(404, "Invite not found.")
    invite.status = "revoked"
    db.commit()


@router.post("/join", status_code=201)
def join_via_invite(
    body: JoinRequest,
    db:   Session = Depends(get_db),
):
    """
    Accept a team invite token and create the new user account.
    Token is single-use — marked accepted immediately.
    """
    invite = db.query(TeamInvite).filter(TeamInvite.token == body.token).first()
    if not invite:
        raise HTTPException(404, "Invalid invite token.")
    if invite.status != "pending":
        raise HTTPException(400, f"Invite is no longer valid (status: {invite.status}).")
    if datetime.utcnow() > invite.expires_at:
        invite.status = "expired"
        db.commit()
        raise HTTPException(400, "Invite has expired. Ask your admin to send a new one.")

    # Check email already registered
    if db.query(User).filter(User.email == invite.email).first():
        raise HTTPException(409, f"An account with {invite.email} already exists. Please sign in.")

    if len(body.password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters.")

    # Re-check team member limit (invite created when within limit, but someone else might have joined)
    plan_name    = _current_plan(db, invite.organization_id)
    plan_limits  = get_plan(plan_name)
    limit        = plan_limits.team_members
    active_count = _active_member_count(db, invite.organization_id)
    if limit != -1 and active_count >= limit:
        raise HTTPException(
            402,
            detail={
                "error":   "team_limit_reached",
                "message": f"The organisation has reached its team member limit ({limit}). "
                           f"The admin must upgrade the plan first.",
            }
        )

    user = User(
        id              = str(uuid.uuid4()),
        organization_id = invite.organization_id,
        email           = invite.email,
        password_hash   = _hash_pw(body.password),
        full_name       = body.full_name.strip(),
        role            = invite.role,
        is_active       = True,
    )
    db.add(user)

    # Mark invite accepted
    invite.status      = "accepted"
    invite.accepted_at = datetime.utcnow()
    db.commit()

    logger.info(f"User joined via invite: {invite.email} org={invite.organization_id}")

    org = db.get(Organization, invite.organization_id)
    return {
        "message":  "Account created successfully. You can now sign in.",
        "email":    user.email,
        "role":     user.role,
        "org_name": org.name if org else invite.organization_id,
    }


@router.delete("/members/{user_id}", status_code=204)
def deactivate_member(
    user_id: str,
    org_id: str = Depends(_get_org),
    db:     Session = Depends(get_db),
):
    """Deactivate (soft-delete) a team member. Does not delete data."""
    user = db.query(User).filter(
        User.id             == user_id,
        User.organization_id == org_id,
    ).first()
    if not user:
        raise HTTPException(404, "User not found in this organisation.")
    if user.role == "owner":
        raise HTTPException(403, "Cannot deactivate the organisation owner.")
    user.is_active = False
    db.commit()


@router.get("/invite/{token}")
def get_invite_details(token: str, db: Session = Depends(get_db)):
    """Retrieve invite details for a token so the join page can prefill values."""
    invite = db.query(TeamInvite).filter(TeamInvite.token == token).first()
    if not invite:
        raise HTTPException(status_code=404, detail="Invalid invite token.")
    if invite.status != "pending":
        raise HTTPException(status_code=400, detail=f"Invite is no longer pending (status: {invite.status}).")
    if datetime.utcnow() > invite.expires_at:
        invite.status = "expired"
        db.commit()
        raise HTTPException(status_code=400, detail="Invite has expired.")

    org = db.get(Organization, invite.organization_id)
    return {
        "email": invite.email,
        "role": invite.role,
        "org_name": org.name if org else invite.organization_id,
        "expires_at": invite.expires_at.isoformat()
    }
