# file: backend/app/services/hitl_service.py
import logging
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.services.state_machine import WorkflowState, state_machine

logger = logging.getLogger(__name__)

# Offline fallback only for tests/local demos that do not pass a database session.
SIMULATED_HITL_DRAFTS: Dict[str, Dict[str, Any]] = {}
SIMULATED_PENDING_APPROVALS: List[Dict[str, Any]] = []


class HITLService:
    def _resolve_workflow_context(self, phone_number: str, db: Session) -> Dict[str, Optional[str]]:
        from app.models import ProcurementTask, ProcurementWorkflow, Vendor

        vendor = db.query(Vendor).filter(Vendor.phone_number == phone_number).first()
        organization_id = vendor.organization_id if vendor else None
        workflow = None
        task = None

        if vendor is not None:
            task = db.query(ProcurementTask).filter(
                ProcurementTask.vendor_id == vendor.id
            ).order_by(ProcurementTask.created_at.desc()).first()
            if task is not None:
                workflow = db.get(ProcurementWorkflow, task.workflow_id)

        if workflow is None and organization_id is not None:
            workflow = db.query(ProcurementWorkflow).filter(
                ProcurementWorkflow.organization_id == organization_id,
                ProcurementWorkflow.current_state.notin_([
                    WorkflowState.COMPLETED.value,
                    WorkflowState.CANCELLED.value,
                ]),
            ).order_by(ProcurementWorkflow.created_at.desc()).first()

        return {
            "organization_id": organization_id or (workflow.organization_id if workflow else None),
            "workflow_id": workflow.id if workflow else None,
            "task_id": task.id if task is not None else None,
            "vendor_id": vendor.id if vendor else None,
        }

    def evaluate_message_for_hitl(
        self,
        phone_number: str,
        text_content: str,
        analysis: Dict[str, Any],
        db: Optional[Session] = None,
    ) -> Dict[str, Any]:
        """
        Routes high-risk vendor replies into a human review draft instead of automatic dispatch.
        """
        intent = analysis.get("intent", "general_query")
        requires_review = False
        reason = ""
        target_state = WorkflowState.VENDOR_PENDING

        if intent == "delay_notice" or analysis.get("delay_flag"):
            requires_review = True
            reason = "Vendor reported a delay in shipment timeline"
            target_state = WorkflowState.DELAYED
        elif intent == "price_discrepancy":
            requires_review = True
            reason = "Price discrepancy flagged in invoice/discount"
            target_state = WorkflowState.APPROVAL_PENDING
        elif intent == "provide_eta":
            target_state = state_machine.check_variance_threshold(
                original_eta="2026-05-25",
                proposed_eta=analysis.get("extracted_eta", "2026-05-25"),
            )
            if target_state == WorkflowState.APPROVAL_PENDING:
                requires_review = True
                reason = "Proposed ETA exceeds variance threshold of 3 days"

        draft_reply = self._generate_ai_copywriter_draft(analysis)
        draft_id = f"draft_{uuid.uuid4().hex}"
        workflow_context = {"organization_id": None, "workflow_id": None, "task_id": None, "vendor_id": None}
        if db is not None:
            workflow_context = self._resolve_workflow_context(phone_number, db)

        draft_entry = {
            "draft_id": draft_id,
            "vendor_phone": phone_number,
            "vendor_message": text_content,
            "detected_intent": intent,
            "draft_content": draft_reply,
            "requires_review": requires_review,
            "review_reason": reason,
            "status": "draft" if requires_review else "auto_sent",
            "target_state": target_state.value,
            "organization_id": workflow_context["organization_id"],
            "workflow_id": workflow_context["workflow_id"],
            "task_id": workflow_context["task_id"],
            "vendor_id": workflow_context["vendor_id"],
            "created_at": datetime.utcnow().isoformat(),
        }
        SIMULATED_HITL_DRAFTS[draft_id] = draft_entry

        if db is not None and workflow_context["organization_id"] is not None:
            from app.models import Approval, HITLDraft, Message

            message = Message(
                id=draft_id,
                organization_id=workflow_context["organization_id"],
                workflow_id=workflow_context["workflow_id"],
                task_id=workflow_context["task_id"],
                vendor_id=workflow_context["vendor_id"],
                sender_type="system_ai",
                message_content=draft_reply,
                hitl_status="draft" if requires_review else "approved",
                message_metadata={
                    "vendor_message": text_content,
                    "detected_intent": intent,
                    "review_reason": reason,
                    "target_state": target_state.value,
                },
            )
            db.add(message)
            db.add(HITLDraft(
                id=draft_id,
                organization_id=workflow_context["organization_id"],
                workflow_id=workflow_context["workflow_id"],
                task_id=workflow_context["task_id"],
                vendor_id=workflow_context["vendor_id"],
                message_id=draft_id,
                vendor_phone=phone_number,
                vendor_message=text_content,
                detected_intent=intent,
                draft_content=draft_reply,
                review_reason=reason,
                target_state=target_state.value,
                status="draft" if requires_review else "auto_sent",
                draft_metadata={"analysis": analysis},
            ))
            if requires_review and workflow_context["workflow_id"] and workflow_context["task_id"]:
                db.add(Approval(
                    organization_id=workflow_context["organization_id"],
                    workflow_id=workflow_context["workflow_id"],
                    task_id=workflow_context["task_id"],
                    type="hitl_message_review",
                    original_value=text_content,
                    proposed_value=draft_reply,
                    status="pending",
                    approval_metadata={"draft_id": draft_id, "review_reason": reason},
                ))

        if requires_review:
            logger.info(f"HITL draft queued ({draft_id}). Reason: {reason}")
            if db is not None and workflow_context["workflow_id"] and workflow_context["organization_id"]:
                try:
                    state_machine.transition_workflow(
                        db=db,
                        workflow_id=workflow_context["workflow_id"],
                        target_state=target_state,
                        organization_id=workflow_context["organization_id"],
                        reason=reason,
                    )
                except ValueError as exc:
                    logger.warning(f"HITL workflow transition skipped for draft {draft_id}: {exc}")
        else:
            logger.info(f"Automation dispatch: Auto-sent WhatsApp template. State: {target_state.value}")

        return draft_entry

    def approve_draft_message(
        self,
        draft_id: str,
        approver_user_id: str,
        db: Optional[Session] = None,
    ) -> Dict[str, Any]:
        """Approves a queued draft, triggering outbound dispatch and logging action."""
        if db is not None:
            from app.models import Approval, HITLDraft, Message

            persistent_draft = db.get(HITLDraft, draft_id)
            if persistent_draft is None:
                raise ValueError(f"Draft {draft_id} not found.")
            if persistent_draft.status != "draft":
                return {"success": False, "message": f"Draft is already in state: {persistent_draft.status}"}
            if draft_id in SIMULATED_HITL_DRAFTS:
                persistent_draft.draft_content = SIMULATED_HITL_DRAFTS[draft_id].get("draft_content", persistent_draft.draft_content)

            persistent_draft.status = "approved"
            persistent_draft.approved_by = approver_user_id
            persistent_draft.approved_at = datetime.utcnow()
            persistent_draft.updated_at = datetime.utcnow()

            message = db.get(Message, persistent_draft.message_id) if persistent_draft.message_id else None
            if message is not None:
                message.hitl_status = "approved"
                message.draft_approved_by = approver_user_id
                message.message_content = persistent_draft.draft_content

            approval = db.query(Approval).filter(
                Approval.approval_metadata["draft_id"].as_string() == draft_id
            ).first()
            if approval is not None:
                approval.status = "approved"
                approval.approved_by = approver_user_id

            workflow_id = persistent_draft.workflow_id
            organization_id = persistent_draft.organization_id
            if workflow_id and organization_id:
                try:
                    from app.models import ProcurementWorkflow
                    workflow = db.get(ProcurementWorkflow, workflow_id)
                    if workflow is not None and workflow.current_state == WorkflowState.APPROVAL_PENDING.value:
                        state_machine.transition_workflow(
                            db=db,
                            workflow_id=workflow_id,
                            target_state=WorkflowState.APPROVED,
                            organization_id=organization_id,
                            user_id=approver_user_id,
                            reason="HITL Coordinator manual override approval.",
                        )
                except ValueError as exc:
                    logger.warning(f"HITL approval state transition skipped for draft {draft_id}: {exc}")

            logger.info(f"HITL approval granted: draft {draft_id} approved by {approver_user_id}.")
            return {
                "success": True,
                "draft_id": draft_id,
                "dispatched_text": persistent_draft.draft_content,
                "recipient": persistent_draft.vendor_phone,
            }

        if draft_id not in SIMULATED_HITL_DRAFTS:
            raise ValueError(f"Draft {draft_id} not found.")
        draft = SIMULATED_HITL_DRAFTS[draft_id]
        if draft["status"] != "draft":
            return {"success": False, "message": f"Draft is already in state: {draft['status']}"}
        draft["status"] = "approved"
        draft["approved_by"] = approver_user_id
        draft["approved_at"] = datetime.utcnow().isoformat()
        return {"success": True, "draft_id": draft_id, "dispatched_text": draft["draft_content"], "recipient": draft["vendor_phone"]}

    def modify_draft_message(self, draft_id: str, new_text: str, db: Optional[Session] = None) -> Dict[str, Any]:
        """Modifies draft text before approval."""
        if db is not None:
            from app.models import Approval, HITLDraft, Message

            persistent_draft = db.get(HITLDraft, draft_id)
            if persistent_draft is None:
                raise ValueError(f"Draft {draft_id} not found.")
            if persistent_draft.status != "draft":
                return {"success": False, "message": f"Draft is already in state: {persistent_draft.status}"}
            persistent_draft.draft_content = new_text
            persistent_draft.updated_at = datetime.utcnow()
            if persistent_draft.message_id:
                message = db.get(Message, persistent_draft.message_id)
                if message is not None:
                    message.message_content = new_text
            approval = db.query(Approval).filter(
                Approval.approval_metadata["draft_id"].as_string() == draft_id
            ).first()
            if approval is not None:
                approval.proposed_value = new_text
            if draft_id in SIMULATED_HITL_DRAFTS:
                SIMULATED_HITL_DRAFTS[draft_id]["draft_content"] = new_text
            logger.info(f"Draft {draft_id} content edited manually.")
            return {"success": True, "draft_id": draft_id, "updated_content": new_text}

        if draft_id not in SIMULATED_HITL_DRAFTS:
            raise ValueError(f"Draft {draft_id} not found.")

        draft = SIMULATED_HITL_DRAFTS[draft_id]
        draft["draft_content"] = new_text
        logger.info(f"Draft {draft_id} content edited manually.")
        return {"success": True, "draft_id": draft_id, "updated_content": new_text}

    def get_pending_hitl_queue(self, db: Optional[Session] = None) -> List[Dict[str, Any]]:
        """Returns all messages currently stuck in draft review."""
        if db is not None:
            from app.models import HITLDraft
            return [
                {
                    "draft_id": d.id,
                    "vendor_phone": d.vendor_phone,
                    "vendor_message": d.vendor_message,
                    "detected_intent": d.detected_intent,
                    "draft_content": d.draft_content,
                    "requires_review": True,
                    "review_reason": d.review_reason,
                    "status": d.status,
                    "target_state": d.target_state,
                    "organization_id": d.organization_id,
                    "workflow_id": d.workflow_id,
                    "task_id": d.task_id,
                    "vendor_id": d.vendor_id,
                    "created_at": d.created_at.isoformat() if d.created_at else None,
                }
                for d in db.query(HITLDraft).filter(HITLDraft.status == "draft").order_by(HITLDraft.created_at.asc()).all()
            ]
        return [d for d in SIMULATED_HITL_DRAFTS.values() if d["status"] == "draft"]

    def _generate_ai_copywriter_draft(self, analysis: Dict[str, Any]) -> str:
        intent = analysis.get("intent")
        lang = analysis.get("language", "en")

        if intent == "delay_notice":
            if lang == "gu":
                return (
                    "\u0a85\u0aae\u0ac7 \u0aa4\u0aae\u0abe\u0ab0\u0ac0 "
                    "\u0aa1\u0abf\u0ab2\u0abf\u0ab5\u0ab0\u0ac0 \u0ab5\u0abf\u0ab2\u0a82\u0aac "
                    "\u0aa8\u0ac0 \u0ab5\u0abf\u0a97\u0aa4 \u0aa8\u0acb\u0a82\u0aa7\u0ac0 "
                    "\u0a9b\u0ac7. \u0a86\u0a82\u0ab6\u0abf\u0a95 "
                    "\u0aa1\u0abf\u0ab8\u0acd\u0aaa\u0ac7\u0a9a \u0ab6\u0a95\u0acd\u0aaf "
                    "\u0a9b\u0ac7? \u0a95\u0ac3\u0aaa\u0abe \u0a95\u0ab0\u0ac0 "
                    "\u0a95\u0aa8\u0acd\u0aab\u0ab0\u0acd\u0aae \u0a95\u0ab0\u0acb."
                )
            return "We have logged the delay. Can you dispatch a partial quantity by tomorrow to avoid a production shutdown? Please confirm."
        if intent == "price_discrepancy":
            return "Our PO rates are based on the annual supply contract. We have flagged this price variance for management review."
        if intent == "provide_eta":
            eta = analysis.get("extracted_eta", "stated date")
            if lang == "gu":
                return (
                    f"\u0ab8\u0aae\u0aaf \u0a86\u0aaa\u0ab5\u0abe \u0aac\u0aa6\u0ab2 "
                    f"\u0a86\u0aad\u0abe\u0ab0. \u0a85\u0aae\u0ac7 \u0aa1\u0abf\u0ab2\u0abf\u0ab5\u0ab0\u0ac0 "
                    f"\u0aa4\u0abe\u0ab0\u0ac0\u0a96 {eta} (ETA) \u0aa4\u0ab0\u0ac0\u0a95\u0ac7 "
                    f"\u0aa8\u0acb\u0a82\u0aa7\u0ac0 \u0a9b\u0ac7. \u0aae\u0abe\u0ab2 "
                    f"\u0aae\u0acb\u0a95\u0ab2\u0acd\u0aaf\u0abe \u0aaa\u0a9b\u0ac0 "
                    f"\u0ab2\u0acb\u0ab0\u0ac0 \u0ab0\u0abf\u0ab8\u0ac0\u0aaa\u0acd\u0a9f "
                    f"\u0aae\u0acb\u0a95\u0ab2\u0ab6\u0acb."
                )
            return f"Got it. We have logged your ETA as {eta}. Once dispatched, please share the Lorry Receipt copy."
        return "Acknowledged. We will register this update in our tracking system."


hitl_service = HITLService()
