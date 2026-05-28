# file: backend/app/services/demo_seeder.py
"""
Demo account seeder.

Creates a permanent demo organisation on the Enterprise plan with:
  - All usage limits set to unlimited (-1)
  - Pre-seeded vendors, procurement workflows, and HITL drafts
  - Pre-loaded audit log entries
  - Outbound webhook endpoint (for testing)
  - One additional team member (manager)

Credentials (printed to server log and returned from /api/v1/auth/demo):
  Email:    demo@aiprocure.in
  Password: Demo@1234

Idempotent — re-running will not duplicate data.
"""
from __future__ import annotations

import logging
import uuid
from datetime import datetime, timedelta, date
from decimal import Decimal

from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

DEMO_EMAIL    = "demo@aiprocure.in"
DEMO_PASSWORD = "Demo@1234"
DEMO_ORG_NAME = "GIDC Demo Factory — Vatva Cluster"


def _hash(pw: str) -> str:
    try:
        from passlib.context import CryptContext
        return CryptContext(schemes=["bcrypt"], deprecated="auto").hash(pw)
    except ImportError:
        import hashlib
        return hashlib.sha256(pw.encode()).hexdigest()


def seed_demo(db: Session) -> dict:
    """
    Idempotently create the demo account and all sample data.
    Returns a dict with the demo credentials.
    """
    from app.models import (
        Organization, User, Subscription, UsageRecord,
        Vendor, ProcurementWorkflow, ProcurementTask,
        ProcurementItem, HITLDraft, AuditLog, WorkflowEvent,
        WebhookEndpoint,
    )

    # ── 1. Organisation ──────────────────────────────────────────
    org = db.query(Organization).filter(Organization.name == DEMO_ORG_NAME).first()
    if not org:
        org = Organization(
            id       = "demo-org-" + str(uuid.uuid4())[:8],
            name     = DEMO_ORG_NAME,
            gstin    = "24AABCU9603R1ZX",
            timezone = "Asia/Kolkata",
        )
        db.add(org)
        db.flush()
        logger.info(f"Demo seeder: created org {org.id}")

    # ── 2. Owner user ────────────────────────────────────────────
    owner = db.query(User).filter(User.email == DEMO_EMAIL).first()
    if not owner:
        owner = User(
            id              = "demo-owner-" + str(uuid.uuid4())[:8],
            organization_id = org.id,
            email           = DEMO_EMAIL,
            password_hash   = _hash(DEMO_PASSWORD),
            full_name       = "Rajesh Patel (Demo Owner)",
            role            = "owner",
            is_active       = True,
        )
        db.add(owner)
        db.flush()

    # ── 3. Manager user ──────────────────────────────────────────
    mgr_email = "manager@aiprocure.in"
    if not db.query(User).filter(User.email == mgr_email).first():
        db.add(User(
            id              = "demo-mgr-" + str(uuid.uuid4())[:8],
            organization_id = org.id,
            email           = mgr_email,
            password_hash   = _hash("Demo@1234"),
            full_name       = "Anita Shah (Demo Manager)",
            role            = "manager",
            is_active       = True,
        ))
        db.flush()

    # ── 4. Enterprise subscription (unlimited everything) ────────
    sub = db.query(Subscription).filter(
        Subscription.organization_id == org.id,
        Subscription.status == "active",
    ).first()
    if not sub:
        now = datetime.utcnow()
        sub = Subscription(
            id                   = "demo-sub-" + str(uuid.uuid4())[:8],
            organization_id      = org.id,
            plan_name            = "enterprise",
            billing_interval     = "annual",
            status               = "active",
            payment_provider     = "demo",
            current_period_start = now.replace(day=1, hour=0, minute=0, second=0),
            current_period_end   = now.replace(year=now.year + 1, day=1, hour=0, minute=0, second=0),
            cancel_at_period_end = False,
        )
        db.add(sub)
        db.flush()

    # ── 5. Usage record (some used to make dashboard look real) ──
    period_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0)
    usage = db.query(UsageRecord).filter(
        UsageRecord.organization_id == org.id,
        UsageRecord.period_start    == period_start,
    ).first()
    if not usage:
        db.add(UsageRecord(
            id              = "demo-usage-" + str(uuid.uuid4())[:8],
            organization_id = org.id,
            period_start    = period_start,
            po_uploads      = 47,
            whatsapp_msgs   = 183,
            hitl_reviews    = 12,
        ))
        db.flush()

    # ── 6. Vendors ───────────────────────────────────────────────
    # Vendor columns: id, organization_id, name, contact_person, phone_number,
    #                 email, gstin, category, preferred_language,
    #                 reliability_score, avg_delay_days, late_deliveries_pct, metadata
    VENDORS = [
        # (name, phone, email, category, contact, lang, reliability, avg_delay)
        ("Mehta Steel Suppliers",   "+917600100001", "mehta@steel.com",    "Steel & Fasteners", "Ramesh Mehta", "gujarati", 0.92, 1.2),
        ("Patel Fasteners Pvt",     "+917600100002", "patel@fasteners.in", "Steel & Fasteners", "Suresh Patel", "gujarati", 0.85, 2.8),
        ("Shah Hydraulics Works",   "+917600100003", "shah@hydraulics.in", "Hydraulics",        "Nitin Shah",   "hindi",    0.78, 4.1),
        ("Amin Electrical Traders", "+917600100004", "amin@electrical.in", "Electrical",        "Fatema Amin",  "gujarati", 0.95, 0.5),
        ("Joshi Packaging Co",      "+917600100005", "joshi@packaging.in", "Packaging",         "Deepak Joshi", "hindi",    0.88, 1.9),
    ]
    vendor_ids = []
    for (name, phone, email, cat, contact, lang, rel, delay) in VENDORS:
        v = db.query(Vendor).filter(Vendor.phone_number == phone).first()
        if not v:
            v = Vendor(
                id                  = "demo-v-" + str(uuid.uuid4())[:8],
                organization_id     = org.id,
                name                = name,
                contact_person      = contact,
                phone_number        = phone,
                email               = email,
                category            = cat,
                preferred_language  = lang,
                reliability_score   = rel,
                avg_delay_days      = delay,
                late_deliveries_pct = max(0.0, (1.0 - rel) * 100),
            )
            db.add(v)
            db.flush()
        vendor_ids.append(v.id)

    # ── 7. Procurement workflows ─────────────────────────────────
    # ProcurementWorkflow columns: id, organization_id, po_number, current_state,
    #   priority, production_impact, version, next_action_deadline, coordination_friction_sec, metadata
    # ProcurementTask columns: id, organization_id, workflow_id, vendor_id, po_number, po_date,
    #   total_amount, status, priority, production_impact, original_eta, revised_eta,
    #   tracking_number, lorry_receipt_url, raw_text_ocr, metadata
    # ProcurementItem columns: id, task_id, item_code, description, quantity, unit,
    #   unit_price, amount, received_quantity, hsn_code, metadata

    WORKFLOWS = [
        # (po_number, state, priority, impact, vendor_idx, total, items)
        ("PO-2025-001", "IN_TRANSIT",      "HIGH",     "MEDIUM",   0, 142500, [
            ("BOLT-M10-88",  "M10 Hex Bolts 8.8",       500,  "pcs",   45.0,  "73181100"),
            ("NUT-M12",      "M12 Hex Nuts",             500,  "pcs",   32.0,  "73182900"),
            ("WASH-12MM",    "Flat Washers 12mm",        1000, "pcs",   12.5,  "73182900"),
        ]),
        ("PO-2025-002", "APPROVAL_PENDING","CRITICAL",  "HIGH",     1, 87200,  [
            ("HYD-HOSE-12",  "Hydraulic Hose 1/2 inch",  50,  "mtrs", 680.0, "83071000"),
            ("CLAMP-SS304",  "Hose Clamps SS304",        200,  "pcs",   95.0, "73079900"),
        ]),
        ("PO-2025-003", "COMPLETED",       "NORMAL",    "LOW",      2, 234000, [
            ("MOTOR-5HP",    "3 Phase Motor 5HP",         10,  "nos", 12800.0, "85011093"),
            ("CAP-50UF",     "Motor Capacitor 50uF",      10,  "nos",   680.0, "85322300"),
            ("STARTER-5HP",  "Starter DOL 5HP",           10,  "nos",  2780.0, "85364900"),
        ]),
        ("PO-2025-004", "DELAYED",         "HIGH",     "MEDIUM",    3, 56800,  [
            ("LED-40W",      "LED Panel 40W",             80,  "nos",   420.0, "94054090"),
            ("MCB-32A-SP",   "MCB 32A SP",                40,  "nos",   285.0, "85362090"),
        ]),
        ("PO-2025-005", "RFQ_SENT",        "NORMAL",   "LOW",       4, 38500,  [
            ("WRAP-1200",    "Bubble Wrap 1.2m roll",     50,  "rolls", 320.0, "39211990"),
            ("HDPE-50KG",    "HDPE Bags 50kg",           200,  "bags",   65.0, "63053300"),
        ]),
        ("PO-2025-006", "VENDOR_PENDING",  "NORMAL",   "LOW",       0, 95600,  [
            ("ACAP-M8-30",   "Allen Cap Screw M8x30",   2000,  "pcs",   18.0, "73181200"),
            ("SW-M8",        "Spring Washer M8",        2000,  "pcs",    6.5, "73182200"),
        ]),
        ("PO-2025-007", "ESCALATED",       "CRITICAL", "HIGH",      2, 412000, [
            ("SRV-2KW",      "Servo Motor 2kW",            5,  "nos", 48500.0, "85013300"),
            ("ENC-1024",     "Encoder 1024PPR",            5,  "nos", 16800.0, "90149000"),
            ("DRV-2KW",      "Servo Drive 2kW",            5,  "nos", 18900.0, "85044090"),
        ]),
    ]

    for (po_num, state, priority, impact, vendor_idx, total, items) in WORKFLOWS:
        if db.query(ProcurementWorkflow).filter(ProcurementWorkflow.po_number == po_num).first():
            continue

        wf_id   = "demo-wf-" + str(uuid.uuid4())[:8]
        task_id = "demo-t-"  + str(uuid.uuid4())[:8]
        v_id    = vendor_ids[vendor_idx]

        wf = ProcurementWorkflow(
            id                = wf_id,
            organization_id   = org.id,
            po_number         = po_num,
            current_state     = state,
            priority          = priority,
            production_impact = impact,
            version           = 1,
        )
        db.add(wf)

        task = ProcurementTask(
            id                = task_id,
            organization_id   = org.id,
            workflow_id       = wf_id,
            vendor_id         = v_id,
            po_number         = po_num,
            po_date           = date.today() - timedelta(days=10),
            total_amount      = Decimal(str(total)),
            status            = state,
            priority          = priority,
            production_impact = impact,
            original_eta      = date.today() + timedelta(days=5),
            revised_eta       = date.today() + timedelta(days=7),
        )
        db.add(task)

        for (code, desc, qty, unit, price, hsn) in items:
            db.add(ProcurementItem(
                id          = "demo-item-" + str(uuid.uuid4())[:8],
                task_id     = task_id,
                item_code   = code,
                description = desc,
                quantity    = Decimal(str(qty)),
                unit        = unit,
                unit_price  = Decimal(str(price)),
                amount      = Decimal(str(qty)) * Decimal(str(price)),
                hsn_code    = hsn,
            ))

        db.add(WorkflowEvent(
            organization_id = org.id,
            workflow_id     = wf_id,
            event_type      = f"STATE_CHANGED_TO_{state}",
            payload         = {"previous_state": "CREATED", "new_state": state, "reason": "Demo seed"},
        ))

        db.add(AuditLog(
            organization_id = org.id,
            workflow_id     = wf_id,
            user_id         = owner.id,
            action          = "STATE_TRANSITION",
            description     = f"Demo: {po_num} initialised at {state}",
            payload_before  = {"state": "CREATED"},
            payload_after   = {"state": state},
        ))

        db.flush()

    # ── 8. HITL draft for APPROVAL_PENDING workflow ───────────────
    approval_wf = db.query(ProcurementWorkflow).filter(
        ProcurementWorkflow.organization_id == org.id,
        ProcurementWorkflow.current_state   == "APPROVAL_PENDING",
    ).first()

    if approval_wf:
        if not db.query(HITLDraft).filter(HITLDraft.workflow_id == approval_wf.id).first():
            task = db.query(ProcurementTask).filter(ProcurementTask.workflow_id == approval_wf.id).first()
            db.add(HITLDraft(
                id              = "demo-draft-" + str(uuid.uuid4())[:8],
                organization_id = org.id,
                workflow_id     = approval_wf.id,
                task_id         = task.id if task else None,
                vendor_id       = task.vendor_id if task else None,
                vendor_phone    = "+917600100002",
                vendor_message  = "Sir, hose material SS304 nahi mil rahi. Kya SS316 chalega? ETA 5 din baad hogi.",
                detected_intent = "ETA_CHANGE",
                draft_content   = (
                    "Dear Patel Fasteners,\n\n"
                    "Thank you for your update. We approve the material substitution to SS316 "
                    "provided the mechanical specifications are maintained and burst pressure "
                    "rating is unchanged.\n\n"
                    f"Please confirm revised ETA of {(date.today() + timedelta(days=12)).strftime('%d %b %Y')} "
                    "and send an updated quotation with the new material grade.\n\n"
                    "Regards,\nProcurement Team\nGIDC Demo Factory"
                ),
                review_reason   = "ETA variance > 3 days + material substitution requires manager approval",
                target_state    = "APPROVED",
                status          = "draft",
            ))
            db.flush()

    # ── 9. Webhook endpoint ──────────────────────────────────────
    if not db.query(WebhookEndpoint).filter(WebhookEndpoint.organization_id == org.id).first():
        db.add(WebhookEndpoint(
            id              = "demo-wh-" + str(uuid.uuid4())[:8],
            organization_id = org.id,
            url             = "https://httpbin.org/post",
            description     = "Demo webhook — echoes events at httpbin.org",
            event_filter    = None,
            secret          = "demo-webhook-secret-key-123",
            is_active       = True,
        ))
        db.flush()

    db.commit()

    logger.info(
        "\n" + "=" * 60 +
        "\n  DEMO ACCOUNT READY" +
        f"\n  Email:    {DEMO_EMAIL}" +
        f"\n  Password: {DEMO_PASSWORD}" +
        "\n  Plan:     Enterprise (all limits unlimited)" +
        f"\n  Org:      {DEMO_ORG_NAME}" +
        f"\n  Org ID:   {org.id}" +
        "\n" + "=" * 60
    )

    return {
        "org_id":   org.id,
        "email":    DEMO_EMAIL,
        "password": DEMO_PASSWORD,
        "plan":     "enterprise",
    }
