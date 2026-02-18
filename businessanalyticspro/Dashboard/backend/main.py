from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
import os
import json
from config import UPLOAD_DIR, ALLOWED_EXTENSIONS
from data_services import (
    profile_dataframe, 
    get_chart_data, 
    get_correlation_matrix,
    clean_dataframe,
    get_column_statistics,
    get_descriptive_stats
)
from schemas import FileUploadResponse, ProfileResponse, ChartDataResponse
from business_manager import data_manager


# Ensure upload directory exists
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app = FastAPI(title="TINMCO Business API", version="1.0.0")

# Configure CORS - Note: allow_credentials=True cannot be used with allow_origins=["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(UPLOAD_DIR, exist_ok=True)

# Global state
DATAFRAME = None
ORIGINAL_DATAFRAME = None
CURRENT_FILE_NAME = None

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to TINMCO Business API", "docs": "/docs"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "API is running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload and parse CSV, XLS, or XLSX file"""
    global DATAFRAME, ORIGINAL_DATAFRAME, CURRENT_FILE_NAME
    
    # Validate file type
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"File type {file_ext} not allowed. Allowed types: {ALLOWED_EXTENSIONS}"
        )
    
    try:
        # Save file
        path = os.path.join(UPLOAD_DIR, file.filename)
        with open(path, "wb") as f:
            f.write(await file.read())
        
        # Parse file
        if file_ext == ".csv":
            DATAFRAME = pd.read_csv(path)
        else:
            DATAFRAME = pd.read_excel(path)
        
        # Store original for reference
        ORIGINAL_DATAFRAME = DATAFRAME.copy()
        CURRENT_FILE_NAME = file.filename
        
        return {
            "status": "success",
            "filename": file.filename,
            "rows": len(DATAFRAME),
            "columns": len(DATAFRAME.columns),
            "message": "File uploaded and processed successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/profile")
async def get_profile_data():
    """Get comprehensive data profile"""
    global DATAFRAME
    
    if DATAFRAME is None:
        raise HTTPException(status_code=400, detail="No file uploaded yet")
    
    try:
        df = DATAFRAME
        total_cells = len(df) * len(df.columns)
        missing_cells = int(df.isnull().sum().sum())
        
        # Get file size
        file_size_kb = 0
        if CURRENT_FILE_NAME:
            file_path = os.path.join(UPLOAD_DIR, CURRENT_FILE_NAME)
            if os.path.exists(file_path):
                file_size_kb = round(os.path.getsize(file_path) / 1024, 2)
        
        return {
            "status": "success",
            "rows": len(df),
            "columns": len(df.columns),
            "missing_values": missing_cells,
            "missing_percentage": round((missing_cells / total_cells * 100) if total_cells > 0 else 0, 2),
            "file_size_kb": file_size_kb,
            "column_names": df.columns.tolist(),
            "column_types": df.dtypes.astype(str).to_dict(),
            "shape": list(df.shape),
            "memory_usage_kb": round(df.memory_usage(deep=True).sum() / 1024, 2),
            "statistics": profile_dataframe(df),
            "missing_per_column": df.isnull().sum().to_dict()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/data")
async def get_data(page: int = 1, per_page: int = 25):
    """Get paginated data"""
    global DATAFRAME
    
    if DATAFRAME is None:
        raise HTTPException(status_code=400, detail="No file uploaded yet")
    
    try:
        start = (page - 1) * per_page
        end = start + per_page
        
        df_page = DATAFRAME.iloc[start:end]
        
        return {
            "status": "success",
            "data": df_page.to_dict(orient="records"),
            "total_rows": len(DATAFRAME),
            "current_page": page,
            "per_page": per_page,
            "total_pages": (len(DATAFRAME) + per_page - 1) // per_page
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/chart-data")
async def get_chart_data_endpoint(chart_type: str, column: str = None, source: str = "upload"):
    """Get data for different chart types"""
    global DATAFRAME
    
    df_to_use = None
    
    if source == "upload":
        if DATAFRAME is None:
            raise HTTPException(status_code=400, detail="No file uploaded yet")
        df_to_use = DATAFRAME
    elif source in ["goods", "vendors", "employees"]:
        # Load business data as DataFrame
        items = data_manager.get_all(source)
        if not items:
             raise HTTPException(status_code=400, detail=f"No data found for {source}")
        df_to_use = pd.DataFrame(items)
    else:
        raise HTTPException(status_code=400, detail="Invalid data source")
    
    try:
        data = get_chart_data(df_to_use, chart_type, column)
        return {
            "status": "success",
            "chart_type": chart_type,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/correlation")
async def get_correlation():
    """Get correlation matrix for numeric columns"""
    global DATAFRAME
    
    if DATAFRAME is None:
        raise HTTPException(status_code=400, detail="No file uploaded yet")
    
    try:
        correlation = get_correlation_matrix(DATAFRAME)
        return {
            "status": "success",
            "correlation": correlation
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/descriptive-stats")
async def get_descriptive_stats_endpoint(column: str):
    """Get detailed statistics for a specific column"""
    global DATAFRAME
    
    if DATAFRAME is None:
        raise HTTPException(status_code=400, detail="No file uploaded yet")
    
    try:
        stats = get_descriptive_stats(DATAFRAME, column)
        return {
            "status": "success",
            "column": column,
            "statistics": stats
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/clean-data")
async def clean_data(action: str, column: str = None):
    """Apply data cleaning operations"""
    global DATAFRAME
    
    if DATAFRAME is None:
        raise HTTPException(status_code=400, detail="No file uploaded yet")
    
    try:
        DATAFRAME = clean_dataframe(DATAFRAME.copy(), action, column)
        
        profile = await get_profile_data()
        return {
            "status": "success",
            "action": action,
            "message": f"Data cleaning action '{action}' applied successfully",
            "profile": profile
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/reset-data")
async def reset_data():
    """Reset to original data"""
    global DATAFRAME, ORIGINAL_DATAFRAME
    
    if ORIGINAL_DATAFRAME is None:
        raise HTTPException(status_code=400, detail="No original data to reset to")
    
    DATAFRAME = ORIGINAL_DATAFRAME.copy()
    
    return {
        "status": "success",
        "message": "Data reset to original state"
    }

@app.get("/export-csv")
async def export_csv():
    """Export current dataframe as CSV"""
    global DATAFRAME
    
    if DATAFRAME is None:
        raise HTTPException(status_code=400, detail="No file uploaded yet")
    
    try:
        csv_path = os.path.join(UPLOAD_DIR, "export.csv")
        DATAFRAME.to_csv(csv_path, index=False)
        
        return {
            "status": "success",
            "message": "Data exported successfully",
            "file": "export.csv"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/business/stats")
async def get_business_stats():
    """Get statistics for business entities"""
    return data_manager.get_stats()

@app.get("/business/{category}")
async def get_business_items(category: str):
    """Get all items for a category (goods, vendors, employees)"""
    if category not in ["goods", "vendors", "employees"]:
        raise HTTPException(status_code=400, detail="Invalid category")
    return data_manager.get_all(category)

@app.post("/business/{category}")
async def add_business_item(category: str, item: dict):
    """Add a new item to a category"""
    if category not in ["goods", "vendors", "employees"]:
        raise HTTPException(status_code=400, detail="Invalid category")
    try:
        return data_manager.add_record(category, item)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/business/{category}/{id_column}/{id_value}")
async def delete_business_item(category: str, id_column: str, id_value: str):
    """Delete an item"""
    if category not in ["goods", "vendors", "employees"]:
        raise HTTPException(status_code=400, detail="Invalid category")
        
    success = data_manager.delete_record(category, id_column, id_value)
    if success:
        return {"status": "success", "message": "Record deleted"}
    else:
        raise HTTPException(status_code=404, detail="Record not found or failed to delete")

if __name__ == "__main__":

    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
