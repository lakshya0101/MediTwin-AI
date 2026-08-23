from fastapi import APIRouter

from app.api.v1.endpoints import health, profile, score, simulation, ai

api_v1_router = APIRouter()

# Include endpoint routers
api_v1_router.include_router(health.router, tags=["Health Check"])
api_v1_router.include_router(profile.router)
api_v1_router.include_router(score.router)
api_v1_router.include_router(simulation.router)
api_v1_router.include_router(ai.router)

