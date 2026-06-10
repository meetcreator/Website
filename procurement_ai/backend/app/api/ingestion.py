# file: backend/app/api/ingestion.py
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Header
import pandas as pd
import io
from datetime import date
from decimal import Decimal, InvalidOperation
from typing import Any
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Organization, ProcurementItem, ProcurementTask, ProcurementWorkflow, Vendor, WorkflowEvent
from app.services.state_machine import WorkflowState, state_machine
from app.services.worker import worker_queue
from app.services.subscription import check_limit

router = APIRouter()

def clean_phone(phone_str: Any) -> str:
    """Standardizes phone numbers to Indian country code format (+91...)."""
    if pd.isna(phone_str):
        return ""
    # Convert numerical strings
    val = str(phone_str).strip().replace(".0", "")
    val = "".join([c for c in val if c.isdigit() or c == "+"])
    
    if not val.startswith("+"):
        if val.startswith("91") and len(val) == 12:
            val = "+" + val
        elif len(val) == 10:
            val = "+91" + val
    return val

def safe_decimal(value: Any, default: str = "0") -> Decimal:
    if value is None or pd.isna(value):
        return Decimal(default)
    try:
        return Decimal(str(value).replace(",", "").strip())
    except (InvalidOperation, ValueError):
        return Decimal(default)

def safe_text(value: Any, default: str = "") -> str:
    if value is None or pd.isna(value):
        return default
    return str(value).strip()

