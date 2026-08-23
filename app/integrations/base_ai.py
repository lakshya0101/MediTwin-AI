from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseAIProvider(ABC):
    """Abstract Base Class for AI/LLM Integration Providers."""

    @abstractmethod
    async def generate_health_insights(
        self, profile_data: Dict[str, Any], health_assessment: Dict[str, Any]
    ) -> str:
        """Generates clinical health insights and personalized lifestyle recommendations."""
        pass

    @abstractmethod
    async def generate_simulation_feedback(
        self, baseline: Dict[str, Any], simulation_result: Dict[str, Any]
    ) -> str:
        """Generates qualitative feedback on a projected health simulation scenario."""
        pass
