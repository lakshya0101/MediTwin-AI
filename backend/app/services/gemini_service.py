import os
import json
from google import genai
from google.genai import types
from fastapi import HTTPException
from pydantic import ValidationError

from backend.app.prompts.health_summary import HEALTH_SUMMARY_PROMPT
from backend.app.prompts.future_prediction import FUTURE_PREDICTION_PROMPT
from backend.app.prompts.recommendations import RECOMMENDATIONS_PROMPT
from backend.app.prompts.scenario import SCENARIO_PROMPT
from backend.app.prompts.coach import COACH_PROMPT

from backend.app.schemas.ai_schemas import (
    HealthAnalysisResponse,
    FuturePredictionResponse,
    LifestyleRecommendationResponse,
    ScenarioExplanationResponse,
    ChatResponse,
)

# Initialize the Gemini client
try:
    client = genai.Client()
except Exception as e:
    client = None
    print(f"Warning: Failed to initialize Gemini client. Make sure GEMINI_API_KEY is set. Error: {e}")

DEFAULT_MODEL = "gemini-3.5-flash-lite"

def _generate_structured_content(prompt: str, schema_class) -> dict:
    """
    Helper function to call Gemini and return a validated Pydantic model dumped to a dict.
    Includes proper error handling.
    """
    if not client:
        raise HTTPException(status_code=500, detail="Gemini client is not initialized. Check API key.")
        
    try:
        response = client.models.generate_content(
            model=DEFAULT_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=schema_class,
                temperature=0.7,
            ),
        )
        parsed_data = schema_class.model_validate_json(response.text)
        return parsed_data.model_dump()
        
    except ValidationError as ve:
        raise HTTPException(status_code=502, detail=f"Invalid response format from AI: {ve}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with AI service: {e}")


def analyze_health(health_data: dict) -> dict:
    """
    Explain the user's health status and backend-calculated scores.
    """
    prompt = HEALTH_SUMMARY_PROMPT.format(context_data=json.dumps(health_data, indent=2))
    return _generate_structured_content(prompt, HealthAnalysisResponse)


def predict_future(health_data: dict) -> dict:
    """
    Predict future health outcomes over the next year.
    """
    prompt = FUTURE_PREDICTION_PROMPT.format(context_data=json.dumps(health_data, indent=2))
    return _generate_structured_content(prompt, FuturePredictionResponse)


def recommend_lifestyle(health_data: dict) -> dict:
    """
    Provide prioritized lifestyle recommendations with estimated impacts.
    """
    prompt = RECOMMENDATIONS_PROMPT.format(context_data=json.dumps(health_data, indent=2))
    return _generate_structured_content(prompt, LifestyleRecommendationResponse)


def explain_scenario(health_data: dict, scenario: str) -> dict:
    """
    Simulate a 'What-If' scenario based on the health profile.
    """
    prompt = SCENARIO_PROMPT.format(
        context_data=json.dumps(health_data, indent=2),
        scenario=scenario
    )
    return _generate_structured_content(prompt, ScenarioExplanationResponse)


def chat_with_ai(question: str, health_data: dict, history: list = None) -> dict:
    """
    Answer a user question contextually based on their health profile and history.
    """
    history_str = json.dumps(history, indent=2) if history else "No previous history."
    prompt = COACH_PROMPT.format(
        context_data=json.dumps(health_data, indent=2),
        history=history_str,
        question=question
    )
    return _generate_structured_content(prompt, ChatResponse)
