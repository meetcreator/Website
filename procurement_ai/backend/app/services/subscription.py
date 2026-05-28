# file: backend/app/services/subscription.py
"""
Subscription plan definitions and usage enforcement.

Plans:
  FREE     — 10 POs / 50 WhatsApp msgs / 5 HITL reviews / month  (always free)
  STARTER  — 100 POs / 500 msgs / 50 HITL / month  (₹2,999/mo)
  GROWTH   — 500 POs / 2,500 msgs / 250 HITL / month  (₹9,999/mo)
  ENTERPRISE — Unlimited  (₹29,999/mo + custom)

Usage is tracked monthly per organisation in the `usage_records` table.
Limits are enforced via check_limit() which raises HTTP 402 when exceeded.
"""
from __future__ import annotations
from dataclasses import dataclass
from typing import Optional
from datetime import datetime
import uuid
import logging

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────
# Plan catalogue
# ─────────────────────────────────────────────────────────────────
@dataclass(frozen=True)
class PlanLimits:
    po_uploads_per_month:      int   # -1 = unlimited
    whatsapp_msgs_per_month:   int
    hitl_reviews_per_month:    int
    team_members:              int
    api_access:                bool
    priority_support:          bool
    price_inr_per_month:       int   # 0 = free


PLANS: dict[str, PlanLimits] = {
    "free": PlanLimits(
        po_uploads_per_month    = 10,
        whatsapp_msgs_per_month = 50,
        hitl_reviews_per_month  = 5,
        team_members            = 1,
        api_access              = False,
        priority_support        = False,
        price_inr_per_month     = 0,
    ),
    "starter": PlanLimits(
        po_uploads_per_month    = 100,
        whatsapp_msgs_per_month = 500,
        hitl_reviews_per_month  = 50,
        team_members            = 5,
        api_access              = True,
        priority_support        = False,
        price_inr_per_month     = 2999,
    ),
    "growth": PlanLimits(
        po_uploads_per_month    = 500,
        whatsapp_msgs_per_month = 2500,
        hitl_reviews_per_month  = 250,
        team_members            = 15,
        api_access              = True,
        priority_support        = True,
        price_inr_per_month     = 9999,
    ),
    "enterprise": PlanLimits(
        po_uploads_per_month    = -1,
        whatsapp_msgs_per_month = -1,
        hitl_reviews_per_month  = -1,
        team_members            = -1,
        api_access              = True,
        priority_support        = True,
        price_inr_per_month     = 29999,
    ),
}

PLAN_ORDER = ["free", "starter", "growth", "enterprise"]


# ─────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────
def get_plan(plan_name: str) -> PlanLimits:
    return PLANS.get(plan_name.lower(), PLANS["free"])


def billing_period_start() -> datetime:
    """First second of the current calendar month (UTC)."""
    now = datetime.utcnow()
    return now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)


# ─────────────────────────────────────────────────────────────────
# Usage enforcement
# ─────────────────────────────────────────────────────────────────
def check_limit(
    db: Session,
    org_id: str,
    resource: str,   # 'po_uploads' | 'whatsapp_msgs' | 'hitl_reviews'
    increment: int = 0,
) -> dict:
    """
    Check (and optionally increment) usage for a given resource.

    Returns the current usage snapshot.
    Raises HTTP 402 if the limit is exceeded.
    """
    from app.models import Subscription, UsageRecord  # late import avoids circular

    # Get active subscription
    sub = (
        db.query(Subscription)
        .filter(
            Subscription.organization_id == org_id,
            Subscription.status == "active",
        )
        .order_by(Subscription.created_at.desc())
        .first()
    )

    plan_name = sub.plan_name if sub else "free"
    limits    = get_plan(plan_name)

    # Get or create this month's usage record
    period_start = billing_period_start()
    usage = (
        db.query(UsageRecord)
        .filter(
            UsageRecord.organization_id == org_id,
            UsageRecord.period_start    == period_start,
        )
        .first()
    )
    if not usage:
        usage = UsageRecord(
            id              = str(uuid.uuid4()),
            organization_id = org_id,
            period_start    = period_start,
        )
        db.add(usage)
        db.flush()

    # Read current value
    current = getattr(usage, resource, 0) or 0

    # Check limit before incrementing
    limit = getattr(limits, f"{resource}_per_month", -1)
    if limit != -1 and current + increment > limit:
        _human = {
            "po_uploads":     "PO uploads",
            "whatsapp_msgs":  "WhatsApp messages",
            "hitl_reviews":   "HITL reviews",
        }.get(resource, resource)
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail={
                "error":        "usage_limit_exceeded",
                "resource":     resource,
                "limit":        limit,
                "used":         current,
                "plan":         plan_name,
                "message":      f"You have reached your {_human} limit ({limit}/month) on the {plan_name.title()} plan.",
                "upgrade_url":  "/ui/pricing.html",
            },
        )

    # Increment
    if increment > 0:
        setattr(usage, resource, current + increment)
        db.flush()

    return {
        "plan":         plan_name,
        "resource":     resource,
        "used":         current + increment,
        "limit":        limit,
        "period_start": period_start.isoformat(),
    }


def get_full_usage_snapshot(db: Session, org_id: str) -> dict:
    """Return a complete usage + limit snapshot for an organisation."""
    from app.models import Subscription, UsageRecord

    sub = (
        db.query(Subscription)
        .filter(
            Subscription.organization_id == org_id,
            Subscription.status == "active",
        )
        .order_by(Subscription.created_at.desc())
        .first()
    )

    plan_name = sub.plan_name if sub else "free"
    limits    = get_plan(plan_name)
    period    = billing_period_start()

    usage = (
        db.query(UsageRecord)
        .filter(
            UsageRecord.organization_id == org_id,
            UsageRecord.period_start    == period,
        )
        .first()
    )

    def pct(used, lim):
        if lim == -1: return 0
        return round((used / lim) * 100, 1) if lim else 0

    u_po   = getattr(usage, "po_uploads",    0) or 0
    u_wa   = getattr(usage, "whatsapp_msgs", 0) or 0
    u_hitl = getattr(usage, "hitl_reviews",  0) or 0

    return {
        "plan":         plan_name,
        "plan_display": plan_name.title(),
        "price_inr":    limits.price_inr_per_month,
        "period_start": period.isoformat(),
        "subscription": {
            "id":              sub.id if sub else None,
            "status":          sub.status if sub else "free",
            "billing_interval": sub.billing_interval if sub else "monthly",
            "renews_at":       sub.current_period_end.isoformat() if sub and sub.current_period_end else None,
        },
        "limits": {
            "po_uploads":     limits.po_uploads_per_month,
            "whatsapp_msgs":  limits.whatsapp_msgs_per_month,
            "hitl_reviews":   limits.hitl_reviews_per_month,
            "team_members":   limits.team_members,
            "api_access":     limits.api_access,
            "priority_support": limits.priority_support,
        },
        "usage": {
            "po_uploads":    {"used": u_po,   "limit": limits.po_uploads_per_month,    "pct": pct(u_po,   limits.po_uploads_per_month)},
            "whatsapp_msgs": {"used": u_wa,   "limit": limits.whatsapp_msgs_per_month, "pct": pct(u_wa,   limits.whatsapp_msgs_per_month)},
            "hitl_reviews":  {"used": u_hitl, "limit": limits.hitl_reviews_per_month,  "pct": pct(u_hitl, limits.hitl_reviews_per_month)},
        },
    }
