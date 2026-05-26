from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = True

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: Optional[int] = None
    plan_type: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Additional properties to return via API
class User(UserInDBBase):
    pass

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None

# Project schemas
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    cloud_provider: str

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    name: Optional[str] = None
    cloud_provider: Optional[str] = None

class ProjectInDBBase(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class Project(ProjectInDBBase):
    pass

# Analysis schemas
class AnalysisBase(BaseModel):
    security_score: Optional[int] = None
    cost_estimate: Optional[float] = None
    results: Optional[Dict[str, Any]] = None

class AnalysisCreate(AnalysisBase):
    project_id: int
    raw_content: str

class AnalysisInDBBase(AnalysisBase):
    id: int
    project_id: int
    raw_content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Analysis(AnalysisInDBBase):
    pass

class DesignAnalysisCreate(BaseModel):
    project_id: Optional[int] = None
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
