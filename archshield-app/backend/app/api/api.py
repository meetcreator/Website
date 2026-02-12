from fastapi import APIRouter
from app.api.endpoints import login, projects, analysis

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
