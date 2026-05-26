# file: backend/app/api/webhooks.py
from fastapi import APIRouter, Depends, Request, Response, status, Header
import hmac
import hashlib
import json
import logging
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.observability import get_correlation_id
from app.models import WebhookEvent
from app.services.ai_service import ai_service

router = APIRouter()
logger = logging.getLogger(__name__)

# Simulated in-memory DB tables for webhooks & logs to run offline sandbox mode
SIMULATED_WEBHOOK_EVENTS_DB: Dict[str, Dict[str, Any]] = {}
SIMULATED_AUDIT_LOGS: list = []

def first_item(value: Any) -> Optional[Dict[str, Any]]:
    if isinstance(value, list) and value and isinstance(value[0], dict):
        return value[0]
    return None

def get_text_body(message_data: Dict[str, Any]) -> str:
    msg_type = message_data.get("type")
    if msg_type == "text":
        return message_data.get("text", {}).get("body", "")
    if msg_type == "button":
        return message_data.get("button", {}).get("text", "")
    if msg_type == "interactive":
        interactive = message_data.get("interactive", {})
        if interactive.get("type") == "button_reply":
            return interactive.get("button_reply", {}).get("title", "")
    return ""

def register_event(
    db: Session,
    event_id: str,
    event_type: str,
    sender_phone: Optional[str],
    raw_payload: Dict[str, Any],
    processed_status: str = "received"
) -> tuple[WebhookEvent, bool]:
    existing = db.query(WebhookEvent).filter(WebhookEvent.event_id == event_id).first()
    if existing is not None:
        return existing, True

    event = WebhookEvent(
        event_id=event_id,
        sender_phone=sender_phone,
        event_type=event_type,
        raw_payload=raw_payload,
        processed_status=processed_status,
        correlation_id=get_correlation_id()
    )
    db.add(event)
    db.flush()
    SIMULATED_WEBHOOK_EVENTS_DB[event_id] = {
        "event_id": event_id,
        "sender_phone": sender_phone,
        "event_type": event_type,
        "processed_status": processed_status
    }
    return event, False

def verify_meta_signature(payload: bytes, signature: str) -> bool:
    """Verifies that webhook payloads are originating from official Meta platforms."""
    if not signature:
        return False
    expected = signature.split("=")[-1]
    computed = hmac.new(
        settings.META_APP_SECRET.encode("utf-8"),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, computed)

@router.get("/whatsapp")
def verify_webhook(
    hub_mode: Optional[str] = None,
    hub_challenge: Optional[int] = None,
    hub_verify_token: Optional[str] = None
):
    """Handles Meta's initial handshake/verification validation."""
    if hub_mode == "subscribe" and hub_verify_token == settings.META_VERIFY_TOKEN:
        logger.info("Meta webhook verification success.")
        return Response(content=str(hub_challenge), media_type="text/plain")
        
    logger.warning("Failed Meta verification handshake.")
    return Response(
        status_code=status.HTTP_403_FORBIDDEN,
        content="Webhook verification token mismatch."
    )

@router.post("/whatsapp")
async def receive_whatsapp_notification(
    request: Request,
    x_hub_signature_256: str = Header(None),
    db: Session = Depends(get_db)
):
    """
    Idempotent Meta Cloud API listener.
    Enforces exact-once processing using database event-log tracking.
    """
    raw_payload = await request.body()
    
    # 1. Signature Security Validation
    if settings.require_meta_signatures:
        if not verify_meta_signature(raw_payload, x_hub_signature_256):
            return Response(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                content="Meta signature validation failed."
            )
            
    try:
        payload = json.loads(raw_payload)
        
        if not isinstance(payload, dict):
            return {"status": "invalid_payload_ignored"}

        entry = first_item(payload.get("entry"))
        if entry is None:
            return {"status": "empty_entry_ignored"}

        changes = first_item(entry.get("changes"))
        if changes is None:
            return {"status": "empty_changes_ignored"}

        value = changes.get("value", {})
        if not isinstance(value, dict):
            return {"status": "invalid_value_ignored"}
        
        # Route A: Handle Message Status Pings (sent, delivered, read)
        if "statuses" in value:
            status_update = first_item(value.get("statuses"))
            if status_update is None:
                return {"status": "empty_status_ignored"}

            event_id = status_update.get("id")
            delivery_status = status_update.get("status", "unknown")
            if not event_id:
                return {"status": "missing_status_event_id_ignored"}

            event, duplicate = register_event(
                db=db,
                event_id=event_id,
                event_type=f"status_{delivery_status}",
                sender_phone=status_update.get("recipient_id"),
                raw_payload=payload,
                processed_status="processed"
            )
            if duplicate:
                logger.info(f"Duplicate status event {event_id} bypassed.")
                return {"status": "duplicate_status_bypassed", "event_id": event_id}

            logger.info(f"Log: Webhook message {event_id} status transitioned to: {delivery_status}")
            return {"status": "status_logged", "event_id": event_id}
            
        # Route B: Handle Inbound Customer Messages
        if "messages" in value:
            message_data = first_item(value.get("messages"))
            if message_data is None:
                return {"status": "empty_message_ignored"}

            message_id = message_data.get("id")
            from_phone = message_data.get("from")
            if not message_id:
                return {"status": "missing_message_id_ignored"}
            
            event, duplicate = register_event(
                db=db,
                event_id=message_id,
                event_type="message_received",
                sender_phone=from_phone,
                raw_payload=payload,
                processed_status="received"
            )
            if duplicate:
                logger.warning(f"DUPLICATE DETECTED: Meta message {message_id} already processed. Bypassing safely.")
                return {
                    "success": True,
                    "status": "duplicate_bypassed",
                    "event_id": message_id,
                    "reason": "Retry-safe idempotency guard activated."
                }
            
            text_body = get_text_body(message_data)
                    
            if not text_body:
                SIMULATED_WEBHOOK_EVENTS_DB[message_id]["processed_status"] = "processed"
                event.processed_status = "processed"
                return {"status": "unsupported_message_format"}
                
            # 3. Process vendor response & assess intents
            parsed_analysis = ai_service.parse_vendor_message(text_body)
            
            # 4. Integrate human-in-the-loop (HITL) routing rules (Priority 5)
            # Fetch global HITL handler
            from app.services.hitl_service import hitl_service
            
            hitl_result = hitl_service.evaluate_message_for_hitl(
                phone_number=from_phone,
                text_content=text_body,
                analysis=parsed_analysis,
                db=db
            )
            
            # Mark processing as completely successful in our idempotency ledger
            SIMULATED_WEBHOOK_EVENTS_DB[message_id]["processed_status"] = "processed"
            event.processed_status = "processed"
            
            return {
                "received": True,
                "message_id": message_id,
                "sender_phone": from_phone,
                "text": text_body,
                "ai_analysis": parsed_analysis,
                "hitl_routing": hitl_result
            }
            
        return Response(status_code=status.HTTP_200_OK, content="Unhandled webhook notification type.")
        
    except Exception as e:
        logger.error(f"Failed to process incoming webhook: {e}")
        # Log failure in event log
        if 'message_id' in locals() and message_id in SIMULATED_WEBHOOK_EVENTS_DB:
            SIMULATED_WEBHOOK_EVENTS_DB[message_id]["processed_status"] = "failed"
            SIMULATED_WEBHOOK_EVENTS_DB[message_id]["error"] = str(e)
            event = db.query(WebhookEvent).filter(WebhookEvent.event_id == message_id).first()
            if event is not None:
                event.processed_status = "failed"
                event.error_message = str(e)
            
        return Response(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=f"Internal handler error: {str(e)}"
        )
