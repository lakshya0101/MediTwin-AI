from fastapi import status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.repositories.profile_repository import profile_repository
from app.schemas.profile import ProfileCreate, ProfileResponse, ProfileUpdate


class ProfileService:
    """Service layer for Profile operations."""

    async def create_profile(
        self, db: AsyncSession, profile_in: ProfileCreate
    ) -> ProfileResponse:
        profile = await profile_repository.create(db, profile_in)
        await db.commit()
        await db.refresh(profile)
        return ProfileResponse.model_validate(profile)

    async def get_profile(self, db: AsyncSession, profile_id: int) -> ProfileResponse:
        profile = await profile_repository.get_by_id(db, profile_id)
        if not profile:
            raise AppException(
                message=f"Profile with ID {profile_id} not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        return ProfileResponse.model_validate(profile)

    async def update_profile(
        self, db: AsyncSession, profile_id: int, profile_in: ProfileUpdate
    ) -> ProfileResponse:
        profile = await profile_repository.get_by_id(db, profile_id)
        if not profile:
            raise AppException(
                message=f"Profile with ID {profile_id} not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        updated_profile = await profile_repository.update(db, profile, profile_in)
        await db.commit()
        await db.refresh(updated_profile)
        return ProfileResponse.model_validate(updated_profile)

    async def delete_profile(self, db: AsyncSession, profile_id: int) -> None:
        profile = await profile_repository.get_by_id(db, profile_id)
        if not profile:
            raise AppException(
                message=f"Profile with ID {profile_id} not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        await profile_repository.delete(db, profile)
        await db.commit()


profile_service = ProfileService()
