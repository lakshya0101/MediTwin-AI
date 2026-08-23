from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
import logging

from app.core.database import get_db
from app.schemas.common import APIResponse
from app.schemas.score import DetailedScoreResponse
from app.services.score_service import score_service
from app.services.gemini_service import gemini_service

logger = logging.getLogger("meditwin.ai")

router = APIRouter(prefix="/ai", tags=["AI Intelligence"])


@router.post(
    "/health-summary/{profile_id}",
    status_code=status.HTTP_200_OK,
    summary="Generate AI Health Summary",
    description="Uses Gemini to generate a personalized health summary for a profile based on computed scores.",
)
async def generate_health_summary(
    profile_id: int,
    db: AsyncSession = Depends(get_db),
):
    logger.info(f"Generating AI health summary for profile {profile_id}")
    score = await score_service.get_latest_score(db, profile_id)
    result = await gemini_service.get_health_summary(score)
    return APIResponse(success=True, data=result, message="Health summary generated.")


@router.post(
    "/future-prediction/{profile_id}",
    status_code=status.HTTP_200_OK,
    summary="Generate AI Future Prediction",
    description="Projects health trajectory at 1 month, 6 months, and 1 year using Gemini.",
)
async def generate_future_prediction(
    profile_id: int,
    db: AsyncSession = Depends(get_db),
):
    logger.info(f"Generating future prediction for profile {profile_id}")
    score = await score_service.get_latest_score(db, profile_id)
    result = await gemini_service.get_future_prediction(score)
    return APIResponse(success=True, data=result, message="Future prediction generated.")


@router.post(
    "/recommendations/{profile_id}",
    status_code=status.HTTP_200_OK,
    summary="Generate AI Recommendations",
    description="Generates prioritized lifestyle recommendations (High/Medium/Low impact) using Gemini.",
)
async def generate_recommendations(
    profile_id: int,
    db: AsyncSession = Depends(get_db),
):
    logger.info(f"Generating recommendations for profile {profile_id}")
    score = await score_service.get_latest_score(db, profile_id)
    result = await gemini_service.get_recommendations(score)
    return APIResponse(success=True, data=result, message="Recommendations generated.")


@router.post(
    "/scenario/{profile_id}",
    status_code=status.HTTP_200_OK,
    summary="Simulate AI Scenario",
    description="Explains the projected health impact of a lifestyle scenario using Gemini.",
)
async def simulate_scenario(
    profile_id: int,
    scenario: str,
    db: AsyncSession = Depends(get_db),
):
    logger.info(f"Simulating scenario for profile {profile_id}: {scenario}")
    score = await score_service.get_latest_score(db, profile_id)
    result = await gemini_service.get_scenario_explanation(score, scenario)
    return APIResponse(success=True, data=result, message="Scenario simulated.")


@router.post(
    "/coach/{profile_id}",
    status_code=status.HTTP_200_OK,
    summary="AI Health Coach",
    description="Conversational AI health coach that answers questions using the profile context.",
)
async def ask_coach(
    profile_id: int,
    question: str,
    db: AsyncSession = Depends(get_db),
):
    logger.info(f"Health coach question for profile {profile_id}: {question}")
    score = await score_service.get_latest_score(db, profile_id)
    result = await gemini_service.ask_coach(score, question)
    return APIResponse(success=True, data=result, message="Coach response generated.")
