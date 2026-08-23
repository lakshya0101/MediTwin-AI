MediTwin AI - Digital Health Twin Backend API

Show Image
Show Image
Show Image
Show Image
Show Image

MediTwin AI is a production-ready asynchronous backend API for a digital health twin platform. It provides deterministic health scoring across clinical cardiovascular, metabolic, and lifestyle domains, scenario-based digital twin simulations, and integrated Google Gemini AI services for personalized health insights.

✨ Features
Deterministic Health Scoring: Accurate cardiovascular, metabolic, and lifestyle domain assessments based on WHO/AHA/ADA standards
Digital Twin Simulations: Scenario-based projections for health trajectories and outcome predictions
AI-Powered Insights: Google Gemini integration for health summaries, predictions, recommendations, and conversational guidance
Async Architecture: Production-ready with SQLAlchemy async ORM and FastAPI for high performance
Clean Architecture: Decoupled layers following SOLID principles and separation of concerns
Comprehensive REST API: RESTful endpoints with automatic OpenAPI documentation and Swagger UI
Health Coach: Conversational AI assistant for personalized, context-aware health guidance
Demo Profiles: 10 realistic sample profiles for testing and demonstrations
🏛️ Architecture Overview

Built following Clean Architecture principles, separating concerns into decoupled layers for maintainability, testability, and scalability:

app/
├── main.py                     # App factory, lifespan context, CORS & middleware
├── core/                       # Core infrastructure & system settings
│   ├── config.py               # Centralized pydantic-settings configuration
│   ├── database.py             # SQLAlchemy async engine & dependency injection
│   ├── init_db.py              # Startup DB schema creation
│   ├── logging.py              # Structured logging configuration
│   └── exceptions.py           # Custom exceptions & global error handlers
├── models/                     # SQLAlchemy 2.x ORM models
│   ├── profile.py              # Patient profile & clinical biomarkers
│   ├── score.py                # Computed health scores & domain ratings
│   └── simulation.py           # Digital twin scenario projections
├── schemas/                    # Pydantic v2 validation & response DTOs
│   ├── common.py               # Standardized APIResponse & ErrorResponse
│   ├── profile.py              # Profile input & response schemas
│   ├── score.py                # Score response schemas & breakdowns
│   ├── simulation.py           # Simulation input & projection schemas
│   └── ai_schemas.py           # AI service request/response schemas
├── domain/                     # Pure business logic (framework-independent)
│   ├── constants.py            # WHO/AHA/ADA clinical reference thresholds
│   ├── health_engine.py        # Sub-score, domain score, & risk calculations
│   └── simulation_engine.py    # Digital twin scenario simulations
├── repositories/               # Data access layer (pure DB operations)
│   ├── profile_repository.py   # Patient profile data access
│   ├── score_repository.py     # Health score data access
│   └── simulation_repository.py # Simulation data access
├── services/                   # Business orchestration & transaction layer
│   ├── profile_service.py      # Profile CRUD business logic
│   ├── score_service.py        # Score calculation & AI insight hooks
│   ├── simulation_service.py   # Simulation execution & AI feedback hooks
│   └── gemini_service.py       # Google Gemini AI integration service
├── api/v1/                     # REST API endpoint controllers
│   ├── router.py               # Version 1 API router aggregator
│   └── endpoints/
│       ├── health.py           # Diagnostic health checks
│       ├── profile.py          # Profile CRUD operations
│       ├── score.py            # Health score endpoints
│       ├── simulation.py       # Simulation endpoints
│       └── ai.py               # AI service endpoints
├── integrations/               # AI service provider abstractions
│   ├── base_ai.py              # Abstract base class for AI providers
│   ├── prompts.py              # Clinical prompt templates
│   └── gemini_provider.py      # Google Gemini provider implementation
└── data/
    └── demo_profiles.json      # Sample profiles for testing
Request Flow
Request
   │
   ▼
FastAPI Route  (app/api/endpoints/)
   │
   ├── Validates Request via Pydantic (app/schemas/)
   │
   ▼
Service Layer  (app/services/)
   │
   ├── Orchestrates business logic
   ├── Calls repositories for data access
   ├── Invokes domain logic for calculations
   │
   ▼
Domain Layer  (app/domain/)
   │
   ├── Pure, framework-independent calculations
   ├── Health scoring & simulation engines
   │
   ▼
Repository Layer  (app/repositories/)
   │
   ├── Database operations via SQLAlchemy
   │
   ▼
Response validated via Pydantic  (app/schemas/)
   │
   ▼
