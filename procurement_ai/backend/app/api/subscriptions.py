# file: backend/app/api/subscriptions.py
"""
Subscription management API.

Endpoints:
  GET  /subscriptions/plans          — list all plans + pricing
  GET  /subscriptions/current        — org's current plan + usage
  POST /subscriptions/upgrade        — upgrade to a paid plan (mock checkout)
  POST /subscriptions/cancel         — cancel at period end
  POST /subscriptions/reactivate     — undo cancellation
  GET  /subscriptions/usage          — full usage snapshot
  POST /subscriptions/webhook/stripe — Stripe webhook handler (stub)
"""
import uuid
import logging
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.models import Subscription, UsageRecord, Organization
from app.services.subscription import PLANS, PLAN_ORDER, get_full_usage_snapshot

logger = logging.getLogger(__name__)
router = APIRouter()


# ─────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────
def _get_org_id(x_org_id: Optional[str] = Header(None, alias="x-org-id")) -> str:
    if not x_org_id:
        raise HTTPException(status_code=400, detail="x-org-id header is required")
    return x_org_id


# ─────────────────────────────────────────────────────────────────
# Schemas
# ─────────────────────────────────────────────────────────────────
class UpgradeRequest(BaseModel):
    plan_name: str                       # starter | growth | enterprise
    billing_interval: str = "monthly"    # monthly | annual
    payment_method_id: Optional[str] = None  # Stripe PM id (future use)


class CancelRequest(BaseModel):
    reason: Optional[str] = None


# ─────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────
@router.get("/plans")
def list_plans():
    """Return all available plans with limits and pricing."""
    result = []
    for plan_name in PLAN_ORDER:
        lim = PLANS[plan_name]
        result.append({
            "name":         plan_name,
            "display_name": plan_name.title(),
            "price_inr_per_month": lim.price_inr_per_month,
            "limits": {
                "po_uploads_per_month":     lim.po_uploads_per_month,
                "whatsapp_msgs_per_month":  lim.whatsapp_msgs_per_month,
                "hitl_reviews_per_month":   lim.hitl_reviews_per_month,
                "team_members":             lim.team_members,
                "api_access":               lim.api_access,
                "priority_support":         lim.priority_support,
            },
        })
    return {"plans": result}


@router.get("/current")
def get_current_subscription(
    org_id: str = Depends(_get_org_id),
    db: Session = Depends(get_db),
):
    """Return the organisation's active subscription and this month's usage."""
    return get_full_usage_snapshot(db, org_id)


@router.get("/usage")
def get_usage(
    org_id: str = Depends(_get_org_id),
    db: Session = Depends(get_db),
):
    """Alias for /current — usage-focused response."""
    return get_full_usage_snapshot(db, org_id)


@router.post("/upgrade", status_code=201)
def upgrade_plan(
    body: UpgradeRequest,
    org_id: str = Depends(_get_org_id),
    db: Session = Depends(get_db),
):
    """
    Upgrade (or change) the subscription plan.

    In development / demo mode this does NOT charge any card —
    it immediately activates the requested plan.
    In production, integrate Stripe Checkout here.
    """
    plan_name = body.plan_name.lower()
    if plan_name not in PLANS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid plan '{plan_name}'. Valid plans: {', '.join(PLAN_ORDER)}"
        )

    # Verify org exists
    org = db.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organisation not found")

    # Cancel any existing active subscription
    existing = (
        db.query(Subscription)
        .filter(
            Subscription.organization_id == org_id,
            Subscription.status == "active",
        )
        .all()
    )
    for sub in existing:
        sub.status = "cancelled"

    # Create new subscription
    now         = datetime.utcnow()
    interval    = body.billing_interval if body.billing_interval in ("monthly", "annual") else "monthly"
    # Annual billing: period ends 12 months from now
    if interval == "annual":
        period_end = now.replace(year=now.year + 1, day=1, hour=0, minute=0, second=0)
    else:
        period_end  = now.replace(day=1) + timedelta(days=32)
        period_end  = period_end.replace(day=1)  # First of next month

    discount = 0.80 if interval == "annual" else 1.0
    base_price = PLANS[plan_name].price_inr_per_month
    effective_price = int(base_price * discount)

    new_sub = Subscription(
        id                   = str(uuid.uuid4()),
        organization_id      = org_id,
        plan_name            = plan_name,
        status               = "active",
        billing_interval     = interval,
        payment_provider     = "demo",
        current_period_start = now.replace(day=1, hour=0, minute=0, second=0),
        current_period_end   = period_end,
        cancel_at_period_end = False,
    )
    db.add(new_sub)
    db.commit()

    logger.info(f"Org {org_id} upgraded to plan={plan_name} interval={interval}")

    return {
        "message":         f"Successfully upgraded to {plan_name.title()} plan ({interval} billing).",
        "plan":            plan_name,
        "billing_interval": interval,
        "price_inr_per_month": effective_price,
        "subscription_id": new_sub.id,
        "renews_at":       period_end.isoformat(),
        "note":            "Demo mode — no payment processed. Integrate Stripe/Razorpay for production.",
    }


@router.post("/cancel")
def cancel_subscription(
    body: CancelRequest,
    org_id: str = Depends(_get_org_id),
    db: Session = Depends(get_db),
):
    """Mark subscription to cancel at the end of the current period."""
    sub = (
        db.query(Subscription)
        .filter(
            Subscription.organization_id == org_id,
            Subscription.status == "active",
        )
        .order_by(Subscription.created_at.desc())
        .first()
    )

    if not sub or sub.plan_name == "free":
        raise HTTPException(status_code=400, detail="No paid subscription to cancel.")

    sub.cancel_at_period_end = True
    db.commit()

    return {
        "message":      "Subscription will cancel at the end of the current billing period.",
        "cancel_at":    sub.current_period_end.isoformat() if sub.current_period_end else None,
        "reason_logged": body.reason,
    }


@router.post("/reactivate")
def reactivate_subscription(
    org_id: str = Depends(_get_org_id),
    db: Session = Depends(get_db),
):
    """Remove the scheduled cancellation."""
    sub = (
        db.query(Subscription)
        .filter(
            Subscription.organization_id == org_id,
            Subscription.status == "active",
            Subscription.cancel_at_period_end == True,
        )
        .first()
    )

    if not sub:
        raise HTTPException(status_code=400, detail="No scheduled cancellation found.")

    sub.cancel_at_period_end = False
    db.commit()

    return {"message": "Subscription reactivated. It will continue past the billing period."}


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Stub for Stripe webhook handler.

    In production:
    1. Verify the Stripe-Signature header using stripe.Webhook.construct_event()
    2. Handle: invoice.payment_succeeded, customer.subscription.deleted, etc.
    """
    payload = await request.body()
    logger.info(f"Stripe webhook received: {len(payload)} bytes")
    # TODO: implement stripe signature verification and event routing
    return {"received": True}
