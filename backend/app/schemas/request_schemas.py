from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

class HealthDataRequest(BaseModel):
    health_data: Dict[str, Any] = Field(
        ..., 
        description="Contextual health data including profile and backend-calculated scores."
    )

class ScenarioRequest(BaseModel):
    health_data: Dict[str, Any] = Field(..., description="Contextual health data.")
    scenario: str = Field(..., description="The what-if scenario to simulate.")

class CoachRequest(BaseModel):
    health_data: Dict[str, Any] = Field(..., description="Contextual health data.")
    question: str = Field(..., description="The user's question.")
    history: Optional[List[Dict[str, Any]]] = Field(
        default=None, 
        description="Previous conversation history for context."
    )