Structured JSON returned to client
⚡ Quick Start
Prerequisites
Python 3.12+ — Download from python.org
pip — Python package manager (included with Python)
Virtual environment — venv (included) or conda
Git — For cloning the repository
Installation
Step 1: Clone the Repository
bash
git clone https://github.com/lakshya0101/MediTwin-AI.git
cd MediTwin-AI
Step 2: Create and Activate Virtual Environment

On macOS/Linux:

bash
python3 -m venv venv
source venv/bin/activate

On Windows (PowerShell):

bash
python -m venv venv
.\venv\Scripts\Activate.ps1

On Windows (Command Prompt):

bash
python -m venv venv
venv\Scripts\activate
Step 3: Install Dependencies
bash
pip install -r requirements.txt

Verify installation:

bash
python -c "import fastapi; print(f'FastAPI {fastapi.__version__} installed')"
Step 4: Configure Environment Variables

Create a .env file in the project root directory:

bash
# macOS/Linux
touch .env

# Windows
type nul > .env

Add the following configuration to .env:

env
# ========== Application Settings ==========
APP_NAME="MediTwin AI Backend"
APP_ENV=development
DEBUG=true
API_V1_STR=/api/v1

# ========== Database Configuration ==========
# SQLite (Development)
DATABASE_URL=sqlite+aiosqlite:///./meditwin.db

# PostgreSQL (Production - uncomment to use)
# DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/meditwin

# ========== CORS Configuration ==========
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","http://localhost:8080"]

# ========== Logging ==========
LOG_LEVEL=INFO

# ========== Google Gemini AI Integration ==========
GEMINI_API_KEY=your_gemini_api_key_here

Important Notes:

Never commit the .env file to version control — it's already in .gitignore
Obtain your Gemini API key from Google AI Studio
For production, use PostgreSQL instead of SQLite
🚀 Running the Application
Development Server

Start the development server with hot-reload:

bash
uvicorn app.main:app --reload
Production Server

Start the production server:

bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Access Points

Once the server is running, access:

URL	Purpose
http://127.0.0.1:8000	API Base URL
http://127.0.0.1:8000/docs	Interactive Swagger OpenAPI Docs
http://127.0.0.1:8000/redoc	ReDoc Interactive API Documentation
http://127.0.0.1:8000/api/v1/health	System health check endpoint
🧪 Running Tests
Run All Tests

Execute the full test suite:

bash
pytest
Run Specific Test Modules
bash
# Domain logic & health engine tests
pytest tests/test_health_engine.py

# API integration tests
pytest tests/test_profile_api.py tests/test_score_api.py tests/test_simulation_api.py

# With verbose output
pytest -v

# With coverage report
pytest --cov=app --cov-report=html
View Coverage Report
bash
# Generate HTML coverage report
pytest --cov=app --cov-report=html

# Open coverage report in browser (after generation)
open htmlcov/index.html  # macOS
# or
start htmlcov/index.html # Windows
📡 API Endpoints

All API responses follow a standardized JSON structure:

Success Response:

json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully."
}

Error Response:

json
{
  "success": false,
  "error": "Error description",
  "message": "Additional context"
}
Core Backend Endpoints
Health & Status
Method	Endpoint	Description
GET	/api/v1/health	System health check, DB connectivity, uptime & API version
Profile Management
Method	Endpoint	Description
POST	/api/v1/profile	Create a new patient health profile
GET	/api/v1/profile/{id}	Retrieve patient profile by ID
PUT	/api/v1/profile/{id}	Update patient profile metrics and biomarkers
DELETE	/api/v1/profile/{id}	Delete profile and all associated data
Health Scoring
Method	Endpoint	Description
POST	/api/v1/score/calculate/{profile_id}	Compute and store comprehensive health score assessment
GET	/api/v1/score/{profile_id}	Fetch the latest computed health score
Simulations
Method	Endpoint	Description
POST	/api/v1/simulation/{profile_id}	Run and store a digital twin scenario simulation
GET	/api/v1/simulation/{simulation_id}	Retrieve simulation projection results
AI Service Endpoints

All AI endpoints are prefixed with /api/v1/ai. These endpoints leverage Google Gemini to generate personalized health insights and guidance.

Health Summary

Endpoint: POST /api/v1/ai/health-summary

Returns a structured AI-generated explanation of the user's current health status, score, and key observations.

Request Body:

json
{
  "health_data": {
    "profile": {
      "age": 30,
      "weight_kg": 70,
      "activity_level": "Sedentary"
    },
    "health_score": 72,
    "risk_level": "Moderate",
    "bmi": 25.0,
    "sleep_score": 65,
    "activity_score": 40
  }
}

