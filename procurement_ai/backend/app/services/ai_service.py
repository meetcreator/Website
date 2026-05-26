# file: backend/app/services/ai_service.py
import json
import logging
import os
import re
from typing import Any, Dict

from openai import OpenAI

from app.core.config import settings

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        # Fall back gracefully if no key is provided during offline sandbox runs.
        self.api_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    def parse_vendor_message(self, message_text: str) -> Dict[str, Any]:
        """
        Parses unstructured messages from factory vendors.
        Extracts intent, estimated delivery date (ETA), and potential delays.
        """
        if not self.client:
            logger.warning("OpenAI API key is missing. Using rule-based parser.")
            return self._mock_rule_based_parser(message_text)

        try:
            prompt = f"""
            You are a procurement coordinator for a manufacturing factory in Gujarat, India.
            Analyze this incoming WhatsApp message from a vendor:
            "{message_text}"

            Extract:
            1. Intent, one of: ack_po, provide_eta, delay_notice, price_discrepancy, general_query.
            2. Extracted ETA in YYYY-MM-DD if a date is mentioned. Assume current date is 2026-05-25.
            3. delay_flag as true when delivery is delayed.
            4. reason for delays, stock issues, or price disputes.
            5. dominant language: en, gu, or hi.

            Return exactly one JSON object:
            {{
                "intent": "provide_eta",
                "extracted_eta": "2026-05-28",
                "delay_flag": false,
                "reason": null,
                "language": "gu"
            }}
            """

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful structured extraction assistant."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.0,
                response_format={"type": "json_object"},
            )

            result = response.choices[0].message.content
            return json.loads(result)

        except Exception as e:
            logger.error(f"Error parsing vendor message via OpenAI: {e}")
            return self._mock_rule_based_parser(message_text)

    def generate_multilingual_followup(
        self,
        vendor_name: str,
        po_number: str,
        language: str = "en",
    ) -> str:
        """Generates polite follow-up messages for local vendor coordination."""
        if language == "gu":
            return (
                f"\u0aa8\u0aae\u0ab8\u0acd\u0aa4\u0ac7 {vendor_name}, "
                f"\u0a85\u0aae\u0aa8\u0ac7 \u0ab9\u0a9c\u0ac1 \u0ab8\u0ac1\u0aa7\u0ac0 "
                f"\u0a85\u0aae\u0abe\u0ab0\u0abe \u0a96\u0ab0\u0ac0\u0aa6\u0ac0 "
                f"\u0a93\u0ab0\u0acd\u0aa1\u0ab0 {po_number} \u0aa8\u0ac0 "
                f"\u0ab8\u0acd\u0ab5\u0ac0\u0a95\u0ac3\u0aa4\u0abf \u0aae\u0ab3\u0ac0 "
                f"\u0aa8\u0aa5\u0ac0. \u0a95\u0ac3\u0aaa\u0abe \u0a95\u0ab0\u0ac0\u0aa8\u0ac7 "
                f"\u0a93\u0ab0\u0acd\u0aa1\u0ab0 \u0a95\u0aa8\u0acd\u0aab\u0ab0\u0acd\u0aae "
                f"\u0a95\u0ab0\u0acb \u0a85\u0aa5\u0ab5\u0abe \u0a85\u0a82\u0aa6\u0abe\u0a9c\u0abf\u0aa4 "
                f"\u0aa1\u0abf\u0ab2\u0abf\u0ab5\u0ab0\u0ac0 \u0ab8\u0aae\u0aaf (ETA) "
                f"\u0a9c\u0aa3\u0abe\u0ab5\u0acb. \u0a86\u0aad\u0abe\u0ab0."
            )
        if language == "hi":
            return (
                f"\u0928\u092e\u0938\u094d\u0924\u0947 {vendor_name}, "
                f"\u0939\u092e\u0947\u0902 \u0905\u092d\u0940 \u0924\u0915 "
                f"\u0939\u092e\u093e\u0930\u0947 \u092a\u0930\u091a\u0947\u0938 "
                f"\u0911\u0930\u094d\u0921\u0930 {po_number} \u0915\u0940 "
                f"\u0938\u094d\u0935\u0940\u0915\u0943\u0924\u093f \u0928\u0939\u0940\u0902 "
                f"\u092e\u093f\u0932\u0940 \u0939\u0948. \u0915\u0943\u092a\u092f\u093e "
                f"\u0911\u0930\u094d\u0921\u0930 \u0915\u0928\u094d\u092b\u0930\u094d\u092e "
                f"\u0915\u0930\u0947\u0902 \u092f\u093e \u0938\u0902\u092d\u093e\u0935\u093f\u0924 "
                f"\u0921\u093f\u0932\u0940\u0935\u0930\u0940 \u0924\u093f\u0925\u093f (ETA) "
                f"\u0938\u093e\u091d\u093e \u0915\u0930\u0947\u0902. \u0927\u0928\u094d\u092f\u0935\u093e\u0926."
            )
        return (
            f"Hello {vendor_name}, we have not yet received acknowledgement for Purchase Order "
            f"{po_number}. Please confirm receipt and share the expected delivery date (ETA). Thank you."
        )

    def _mock_rule_based_parser(self, text: str) -> Dict[str, Any]:
        """Deterministic fallback when OpenAI is offline/not configured."""
        text_lower = text.lower()
        res = {
            "intent": "general_query",
            "extracted_eta": None,
            "delay_flag": False,
            "reason": None,
            "language": "en",
        }

        if re.search(r"\bgu\b", text_lower) or "\u0aae\u0acb\u0a95\u0ab2\u0ac0" in text_lower or "\u0a86\u0ab5\u0ab6\u0ac7" in text_lower:
            res["language"] = "gu"
        elif re.search(r"\bhi\b", text_lower) or "\u092d\u0947\u091c" in text_lower or "\u0906\u090f\u0917\u093e" in text_lower:
            res["language"] = "hi"

        if "okay" in text_lower or "ack" in text_lower or "\u0aae\u0ab3\u0ac0 \u0a97\u0aaf\u0acb" in text_lower or "mil gaya" in text_lower:
            res["intent"] = "ack_po"
        elif "late" in text_lower or "delay" in text_lower or "\u0aae\u0acb\u0aa1\u0ac1\u0a82" in text_lower or "dekhna padega" in text_lower:
            res["intent"] = "delay_notice"
            res["delay_flag"] = True
            res["reason"] = "Vendor flagged delays in dispatch"
        elif "tarikh" in text_lower or "date" in text_lower or "eta" in text_lower:
            res["intent"] = "provide_eta"
            res["extracted_eta"] = "2026-05-29"

        return res


ai_service = AIService()
