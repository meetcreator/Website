# file: backend/app/api/razorpay_billing.py
"""
Razorpay billing integration.

Endpoints:
  POST /subscriptions/checkout/razorpay  — Create Razorpay order, return order_id for frontend SDK
  POST /subscriptions/webhook/razorpay   — Verify payment_id + signature, activate subscription

Setup:
  1. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env
  2. Configure Razorpay webhook secret in dashboard → Settings → Webhooks
  3. Point Razorpay webhook URL to /api/v1/subscriptions/webhook/razorpay

Without keys the module runs in DEMO mode — orders are simulated and auto-confirmed.
"""
import hashlib
import hmac
import json
import logging
import uuid
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models import Organization, Subscription
from app.services.subscription import PLANS, PLAN_ORDER

logger = logging.getLogger(__name__)
router = APIRouter()

# ─────────────────────────────────────────────────────────────────
# Razorpay SDK (graceful degradation if not installed)
# ─────────────────────────────────────────────────────────────────
try:
    import razorpay as _rzp_sdk
    _rzp_client = (
        _rzp_sdk.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
        if settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET
        else None
    )
    RAZORPAY_AVAILABLE = _rzp_client is not None
except ImportError:
    _rzp_client = None
    RAZORPAY_AVAILABLE = False

ANNUAL_DISCOUNT = 0.80   # 20% off for annual billing

# ─────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────
def _get_org(x_org_id: Optional[str] = Header(None, alias="x-org-id")) -> str:
    if not x_org_id:
        raise HTTPException(400, "x-org-id header required")
    return x_org_id


def _amount_paisa(plan_name: str, interval: str) -> int:
    """Return amount in paisa (INR × 100)."""
    plan   = PLANS.get(plan_name)
    if not plan:
        raise HTTPException(400, f"Unknown plan: {plan_name}")
    price  = plan.price_inr_per_month
    if interval == "annual":
        price = int(price * ANNUAL_DISCOUNT) * 12
    return price * 100


def _activate_subscription(
    db: Session,
    org_id: str,
    plan_name: str,
    interval: str,
    provider: str = "razorpay",
    external_sub_id: Optional[str] = None,
    external_customer_id: Optional[str] = None,
):
    """Cancel old sub and create a new active one."""
    # Cancel existing
    for sub in db.query(Subscription).filter(
        Subscription.organization_id == org_id,
        Subscription.status == "active",
    ).all():
        sub.status = "cancelled"

    now = datetime.utcnow()
    if interval == "annual":
        period_end = now.replace(year=now.year + 1, day=1, hour=0, minute=0, second=0)
    else:
        period_end = (now.replace(day=1) + timedelta(days=32)).replace(day=1)

    new_sub = Subscription(
        id                   = str(uuid.uuid4()),
        organization_id      = org_id,
        plan_name            = plan_name,
        billing_interval     = interval,
        status               = "active",
        payment_provider     = provider,
        external_sub_id      = external_sub_id,
        external_customer_id = external_customer_id,
        current_period_start = now.replace(day=1, hour=0, minute=0, second=0),
        current_period_end   = period_end,
        cancel_at_period_end = False,
    )
    db.add(new_sub)
    db.commit()
    return new_sub


# ─────────────────────────────────────────────────────────────────
# Schemas
# ─────────────────────────────────────────────────────────────────
class CheckoutRequest(BaseModel):
    plan_name:        str
    billing_interval: str = "monthly"   # monthly | annual


# ─────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────
@router.post("/checkout/razorpay")
def create_razorpay_order(
    body:   CheckoutRequest,
    org_id: str = Depends(_get_org),
    db:     Session = Depends(get_db),
):
    """
    Create a Razorpay order and return the order_id + key_id for the
    Razorpay Checkout JS SDK on the frontend.

    In demo mode (no keys configured) returns a simulated order.
    """
    plan_name = body.plan_name.lower()
    interval  = body.billing_interval if body.billing_interval in ("monthly", "annual") else "monthly"

    if plan_name not in PLANS or plan_name == "free":
        raise HTTPException(400, "Select a paid plan to proceed with checkout.")

    org = db.get(Organization, org_id)
    if not org:
        raise HTTPException(404, "Organisation not found.")

    amount_paisa = _amount_paisa(plan_name, interval)

    if RAZORPAY_AVAILABLE:
        # Real Razorpay order
        try:
            order = _rzp_client.order.create({
                "amount":   amount_paisa,
                "currency": "INR",
                "receipt":  f"proc_{org_id[:8]}_{uuid.uuid4().hex[:6]}",
                "notes": {
                    "org_id":   org_id,
                    "org_name": org.name,
                    "plan":     plan_name,
                    "interval": interval,
                },
            })
            return {
                "mode":              "razorpay",
                "key_id":            settings.RAZORPAY_KEY_ID,
                "order_id":          order["id"],
                "amount":            amount_paisa,
                "currency":          "INR",
                "plan_name":         plan_name,
                "billing_interval":  interval,
                "org_name":          org.name,
                "description":       f"AI Procurement Hub — {plan_name.title()} ({interval})",
            }
        except Exception as e:
            logger.error(f"Razorpay order creation failed: {e}")
            raise HTTPException(502, f"Razorpay order failed: {e}")
    else:
        # Demo mode — simulate an order
        demo_order_id = f"order_DEMO_{uuid.uuid4().hex[:14].upper()}"
        logger.info(f"DEMO Razorpay order created: {demo_order_id} org={org_id} plan={plan_name}")
        return {
            "mode":             "demo",
            "key_id":           "rzp_test_demo_key",
            "order_id":         demo_order_id,
            "amount":           amount_paisa,
            "currency":         "INR",
            "plan_name":        plan_name,
            "billing_interval": interval,
            "org_name":         org.name,
            "description":      f"AI Procurement Hub — {plan_name.title()} ({interval})",
            "note":             "Demo mode: no real payment captured. Set RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET in .env for live billing.",
        }


