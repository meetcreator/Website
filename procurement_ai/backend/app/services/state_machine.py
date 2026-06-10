# file: backend/app/services/state_machine.py
import logging
from enum import Enum
from typing import Dict, Any, Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from app.core.config import settings

logger = logging.getLogger(__name__)

class WorkflowState(str, Enum):
    CREATED = "CREATED"
    RFQ_SENT = "RFQ_SENT"
    VENDOR_PENDING = "VENDOR_PENDING"
    ETA_RECEIVED = "ETA_RECEIVED"
    APPROVAL_PENDING = "APPROVAL_PENDING"
    APPROVED = "APPROVED"
    IN_TRANSIT = "IN_TRANSIT"
    DELAYED = "DELAYED"
    ESCALATED = "ESCALATED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

VALID_TRANSITIONS: Dict[WorkflowState, List[WorkflowState]] = {
    WorkflowState.CREATED: [WorkflowState.RFQ_SENT, WorkflowState.VENDOR_PENDING, WorkflowState.CANCELLED],
    WorkflowState.RFQ_SENT: [WorkflowState.VENDOR_PENDING, WorkflowState.CANCELLED],
    WorkflowState.VENDOR_PENDING: [WorkflowState.ETA_RECEIVED, WorkflowState.DELAYED, WorkflowState.ESCALATED, WorkflowState.APPROVAL_PENDING, WorkflowState.CANCELLED],
    WorkflowState.ETA_RECEIVED: [WorkflowState.APPROVED, WorkflowState.APPROVAL_PENDING, WorkflowState.IN_TRANSIT, WorkflowState.CANCELLED],
    WorkflowState.APPROVAL_PENDING: [WorkflowState.APPROVED, WorkflowState.RFQ_SENT, WorkflowState.CANCELLED],
    WorkflowState.APPROVED: [WorkflowState.IN_TRANSIT, WorkflowState.DELAYED, WorkflowState.CANCELLED],
    WorkflowState.IN_TRANSIT: [WorkflowState.COMPLETED, WorkflowState.DELAYED, WorkflowState.CANCELLED],
    WorkflowState.DELAYED: [WorkflowState.ESCALATED, WorkflowState.IN_TRANSIT, WorkflowState.COMPLETED, WorkflowState.CANCELLED],
    WorkflowState.ESCALATED: [WorkflowState.APPROVED, WorkflowState.DELAYED, WorkflowState.COMPLETED, WorkflowState.CANCELLED],
    WorkflowState.COMPLETED: [],
    WorkflowState.CANCELLED: []
}

class StateMachineService:
    @staticmethod
    def is_transition_valid(current: WorkflowState, target: WorkflowState) -> bool:
        if target == WorkflowState.CANCELLED and current != WorkflowState.COMPLETED:
            return True
        return target in VALID_TRANSITIONS.get(current, [])

    @staticmethod
    def transition_workflow(
        db: Session,
        workflow_id: str,
        target_state: WorkflowState,
        organization_id: str,
        user_id: Optional[str] = None,
        reason: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes a database transition using Row-Level Locking (SELECT ... FOR UPDATE).
        Ensures thread-safe isolated commits and appends directly to the event sourcing logs.
        """
        # Import models locally to avoid circular dependencies
        from app.models import ProcurementWorkflow, WorkflowEvent, AuditLog, ProcurementTask

        # 1. ACQUIRE THREAD-SAFE CONCURRENCY ROW LOCK (Priority 4)
        # Using with_for_update() blocks concurrent webhooks from writing to the same PO simultaneously
        workflow = db.query(ProcurementWorkflow).filter(
            ProcurementWorkflow.id == workflow_id
        ).with_for_update().first()

        if not workflow:
            raise ValueError(f"Workflow ID {workflow_id} not found in database records.")

        current_state = WorkflowState(workflow.current_state)

        # 2. VALIDATE STATE BOUNDARIES
        if not StateMachineService.is_transition_valid(current_state, target_state):
            raise ValueError(f"State integrity breach: Invalid transition from '{current_state.value}' to '{target_state.value}' rejected.")

        # 3. TRANSITION PERSISTENT VALUE
        workflow.current_state = target_state.value
        workflow.updated_at = datetime.utcnow()

        # Update matching ProcurementTask status if exists
        task = db.query(ProcurementTask).filter(ProcurementTask.workflow_id == workflow_id).first()
        if task:
            task.status = target_state.value
            task.updated_at = datetime.utcnow()

        # 4. APPEND-ONLY WORKFLOW EVENT LOGS (Event Sourcing Concept)
        event_log = WorkflowEvent(
            organization_id=organization_id,
            workflow_id=workflow_id,
            event_type=f"STATE_CHANGED_TO_{target_state.value}",
            payload={
                "previous_state": current_state.value,
                "new_state": target_state.value,
                "reason": reason or "System automated transition",
                "triggered_by": user_id
            }
        )
        db.add(event_log)

        # 5. REGISTER CORE SYSTEM AUDIT TRAIL
        audit = AuditLog(
            organization_id=organization_id,
            workflow_id=workflow_id,
            user_id=user_id,
            action="STATE_TRANSITION",
            description=f"PO transitioned from {current_state.value} to {target_state.value}. {reason or ''}",
            payload_before={"state": current_state.value},
            payload_after={"state": target_state.value}
        )
        db.add(audit)

        logger.info(f"Durable Commit: Workflow {workflow_id} state updated to {target_state.value}")
        
        # Flush to DB (relying on get_db_session() transaction manager to commit/rollback safely)
        db.flush()

        # Fan out to customer-registered outbound webhooks (Growth+ feature)
        try:
            from app.services.outbound_webhooks import fanout_event, WebhookEvent as WHEvent
            fanout_event(
                db              = db,
                organization_id = organization_id,
                event_type      = WHEvent.STATE_TRANSITION,
                data            = {
                    "workflow_id":    workflow_id,
                    "previous_state": current_state.value,
                    "new_state":      target_state.value,
                    "reason":         reason,
                    "triggered_by":   user_id,
                },
            )
        except Exception as _wh_err:
            logger.warning(f"Outbound webhook fanout failed (non-critical): {_wh_err}")

        return {
            "success":        True,
            "workflow_id":    workflow_id,
            "previous_state": current_state,
            "new_state":      target_state
        }

    @staticmethod
    def check_variance_threshold(
        original_eta: Optional[str],
        proposed_eta: str
    ) -> WorkflowState:
        if not original_eta:
            return WorkflowState.ETA_RECEIVED

        try:
            d_orig = datetime.strptime(str(original_eta), "%Y-%m-%d")
            d_prop = datetime.strptime(str(proposed_eta), "%Y-%m-%d")
            variance_days = (d_prop - d_orig).days

            if variance_days > 3:
                logger.info(f"Friction warning: {variance_days} days variance exceeds limit. Diverting to APPROVAL_PENDING.")
                return WorkflowState.APPROVAL_PENDING
            return WorkflowState.APPROVED
        except Exception as e:
            logger.error(f"Variance date parser failure: {e}")
            return WorkflowState.ETA_RECEIVED

state_machine = StateMachineService()
