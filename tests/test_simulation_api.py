import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_simulation_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Create Profile first
        payload = {
            "full_name": "Simulation User",
            "age": 45,
            "biological_sex": "male",
            "height_cm": 172.0,
            "weight_kg": 90.0,
            "systolic_bp": 140,
            "diastolic_bp": 90,
            "fasting_glucose": 115.0,
            "total_cholesterol": 230.0,
            "hdl_cholesterol": 40.0,
            "ldl_cholesterol": 150.0,
            "exercise_hours_per_week": 0.5,
            "sleep_hours_per_night": 5.5,
            "stress_level": 8,
            "smoking_status": "current",
            "alcohol_drinks_per_week": 10,
            "water_intake_liters": 1.0,
        }
        res_create = await client.post("/api/v1/profile", json=payload)
        profile_id = res_create.json()["data"]["id"]

        # Run Simulation (weight reduction, quit smoking, increase exercise)
        sim_payload = {
            "weight_kg": 78.0,
            "exercise_hours_per_week": 4.0,
            "smoking_status": "never",
            "systolic_bp": 120,
            "diastolic_bp": 80,
        }
        res_sim = await client.post(f"/api/v1/simulation/{profile_id}", json=sim_payload)
        assert res_sim.status_code == 201
        sim_data = res_sim.json()["data"]
        simulation_id = sim_data["id"]
        assert sim_data["projected_score"]["overall_score_delta"] > 0

        # Get Simulation
        res_get_sim = await client.get(f"/api/v1/simulation/{simulation_id}")
        assert res_get_sim.status_code == 200
        assert res_get_sim.json()["data"]["id"] == simulation_id