@router.post("/confirm/razorpay")
def confirm_razorpay_payment(
    request_data: dict,
    org_id: str = Depends(_get_org),
    db:     Session = Depends(get_db),
):
    """
    Called by the frontend after Razorpay Checkout success.
    Verifies the payment signature and activates the subscription.

    Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan_name, billing_interval }
    """
    order_id   = request_data.get("razorpay_order_id", "")
    payment_id = request_data.get("razorpay_payment_id", "")
    signature  = request_data.get("razorpay_signature", "")
    plan_name  = request_data.get("plan_name", "")
    interval   = request_data.get("billing_interval", "monthly")

    if not all([order_id, payment_id, plan_name]):
        raise HTTPException(400, "Missing required fields: razorpay_order_id, razorpay_payment_id, plan_name")

    # Verify signature (skip in demo mode)
    if RAZORPAY_AVAILABLE and settings.RAZORPAY_KEY_SECRET:
        msg      = f"{order_id}|{payment_id}"
        expected = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            msg.encode(),
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(expected, signature):
            raise HTTPException(400, "Invalid Razorpay payment signature. Payment not confirmed.")
    else:
        logger.info(f"Demo mode: skipping Razorpay signature verification for order {order_id}")

    # Activate subscription
    sub = _activate_subscription(
        db                   = db,
        org_id               = org_id,
        plan_name            = plan_name,
        interval             = interval,
        provider             = "razorpay",
        external_sub_id      = payment_id,
        external_customer_id = order_id,
    )

    logger.info(f"Razorpay payment confirmed: org={org_id} plan={plan_name} payment={payment_id}")

    return {
        "success":          True,
        "message":          f"Payment confirmed. {plan_name.title()} plan activated.",
        "plan":             plan_name,
        "billing_interval": interval,
        "subscription_id":  sub.id,
        "renews_at":        sub.current_period_end.isoformat() if sub.current_period_end else None,
    }


@router.post("/webhook/razorpay")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: Optional[str] = Header(None, alias="x-razorpay-signature"),
    db:      Session = Depends(get_db),
):
    """
    Razorpay webhook handler.

    Configure in Razorpay Dashboard → Settings → Webhooks:
      URL:    https://your-domain/api/v1/subscriptions/webhook/razorpay
      Events: payment.captured, subscription.activated, subscription.cancelled

    Set the webhook secret in RAZORPAY_KEY_SECRET for signature verification.
    """
    body = await request.body()

    # Verify webhook signature
    if settings.RAZORPAY_KEY_SECRET and x_razorpay_signature:
        expected = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            body,
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(expected, x_razorpay_signature):
            raise HTTPException(400, "Invalid Razorpay webhook signature.")

    try:
        payload    = json.loads(body)
        event_type = payload.get("event", "")
        entity     = payload.get("payload", {}).get("payment", {}).get("entity", {})

        logger.info(f"Razorpay webhook: event={event_type}")

        if event_type == "payment.captured":
            # Extract org_id from order notes
            notes   = entity.get("notes", {})
            org_id  = notes.get("org_id")
            plan    = notes.get("plan", "starter")
            interval= notes.get("interval", "monthly")

            if org_id:
                _activate_subscription(
                    db          = db,
                    org_id      = org_id,
                    plan_name   = plan,
                    interval    = interval,
                    provider    = "razorpay",
                    external_sub_id      = entity.get("id"),
                    external_customer_id = entity.get("order_id"),
                )
                logger.info(f"Webhook activated plan={plan} for org={org_id}")

        elif event_type == "subscription.cancelled":
            sub_entity = payload.get("payload", {}).get("subscription", {}).get("entity", {})
            ext_id = sub_entity.get("id")
            if ext_id:
                sub = db.query(Subscription).filter(Subscription.external_sub_id == ext_id).first()
                if sub:
                    sub.status = "cancelled"
                    db.commit()

        return {"received": True, "event": event_type}

    except json.JSONDecodeError:
        raise HTTPException(400, "Invalid JSON payload.")
    except Exception as e:
        logger.error(f"Razorpay webhook error: {e}")
        raise HTTPException(500, str(e))
