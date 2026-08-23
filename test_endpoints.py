import requests
import json

with open("backend/data/demo_profiles.json", "r") as f:
    profiles = json.load(f)

test_profile = profiles[0]
health_data = test_profile

base_url = "http://127.0.0.1:8000/api/v1/ai"

endpoints = [
    ("/health-summary", {"health_data": health_data}),
    ("/future-prediction", {"health_data": health_data}),
    ("/recommendations", {"health_data": health_data}),
    ("/scenario", {"health_data": health_data, "scenario": "Start running 5km every day"}),
    ("/coach", {"health_data": health_data, "question": "How can I improve my sleep?"})
]

for endpoint, payload in endpoints:
    print(f"\nTesting {endpoint}...")
    try:
        response = requests.post(base_url + endpoint, json=payload, timeout=30)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Success!")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Failed to connect: {e}")
