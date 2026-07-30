from fastapi import status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.domain import simulation_engine
from app.repositories.profile_repository import profile_repository
from app.repositories.simulation_repository import simulation_repository
from app.schemas.simulation import SimulationCreate, SimulationInput, SimulationResponse


class SimulationService:
    """Service layer for managing digital twin health simulations."""

    async def run_and_save_simulation(
        self, db: AsyncSession, profile_id: int, input_changes: SimulationInput
    ) -> SimulationResponse:
        profile = await profile_repository.get_by_id(db, profile_id)
        if not profile:
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

        return SimulationResponse.model_validate(simulation)

    async def get_simulation(
        self, db: AsyncSession, simulation_id: int
    ) -> SimulationResponse:
        simulation = await simulation_repository.get_by_id(db, simulation_id)
        if not simulation:
            raise AppException(
                message=f"Simulation with ID {simulation_id} not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        return SimulationResponse.model_validate(simulation)


simulation_service = SimulationService()
