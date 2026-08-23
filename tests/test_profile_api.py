import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_profile_crud_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        # 1. Create Profile
        payload = {
            "full_name": "API Test User",
            "age": 40,
            "biological_sex": "male",
            "height_cm": 178.0,
            "weight_kg": 82.0,
            "systolic_bp": 125,
            "diastolic_bp": 82,
            "fasting_glucose": 105.0,
            "total_cholesterol": 210.0,
            "hdl_cholesterol": 45.0,
            "ldl_cholesterol": 135.0,
            "exercise_hours_per_week": 2.0,
            "sleep_hours_per_night": 6.5,
            "stress_level": 6,
            "smoking_status": "former",
            "alcohol_drinks_per_week": 4,
            "water_intake_liters": 2.0,
        }
        res_create = await client.post("/api/v1/profile", json=payload)
        assert res_create.status_code == 201
        data_create = res_create.json()
        assert data_create["success"] is True
        profile_id = data_create["data"]["id"]

        # 2. Get Profile
        res_get = await client.get(f"/api/v1/profile/{profile_id}")
        assert res_get.status_code == 200
        assert res_get.json()["data"]["full_name"] == "API Test User"

        # 3. Update Profile
        update_payload = {"exercise_hours_per_week": 4.5, "stress_level": 3}
        res_update = await client.put(f"/api/v1/profile/{profile_id}", json=update_payload)
        assert res_update.status_code == 200
        assert res_update.json()["data"]["exercise_hours_per_week"] == 4.5

        # 4. Delete Profile
        res_delete = await client.delete(f"/api/v1/profile/{profile_id}")
        assert res_delete.status_code == 200

        # 5. Verify Not Found
        res_get_deleted = await client.get(f"/api/v1/profile/{profile_id}")
        assert res_get_deleted.status_code == 404
