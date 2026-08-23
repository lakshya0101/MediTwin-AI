from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profile import Profile
from app.schemas.profile import ProfileCreate, ProfileUpdate


class ProfileRepository:
    """Repository handling database operations for Profiles."""

    async def create(self, db: AsyncSession, profile_in: ProfileCreate) -> Profile:
        profile = Profile(**profile_in.model_dump())
        db.add(profile)
        await db.flush()
        return profile

    async def get_by_id(self, db: AsyncSession, profile_id: int) -> Optional[Profile]:
        result = await db.execute(select(Profile).where(Profile.id == profile_id))
        return result.scalar_one_or_none()

    async def update(
        self, db: AsyncSession, profile: Profile, update_in: ProfileUpdate
    ) -> Profile:
        update_data = update_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(profile, field, value)
        await db.flush()
        return profile

    async def delete(self, db: AsyncSession, profile: Profile) -> None:
        await db.delete(profile)
        await db.flush()


profile_repository = ProfileRepository()
