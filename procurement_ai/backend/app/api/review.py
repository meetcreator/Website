# file: backend/app/api/review.py
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import ActiveJob, HITLDraft, ProcurementItem, ProcurementTask, ProcurementWorkflow, Vendor
from app.services.hitl_service import hitl_service

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
