# file: backend/app/api/outbound_webhooks.py
"""
Outbound webhook management API (Growth+ feature).

Endpoints:
  POST   /webhooks/endpoints              — Register a new endpoint
  GET    /webhooks/endpoints              — List all endpoints for an org
  PATCH  /webhooks/endpoints/{id}         — Update url / filters / active status
  DELETE /webhooks/endpoints/{id}         — Remove an endpoint
  GET    /webhooks/endpoints/{id}/logs    — Delivery history for an endpoint
  POST   /webhooks/endpoints/{id}/test    — Send a test ping to the endpoint
"""
import uuid
import logging
from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Header, status
from pydantic import BaseModel, HttpUrl
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import WebhookEndpoint, OutboundWebhookLog
from app.services.subscription import get_plan, get_full_usage_snapshot
from app.models import Subscription

logger = logging.getLogger(__name__)
router = APIRouter()

PLAN_WEBHOOK_LIMITS = {
    "free":       0,   # no outbound webhooks on free plan
    "starter":    0,   # not in starter either
    "growth":     5,   # up to 5 endpoints
    "enterprise": -1,  # unlimited
}


# ─────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────
def _get_org(x_org_id: Optional[str] = Header(None, alias="x-org-id")) -> str:
    if not x_org_id:
        raise HTTPException(400, "x-org-id header required")
    return x_org_id


def _check_webhook_plan(db: Session, org_id: str) -> str:
    """Return plan name; raise 402 if plan doesn't allow outbound webhooks."""
    sub = (
        db.query(Subscription)
        .filter(Subscription.organization_id == org_id, Subscription.status == "active")
        .order_by(Subscription.created_at.desc())
        .first()
    )
    plan = sub.plan_name if sub else "free"
    limit = PLAN_WEBHOOK_LIMITS.get(plan, 0)
    if limit == 0:
        raise HTTPException(
            status_code=402,
            detail={
                "error":       "plan_restriction",
                "message":     "Outbound webhook integrations are available on the Growth plan and above.",
                "upgrade_url": "/ui/pricing.html",
                "current_plan": plan,
            }
        )
    return plan


# ─────────────────────────────────────────────────────────────────
# Schemas
# ─────────────────────────────────────────────────────────────────
class EndpointCreate(BaseModel):
    url:          str
    description:  Optional[str] = None
    event_filter: Optional[str] = None   # comma-separated event types; null = all
    secret:       Optional[str] = None


class EndpointUpdate(BaseModel):
    url:          Optional[str] = None
    description:  Optional[str] = None
    event_filter: Optional[str] = None
    secret:       Optional[str] = None
    is_active:    Optional[bool] = None


def _ep_to_dict(ep: WebhookEndpoint) -> dict:
    return {
        "id":              ep.id,
        "organization_id": ep.organization_id,
        "url":             ep.url,
        "description":     ep.description,
        "event_filter":    ep.event_filter,
        "has_secret":      bool(ep.secret),
        "is_active":       ep.is_active,
        "created_at":      ep.created_at.isoformat() if ep.created_at else None,
        "updated_at":      ep.updated_at.isoformat() if ep.updated_at else None,
    }


# ─────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────
@router.post("/endpoints", status_code=201)
def create_endpoint(
    body:   EndpointCreate,
    org_id: str = Depends(_get_org),
    db:     Session = Depends(get_db),
):
    plan = _check_webhook_plan(db, org_id)
    limit = PLAN_WEBHOOK_LIMITS.get(plan, 0)

    # Enforce endpoint count limit per plan
    if limit != -1:
        existing_count = (
            db.query(WebhookEndpoint)
            .filter(WebhookEndpoint.organization_id == org_id, WebhookEndpoint.is_active == True)
            .count()
        )
        if existing_count >= limit:
            raise HTTPException(
                status_code=402,
                detail=f"Your {plan.title()} plan allows up to {limit} active webhook endpoints. "
                       f"Upgrade to Enterprise for unlimited endpoints."
            )

    ep = WebhookEndpoint(
        id              = str(uuid.uuid4()),
        organization_id = org_id,
        url             = body.url,
        description     = body.description,
        event_filter    = body.event_filter,
        secret          = body.secret,
        is_active       = True,
    )
    db.add(ep)
    db.commit()
    logger.info(f"Webhook endpoint created: {ep.url} for org {org_id}")
    return {"message": "Endpoint registered.", "endpoint": _ep_to_dict(ep)}


