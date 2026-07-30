<<<<<<< HEAD
# MediTwin AI - Digital Health Twin Backend API

[![Python Version](https://img.shields.io/badge/python-3.12%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0%2B%20(Async)-red.svg)](https://www.sqlalchemy.org/)
[![Pydantic](https://img.shields.io/badge/Pydantic-v2-e91e63.svg)](https://docs.pydantic.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

MediTwin AI is a production-ready asynchronous backend API for a digital health twin platform. It provides deterministic health scoring across clinical cardiovascular, metabolic, and lifestyle domains, scenario-based digital twin simulations, and extensible hooks for Google Gemini AI integrations.

---

## 🏛️ Project Architecture

Built following **Clean Architecture** principles, separating concerns into decoupled layers:

```
c:\Users\HP\MediTwin-AI\app\
├── main.py                     # App factory, lifespan context, CORS & Middleware
├── core/                       # Core infrastructure & system settings
│   ├── config.py               # Centralized pydantic-settings configuration
│   ├── database.py             # SQLAlchemy Async Engine & get_db session dependency
│   ├── init_db.py              # Startup DB schema creation
│   ├── logging.py              # Structured logging configuration
│   └── exceptions.py           # Custom AppException & global exception handlers
├── models/                     # SQLAlchemy 2.x ORM Models
│   ├── profile.py              # Patient profile & clinical biomarkers
│   ├── score.py                # Computed health scores & domain ratings
│   └── simulation.py           # Digital twin scenario projections
├── schemas/                    # Pydantic v2 Validation & Response DTOs
│   ├── common.py               # Standardized APIResponse & ErrorResponse
│   ├── profile.py              # Profile input & response schemas
│   ├── score.py                # Score response schemas & breakdown
│   └── simulation.py           # Simulation input & projection schemas
├── domain/                     # Pure Deterministic Business Logic (Framework-independent)
│   ├── constants.py            # WHO/AHA/ADA clinical reference thresholds
│   ├── health_engine.py        # Sub-score, domain score, and overall risk calculations
│   └── simulation_engine.py    # Digital twin hypothetical scenario calculations
├── repositories/               # Data Access Layer (Pure DB operations)
│   ├── profile_repository.py
│   ├── score_repository.py
│   └── simulation_repository.py
├── services/                   # Business Orchestration & Transaction Layer
│   ├── profile_service.py
│   ├── score_service.py        # Score calculation & AI insight hooks
│   └── simulation_service.py   # Simulation execution & AI feedback hooks
├── api/v1/                     # REST API Endpoint Controllers
│   ├── router.py               # Version 1 API router aggregator
│   └── endpoints/
│       ├── health.py           # Diagnostic health check
│       ├── profile.py          # Profile CRUD
│       ├── score.py            # Health score endpoints
│       └── simulation.py       # Simulation endpoints
└── integrations/               # AI Service Provider Hooks
    ├── base_ai.py              # Abstract Base Class BaseAIProvider
    ├── prompts.py              # Clinical prompt templates
    └── gemini_provider.py      # Google Gemini provider implementation hook
=======
# 🧬 MediTwin AI — Digital Health Twin Platform

> **AI-powered Digital Health Twin that simulates future health outcomes through personalized lifestyle scenarios, predictive risk analysis, and intelligent health coaching.**

---

## 📖 Project Overview

MediTwin AI is a hackathon project that reimagines how people understand and interact with their own health data.

Instead of generic health advice, MediTwin AI creates a **Digital Health Twin** — a simulation of you — that can:

- Explain your current health based on real metrics
- Predict where your health is heading in 1 month, 6 months, and 1 year
- Simulate lifestyle changes like *"What happens if I quit smoking?"* or *"What if I walk daily?"*
- Provide prioritized, personalized recommendations
- Answer health questions conversationally through an AI Health Coach

The AI does not diagnose diseases. It explains trends, simulates outcomes, and guides users toward better health decisions.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏥 **Health Summary** | AI-generated explanation of your current health status and score |
| 🔮 **Future Prediction** | Timeline-based health trajectory at 1 Month, 6 Months, and 1 Year |
| 💡 **Recommendations Engine** | Prioritized, actionable lifestyle recommendations (High / Medium / Low impact) |
| 🔄 **Scenario Simulator** | What-If simulation for lifestyle changes and their projected health impact |
| 🤖 **AI Health Coach** | Conversational AI that answers health questions using your profile context |
| 📊 **Demo Profiles** | 10 realistic profiles covering diverse health situations for testing and demos |

---

## 🛠 Tech Stack

### AI & Backend
| Layer | Technology |
|---|---|
| Language | Python 3.11+ |
| Web Framework | FastAPI |
| ASGI Server | Uvicorn |
| AI Model | Google Gemini (via `google-genai` SDK) |
| Data Validation | Pydantic v2 |
| Environment Config | python-dotenv |

### API Design
| Concept | Implementation |
|---|---|
| Architecture | Clean Architecture (Prompts → Schemas → Services → Routes) |
| Response Format | Structured JSON (enforced via Pydantic + Gemini JSON mode) |
| Versioning | `/api/v1/` prefix |
| Documentation | Auto-generated via FastAPI `/docs` and `/redoc` |

---

## 📁 Folder Structure

```
MediTwin-AI/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       └── ai.py               # FastAPI AI route definitions
│   │   │
│   │   ├── prompts/
│   │   │   ├── system_prompt.py        # Shared AI persona & rules
│   │   │   ├── health_summary.py       # Health analysis prompt
│   │   │   ├── future_prediction.py    # Future prediction prompt
│   │   │   ├── recommendations.py      # Lifestyle recommendations prompt
│   │   │   ├── scenario.py             # What-If scenario prompt
│   │   │   └── coach.py                # Health coach chat prompt
│   │   │
│   │   ├── schemas/
│   │   │   ├── ai_schemas.py           # Pydantic response models
│   │   │   └── request_schemas.py      # Pydantic request models
│   │   │
│   │   ├── services/
│   │   │   └── gemini_service.py       # Gemini API integration & business logic
│   │   │
│   │   └── main.py                     # FastAPI app entrypoint (CORS, routing, lifespan)
│   │
│   └── data/
│       └── demo_profiles.json          # 10 realistic demo health profiles
│
├── .env                                # API keys (gitignored)
├── .gitignore
├── requirements.txt
└── README.md
>>>>>>> origin/feature/ai-integration
```

---

<<<<<<< HEAD
## ⚡ Quick Start & Setup Guide

### 1. Requirements
- Python 3.12+ installed
- Virtual environment (`venv` or `conda`)

### 2. Installation

Clone repository and navigate into root:
=======
## ⚙️ Installation

### 1. Clone the Repository

>>>>>>> origin/feature/ai-integration
```bash
git clone https://github.com/lakshya0101/MediTwin-AI.git
cd MediTwin-AI
```

<<<<<<< HEAD
Create and activate virtual environment:
```bash
python -m venv .venv
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate
```

Install dependencies:
=======
### 2. Create a Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate       # macOS / Linux
venv\Scripts\activate          # Windows
```

### 3. Install Dependencies

>>>>>>> origin/feature/ai-integration
```bash
pip install -r requirements.txt
```

<<<<<<< HEAD
### 3. Environment Setup

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default `.env` configuration:
```env
APP_NAME="MediTwin AI Backend"
APP_ENV=development
DEBUG=true
API_V1_STR=/api/v1
DATABASE_URL=sqlite+aiosqlite:///./meditwin.db
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
LOG_LEVEL=INFO
```

---

## 🚀 Running the Application

Launch the ASGI Uvicorn development server:

```bash
uvicorn app.main:app --reload
```

Server endpoints:
- **API Base URL**: `http://127.0.0.1:8000`
- **Swagger OpenAPI Docs**: `http://127.0.0.1:8000/docs`
- **ReDoc Interactive Docs**: `http://127.0.0.1:8000/redoc`
- **System Health Check**: `http://127.0.0.1:8000/api/v1/health`

---

## 🧪 Running Tests

Execute full test suite with `pytest`:

```bash
pytest
```

Running specific test suites:
```bash
# Domain health engine tests
pytest tests/test_health_engine.py

# API Integration tests
pytest tests/test_profile_api.py tests/test_score_api.py tests/test_simulation_api.py
```

---

## 🌐 API Overview & Endpoints

All success API responses return a standardized JSON structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully."
}
```

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | System health check, DB ping, uptime & version |
| `POST` | `/api/v1/profile` | Create patient health profile |
| `GET` | `/api/v1/profile/{id}` | Get patient profile by ID |
| `PUT` | `/api/v1/profile/{id}` | Update patient profile metrics |
| `DELETE` | `/api/v1/profile/{id}` | Delete profile and associated data |
| `POST` | `/api/v1/score/calculate/{profile_id}` | Compute & store health score assessment |
| `GET` | `/api/v1/score/{profile_id}` | Fetch latest health score |
| `POST` | `/api/v1/simulation/{profile_id}` | Run & store digital twin scenario simulation |
| `GET` | `/api/v1/simulation/{simulation_id}` | Fetch simulation projection result |

---

## 📑 Additional Documentation

- [Frontend Integration Guide](FRONTEND_INTEGRATION.md): Detailed API contracts, TypeScript interfaces, and sample JSON payloads for frontend integration.
- [AI Integration Guide](AI_INTEGRATION.md): Complete architectural breakdown and hook specifications for connecting Google Gemini LLMs.
- [Postman Collection](MediTwin.postman_collection.json): Importable Postman v2.1 collection.
=======
---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore`.
> Obtain your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 🚀 Running the Backend

```bash
uvicorn backend.app.main:app --reload
```

The server will start at:

```
http://127.0.0.1:8000
```

| URL | Description |
|---|---|
| `http://127.0.0.1:8000/docs` | Interactive Swagger UI |
| `http://127.0.0.1:8000/redoc` | ReDoc API documentation |
| `http://127.0.0.1:8000/health` | Server health check |

---

## 🔗 API Endpoints

All AI endpoints are prefixed with `/api/v1/ai`.

### `POST /api/v1/ai/health-summary`
Returns a structured AI explanation of the user's current health status, score, and key observations.

**Request Body:**
```json
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
```

---

### `POST /api/v1/ai/future-prediction`
Projects health trajectory across **Today → 1 Month → 6 Months → 1 Year**.

**Request Body:** Same as `/health-summary`

---

### `POST /api/v1/ai/recommendations`
Returns prioritized lifestyle recommendations with qualitative impact ratings (High / Medium / Low).

**Request Body:** Same as `/health-summary`

---

### `POST /api/v1/ai/scenario`
Simulates a What-If lifestyle change and explains its projected health impact.

**Request Body:**
```json
{
  "health_data": { "..." },
  "scenario": "Start walking 7000 steps daily"
}
```

**Supported scenarios (examples):**
- Walk daily
- Quit smoking
- Sleep 8 hours
- Lose 5 kg / Gain 5 kg
- Stop exercising
- Increase water intake

---

### `POST /api/v1/ai/coach`
Conversational AI Health Coach that answers questions using the user's profile and chat history.

**Request Body:**
```json
{
  "health_data": { "..." },
  "question": "Why is my health score low?",
  "history": [
    { "role": "user", "content": "How can I improve my sleep?" },
    { "role": "assistant", "content": "..." }
  ]
}
```

> `history` is optional. Pass previous messages to maintain conversational context.

---

## 👥 Demo Profiles

10 realistic demo profiles are available in `backend/data/demo_profiles.json` for testing, presentations, and debugging.

| # | Name | Condition | Health Score | Risk Level |
|---|---|---|---|---|
| 1 | Alex | Healthy Athlete | 94 | Very Low |
| 2 | Sarah | Sedentary Office Worker | 68 | Moderate |
| 3 | David | Stressed Executive | 45 | High |
| 4 | Maria | Managing Type 2 Diabetes | 72 | Moderate |
| 5 | James | Recovering Smoker | 65 | Moderate |
| 6 | Emma | College Student (Irregular Habits) | 78 | Low |
| 7 | Robert | Active Senior | 82 | Low |
| 8 | Olivia | Postpartum Mother | 75 | Low |
| 9 | Daniel | Marathon Runner | 98 | Very Low |
| 10 | Sophia | Night Shift Worker | 38 | High |

---

## 🏗 Project Architecture

```
Request
   │
   ▼
FastAPI Route  (backend/app/api/routes/ai.py)
   │
   ├── Validates Request via Pydantic (request_schemas.py)
   │
   ▼
Gemini Service  (backend/app/services/gemini_service.py)
   │
   ├── Loads Prompt Template  (backend/app/prompts/*.py)
   │   └── Every prompt imports shared SYSTEM_PROMPT
   │
   ├── Calls Gemini API (google-genai SDK)
   │   └── Enforces structured JSON output via Pydantic schema
   │
   ▼
Response validated via Pydantic  (backend/app/schemas/ai_schemas.py)
   │
   ▼
Structured JSON returned to client
```

### Key Design Decisions

- **AI never calculates scores.** Health Score, BMI, Risk Level, Sleep Score, and Activity Score are all computed by the backend. Gemini only **explains** these values.
- **Prompts are fully separated** from business logic to allow easy tuning.
- **Every response includes a disclaimer** — MediTwin AI is a simulator, not a medical tool.

---

## 🔭 Future Improvements

- [ ] Add FastAPI middleware for request logging and rate limiting
- [ ] Add authentication with JWT tokens
- [ ] Connect to Lakshya's health scoring backend (FastAPI + health engine)
- [ ] Integrate real wearable data (Apple Health, Fitbit)
- [ ] Stream AI responses using Server-Sent Events (SSE)
- [ ] Add multilingual prompt support
- [ ] Switch to numerical impact scores once backend provides them

---

## ⚠️ Disclaimer

> MediTwin AI is a **simulation tool** built for educational purposes.
>
> It does **not** diagnose diseases, guarantee medical outcomes, or replace professional medical advice.
>
> Always consult a qualified healthcare provider for medical decisions.

---

## 👨‍💻 Built By

| Role | Contributor |
|---|---|
| AI Integration, Prompt Engineering, FastAPI AI APIs, Health Coach, Future Prediction, Scenario Engine, Recommendations, Backend Integration, Deployment | **Aditya** |
| Frontend (Landing Page, Dashboard, Charts, What-If Simulator UI, AI Chat Interface) | **Vishesh** |
| Backend (FastAPI), Health Engine, Scenario Engine, API Design, Architecture, Code Review | **Lakshya** |

---

*Built with ❤️ for a hackathon. 🚀*
>>>>>>> origin/feature/ai-integration
