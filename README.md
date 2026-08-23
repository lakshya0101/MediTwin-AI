# MediTwin AI

### Simulate tomorrow's health today with your AI-powered Digital Health Twin.

MediTwin AI is an AI-powered Digital Health Twin that helps users understand their current health, simulate lifestyle changes, and explore potential future health outcomes through deterministic health scoring, scenario simulation, and personalized AI insights.

## Overview

Traditional health applications focus on tracking the present. MediTwin AI goes a step further by allowing users to explore:

* Current health and risk assessment
* Personalized health scores
* Future health projections
* What-if lifestyle scenarios
* AI-powered recommendations
* Conversational health guidance

The platform combines deterministic health calculations with Google Gemini. The backend calculates health metrics and risk scores, while AI explains and contextualizes the results.

## Key Features

### Digital Health Twin

Creates a personalized representation of a user's health and lifestyle profile.

### Deterministic Health Scoring

Calculates cardiovascular, metabolic, lifestyle, BMI, sleep, activity, and overall health scores using defined clinical reference standards.

### Future Health Simulation

Projects potential health trajectories across different timeframes based on current health data and lifestyle patterns.

### What-If Scenarios

Allows users to simulate lifestyle changes such as:

* Increasing daily steps
* Improving sleep
* Losing or gaining weight
* Quitting smoking
* Increasing water intake
* Starting or stopping exercise

### AI Health Insights

Google Gemini provides:

* Health summaries
* Future health explanations
* Personalized recommendations
* Scenario analysis
* Conversational health coaching

### Interactive Dashboard

The frontend provides a visual experience for health scores, risk levels, simulations, recommendations, and AI-generated insights.

## How It Works

```
User Health Data
       |
       v
Health Profile
       |
       v
Deterministic Health Engine
       |
       +----> Health Score
       +----> Risk Assessment
       +----> Health Metrics
       |
       v
Digital Twin Simulation
       |
       v
Google Gemini AI
       |
       +----> Health Insights
       +----> Recommendations
       +----> Future Predictions
       +----> AI Health Coach
```

### Core Principle

> AI explains the health data; it does not generate the health scores.

This separation keeps critical health calculations deterministic while using AI for interpretation and personalization.

## Architecture

```
                    MediTwin AI
                        |
          +-------------+-------------+
          |                           |
      Frontend                    Backend
    Next.js / React              FastAPI
          |                           |
          |                    +------+------+
          |                    |             |
          |               Health Engine  Simulation
          |                    |             |
          |                    +------+------+
          |                           |
          |                      Database
          |                           |
          +---------- REST API -------+
                      |
                 Google Gemini
```

The backend follows a modular architecture separating API routes, services, domain logic, repositories, database models, and AI integrations.

## Tech Stack

| Layer      | Technology                 |
| ---------- | -------------------------- |
| Frontend   | Next.js, React, TypeScript |
| Backend    | FastAPI, Python            |
| Database   | SQLite / PostgreSQL        |
| ORM        | SQLAlchemy                 |
| Validation | Pydantic                   |
| AI         | Google Gemini              |
| API        | REST / OpenAPI             |
| Testing    | Pytest                     |

## Project Structure

```
MediTwin-AI/
├── app/                         # Next.js frontend
├── components/                 # Frontend components
├── lib/                        # Frontend utilities
├── public/                     # Static assets
├── backend/                    # Backend services
├── tests/                      # Tests
├── docs/                       # Architecture documentation
├── AI_INTEGRATION.md           # AI integration guide
├── FRONTEND_INTEGRATION.md     # Frontend integration guide
├── MediTwin.postman_collection.json
├── package.json
├── requirements.txt
└── README.md
```

## Getting Started

### Prerequisites

* Python 3.12+
* Node.js and npm
* Git
* Google Gemini API key

### Clone the Repository

```bash
git clone https://github.com/lakshya0101/MediTwin-AI.git
cd MediTwin-AI
```

### Backend Setup

```bash
python -m venv venv
```

**Windows:**

```bash
venv\Scripts\activate
```

**macOS / Linux:**

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
APP_ENV=development
DEBUG=true
DATABASE_URL=sqlite+aiosqlite:///./meditwin.db
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
npm install
npm run dev
```

## API

The FastAPI backend provides endpoints for:

* Health checks
* Profile management
* Health scoring
* Digital twin simulations
* Future predictions
* AI recommendations
* Scenario analysis
* AI health coaching

Interactive API documentation is available at:

```
http://127.0.0.1:8000/docs
```

## Demo Profiles

The project includes 10 realistic demo profiles for testing, API validation, and demonstrations, covering different health and lifestyle patterns.

## Safety and Medical Disclaimer

MediTwin AI is a simulation and educational tool. It does not diagnose, treat, or cure medical conditions and should not replace professional medical advice.

AI-generated insights and simulated outcomes are provided for informational purposes only. Users should consult a qualified healthcare professional before making medical decisions based on the platform's output.

## Documentation

Additional documentation:

* `docs/PROJECT_ARCHITECTURE.md`
* `AI_INTEGRATION.md`
* `FRONTEND_INTEGRATION.md`
* `MediTwin.postman_collection.json`

## Future Scope

* Wearable and health-platform integrations
* Advanced authentication and authorization
* Real-time AI responses
* Multilingual support
* Production PostgreSQL deployment
* Health trend analytics
* Mobile applications
* PDF and CSV health reports

## Team

| Role               | Contributor    |
| ------------------ | -------------- |
| Backend Architect  | Lakshya Dogra  |
| Frontend Developer | Vishesh Nigam  |
| AI Engineer        | Aditya Agrawal |

## License

This project is licensed under the MIT License.

---

## Built for the Future of Digital Health

MediTwin AI brings together Digital Twins, health analytics, scenario simulation, and generative AI to create a more interactive approach to personal health.

> **Don't just track your health. Simulate it.**

### Simulate tomorrow's health today with your AI-powered Digital Health Twin.

Built with ❤️ for the hackathon.