Response Example:

json
{
  "success": true,
  "data": {
    "summary": "Your health score of 72 indicates moderate overall health...",
    "key_observations": ["BMI is in healthy range", "Sleep patterns need improvement"],
    "disclaimer": "MediTwin AI is a simulation tool, not medical advice."
  }
}
Future Health Prediction

Endpoint: POST /api/v1/ai/future-prediction

Projects health trajectory across multiple timeframes: Today → 1 Month → 6 Months → 1 Year.

Request Body:

json
{
  "health_data": {
    "profile": { "age": 30, "weight_kg": 70, "activity_level": "Sedentary" },
    "health_score": 72,
    "risk_level": "Moderate",
    "bmi": 25.0,
    "sleep_score": 65,
    "activity_score": 40
  }
}
Lifestyle Recommendations

Endpoint: POST /api/v1/ai/recommendations

Returns prioritized lifestyle recommendations with impact severity ratings (High / Medium / Low).

Request Body: Same structure as /health-summary

Response Example:

json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "recommendation": "Increase daily steps to 8,000+",
        "impact": "High",
        "timeframe": "2-4 weeks"
      },
      {
        "recommendation": "Establish consistent sleep schedule",
        "impact": "High",
        "timeframe": "1-2 weeks"
      }
    ]
  }
}
Scenario Simulation (What-If Analysis)

Endpoint: POST /api/v1/ai/scenario

Simulates a "What-If" lifestyle change and explains its projected health impact.

Request Body:

json
{
  "health_data": {
    "profile": { "age": 30, "weight_kg": 70, "activity_level": "Sedentary" },
    "health_score": 72,
    "risk_level": "Moderate",
    "bmi": 25.0,
    "sleep_score": 65,
    "activity_score": 40
  },
  "scenario": "Start walking 7000 steps daily"
}

Supported Scenarios:

"Start walking 7000 steps daily"
"Increase daily steps to 10000"
"Quit smoking"
"Sleep 8 hours consistently"
"Lose 5 kg"
"Gain 5 kg"
"Stop exercising"
"Increase water intake to 3L daily"
Health Coach (Conversational AI)

Endpoint: POST /api/v1/ai/coach

Conversational AI health coach that answers health-related questions using the user's profile data and chat history for context-aware responses.

Request Body:

json
{
  "health_data": {
    "profile": { "age": 30, "weight_kg": 70, "activity_level": "Sedentary" },
    "health_score": 72,
    "risk_level": "Moderate",
    "bmi": 25.0,
    "sleep_score": 65,
    "activity_score": 40
  },
  "question": "Why is my health score low?",
  "history": [
    {
      "role": "user",
      "content": "How can I improve my sleep?"
    },
    {
      "role": "assistant",
      "content": "Consider establishing a consistent sleep schedule and limiting screen time before bed."
    }
  ]
}

Notes:

The history field is optional — omit it for the first message
Pass previous conversation turns to maintain context across messages
The coach uses your profile data to provide personalized guidance
👥 Demo Profiles

Ten realistic demo profiles are available in app/data/demo_profiles.json for testing, presentations, and API validation. Each profile includes complete health metrics:

#	Name	Profile Type	Health Score	Risk Level
1	Alex	Healthy Athlete	94	Very Low
2	Sarah	Sedentary Office Worker	68	Moderate
3	David	Stressed Executive	45	High
4	Maria	Managing Type 2 Diabetes	72	Moderate
5	James	Recovering Smoker	65	Moderate
6	Emma	College Student (Irregular Habits)	78	Low
7	Robert	Active Senior	82	Low
8	Olivia	Postpartum Mother	75	Low
9	Daniel	Marathon Runner	98	Very Low
10	Sophia	Night Shift Worker	38	High

Load demo profiles for testing:

python
import json
with open('app/data/demo_profiles.json') as f:
    profiles = json.load(f)
🔑 Key Design Principles
1. AI Never Calculates Scores

All health metrics (Health Score, BMI, Risk Level, Sleep Score, Activity Score) are computed by the backend domain layer using deterministic algorithms. Gemini AI only explains and contextualizes these values — it never generates raw scores.

2. Separation of Concerns
Domain Layer: Pure business logic, framework-independent
Services Layer: Business orchestration and transactions
Repository Layer: Data access abstractions
API Layer: Request/response handling
Prompts: Fully isolated in dedicated template files for easy tuning
3. Comprehensive Disclaimers

Every AI-generated response includes a disclaimer that MediTwin AI is an educational simulator, not a medical diagnostic or treatment tool.

