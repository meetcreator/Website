from pydantic import BaseModel
from typing import Dict, List, Any, Optional

class FileUploadResponse(BaseModel):
    status: str
    filename: str
    rows: int
    columns: int
    message: str

class ProfileResponse(BaseModel):
    status: str
    rows: int
    columns: int
    missing_values: int
    missing_percentage: float
    file_size_kb: float
    column_names: List[str]
    column_types: Dict[str, str]
    shape: List[int]
    memory_usage_kb: float
    statistics: Dict[str, Any]
    missing_per_column: Dict[str, int]

class ChartDataResponse(BaseModel):
    status: str
    chart_type: str
    data: Dict[str, Any]

class CorrelationResponse(BaseModel):
    status: str
    correlation: Dict[str, Any]

class DescriptiveStatsResponse(BaseModel):
    status: str
    column: str
    statistics: Dict[str, Any]

class DataResponse(BaseModel):
    status: str
    data: List[Dict[str, Any]]
    total_rows: int
    current_page: int
    per_page: int
    total_pages: int

class CleanDataRequest(BaseModel):
    action: str
    column: Optional[str] = None

class CleanDataResponse(BaseModel):
    status: str
    action: str
    message: str
    profile: Dict[str, Any]
