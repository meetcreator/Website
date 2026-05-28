# file: backend/app/models.py
from sqlalchemy import Column, String, Integer, Numeric, Date, DateTime, Boolean, ForeignKey, Text, Index, JSON, UniqueConstraint
from datetime import datetime
import uuid
from app.core.database import Base
from app.services.state_machine import WorkflowState

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    gstin = Column(String(15), nullable=True)
    timezone = Column(String(100), default="Asia/Kolkata")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    phone_number = Column(String(15), nullable=True)
    role = Column(String(50), default="executive") # 'owner', 'manager', 'executive'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class WebhookEvent(Base):
    __tablename__ = "webhook_events"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String(255), unique=True, nullable=False)
    sender_phone = Column(String(50), nullable=True)
    event_type = Column(String(100), nullable=False)
    raw_payload = Column(JSON, nullable=True)
    processed_status = Column(String(50), default="received")
    error_message = Column(Text, nullable=True)
    correlation_id = Column(String, nullable=True) # Trace ID for log matching
    created_at = Column(DateTime, default=datetime.utcnow)

class ProcurementWorkflow(Base):
    __tablename__ = "procurement_workflows"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    po_number = Column(String(100), nullable=False)
    current_state = Column(String(100), default=WorkflowState.CREATED.value)
    
    priority = Column(String(50), default="NORMAL") # 'CRITICAL', 'HIGH', 'NORMAL', 'LOW'
    production_impact = Column(String(255), nullable=True)
    version = Column(Integer, default=1)           # Priority 4: Replay safety versioning
    
    next_action_deadline = Column(DateTime, nullable=True)
    coordination_friction_sec = Column(Integer, default=0)
    workflow_metadata = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    __table_args__ = (
        UniqueConstraint("organization_id", "po_number", name="uq_workflows_org_po"),
    )

class Vendor(Base):
    __tablename__ = "vendors"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    contact_person = Column(String(100), nullable=True)
    phone_number = Column(String(15), nullable=False)
    email = Column(String(255), nullable=True)
    gstin = Column(String(15), nullable=True)
    category = Column(String(100), nullable=True)
    preferred_language = Column(String(10), default="en")
    
    reliability_score = Column(Numeric(5, 2), default=100.00)
    avg_delay_days = Column(Numeric(4, 2), default=0.00)
    late_deliveries_pct = Column(Numeric(5, 2), default=0.00)
    
    vendor_metadata = Column("metadata", JSON, default=dict)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    __table_args__ = (
        UniqueConstraint("organization_id", "phone_number", name="uq_vendors_org_phone"),
    )

class ProcurementTask(Base):
    __tablename__ = "procurement_tasks"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    workflow_id = Column(String, ForeignKey("procurement_workflows.id", ondelete="CASCADE"), nullable=False)
    vendor_id = Column(String, ForeignKey("vendors.id", ondelete="RESTRICT"), nullable=False)
    po_number = Column(String(100), nullable=False)
    po_date = Column(Date, nullable=False)
    total_amount = Column(Numeric(15, 2), nullable=True)
    status = Column(String(100), default=WorkflowState.CREATED.value)
    
    priority = Column(String(50), default="NORMAL")
    production_impact = Column(String(255), nullable=True)
    
    original_eta = Column(Date, nullable=True)
    revised_eta = Column(Date, nullable=True)
    tracking_number = Column(String(100), nullable=True)
    lorry_receipt_url = Column(Text, nullable=True)
    raw_text_ocr = Column(Text, nullable=True)
    task_metadata = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    __table_args__ = (
        UniqueConstraint("organization_id", "po_number", name="uq_tasks_org_po"),
    )

