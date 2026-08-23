from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.simulation import Simulation
from app.schemas.simulation import SimulationCreate


class SimulationRepository:
    """Repository handling database operations for Simulations."""

    async def create(self, db: AsyncSession, simulation_in: SimulationCreate) -> Simulation:
        simulation = Simulation(**simulation_in.model_dump())
        db.add(simulation)
        await db.flush()
        return simulation

    async def get_by_id(self, db: AsyncSession, simulation_id: int) -> Optional[Simulation]:
        result = await db.execute(select(Simulation).where(Simulation.id == simulation_id))
        return result.scalar_one_or_none()

    async def get_all_by_profile_id(
        self, db: AsyncSession, profile_id: int
    ) -> Sequence[Simulation]:
        result = await db.execute(
            select(Simulation)
            .where(Simulation.profile_id == profile_id)
            .order_by(Simulation.created_at.desc())
        )
        return result.scalars().all()


simulation_repository = SimulationRepository()
