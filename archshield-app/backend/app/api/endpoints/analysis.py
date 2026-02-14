from typing import Any, List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.api import deps
from app.models import models
from app.schemas import schemas
from app.services.parser import ArchitectureParser

router = APIRouter()

@router.post("/upload/{project_id}", response_model=schemas.Analysis)
async def upload_architecture(
    *,
    db: Session = Depends(deps.get_db),
    project_id: int,
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload an architecture file and trigger analysis.
    """
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    # Read file content
    content = await file.read()
    try:
        content_str = content.decode("utf-8")
    except UnicodeDecodeError:
        try:
            content_str = content.decode("latin-1")
        except UnicodeDecodeError:
             raise HTTPException(status_code=400, detail="Could not decode file. Please use UTF-8 encoding.")
    
    # Parse the file
    parsed_data = ArchitectureParser.parse_terraform(content_str)
    recommendations = ArchitectureParser.generate_recommendations(parsed_data)
    
    # Calculate mock scores
    security_score = 100 - (len([r for r in recommendations if r["severity"] == "Critical"]) * 20)
    security_score = max(0, security_score)
    
    # Create analysis record
    analysis_obj = models.Analysis(
        project_id=project_id,
        raw_content=content_str[:1000],  # Save snippet for reference
        security_score=security_score,
        cost_estimate=150.0,  # Mock estimate
        results={
            "resources": parsed_data["resources"],
            "recommendations": recommendations,
            "summary": f"Detected {parsed_data['resource_count']} resources."
        }
    )
    
    db.add(analysis_obj)
    db.commit()
    db.refresh(analysis_obj)
    return analysis_obj

@router.get("/{project_id}/latest", response_model=schemas.Analysis)
def get_latest_analysis(
    *,
    db: Session = Depends(deps.get_db),
    project_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get the latest analysis for a project.
    """
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")
        
    analysis = db.query(models.Analysis).filter(models.Analysis.project_id == project_id).order_by(models.Analysis.created_at.desc()).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="No analysis found for this project")
    return analysis

from datetime import datetime

@router.post("/design", response_model=schemas.Analysis)
def analyze_design(
    *,
    db: Session = Depends(deps.get_db),
    design_data: schemas.DesignAnalysisCreate,
    current_user: Optional[models.User] = Depends(deps.get_current_user_optional),
) -> Any:
    """
    Analyze architecture design from the canvas tool. Supports both guests and logged-in users.
    """
    project_id = design_data.project_id
    
    # Check project permission only if project_id is provided
    if project_id:
        project = db.query(models.Project).filter(models.Project.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        if not current_user or project.owner_id != current_user.id:
            raise HTTPException(status_code=400, detail="Not enough permissions for this project")

    # Extract resources from nodes
    resources = []
    for node in design_data.nodes:
        label = node.get("data", {}).get("label", "Unknown")
        resources.append({
            "id": node.get("id"),
            "type": node.get("type", "default"),
            "name": label
        })

    # Generate mock recommendations based on labels
    recommendations = []
    has_public_id = False
    for r in resources:
        name_lower = r["name"].lower()
        if "s3" in name_lower or "storage" in name_lower:
            recommendations.append({
                "title": f"Encryption for {r['name']}",
                "description": "Ensure SSE-S3 or SSE-KMS is enabled for data at rest.",
                "severity": "Medium",
                "category": "Security"
            })
        if "internet" in name_lower:
            has_public_id = True
            
    if has_public_id:
        recommendations.append({
            "title": "Public Internet Exposure",
            "description": "Direct internet access detected. Ensure a NAT Gateway or Bastion Host is used if possible.",
            "severity": "High",
            "category": "Network"
        })

    results = {
        "resources": resources,
        "recommendations": recommendations,
        "summary": f"Analyzed {len(resources)} components from architecture designer."
    }
    raw_content = f"Design Analysis: {len(resources)} nodes, {len(design_data.edges)} edges."

    # Create analysis record only if we have a project
    if project_id:
        analysis_obj = models.Analysis(
            project_id=project_id,
            raw_content=raw_content,
            security_score=85,
            cost_estimate=200.0,
            results=results
        )
        db.add(analysis_obj)
        db.commit()
        db.refresh(analysis_obj)
        return analysis_obj
    else:
        # Return mock analysis for guests
        return {
            "id": 0,
            "project_id": 0,
            "raw_content": raw_content,
            "security_score": 85,
            "cost_estimate": 200.0,
            "results": results,
            "created_at": datetime.utcnow()
        }
