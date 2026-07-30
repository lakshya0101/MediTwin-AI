from fastapi import APIRouter

from app.api.v1.endpoints import health

api_v1_router = APIRouter()

# Include feature endpoints for v1 API
api_v1_router.include_router(health.router, tags=["Health Check"])
