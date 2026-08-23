from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.common import APIResponse
from app.schemas.simulation import SimulationInput, SimulationResponse
from app.services.simulation_service import simulation_service

router = APIRouter(prefix="/simulation", tags=["Simulations"])


@router.post(
    "/{profile_id}",
    response_model=APIResponse[SimulationResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Run Health Twin Simulation",
    description="Simulates hypothetical lifestyle/biomarker changes for a profile and projects health score deltas.",
)
async def create_simulation(
    profile_id: int,
    input_changes: SimulationInput,
    db: AsyncSession = Depends(get_db),
):
    result = await simulation_service.run_and_save_simulation(db, profile_id, input_changes)
    return APIResponse(
        success=True,
        data=result,
        message="Digital twin simulation executed successfully.",
    )


@router.get(
    "/{simulation_id}",
    response_model=APIResponse[SimulationResponse],
    status_code=status.HTTP_200_OK,
    summary="Get Simulation Result",
    description="Retrieves projected health score simulation scenario by simulation ID.",
)
async def get_simulation(
    simulation_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await simulation_service.get_simulation(db, simulation_id)
    return APIResponse(
        success=True,
        data=result,
        message="Simulation result retrieved successfully.",
    )
