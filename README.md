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
```

---

## ⚡ Quick Start & Setup Guide

### 1. Requirements
- Python 3.12+ installed
- Virtual environment (`venv` or `conda`)

### 2. Installation

Clone repository and navigate into root:
```bash
git clone https://github.com/lakshya0101/MediTwin-AI.git
cd MediTwin-AI
```

Create and activate virtual environment:
```bash
python -m venv .venv
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

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
