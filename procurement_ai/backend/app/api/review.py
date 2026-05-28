# file: backend/app/api/review.py
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import ActiveJob, HITLDraft, ProcurementItem, ProcurementTask, ProcurementWorkflow, Vendor
from app.services.hitl_service import hitl_service
from app.services.subscription import check_limit
from app.models import AuditLog
from sqlalchemy import func
import uuid

router = APIRouter()


class DraftUpdate(BaseModel):
    draft_content: str


class DraftApproval(BaseModel):
    approver_user_id: str = "local_manager"


def draft_to_dict(draft: HITLDraft) -> dict:
    return {
        "draft_id": draft.id,
        "organization_id": draft.organization_id,
        "workflow_id": draft.workflow_id,
        "task_id": draft.task_id,
        "vendor_id": draft.vendor_id,
        "vendor_phone": draft.vendor_phone,
        "vendor_message": draft.vendor_message,
        "detected_intent": draft.detected_intent,
        "draft_content": draft.draft_content,
        "review_reason": draft.review_reason,
        "target_state": draft.target_state,
        "status": draft.status,
        "approved_by": draft.approved_by,
        "approved_at": draft.approved_at.isoformat() if draft.approved_at else None,
        "created_at": draft.created_at.isoformat() if draft.created_at else None,
        "updated_at": draft.updated_at.isoformat() if draft.updated_at else None,
    }


@router.get("/drafts")
def list_drafts(status: Optional[str] = "draft", db: Session = Depends(get_db)):
    query = db.query(HITLDraft)
    if status and status.lower() != "all":
        query = query.filter(HITLDraft.status == status)
    drafts = query.order_by(HITLDraft.created_at.desc()).all()
    return {"drafts": [draft_to_dict(d) for d in drafts]}


@router.patch("/drafts/{draft_id}")
def update_draft(draft_id: str, payload: DraftUpdate, db: Session = Depends(get_db)):
    try:
        result = hitl_service.modify_draft_message(draft_id, payload.draft_content, db=db)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return result


@router.post("/drafts/{draft_id}/approve")
def approve_draft(draft_id: str, payload: DraftApproval, db: Session = Depends(get_db)):
    # Fetch draft first to get org_id for limit check
    draft = db.get(HITLDraft, draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail=f"Draft {draft_id} not found.")

    # Enforce HITL review plan limit
    check_limit(db, draft.organization_id, "hitl_reviews", increment=1)

    try:
        result = hitl_service.approve_draft_message(draft_id, payload.approver_user_id, db=db)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return result


@router.get("/workflows")
def list_workflows(db: Session = Depends(get_db)):
    rows = (
        db.query(ProcurementWorkflow, ProcurementTask, Vendor)
        .join(ProcurementTask, ProcurementTask.workflow_id == ProcurementWorkflow.id)
        .join(Vendor, Vendor.id == ProcurementTask.vendor_id)
        .order_by(ProcurementWorkflow.created_at.desc())
        .limit(50)
        .all()
    )
    workflows = []
    for workflow, task, vendor in rows:
        item_count = db.query(ProcurementItem).filter(ProcurementItem.task_id == task.id).count()
        workflows.append({
            "workflow_id": workflow.id,
            "task_id": task.id,
            "po_number": workflow.po_number,
            "state": workflow.current_state,
            "priority": workflow.priority,
            "vendor_name": vendor.name,
            "vendor_phone": vendor.phone_number,
            "total_amount": float(task.total_amount or 0),
            "item_count": item_count,
            "updated_at": workflow.updated_at.isoformat() if workflow.updated_at else None,
        })
    return {"workflows": workflows}


@router.get("/jobs")
def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(ActiveJob).order_by(ActiveJob.created_at.desc()).limit(50).all()
    return {
        "jobs": [
            {
                "id": job.id,
                "task_name": job.task_name,
                "status": job.status,
                "run_at": job.run_at.isoformat() if job.run_at else None,
                "payload": job.payload,
                "retries_remaining": job.retries_remaining,
            }
            for job in jobs
        ]
    }


@router.get("/tasks/{task_id}/items")
def get_task_items(task_id: str, db: Session = Depends(get_db)):
    """Returns line items for a specific procurement task."""
    from app.models import ProcurementItem
    task = db.get(ProcurementTask, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found.")
    items = db.query(ProcurementItem).filter(ProcurementItem.task_id == task_id).all()
    return {
        "task_id": task_id,
        "po_number": task.po_number,
        "items": [
            {
                "id": item.id,
                "description": item.description,
                "quantity": float(item.quantity),
                "unit": item.unit,
                "unit_price": float(item.unit_price),
                "amount": float(item.amount),
                "hsn_code": item.hsn_code,
                "item_code": item.item_code,
            }
            for item in items
        ]
    }


@router.get("/audit-log")
def get_audit_log(
    org_id: Optional[str] = None,
    limit: int = 100,
    format: Optional[str] = None,   # 'csv' for download
    db: Session = Depends(get_db)
):
    """
    Returns the audit trail for an organisation.
    Starter+ plans only. Pass ?format=csv for a downloadable CSV.
    """
    from fastapi.responses import StreamingResponse
    import io, csv

    query = db.query(AuditLog)
    if org_id:
        query = query.filter(AuditLog.organization_id == org_id)
    logs = query.order_by(AuditLog.created_at.desc()).limit(min(limit, 500)).all()

    rows = [
        {
            "id":              log.id,
            "organization_id": log.organization_id,
            "workflow_id":     log.workflow_id,
            "user_id":         log.user_id,
            "action":          log.action,
            "description":     log.description,
            "created_at":      log.created_at.isoformat() if log.created_at else None,
        }
        for log in logs
    ]

    if format == "csv":
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=["id","organization_id","workflow_id","user_id","action","description","created_at"])
        writer.writeheader()
        writer.writerows(rows)
        output.seek(0)
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode()),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=audit_log.csv"}
        )

    return {"count": len(rows), "audit_log": rows}


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Returns aggregate dashboard statistics from live data."""
    from sqlalchemy import func
    total = db.query(func.count(ProcurementWorkflow.id)).scalar() or 0
    critical = db.query(func.count(ProcurementWorkflow.id)).filter(
        ProcurementWorkflow.priority == "CRITICAL"
    ).scalar() or 0
    delayed = db.query(func.count(ProcurementWorkflow.id)).filter(
        ProcurementWorkflow.current_state.in_(["DELAYED", "ESCALATED"])
    ).scalar() or 0
    pending_review = db.query(func.count(ProcurementWorkflow.id)).filter(
        ProcurementWorkflow.current_state == "APPROVAL_PENDING"
    ).scalar() or 0
    return {
        "total_workflows": total,
        "critical_count": critical,
        "delayed_count": delayed,
        "pending_review_count": pending_review,
    }