class ProcurementItem(Base):
    __tablename__ = "procurement_items"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String, ForeignKey("procurement_tasks.id", ondelete="CASCADE"), nullable=False)
    item_code = Column(String(100), nullable=True)
    description = Column(Text, nullable=False)
    quantity = Column(Numeric(12, 4), nullable=False)
    unit = Column(String(20), default="Kgs")
    unit_price = Column(Numeric(15, 2), nullable=False)
    amount = Column(Numeric(15, 2), nullable=False)
    received_quantity = Column(Numeric(12, 4), default=0.0000)
    hsn_code = Column(String(10), nullable=True)
    item_metadata = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    workflow_id = Column(String, ForeignKey("procurement_workflows.id", ondelete="SET NULL"), nullable=True)
    task_id = Column(String, ForeignKey("procurement_tasks.id", ondelete="SET NULL"), nullable=True)
    vendor_id = Column(String, ForeignKey("vendors.id", ondelete="SET NULL"), nullable=True)
    sender_type = Column(String(50), nullable=False)
    whatsapp_message_id = Column(String(255), nullable=True)
    message_content = Column(Text, nullable=False)
    translated_content = Column(Text, nullable=True)
    delivery_status = Column(String(50), default="sent")
    hitl_status = Column(String(50), default="approved")
    draft_approved_by = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    correlation_id = Column(String, nullable=True) # Trace ID for log matching
    message_metadata = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

