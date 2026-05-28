# file: backend/app/services/outbound_webhooks.py
"""
Outbound webhook fanout service.

When a workflow event occurs (state transition, HITL approval, etc.),
this service queries all active WebhookEndpoint records for the org
and dispatches HTTP POST requests to each URL with a signed payload.

Signing: HMAC-SHA256 of the JSON body using the endpoint's secret.
Header: X-ProcureHub-Signature: sha256=<hex>

Delivery is best-effort (no retry queue in demo mode).
Production: replace urllib calls with a Celery/RQ task for async retry.
"""
from __future__ import annotations

import hashlib
import hmac
import json
import logging
import time
import uuid
import urllib.request
import urllib.error
from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────
# Event Types (mirrors state machine + HITL events)
# ─────────────────────────────────────────────────────────────────
class WebhookEvent:
    STATE_TRANSITION  = "STATE_TRANSITION"
    HITL_APPROVED     = "HITL_APPROVED"
    HITL_FLAGGED      = "HITL_FLAGGED"
    PO_IMPORTED       = "PO_IMPORTED"
    ESCALATION        = "ESCALATION"


def _sign_payload(body_bytes: bytes, secret: Optional[str]) -> str:
    """Return HMAC-SHA256 hex signature of body_bytes using secret."""
    if not secret:
        return ""
    return hmac.new(secret.encode(), body_bytes, hashlib.sha256).hexdigest()


def _build_envelope(
    event_type: str,
    organization_id: str,
    data: Dict[str, Any],
    delivery_id: str,
) -> Dict[str, Any]:
    return {
        "delivery_id":    delivery_id,
        "event_type":     event_type,
        "organization_id": organization_id,
        "timestamp":      datetime.utcnow().isoformat() + "Z",
        "data":           data,
    }


def fanout_event(
    db: Session,
    organization_id: str,
    event_type: str,
    data: Dict[str, Any],
    timeout_seconds: int = 5,
) -> List[Dict[str, Any]]:
    """
    Deliver an event to all active webhook endpoints for this org.

    Returns a list of delivery result dicts (one per endpoint).
    """
    from app.models import WebhookEndpoint, OutboundWebhookLog
    from app.services.subscription import get_plan

    # Fetch active endpoints for this org
    endpoints = (
        db.query(WebhookEndpoint)
        .filter(
            WebhookEndpoint.organization_id == organization_id,
            WebhookEndpoint.is_active       == True,
        )
        .all()
    )

    if not endpoints:
        return []

    results: List[Dict[str, Any]] = []

    for ep in endpoints:
        # Check event filter (comma-separated whitelist; empty = all)
        if ep.event_filter:
            allowed = {e.strip() for e in ep.event_filter.split(",")}
            if event_type not in allowed:
                continue

        delivery_id = str(uuid.uuid4())
        envelope    = _build_envelope(event_type, organization_id, data, delivery_id)
        body_bytes  = json.dumps(envelope, default=str).encode("utf-8")
        signature   = _sign_payload(body_bytes, ep.secret)

        headers = {
            "Content-Type":            "application/json",
            "X-ProcureHub-Delivery":   delivery_id,
            "X-ProcureHub-Event":      event_type,
            "X-ProcureHub-Signature":  f"sha256={signature}" if signature else "",
            "User-Agent":              "ProcureHub-Webhooks/1.0",
        }

        start_ms   = int(time.monotonic() * 1000)
        success    = False
        status_code = None
        resp_body  = ""
        error_msg  = ""

        try:
            req      = urllib.request.Request(ep.url, data=body_bytes, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=timeout_seconds) as resp:
                status_code = resp.status
                resp_body   = resp.read(512).decode(errors="replace")
                success     = 200 <= status_code < 300
        except urllib.error.HTTPError as e:
            status_code = e.code
            resp_body   = e.read(512).decode(errors="replace")
            error_msg   = f"HTTP {e.code}: {e.reason}"
        except Exception as exc:
            error_msg = str(exc)

        duration_ms = int(time.monotonic() * 1000) - start_ms

        log = OutboundWebhookLog(
            id              = str(uuid.uuid4()),
            endpoint_id     = ep.id,
            organization_id = organization_id,
            event_type      = event_type,
            payload         = envelope,
            response_status = status_code,
            response_body   = resp_body[:512] if resp_body else None,
            duration_ms     = duration_ms,
            success         = success,
            error_message   = error_msg or None,
        )
        db.add(log)

        level = logger.info if success else logger.warning
        level(f"Webhook [{ep.url}] event={event_type} status={status_code} ok={success} {duration_ms}ms")

        results.append({
            "endpoint_id": ep.id,
            "url":         ep.url,
            "delivery_id": delivery_id,
            "success":     success,
            "status_code": status_code,
            "duration_ms": duration_ms,
            "error":       error_msg or None,
        })

    try:
        db.flush()
    except Exception as e:
        logger.error(f"Failed to flush webhook log: {e}")

    return results
