import logging
from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from backend.app.schemas.request_schemas import (
    HealthDataRequest,
    ScenarioRequest,
    CoachRequest
)
from backend.app.schemas.ai_schemas import (
    HealthAnalysisResponse,
    FuturePredictionResponse,
    LifestyleRecommendationResponse,
    ScenarioExplanationResponse,
    ChatResponse
)
from backend.app.services import gemini_service

# Configure logging for the AI routes
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/ai",
    tags=["AI Module"]
)

@router.post(
    "/health-summary",
    response_model=HealthAnalysisResponse,
    summary="Generate Health Summary",
    description="Analyzes the provided contextual health data and returns a structured explanation of the user's current health status, positive habits, and improvement areas."
)
async def generate_health_summary(request: HealthDataRequest):
    """
    Endpoint to explain current health status based on backend data.
    """
    logger.info("Generating health summary.")
    try:
        response = gemini_service.analyze_health(request.health_data)
        return response
    except HTTPException as e:
        logger.error(f"HTTPException in generate_health_summary: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in generate_health_summary: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while generating health summary.")


@router.post(
    "/future-prediction",
    response_model=FuturePredictionResponse,
    summary="Predict Future Health",
    description="Predicts future health outcomes at 1 month, 6 months, and 1 year intervals based on the current lifestyle."
)
async def generate_future_prediction(request: HealthDataRequest):
    """
    Endpoint to predict and explain health trends over the next year.
    """
    logger.info("Generating future prediction.")
    try:
        response = gemini_service.predict_future(request.health_data)
        return response
    except HTTPException as e:
        logger.error(f"HTTPException in generate_future_prediction: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in generate_future_prediction: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while generating future prediction.")


@router.post(
    "/recommendations",
    response_model=LifestyleRecommendationResponse,
    summary="Get Prioritized Recommendations",
    description="Provides actionable and prioritized health recommendations with estimated impacts on the health score."
)
async def get_recommendations(request: HealthDataRequest):
    """
    Endpoint to generate prioritized health lifestyle recommendations.
    """
    logger.info("Generating lifestyle recommendations.")
    try:
        response = gemini_service.recommend_lifestyle(request.health_data)
        return response
    except HTTPException as e:
        logger.error(f"HTTPException in get_recommendations: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in get_recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while generating recommendations.")


@router.post(
    "/scenario",
    response_model=ScenarioExplanationResponse,
    summary="Simulate What-If Scenario",
    description="Explains why a simulated scenario caused specific metric changes and risk alterations."
)
async def simulate_scenario(request: ScenarioRequest):
    """
    Endpoint to explain the results of a What-If health scenario.
    """
    logger.info(f"Simulating scenario: {request.scenario}")
    try:
        response = gemini_service.explain_scenario(request.health_data, request.scenario)
        return response
    except HTTPException as e:
        logger.error(f"HTTPException in simulate_scenario: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in simulate_scenario: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while simulating scenario.")


@router.post(
    "/coach",
    response_model=ChatResponse,
    summary="Chat with Health Coach",
    description="Answers the user's questions contextually using their health profile and chat history."
)
async def chat_with_coach(request: CoachRequest):
    """
    Endpoint for natural language chat with the AI health coach.
    """
    logger.info(f"Received coach question: {request.question}")
    try:
        response = gemini_service.chat_with_ai(
            question=request.question,
            health_data=request.health_data,
            history=request.history
        )
        return response
    except HTTPException as e:
        logger.error(f"HTTPException in chat_with_coach: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in chat_with_coach: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during chat.")