class HITLDraft(Base):
    __tablename__ = "hitl_drafts"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    workflow_id = Column(String, ForeignKey("procurement_workflows.id", ondelete="SET NULL"), nullable=True)
    task_id = Column(String, ForeignKey("procurement_tasks.id", ondelete="SET NULL"), nullable=True)
    vendor_id = Column(String, ForeignKey("vendors.id", ondelete="SET NULL"), nullable=True)
    message_id = Column(String, ForeignKey("messages.id", ondelete="SET NULL"), nullable=True)
    vendor_phone = Column(String(50), nullable=False)
    vendor_message = Column(Text, nullable=False)
    detected_intent = Column(String(100), nullable=False)
    draft_content = Column(Text, nullable=False)
    review_reason = Column(Text, nullable=True)
    target_state = Column(String(100), nullable=False)
    status = Column(String(50), default="draft")
    approved_by = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    draft_metadata = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Approval(Base):
    __tablename__ = "approvals"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    workflow_id = Column(String, ForeignKey("procurement_workflows.id", ondelete="CASCADE"), nullable=False)
    task_id = Column(String, ForeignKey("procurement_tasks.id", ondelete="CASCADE"), nullable=False)
    requested_by = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    approved_by = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    type = Column(String(100), nullable=False)
    original_value = Column(Text, nullable=True)
    proposed_value = Column(Text, nullable=True)
    status = Column(String(50), default="pending")
    rejection_reason = Column(Text, nullable=True)
    approval_metadata = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class EscalationLog(Base):
    __tablename__ = "escalation_logs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    workflow_id = Column(String, ForeignKey("procurement_workflows.id", ondelete="CASCADE"), nullable=False)
    task_id = Column(String, ForeignKey("procurement_tasks.id", ondelete="CASCADE"), nullable=False)
    escalation_level = Column(Integer, nullable=False)
    triggered_at = Column(DateTime, default=datetime.utcnow)
    action_taken = Column(Text, nullable=False)
    resolved_at = Column(DateTime, nullable=True)
    status = Column(String(50), default="active")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    workflow_id = Column(String, ForeignKey("procurement_workflows.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    payload_before = Column(JSON, nullable=True)
    payload_after = Column(JSON, nullable=True)
    correlation_id = Column(String, nullable=True) # Trace ID for log matching
    created_at = Column(DateTime, default=datetime.utcnow)

class WorkflowEvent(Base):
    __tablename__ = "workflow_events"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    workflow_id = Column(String, ForeignKey("procurement_workflows.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String(100), nullable=False)
    payload = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

class ActiveJob(Base):
    __tablename__ = "active_jobs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    task_name = Column(String(100), nullable=False)
    payload = Column(JSON, nullable=False)
    run_at = Column(DateTime, nullable=False)
    status = Column(String(50), default="queued") # 'queued', 'running', 'completed', 'failed'
    retries_remaining = Column(Integer, default=3)
    correlation_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

Index("idx_webhook_event_id", WebhookEvent.event_id)
Index("idx_workflows_org_po", ProcurementWorkflow.organization_id, ProcurementWorkflow.po_number)
Index("idx_hitl_status", HITLDraft.status)
Index("idx_active_jobs_status_run", ActiveJob.status, ActiveJob.run_at)


# ─────────────────────────────────────────────────────────────────
# Subscription billing models
# ─────────────────────────────────────────────────────────────────

class Subscription(Base):
    """One active subscription per organisation. plan_name matches PLANS catalogue."""
    __tablename__ = "subscriptions"
    id                  = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id     = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    plan_name           = Column(String(50), nullable=False, default="free")  # free|starter|growth|enterprise
    status              = Column(String(50), nullable=False, default="active")  # active|cancelled|past_due|trialing
    billing_interval    = Column(String(20), nullable=False, default="monthly")  # monthly|annual
    # Payment / Stripe reference (optional — used in production only)
    payment_provider    = Column(String(50), nullable=True)   # 'stripe' | 'razorpay' | 'manual'
    external_sub_id     = Column(String(255), nullable=True)  # Stripe subscription ID
    external_customer_id= Column(String(255), nullable=True)  # Stripe customer ID
    # Billing period
    current_period_start= Column(DateTime, nullable=True)
    current_period_end  = Column(DateTime, nullable=True)
    cancel_at_period_end= Column(Boolean, default=False)
    # Metadata
    created_at          = Column(DateTime, default=datetime.utcnow)
    updated_at          = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_sub_org_status", "organization_id", "status"),
    )


class UsageRecord(Base):
    """Monthly usage counters per organisation (reset each billing period)."""
    __tablename__ = "usage_records"
    id              = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    period_start    = Column(DateTime, nullable=False)   # first day of the month UTC
    # Usage counters
    po_uploads      = Column(Integer, default=0)
    whatsapp_msgs   = Column(Integer, default=0)
    hitl_reviews    = Column(Integer, default=0)
    api_calls       = Column(Integer, default=0)
    created_at      = Column(DateTime, default=datetime.utcnow)
    updated_at      = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("organization_id", "period_start", name="uq_usage_org_period"),
        Index("idx_usage_org_period", "organization_id", "period_start"),
    )


# ─────────────────────────────────────────────────────────────────
# Outbound webhook endpoints (Growth+ feature)
# ─────────────────────────────────────────────────────────────────

class WebhookEndpoint(Base):
    """
    Customer-registered outbound webhook URLs.
    The platform fans out workflow events to these URLs via HTTP POST.
    """
    __tablename__ = "webhook_endpoints"
    id              = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    url             = Column(String(2048), nullable=False)
    description     = Column(String(255), nullable=True)
    # Comma-separated event types to subscribe to, e.g. "STATE_TRANSITION,HITL_APPROVED"
    # Empty/null means all events
    event_filter    = Column(Text, nullable=True)
    secret          = Column(String(255), nullable=True)   # HMAC signing secret
    is_active       = Column(Boolean, default=True)
    created_at      = Column(DateTime, default=datetime.utcnow)
    updated_at      = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_webhook_endpoint_org", "organization_id", "is_active"),
    )


class OutboundWebhookLog(Base):
    """Delivery attempt log for each outbound webhook call."""
    __tablename__ = "outbound_webhook_logs"
    id              = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    endpoint_id     = Column(String, ForeignKey("webhook_endpoints.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    event_type      = Column(String(100), nullable=False)
    payload         = Column(JSON, nullable=False)
    response_status = Column(Integer, nullable=True)   # HTTP response code
    response_body   = Column(Text, nullable=True)
    duration_ms     = Column(Integer, nullable=True)
    success         = Column(Boolean, default=False)
    error_message   = Column(Text, nullable=True)
    created_at      = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_ow_log_endpoint", "endpoint_id", "created_at"),
    )


# ─────────────────────────────────────────────────────────────────
# Team invite system (enforces plan team_members limit)
# ─────────────────────────────────────────────────────────────────

class TeamInvite(Base):
    """Single-use invite tokens for adding team members within plan limits."""
    __tablename__ = "team_invites"
    id              = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    invited_by      = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    email           = Column(String(255), nullable=False)
    role            = Column(String(50), default="executive")
    token           = Column(String(512), nullable=False, unique=True)
    status          = Column(String(50), default="pending")  # pending | accepted | expired | revoked
    expires_at      = Column(DateTime, nullable=False)
    accepted_at     = Column(DateTime, nullable=True)
    created_at      = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_invite_token", "token"),
        Index("idx_invite_org_email", "organization_id", "email"),
    )