@router.get("/endpoints")
def list_endpoints(
    org_id: str = Depends(_get_org),
    db:     Session = Depends(get_db),
):
    eps = (
        db.query(WebhookEndpoint)
        .filter(WebhookEndpoint.organization_id == org_id)
        .order_by(WebhookEndpoint.created_at.desc())
        .all()
    )
    return {"endpoints": [_ep_to_dict(e) for e in eps], "count": len(eps)}


@router.patch("/endpoints/{endpoint_id}")
def update_endpoint(
    endpoint_id: str,
    body:   EndpointUpdate,
    org_id: str = Depends(_get_org),
    db:     Session = Depends(get_db),
):
    ep = db.query(WebhookEndpoint).filter(
        WebhookEndpoint.id == endpoint_id,
        WebhookEndpoint.organization_id == org_id,
    ).first()
    if not ep:
        raise HTTPException(404, "Endpoint not found.")

    if body.url         is not None: ep.url          = body.url
    if body.description is not None: ep.description  = body.description
    if body.event_filter is not None: ep.event_filter = body.event_filter
    if body.secret      is not None: ep.secret        = body.secret
    if body.is_active   is not None: ep.is_active     = body.is_active

    db.commit()
    return {"message": "Endpoint updated.", "endpoint": _ep_to_dict(ep)}


@router.delete("/endpoints/{endpoint_id}", status_code=204)
def delete_endpoint(
    endpoint_id: str,
    org_id: str = Depends(_get_org),
    db:     Session = Depends(get_db),
):
    ep = db.query(WebhookEndpoint).filter(
        WebhookEndpoint.id == endpoint_id,
        WebhookEndpoint.organization_id == org_id,
    ).first()
    if not ep:
        raise HTTPException(404, "Endpoint not found.")
    db.delete(ep)
    db.commit()


@router.get("/endpoints/{endpoint_id}/logs")
def get_endpoint_logs(
    endpoint_id: str,
    limit:  int = 50,
    org_id: str = Depends(_get_org),
    db:     Session = Depends(get_db),
):
    ep = db.query(WebhookEndpoint).filter(
        WebhookEndpoint.id == endpoint_id,
        WebhookEndpoint.organization_id == org_id,
    ).first()
    if not ep:
        raise HTTPException(404, "Endpoint not found.")

    logs = (
        db.query(OutboundWebhookLog)
        .filter(OutboundWebhookLog.endpoint_id == endpoint_id)
        .order_by(OutboundWebhookLog.created_at.desc())
        .limit(min(limit, 200))
        .all()
    )
    return {
        "endpoint_id": endpoint_id,
        "logs": [
            {
                "id":             log.id,
                "event_type":     log.event_type,
                "response_status": log.response_status,
                "success":        log.success,
                "duration_ms":    log.duration_ms,
                "error_message":  log.error_message,
                "created_at":     log.created_at.isoformat() if log.created_at else None,
            }
            for log in logs
        ],
    }


@router.post("/endpoints/{endpoint_id}/test")
def test_endpoint(
    endpoint_id: str,
    org_id: str = Depends(_get_org),
    db:     Session = Depends(get_db),
):
    """Send a test ping event to the endpoint and return the delivery result."""
    ep = db.query(WebhookEndpoint).filter(
        WebhookEndpoint.id == endpoint_id,
        WebhookEndpoint.organization_id == org_id,
    ).first()
    if not ep:
        raise HTTPException(404, "Endpoint not found.")

    from app.services.outbound_webhooks import fanout_event
    results = fanout_event(
        db              = db,
        organization_id = org_id,
        event_type      = "TEST_PING",
        data            = {"message": "This is a test delivery from AI Procurement Hub.", "endpoint_id": endpoint_id},
    )
    db.commit()

    if not results:
        return {"message": "No active endpoints matched.", "results": []}
    return {"message": "Test ping sent.", "results": results}
