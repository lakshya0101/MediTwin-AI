import logging
import time
from typing import Optional
from fastapi import status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.domain import simulation_engine
from app.integrations.base_ai import BaseAIProvider
from app.repositories.profile_repository import profile_repository
from app.repositories.simulation_repository import simulation_repository
from app.schemas.simulation import SimulationCreate, SimulationInput, SimulationResponse

logger = logging.getLogger("meditwin.simulation_service")


class SimulationService:
    """Service layer for managing digital twin health simulations with optional AI hook integration."""

    def __init__(self, ai_provider: Optional[BaseAIProvider] = None) -> None:
        self.ai_provider = ai_provider

    async def run_and_save_simulation(
        self, db: AsyncSession, profile_id: int, input_changes: SimulationInput
    ) -> SimulationResponse:
        start_time = time.perf_counter()
        logger.info(f"Initiating digital twin simulation for Profile ID: {profile_id}")

        profile = await profile_repository.get_by_id(db, profile_id)
        if not profile:
            logger.warning(f"Simulation aborted. Profile ID {profile_id} not found.")
            raise AppException(
                message=f"Profile with ID {profile_id} not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        baseline_dict = {
            "height_cm": profile.height_cm,
            "weight_kg": profile.weight_kg,
            "systolic_bp": profile.systolic_bp,
            "diastolic_bp": profile.diastolic_bp,
            "fasting_glucose": profile.fasting_glucose,
            "total_cholesterol": profile.total_cholesterol,
            "hdl_cholesterol": profile.hdl_cholesterol,
            "ldl_cholesterol": profile.ldl_cholesterol,
            "biological_sex": profile.biological_sex,
            "exercise_hours_per_week": profile.exercise_hours_per_week,
            "sleep_hours_per_night": profile.sleep_hours_per_night,
            "stress_level": profile.stress_level,
            "smoking_status": profile.smoking_status,
            "alcohol_drinks_per_week": profile.alcohol_drinks_per_week,
            "water_intake_liters": profile.water_intake_liters,
        }

        changes_dict = input_changes.model_dump(exclude_unset=True)

        if not changes_dict:
            raise AppException(
                message="At least one hypothetical parameter change must be provided for simulation.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        projected_result = simulation_engine.run_simulation(baseline_dict, changes_dict)

        sim_create = SimulationCreate(
            profile_id=profile_id,
            input_changes=changes_dict,
            projected_score=projected_result,
        )

        simulation = await simulation_repository.create(db, sim_create)
        await db.commit()
        await db.refresh(simulation)

        duration_ms = (time.perf_counter() - start_time) * 1000.0
        logger.info(
            f"Simulation execution complete for Profile ID: {profile_id} | "
            f"Projected Score Delta: {projected_result['overall_score_delta']} | Duration: {duration_ms:.2f}ms"
        )

        # AI Extension Hook
        await self.trigger_ai_feedback_hook(baseline_dict, projected_result)

        return SimulationResponse.model_validate(simulation)

    async def get_simulation(
        self, db: AsyncSession, simulation_id: int
    ) -> SimulationResponse:
        logger.info(f"Fetching simulation result ID: {simulation_id}")
        simulation = await simulation_repository.get_by_id(db, simulation_id)
        if not simulation:
            raise AppException(
                message=f"Simulation with ID {simulation_id} not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        return SimulationResponse.model_validate(simulation)

    async def trigger_ai_feedback_hook(
        self, baseline: dict, simulation_result: dict
    ) -> Optional[str]:
        """Extension point hook for invoking AI provider qualitative simulation feedback asynchronously."""
        if not self.ai_provider:
            return None
        try:
            logger.info("Executing AI simulation feedback hook...")
            return await self.ai_provider.generate_simulation_feedback(baseline, simulation_result)
        except NotImplementedError:
            logger.debug("AI Provider method not implemented yet (Phase 2). Skipping AI hook.")
            return None
        except Exception as e:
            logger.error(f"Error in AI simulation feedback hook: {str(e)}", exc_info=True)
            return None


simulation_service = SimulationService()
