# AI Procurement & Vendor Coordination

An intelligent procurement coordination platform for **Gujarat GIDC manufacturing SMEs**. It automates the full purchase-order lifecycle — from CSV ingestion and WhatsApp vendor follow-ups to AI-powered message parsing, human-in-the-loop (HITL) draft review, workflow state-machine transitions, and durable job queuing — all backed by a FastAPI + SQLite/PostgreSQL backend and a premium dark-theme web dashboard.

---

## Table of Contents

1. [How It Works — Overview](#how-it-works--overview)
2. [Architecture](#architecture)
3. [Data Flow: End-to-End PO Lifecycle](#data-flow-end-to-end-po-lifecycle)
4. [Workflow State Machine](#workflow-state-machine)
5. [AI Message Parsing](#ai-message-parsing)
6. [Human-in-the-Loop (HITL) Review](#human-in-the-loop-hitl-review)
7. [WhatsApp Integration](#whatsapp-integration)
8. [Durable Worker Queue](#durable-worker-queue)
9. [Database Models](#database-models)
10. [API Reference](#api-reference)
11. [Frontend Pages](#frontend-pages)
12. [Local Setup](#local-setup)
13. [Configuration (.env)](#configuration-env)
14. [Running Tests](#running-tests)
15. [Production Deployment](#production-deployment)

---

## How It Works — Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Operations Console                           │
│              (Upload PO CSV  ·  Simulate Webhook)                │
└──────────────────────┬──────────────────────────────────────────┘
                       │ POST /api/v1/ingestion/excel
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                               │
│                                                                  │
│  Ingestion ──► State Machine ──► Worker Queue                   │
│      │               │                 │                        │
│      │         Workflow Events    WhatsApp Outbox               │
│      │               │                                          │
│  Webhook ──► AI Parser ──► HITL Router                          │
│  (Meta)    (GPT-4o-mini)        │                               │
│                           Draft Queue ──► Manager Approval      │
└─────────────────────────────────────────────────────────────────┘
                       │
                       ▼
              SQLite / PostgreSQL
```

1. A **purchase order CSV** (exported from Tally or any ERP) is uploaded via the Operations Console.
2. The backend **ingests and normalises** the file — auto-detecting column names, grouping line items by PO number, creating Vendor + Workflow + Task records, and queuing a WhatsApp outbox job.
3. The workflow moves to **VENDOR_PENDING** and the system waits for a reply from the vendor via the **Meta WhatsApp Cloud API webhook**.
4. Incoming messages are fed to the **AI service** (OpenAI GPT-4o-mini, or a rule-based fallback) which extracts intent, ETA, delay flags, and language.
5. The **HITL router** decides whether to auto-handle the reply or route it to a **draft review queue** for a human coordinator to approve before it is sent.
6. Approved messages update the workflow state and trigger further outbox jobs or escalations.

---

## Architecture

```
procurement_ai/
├── backend/
│   └── app/
│       ├── main.py              # FastAPI app, CORS, static mount, startup
│       ├── models.py            # SQLAlchemy ORM models (all 12 tables)
│       ├── api/
│       │   ├── ingestion.py     # POST /ingestion/excel — PO file parser
│       │   ├── webhooks.py      # GET|POST /webhooks/whatsapp — Meta handler
│       │   └── review.py        # Workflow, HITL drafts, jobs, stats endpoints
│       ├── core/
│       │   ├── config.py        # Pydantic settings — reads .env
│       │   ├── database.py      # SQLAlchemy engine, session, init_db()
│       │   └── observability.py # Correlation ID middleware + structured logging
│       └── services/
│           ├── state_machine.py  # WorkflowState enum + transition validator
│           ├── hitl_service.py   # HITL draft creation, approval, modification
│           ├── ai_service.py     # OpenAI parser + rule-based fallback
│           ├── worker.py         # Durable job queue (DB-backed + memory fallback)
│           ├── whatsapp_policy.py# Meta 24h session window guard
│           └── seed_data.py      # Generates mock_500_tasks.json for the dashboard
├── frontend/
│   ├── index.html               # Premium dark dashboard (500 mock POs)
│   ├── operations.html          # Live operations console (upload, review, monitor)
│   └── mock_500_tasks.json      # Pre-generated 500-row mock dataset
├── .env                         # Local configuration (see section below)
├── .env.example                 # Template for .env
├── schema.sql                   # Raw SQL schema for reference
└── pytest.ini                   # Test configuration
```

---

## Data Flow: End-to-End PO Lifecycle

### Step 1 — PO Ingestion (`POST /api/v1/ingestion/excel`)

The endpoint accepts a `multipart/form-data` file upload. It:

- Reads CSV or Excel using `pandas`
- Auto-detects column aliases for `po_number`, `vendor_name`, `vendor_phone`, item description, quantity, and rate
- Groups rows by PO number (one task per PO, multiple line items per task)
- Upserts `Organization`, `Vendor`, `ProcurementWorkflow`, `ProcurementTask`, and `ProcurementItem` records
- Enqueues a `dispatch_whatsapp_outbox` job to send the vendor a confirmation request
- Transitions the workflow from `CREATED` → `VENDOR_PENDING`
- Appends a `PO_INGESTED` event to the workflow event log

### Step 2 — WhatsApp Outbox (`dispatch_whatsapp_outbox` job)

The worker processes the queued job and sends the vendor a WhatsApp message:

```
"Hello {vendor_name}, please confirm receipt of Purchase Order {po_number} and share ETA."
```

In production this calls the Meta Cloud API. In development it logs the dispatch locally.

### Step 3 — Vendor Reply (`POST /api/v1/webhooks/whatsapp`)

When the vendor replies, Meta sends a webhook payload to this endpoint. The handler:

1. **Verifies** the `X-Hub-Signature-256` HMAC signature (only enforced in production)
2. **Deduplicates** against `webhook_events` table using the `message_id` as an idempotency key
3. Extracts the text body from `text`, `button`, or `interactive` message types
4. Calls the **AI service** to parse intent
5. Routes the parsed result through the **HITL service**

### Step 4 — AI Parsing (`ai_service.parse_vendor_message`)

Sends the message to `gpt-4o-mini` with a structured prompt to extract:

| Field | Values |
|---|---|
| `intent` | `ack_po`, `provide_eta`, `delay_notice`, `price_discrepancy`, `general_query` |
| `extracted_eta` | ISO date string (e.g. `2026-05-30`) |
| `delay_flag` | `true` / `false` |
| `reason` | Free-text reason if a delay or dispute |
| `language` | `en`, `gu` (Gujarati), or `hi` (Hindi) |

If no OpenAI key is configured, a **rule-based keyword parser** is used as fallback (detects "delay", "late", "ETA", Gujarati/Hindi keywords).

### Step 5 — HITL Routing (`hitl_service.evaluate_message_for_hitl`)

The HITL service decides whether human review is needed:

| Condition | Action | Workflow State |
|---|---|---|
| `intent == delay_notice` OR `delay_flag == true` | Route to HITL draft queue | `DELAYED` |
| `intent == price_discrepancy` | Route to HITL draft queue | `APPROVAL_PENDING` |
| `intent == provide_eta` AND ETA variance > 3 days | Route to HITL draft queue | `APPROVAL_PENDING` |
| All other intents | Auto-handle (no human needed) | `ETA_RECEIVED` or `APPROVED` |

For each routed message it creates:
- An **`HITLDraft`** record with an AI-generated reply pre-filled
- A **`Message`** record in the outbox (status: `draft`)
- An **`Approval`** record linking the draft to the workflow

### Step 6 — Draft Approval (`PATCH + POST /api/v1/review/drafts/{draft_id}/approve`)

A human coordinator sees the draft in the Operations Console, optionally edits the AI reply text, then clicks **Approve & Send**. This:

- Updates `HITLDraft.status` → `approved`
- Updates the linked `Message` and `Approval` records
- Transitions the workflow to `APPROVED` (if it was in `APPROVAL_PENDING`)
- In production: dispatches the approved message to the vendor via Meta WhatsApp API

---

## Workflow State Machine

All state transitions are validated against an explicit allowlist before being written to the database. Invalid transitions (e.g. `COMPLETED → CREATED`) raise a `ValueError`.

```
CREATED
  └─► RFQ_SENT ──► VENDOR_PENDING
                        │
              ┌─────────┼──────────────┐
              ▼         ▼              ▼
           DELAYED   ETA_RECEIVED   ESCALATED
              │         │
              │    ┌────┴─────┐
              │    ▼          ▼
              │  APPROVED   APPROVAL_PENDING
              │    │              │
              │    ▼              ▼ (after human approves)
              └──► IN_TRANSIT ◄──APPROVED
                       │
                       ▼
                   COMPLETED
```

Every transition writes two append-only records:
- **`WorkflowEvent`** — event-sourcing log (`event_type`, `previous_state`, `new_state`, `reason`)
- **`AuditLog`** — human-readable audit trail (`action`, `description`, `payload_before`, `payload_after`)

All transitions use `SELECT ... FOR UPDATE` row-level locking to prevent concurrent webhook collisions on the same PO.

---

## AI Message Parsing

### With OpenAI configured

Set `OPENAI_API_KEY` in `.env`. The service calls `gpt-4o-mini` with `temperature=0` and `response_format=json_object` for deterministic structured extraction.

### Without OpenAI (rule-based fallback)

The fallback `_mock_rule_based_parser` uses regex and keyword matching:

```python
# Intent detection
"delay" / "late" / "moḍu" (Gujarati)  →  delay_notice
"okay" / "ack" / "mil gaya"           →  ack_po
"tarikh" / "date" / "eta"             →  provide_eta
```

Language detection checks for Gujarati Unicode characters (`\u0a80–\u0aff`) and Hindi (`\u0900–\u097f`).

### Multilingual Reply Generation

The HITL service pre-generates draft replies in the vendor's detected language:

- **English** — standard procurement follow-up
- **Gujarati (gu)** — full Unicode Gujarati script reply
- **Hindi (hi)** — full Unicode Devanagari reply

---

## Human-in-the-Loop (HITL) Review

The HITL queue is visible in both the **Operations Console** (`operations.html`) and the **Dashboard** (`index.html`).

### Draft Lifecycle

```
evaluate_message_for_hitl()
        │
        ├── requires_review = False  →  auto_sent (no human needed)
        │
        └── requires_review = True
                │
                ▼
           HITLDraft (status: "draft")
                │
           [Human edits text in UI]
                │
           PATCH /review/drafts/{id}        ← saves edited text
                │
           POST /review/drafts/{id}/approve ← approves + dispatches
                │
                ▼
           HITLDraft (status: "approved")
           Workflow  → APPROVED
```

### HITL in the Operations Console

Each draft card shows:
- The **vendor's original message** (quoted)
- The **detected intent** and **workflow target state**
- The **review reason** (why human approval is required)
- An **editable AI-generated reply** textarea
- **Save** (persist edits) and **Approve & Send** (finalise and dispatch) buttons

---

## WhatsApp Integration

### Meta Cloud API Setup (Production)

1. Create a Meta App at [developers.facebook.com](https://developers.facebook.com)
2. Add the WhatsApp product and configure a phone number
3. Set the webhook URL to `https://your-domain.com/api/v1/webhooks/whatsapp`
4. Set your `.env` values: `META_APP_SECRET`, `META_WHATSAPP_TOKEN`, `META_PHONE_NUMBER_ID`, `META_VERIFY_TOKEN`

### Session Window Guard (`whatsapp_policy.py`)

Meta enforces a 24-hour session window: you can only send free-form text replies within 24 hours of the last inbound message from that vendor. Outside that window, only pre-approved **template messages** are allowed.

The `WhatsAppPolicy.validate_and_prepare_outbox()` method:
- If `last_inbound_timestamp` is within 24 hours → returns a `text` payload
- If expired → returns a `template` payload with the specified fallback template name

### Local Testing (No Meta Required)

Use the **"Send Vendor Webhook"** panel in `operations.html` to inject synthetic webhook payloads directly into the backend. Three quick-fill buttons are provided:
- Gujarati delay notice
- Price discrepancy message
- ETA confirmation

---

## Durable Worker Queue

The `WorkerQueue` service provides crash-safe background job execution:

### Enqueueing a job

```python
worker_queue.enqueue_job(
    task_name="dispatch_whatsapp_outbox",
    payload={"phone_number": "+919876543210", "message_text": "..."},
    db=db_session  # writes to active_jobs table
)
```

### Job execution & crash recovery

Jobs are written to the `active_jobs` table with status `queued`. On worker restart (crash recovery), `execute_pending_jobs()` re-queries all `queued` jobs with `run_at <= now` and processes them.

Failed jobs are retried up to **3 times** with a 10-second backoff. After exhausting retries, the job is marked `failed` (acting as a dead-letter queue within the same table).

### Supported task names

| Task | Description |
|---|---|
| `dispatch_whatsapp_outbox` | Send a WhatsApp message to a vendor |
| `escalate_unresponsive_vendor` | Trigger escalation alerts for non-responding vendors |

---

## Database Models

| Model | Table | Purpose |
|---|---|---|
| `Organization` | `organizations` | Multi-tenant root — each customer is an org |
| `User` | `users` | Managers and executives within an org |
| `Vendor` | `vendors` | Supplier directory with reliability scores |
| `ProcurementWorkflow` | `procurement_workflows` | One per PO number — holds current state |
| `ProcurementTask` | `procurement_tasks` | Detailed task linked to workflow + vendor |
| `ProcurementItem` | `procurement_items` | Line items within a task |
| `Message` | `messages` | All inbound/outbound WhatsApp messages |
| `HITLDraft` | `hitl_drafts` | AI-generated reply drafts pending human review |
| `Approval` | `approvals` | Approval records for HITL and price changes |
| `WebhookEvent` | `webhook_events` | Idempotency ledger for Meta webhook deduplication |
| `WorkflowEvent` | `workflow_events` | Append-only event-sourcing log |
| `AuditLog` | `audit_logs` | Human-readable audit trail of all state changes |
| `ActiveJob` | `active_jobs` | Durable worker job queue with retry state |

---

## API Reference

Base path: `/api/v1`

### Ingestion

| Method | Path | Description |
|---|---|---|
| `POST` | `/ingestion/excel` | Upload a PO file (CSV/XLS/XLSX). Header: `x-org-id`. Body: multipart file. |

### Webhooks

| Method | Path | Description |
|---|---|---|
| `GET` | `/webhooks/whatsapp` | Meta webhook verification handshake |
| `POST` | `/webhooks/whatsapp` | Receive inbound vendor WhatsApp messages |

### Review & Operations

| Method | Path | Description |
|---|---|---|
| `GET` | `/review/workflows` | List all workflows (joined with task + vendor) |
| `GET` | `/review/drafts` | List HITL drafts. Query param: `?status=draft\|all` |
| `PATCH` | `/review/drafts/{id}` | Edit draft reply text |
| `POST` | `/review/drafts/{id}/approve` | Approve a draft and trigger dispatch |
| `GET` | `/review/jobs` | List recent worker jobs |
| `GET` | `/review/tasks/{task_id}/items` | Get line items for a specific task |
| `GET` | `/review/stats` | Aggregate counts for dashboard overlay |

Interactive docs are available at: **`http://127.0.0.1:8000/docs`**

---

## Frontend Pages

### Dashboard (`/ui/index.html`)

A read-only analytics view loaded from the pre-generated `mock_500_tasks.json` (500 realistic GIDC procurement records). Features:

- **Top metrics** — Total POs, Critical, Delayed, Pending Review (live backend counts overlaid when backend is online)
- **Filterable paginated ledger** — search by PO/vendor/category, filter by priority, GIDC zone, and workflow state
- **Downstream production impact panel** — shows which factory line is blocked when a PO is delayed
- **Vendor reliability scorecard** — reliability %, average delay days, late delivery rate
- **Workflow state trace timeline** — simulated step-by-step state history for any selected PO
- **HITL approval queue** — shows drafts from both the mock dataset and the live backend (merged)
- **GIDC escalation heatmap** — top 4 industrial zones by delayed/escalated PO count

### Operations Console (`/ui/operations.html`)

The live control panel for procurement coordinators. Features:

- **Connection settings** — configurable API Base URL and Organization ID
- **PO upload** — file picker or one-click sample CSV with loading state + result summary
- **Vendor reply simulator** — inject synthetic webhook payloads with quick-fill buttons (Gujarati, price dispute, ETA)
- **Live workflow ledger** — auto-refreshes every 10 seconds, shows current state badges
- **HITL review queue** — edit and approve AI-drafted replies before WhatsApp dispatch
- **Worker job queue** — live view of queued, running, and completed background jobs
- **Backend connectivity indicator** — pulsing green dot when API is reachable

---

## Local Setup

### 1. Clone and configure environment

```powershell
cd procurement_ai
copy .env.example .env
# Edit .env if needed (SQLite is configured by default)
```

### 2. Install dependencies

```powershell
python -m pip install -r backend/requirements.txt
```

### 3. Run tests

```powershell
$env:DATABASE_URL="sqlite:///:memory:"
python -m pytest
```

Expected output: **6 passed**

### 4. Start the API server

```powershell
cd backend
python -m uvicorn app.main:app --reload
```

### 5. Open the UI

| Page | URL |
|---|---|
| Operations Console | http://127.0.0.1:8000/ui/operations.html |
| Dashboard | http://127.0.0.1:8000/ui/index.html |
| Interactive API Docs | http://127.0.0.1:8000/docs |

### 6. Try a full workflow

1. Open the Operations Console
2. Click **Use Sample CSV** → "Imported 2 purchase orders" ✓
3. The Workflow Ledger shows `PO-2026-DEMO-001` and `PO-2026-DEMO-002` in `VENDOR_PENDING`
4. Enter phone `+919876543210`, message `"Delivery delay by 2 days. Machine breakdown."` → click **Send Vendor Webhook**
5. The HITL queue now shows a draft card for review
6. Edit the AI reply if needed → click **Approve & Send**
7. The workflow transitions to `APPROVED`

### 7. Regenerate mock data (optional)

```powershell
python backend/app/services/seed_data.py
```

This regenerates `frontend/mock_500_tasks.json` with fresh random data.

---

## Configuration (.env)

| Variable | Default | Description |
|---|---|---|
| `ENVIRONMENT` | `development` | Set to `production` to enable security validations |
| `DATABASE_URL` | `sqlite:///./procurement_ai.db` | SQLite (dev) or PostgreSQL URL |
| `SECRET_KEY` | *(dev placeholder)* | JWT signing key — **must be changed in production** |
| `CORS_ORIGINS` | `http://localhost:3000,...` | Comma-separated allowed origins |
| `META_APP_SECRET` | *(placeholder)* | Meta App Secret for webhook HMAC verification |
| `META_WHATSAPP_TOKEN` | *(placeholder)* | Meta Cloud API access token |
| `META_PHONE_NUMBER_ID` | *(placeholder)* | Phone number ID from Meta dashboard |
| `META_VERIFY_TOKEN` | `webhook_verification_token` | Token you set in Meta App webhook settings |
| `OPENAI_API_KEY` | *(empty)* | GPT-4o-mini key. Leave blank to use rule-based fallback |
| `REDIS_HOST` | `localhost` | Reserved for future Celery/Redis queue migration |

The database automatically falls back to SQLite if PostgreSQL is unreachable.

---

## Running Tests

```powershell
# From project root
$env:DATABASE_URL="sqlite:///:memory:"
python -m pytest backend/tests/ -v
```

| Test | What it covers |
|---|---|
| `test_state_transition_integrity` | Valid + invalid transitions, COMPLETED → CREATED rejection, event-sourcing log entries |
| `test_webhook_idempotency_deduplication` | Duplicate Meta webhook IDs are caught and not double-processed |
| `test_human_in_the_loop_moderation_queue` | Delay notice → draft queued → edit → approve → APPROVED state |
| `test_correlation_id_propagation` | Trace IDs persist across `WebhookEvent` and `Message` records |
| `test_whatsapp_policy_session_window_guard` | Messages within 24h → `text` type; expired → `template` type |
| `test_durable_queue_crash_recovery` | Job committed to DB, worker crashes, restarts, reads from DB, marks completed |

---

## Production Deployment

1. Set `ENVIRONMENT=production` in `.env`
2. Use a strong random `SECRET_KEY`
3. Set a PostgreSQL `DATABASE_URL` (Supabase, RDS, etc.)
4. Configure all four Meta WhatsApp credentials
5. Restrict `CORS_ORIGINS` to your actual frontend domain(s)
6. Run behind a reverse proxy (nginx/Caddy) with HTTPS — Meta requires HTTPS for webhooks
7. Use a process manager (systemd, PM2, or Docker) to keep uvicorn alive across restarts

```powershell
# Production start
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```
