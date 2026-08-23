import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_score_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Create Profile first
        payload = {
            "full_name": "Score API User",
            "age": 28,
            "biological_sex": "female",
            "height_cm": 168.0,
            "weight_kg": 58.0,
            "systolic_bp": 112,
            "diastolic_bp": 74,
            "fasting_glucose": 88.0,
            "total_cholesterol": 175.0,
            "hdl_cholesterol": 62.0,
            "ldl_cholesterol": 95.0,
            "exercise_hours_per_week": 4.0,
            "sleep_hours_per_night": 7.5,
            "stress_level": 3,
            "smoking_status": "never",
            "alcohol_drinks_per_week": 1,
            "water_intake_liters": 2.8,
        }
        res_create = await client.post("/api/v1/profile", json=payload)
        profile_id = res_create.json()["data"]["id"]

        # Calculate Score
        res_calc = await client.post(f"/api/v1/score/calculate/{profile_id}")
        assert res_calc.status_code == 200
        calc_data = res_calc.json()["data"]
        assert "overall_score" in calc_data
        assert "sub_scores" in calc_data
        assert calc_data["risk_category"] == "Low Risk"

        # Fetch Score
        res_get = await client.get(f"/api/v1/score/{profile_id}")
        assert res_get.status_code == 200
        assert res_get.json()["data"]["overall_score"] == calc_data["overall_score"]