@router.post("/excel")
async def ingest_excel_po(
    file: UploadFile = File(...),
    x_org_id: str = Header("c12e8790-2b1b-4b1f-9988-f58c49e7b233"),
    db: Session = Depends(get_db)
):
    """
    Accepts Tally exported excel/csv. Maps columns and registers POs inside the system.
    Matches dynamic structures representing PO Number, Vendor Name, Contact Phone, and Line items.
    """
    filename = file.filename.lower()
    contents = await file.read()
    
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        elif filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file format. Please upload a standard CSV or Excel file."
            )
            
        # Standardize columns to lowercase, strip whitespaces
        df.columns = [str(c).strip().lower() for c in df.columns]
        
        # Verify required structural components
        # We need PO number, Vendor Name, and Vendor Phone to initiate WhatsApp tracking
        required_mappings = {
            "po_number": ["po number", "po_number", "order no", "purchase order", "voucher number", "po no"],
            "vendor_name": ["vendor name", "vendor", "party name", "party", "supplier"],
            "vendor_phone": ["phone", "phone number", "mobile", "contact", "whatsapp no", "whatsapp"],
        }
        
        found_mappings = {}
        for key, alternatives in required_mappings.items():
            for alt in alternatives:
                if alt in df.columns:
                    found_mappings[key] = alt
                    break
                    
        # Fallback if mapping fails
        if len(found_mappings) < 3:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Unable to auto-detect essential columns. Required columns: PO Number, Vendor Name, and Vendor Phone/WhatsApp. Found: {list(found_mappings.keys())} in columns: {list(df.columns)}"
            )
            
        import_logs = []
        registered_count = 0
        skipped_count = 0

        organization = db.get(Organization, x_org_id)
        if organization is None:
            organization = Organization(id=x_org_id, name=f"Organization {x_org_id}")
            db.add(organization)
            db.flush()
        
        # Group entries by PO Number to construct tasks and attach multiple line items
        po_col = found_mappings["po_number"]
        grouped_pos = df.groupby(po_col)
        
        for po_num, group in grouped_pos:
            po_number = safe_text(po_num)
            if not po_number:
                skipped_count += 1
                import_logs.append({
                    "po_number": "",
                    "status": "skipped",
                    "reason": "Missing PO number"
                })
                continue

            first_row = group.iloc[0]
            vendor_name = safe_text(first_row.get(found_mappings["vendor_name"]), "Unknown Vendor")
            vendor_phone = clean_phone(first_row.get(found_mappings["vendor_phone"], ""))
            
            if not vendor_phone:
                skipped_count += 1
                import_logs.append({
                    "po_number": str(po_num),
                    "status": "skipped",
                    "reason": "Missing vendor contact number to initiate WhatsApp"
                })
                continue
                
            # Construct items
            items_list = []
            total_po_amount = Decimal("0")
            
            # Map items details inside this PO group
            item_desc_cols = ["item", "item description", "description", "particulars", "item name"]
            qty_cols = ["qty", "quantity", "quantity ordered"]
            rate_cols = ["rate", "price", "unit price"]
            amt_cols = ["amount", "total", "value"]
            
            item_col = next((c for c in item_desc_cols if c in df.columns), None)
            qty_col = next((c for c in qty_cols if c in df.columns), None)
            rate_col = next((c for c in rate_cols if c in df.columns), None)
            amt_col = next((c for c in amt_cols if c in df.columns), None)
            
            for idx, row in group.iterrows():
                desc = safe_text(row.get(item_col), "Industrial Consumables") if item_col else "Industrial Consumables"
                qty = safe_decimal(row.get(qty_col), "1") if qty_col else Decimal("1")
                rate = safe_decimal(row.get(rate_col), "0") if rate_col else Decimal("0")
                amt = safe_decimal(row.get(amt_col), str(qty * rate)) if amt_col else qty * rate
                
                total_po_amount += amt
                items_list.append({
                    "description": desc,
                    "quantity": qty,
                    "rate": rate,
                    "amount": amt
                })

            vendor = db.query(Vendor).filter(
                Vendor.organization_id == x_org_id,
                Vendor.phone_number == vendor_phone
            ).first()
            if vendor is None:
                vendor = Vendor(
                    organization_id=x_org_id,
                    name=vendor_name,
                    phone_number=vendor_phone
                )
                db.add(vendor)
            else:
                vendor.name = vendor_name
            db.flush()

            workflow = db.query(ProcurementWorkflow).filter(
                ProcurementWorkflow.organization_id == x_org_id,
                ProcurementWorkflow.po_number == po_number
            ).first()
            workflow_created = False
            if workflow is None:
                workflow = ProcurementWorkflow(
                    organization_id=x_org_id,
                    po_number=po_number
                )
                db.add(workflow)
                db.flush()
                workflow_created = True

            task = db.query(ProcurementTask).filter(
                ProcurementTask.organization_id == x_org_id,
                ProcurementTask.po_number == po_number
            ).first()
            task_created = False
            if task is None:
                task = ProcurementTask(
                    organization_id=x_org_id,
                    workflow_id=workflow.id,
                    vendor_id=vendor.id,
                    po_number=po_number,
                    po_date=date.today()
                )
                db.add(task)
                db.flush()
                task_created = True
            else:
                task.workflow_id = workflow.id
                task.vendor_id = vendor.id

            task.total_amount = total_po_amount
            task.status = workflow.current_state
            db.query(ProcurementItem).filter(ProcurementItem.task_id == task.id).delete()
            for item in items_list:
                db.add(ProcurementItem(
                    task_id=task.id,
                    description=item["description"],
                    quantity=item["quantity"],
                    unit_price=item["rate"],
                    amount=item["amount"]
                ))

            db.add(WorkflowEvent(
                organization_id=x_org_id,
                workflow_id=workflow.id,
                event_type="PO_INGESTED" if workflow_created else "PO_REINGESTED",
                payload={
                    "po_number": po_number,
                    "vendor_id": vendor.id,
                    "task_id": task.id,
                    "task_created": task_created,
                    "line_items_count": len(items_list),
                    "total_amount": float(total_po_amount),
                    "source_filename": filename,
                }
            ))
            worker_queue.enqueue_job(
                task_name="dispatch_whatsapp_outbox",
                payload={
                    "workflow_id": workflow.id,
                    "task_id": task.id,
                    "vendor_id": vendor.id,
                    "phone_number": vendor_phone,
                    "message_text": f"Hello {vendor_name}, please confirm receipt of Purchase Order {po_number} and share ETA."
                },
                db=db
            )
            if workflow.current_state == WorkflowState.CREATED.value:
                state_machine.transition_workflow(
                    db=db,
                    workflow_id=workflow.id,
                    target_state=WorkflowState.VENDOR_PENDING,
                    organization_id=x_org_id,
                    reason="PO ingested and vendor confirmation job queued."
                )
                
            registered_count += 1
            import_logs.append({
                "po_number": po_number,
                "status": "imported",
                "vendor": vendor_name,
                "phone": vendor_phone,
                "total_amount": float(total_po_amount),
                "line_items_count": len(items_list)
            })

        # Track usage: count new POs imported this session
        if registered_count > 0:
            check_limit(db, x_org_id, "po_uploads", increment=registered_count)

        return {
            "success": True,
            "organization_id": x_org_id,
            "summary": {
                "total_rows_processed": len(df),
                "imported_purchase_orders": registered_count,
                "skipped_purchase_orders": skipped_count
            },
            "logs": import_logs
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal parser failure: {str(e)}"
        )
