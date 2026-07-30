from pydantic import BaseModel, Field
from typing import List

class HealthAnalysisResponse(BaseModel):
    summary: str = Field(description="A brief summary explaining the user's current health status.")
    key_insights: List[str] = Field(description="Key insights on strongest positive habits and biggest improvement areas.")
    score_explanation: str = Field(description="Explanation of why their current health score is what it is.")
    recommendations: List[str] = Field(description="Prioritized recommendations based on the analysis.")
    disclaimer: str = Field(description="Educational disclaimer that this is a simulator and not medical advice.")

class FuturePredictionResponse(BaseModel):
    summary: str = Field(description="Summary of the expected health trends over the next year.")
    today_projection: str = Field(description="Expected trends, improvements, and risks for today.")
    one_month_projection: str = Field(description="Expected trends, improvements, and risks at 1 month.")
    six_months_projection: str = Field(description="Expected trends, improvements, and risks at 6 months.")
    one_year_projection: str = Field(description="Expected trends, improvements, and risks at 1 year.")
    key_insights: List[str] = Field(description="Key insights on the overall trajectory.")
    recommendations: List[str] = Field(description="Recommendations to improve this trajectory.")
    disclaimer: str = Field(description="Educational disclaimer noting uncertainty and not guaranteeing outcomes.")

class LifestyleRecommendationResponse(BaseModel):
    summary: str = Field(description="Summary of the recommended lifestyle changes.")
    prioritized_recommendations: List[str] = Field(description="List of specific, prioritized recommendations (e.g., 'Priority 1: Improve sleep. Expected Impact: High').")
    key_insights: List[str] = Field(description="Key insights on why these recommendations matter.")
    disclaimer: str = Field(description="Educational disclaimer.")

class ScenarioExplanationResponse(BaseModel):
    summary: str = Field(description="Summary of the scenario's impact.")
    score_change_explanation: str = Field(description="Why the health score changed in this scenario.")
    metrics_improved: List[str] = Field(description="Specific metrics that improved.")
    risks_altered: List[str] = Field(description="Risks that increased or decreased.")
    next_best_action: str = Field(description="The next best action for the user to take.")
    key_insights: List[str] = Field(description="Key insights from this scenario.")
    recommendations: List[str] = Field(description="General recommendations derived from the scenario.")
    disclaimer: str = Field(description="Educational disclaimer.")

class ChatResponse(BaseModel):
    answer: str = Field(description="The natural, contextual answer to the user's question.")
    summary: str = Field(description="A very brief summary of the answer.")
    key_insights: List[str] = Field(description="Key insights related to the answer.")
    recommendations: List[str] = Field(description="Any recommendations related to the user's question.")
    disclaimer: str = Field(description="Educational disclaimer.")