4. Deterministic Clinical Scoring

All health calculations follow:

WHO (World Health Organization) guidelines
AHA (American Heart Association) standards
ADA (American Diabetes Association) recommendations
5. Async-First Architecture

Built with SQLAlchemy async ORM and FastAPI for high-concurrency, non-blocking I/O operations suitable for production deployments.

📚 Additional Documentation
Frontend Integration Guide — Complete API contracts, TypeScript type definitions, and sample JSON payloads for frontend developers
AI Integration Guide — Detailed architectural breakdown, prompt specifications, and hook system documentation for LLM integration
Postman Collection — Ready-to-import Postman v2.1 collection with all endpoints pre-configured
🔧 Environment Setup for Different Scenarios
Local Development
env
APP_ENV=development
DEBUG=true
DATABASE_URL=sqlite+aiosqlite:///./meditwin.db
LOG_LEVEL=DEBUG
Testing
env
APP_ENV=testing
DEBUG=true
DATABASE_URL=sqlite+aiosqlite:///:memory:
LOG_LEVEL=DEBUG
Production
env
APP_ENV=production
DEBUG=false
DATABASE_URL=postgresql+asyncpg://user:password@prod-db:5432/meditwin
LOG_LEVEL=INFO
CORS_ORIGINS=["https://yourdomain.com"]
🔮 Future Enhancements
 Authentication & Authorization — JWT tokens, role-based access control (RBAC)
 Advanced Logging — Request/response logging middleware, audit trails
 Rate Limiting — Per-endpoint and per-user rate limits to prevent abuse
 Wearable Integration — Connect to Apple Health, Fitbit, Garmin, and Oura Ring APIs
 Real-Time Streaming — Server-Sent Events (SSE) for live AI response streaming
 Multilingual Support — Prompt templates and responses in multiple languages
 Caching Layer — Redis caching for frequent queries and score calculations
 PostgreSQL Support — Production-grade database migration guides
 Admin Dashboard — Web-based interface for profile management and monitoring
 Mobile SDK — Native Swift and Kotlin SDKs for iOS and Android apps
 Analytics — User engagement metrics and health trend analysis
 Export Features — PDF health reports, CSV data export
🐛 Troubleshooting
Port Already in Use
bash
# Find process using port 8000
lsof -i :8000

# Kill the process (macOS/Linux)
kill -9 <PID>

# Use different port
uvicorn app.main:app --port 8001
Database Issues
bash
# Remove SQLite database and recreate
rm meditwin.db

# Restart server (creates fresh schema)
uvicorn app.main:app --reload
Virtual Environment Issues
bash
# Deactivate and reactivate
deactivate
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows
Missing Dependencies
bash
# Reinstall all dependencies
pip install --upgrade pip
pip install -r requirements.txt
⚠️ Disclaimer

IMPORTANT: MediTwin AI is a simulation and educational tool.

It does NOT:

Diagnose diseases or medical conditions
Treat or cure any medical condition
Guarantee medical outcomes or predictions
Replace professional medical advice
Substitute for consultation with healthcare providers

ALWAYS consult a qualified healthcare provider (MD, DO, RN, or specialist) before making any medical decisions or lifestyle changes based on this tool's output.

Users are responsible for verifying all information independently.

🤝 Contributing

We welcome contributions! To contribute:

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

Please ensure:

All tests pass (pytest)
Code follows PEP 8 style guide
Docstrings are included for all functions
👨‍💻 Development Team
Role	Contributor	Responsibilities
Backend Architect	Lakshya	FastAPI architecture, health scoring engine, simulation engine, API design, code review, database optimization
Frontend Developer	Vishesh	Landing page, interactive dashboard, health charts, what-if simulator UI, AI chat interface, responsive design
AI Engineer	Aditya	Prompt engineering, Google Gemini integration, health coach development, future predictions, scenario analysis, LLM optimization
📄 License

This project is licensed under the MIT License — see LICENSE file for complete details.

MIT License Summary

You are free to:

✅ Use commercially
✅ Modify the source code
✅ Distribute copies
✅ Use privately

You must:

ℹ️ Include the license and copyright notice
📧 Support & Feedback
Report Bugs: GitHub Issues
Feature Requests: GitHub Discussions
Documentation: See docs/ directory
🙏 Acknowledgments

Built with modern Python technologies:

FastAPI — Modern async web framework
SQLAlchemy — Powerful ORM for databases
Pydantic — Data validation and settings management
Google Generative AI — Gemini LLM integration

Built with ❤️ for the hackathon. Advancing digital health innovation. 🚀