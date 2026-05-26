# file: backend/app/services/whatsapp_policy.py
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Tuple

logger = logging.getLogger(__name__)

class WhatsAppPolicyService:
    def validate_and_prepare_outbox(
        self,
        vendor_phone: str,
        proposed_text: str,
        last_inbound_timestamp: datetime,
        template_fallback_name: str = "po_followup_ack"
    ) -> Tuple[bool, Dict[str, Any], str]:
        """
        Validates outbound payloads against official Meta conversation guidelines.
        Enforces the 24-Hour Conversation Window rule.
        """
        now = datetime.utcnow()
        elapsed_hours = (now - last_inbound_timestamp).total_seconds() / 3600.0
        
        # 1. 24-HOUR WINDOW GATING
        if elapsed_hours > 24.0:
            logger.warning(
                f"WhatsApp Policy Check: Session window EXPIRED ({elapsed_hours:.1f}h elapsed since last vendor reply). "
                f"Blocking free-form text. Upgrading to template: '{template_fallback_name}'."
            )
            
            # Policy decision: Format Meta template payload
            payload = {
                "messaging_product": "whatsapp",
                "to": vendor_phone,
                "type": "template",
                "template": {
                    "name": template_fallback_name,
                    "language": {
                        "code": "en"
                    },
                    "components": [
                        {
                            "type": "body",
                            "parameters": [
                                { "type": "text", "text": "Laxmi Fasteners" },
                                { "type": "text", "text": "PO-2026-102" }
                            ]
                        }
                    ]
                }
            }
            
            return (
                False, # Bypassed free-form text
                payload,
                f"Meta 24h Window Expired. Automatic payload upgrade to approved template: '{template_fallback_name}' triggered."
            )
            
        # 2. WITHIN WINDOW: ALLOW FREE-FORM CONVERSATIONAL COOP
        logger.info(f"WhatsApp Policy Check: Session window ACTIVE ({elapsed_hours:.1f}h elapsed). Outbox authorized.")
        
        payload = {
            "messaging_product": "whatsapp",
            "to": vendor_phone,
            "recipient_type": "individual",
            "type": "text",
            "text": {
                "body": proposed_text
            }
        }
        
        return (True, payload, "Free-form outbox message authorized within session window.")

whatsapp_policy = WhatsAppPolicyService()
