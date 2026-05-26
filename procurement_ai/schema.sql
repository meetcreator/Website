-- PostgreSQL Database Schema: AI Procurement & Vendor Coordination Platform
-- NOTE: SQLAlchemy models + Alembic migrations are the source of truth going forward.
-- Extended for webhooks, priority layers, downstream impacts, correlation IDs, versioning, and persistent jobs.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Organizations (Tenants)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    gstin VARCHAR(15),
    timezone VARCHAR(100) DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users & Roles
CREATE TYPE user_role AS ENUM ('owner', 'manager', 'executive', 'operations', 'admin');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15),
    role user_role NOT NULL DEFAULT 'executive',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Webhook Events (Idempotency Enforcer with Correlation Tracing)
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(255) UNIQUE NOT NULL, -- Meta message_id or delivery ID
    sender_phone VARCHAR(50),
    event_type VARCHAR(100) NOT NULL,
    raw_payload JSONB,
    processed_status VARCHAR(50) DEFAULT 'received',
    error_message TEXT,
    correlation_id UUID,                   -- Trace ID for observability
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Workflow State Machine States
CREATE TYPE workflow_state AS ENUM (
    'CREATED',
    'RFQ_SENT',
    'VENDOR_PENDING',
    'ETA_RECEIVED',
    'APPROVAL_PENDING',
    'APPROVED',
    'IN_TRANSIT',
    'DELAYED',
    'ESCALATED',
    'COMPLETED',
    'CANCELLED'
);

-- 5. Workflow Priorities
CREATE TYPE workflow_priority AS ENUM (
    'CRITICAL',
    'HIGH',
    'NORMAL',
    'LOW'
);

-- 6. Procurement Workflows (Persistent Operational Graph with Versioning)
CREATE TABLE procurement_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    po_number VARCHAR(100) NOT NULL,
    current_state workflow_state NOT NULL DEFAULT 'CREATED',
    priority workflow_priority NOT NULL DEFAULT 'NORMAL',
    production_impact VARCHAR(255),
    version INTEGER DEFAULT 1,                     -- Priority 4: Workflow Versioning
    next_action_deadline TIMESTAMP WITH TIME ZONE,
    coordination_friction_sec INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, po_number)
);

-- 7. Vendors
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    gstin VARCHAR(15),
    category VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'en',
    reliability_score NUMERIC(5, 2) DEFAULT 100.00,
    avg_delay_days NUMERIC(4, 2) DEFAULT 0.00,
    late_deliveries_pct NUMERIC(5, 2) DEFAULT 0.00,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, phone_number)
);

-- 8. Procurement Tasks
CREATE TABLE procurement_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES procurement_workflows(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE RESTRICT,
    po_number VARCHAR(100) NOT NULL,
    po_date DATE NOT NULL,
    total_amount NUMERIC(15, 2),
    status workflow_state NOT NULL DEFAULT 'CREATED',
    priority workflow_priority NOT NULL DEFAULT 'NORMAL',
    production_impact VARCHAR(255),
    original_eta DATE,
    revised_eta DATE,
    tracking_number VARCHAR(100),
    lorry_receipt_url TEXT,
    raw_text_ocr TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding VECTOR(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, po_number)
);

-- 9. Line Items
CREATE TABLE procurement_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES procurement_tasks(id) ON DELETE CASCADE,
    item_code VARCHAR(100),
    description TEXT NOT NULL,
    quantity NUMERIC(12, 4) NOT NULL,
    unit VARCHAR(20) DEFAULT 'Kgs',
    unit_price NUMERIC(15, 2) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    received_quantity NUMERIC(12, 4) DEFAULT 0.0000,
    hsn_code VARCHAR(10),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. WhatsApp Messages & HITL
CREATE TYPE sender_type AS ENUM ('vendor', 'system_ai', 'user_manual', 'copilot');
CREATE TYPE hitl_approval_status AS ENUM ('draft', 'approved', 'rejected');

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES procurement_workflows(id) ON DELETE SET NULL,
    task_id UUID REFERENCES procurement_tasks(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    sender_type sender_type NOT NULL,
    whatsapp_message_id VARCHAR(255),
    message_content TEXT NOT NULL,
    translated_content TEXT,
    delivery_status VARCHAR(50) DEFAULT 'sent',
    hitl_status hitl_approval_status DEFAULT 'approved',
    draft_approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    correlation_id UUID,                   -- Trace ID for observability
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding VECTOR(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. HITL Drafts (Persistent Review Queue)
CREATE TABLE hitl_drafts (
    id VARCHAR PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES procurement_workflows(id) ON DELETE SET NULL,
    task_id UUID REFERENCES procurement_tasks(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    vendor_phone VARCHAR(50) NOT NULL,
    vendor_message TEXT NOT NULL,
    detected_intent VARCHAR(100) NOT NULL,
    draft_content TEXT NOT NULL,
    review_reason TEXT,
    target_state workflow_state NOT NULL,
    status hitl_approval_status DEFAULT 'draft',
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Operational Approvals
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES procurement_workflows(id) ON DELETE CASCADE,
    task_id UUID REFERENCES procurement_tasks(id) ON DELETE CASCADE,
    requested_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(100) NOT NULL,
    original_value TEXT,
    proposed_value TEXT,
    status approval_status DEFAULT 'pending',
    rejection_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Escalation Logs
CREATE TABLE escalation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES procurement_workflows(id) ON DELETE CASCADE,
    task_id UUID REFERENCES procurement_tasks(id) ON DELETE CASCADE,
    escalation_level INTEGER NOT NULL,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    action_taken TEXT NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active'
);

-- 14. Core Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES procurement_workflows(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    payload_before JSONB,
    payload_after JSONB,
    correlation_id UUID,                   -- Trace ID for observability
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Workflow Events (Append-Only Event Sourcing Log)
CREATE TABLE workflow_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES procurement_workflows(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Persistent Background Jobs (Priority 1: Crash Recovery)
CREATE TABLE active_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_name VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    run_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'queued',   -- 'queued', 'running', 'completed', 'failed'
    retries_remaining INTEGER DEFAULT 3,
    correlation_id UUID,                   -- Trace ID for observability
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- INDEXES & PERFORMANCE TUNING
-- ==================================================
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_vendors_org ON vendors(organization_id);
CREATE INDEX idx_workflows_org ON procurement_workflows(organization_id);
CREATE INDEX idx_tasks_org ON procurement_tasks(organization_id);
CREATE INDEX idx_messages_org ON messages(organization_id);
CREATE INDEX idx_hitl_status ON hitl_drafts(status);
CREATE INDEX idx_audits_org ON audit_logs(organization_id);
CREATE INDEX idx_workflow_events_wf ON workflow_events(workflow_id);

CREATE INDEX idx_webhook_event ON webhook_events(event_id);
CREATE INDEX idx_workflows_state ON procurement_workflows(current_state);
CREATE INDEX idx_tasks_po_number ON procurement_tasks(po_number);
CREATE INDEX idx_vendors_whatsapp ON vendors(phone_number);
CREATE INDEX idx_active_jobs_run ON active_jobs(run_at);

-- Auto modified triggers
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_time BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_users_time BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_workflows_time BEFORE UPDATE ON procurement_workflows FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_vendors_time BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_tasks_time BEFORE UPDATE ON procurement_tasks FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_approvals_time BEFORE UPDATE ON approvals FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
