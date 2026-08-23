# MediTwin AI

> Simulate tomorrow's health today with your AI-powered Digital Health Twin.

MediTwin AI is an AI-powered Digital Health Twin that helps users understand their current health, simulate lifestyle changes, and explore potential future health outcomes through deterministic health scoring, scenario simulation, and personalized AI insights.

---

## Overview

Traditional health applications focus primarily on tracking the present.

MediTwin AI goes a step further by allowing users to explore:

- Current health and risk assessment
- Personalized health scores
- Future health projections
- What-if lifestyle scenarios
- AI-powered recommendations
- Conversational health guidance

> The goal is simple: turn health data into an understandable simulation of the future.

---

## The Problem

Most health platforms answer:

> "How am I doing today?"

MediTwin AI focuses on a different question:

> "What could my health look like if I continue this lifestyle?"

By combining health analytics, Digital Twin simulation, and generative AI, MediTwin AI transforms static health metrics into interactive, scenario-based insights.

---

## The Solution

MediTwin AI creates a personalized Digital Health Twin using a user's health and lifestyle data.

The platform combines deterministic health calculations with AI-powered interpretation to provide:

```
Current Health
      |
      v
Health Score
      |
      v
Risk Assessment
      |
      v
What-If Simulation
      |
      v
Future Projection
      |
      v
Personalized AI Insight
```

**Core Principle:** AI explains the health data; it does not generate the health scores.

---

## Key Features

### Digital Health Twin

Creates a personalized representation of a user's health and lifestyle profile.

### Deterministic Health Scoring

Calculates health metrics across multiple domains including:

* Cardiovascular health
* Metabolic health
* Lifestyle patterns
* BMI measurement
* Sleep quality
* Physical activity
* Overall health indicator
* Risk stratification

### Future Health Simulation

Projects potential health trajectories based on current health data and lifestyle patterns across multiple timeframes.

### What-If Scenarios

Users can experiment with lifestyle changes:

* Increasing daily steps
* Improving sleep quality
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

The frontend brings together health scores, risk indicators, simulations, recommendations, and AI insights into a single unified experience.

---

## How It Works

```
                    User Health Data
                           |
                           v
                  +------------------+
                  |  Health Profile  |
                  +--------+---------+
                           |
                           v
              +-------------------------+
              | Deterministic Health    |
              |       Engine             |
              +------------+------------+
                           |
              +------------+------------+
              |                         |
              v                         v
        Health Score              Risk Analysis
              |                         |
              +------------+------------+
                           |
                           v
                  Digital Twin Engine
                           |
                           v
                    What-If Scenarios
                           |
                           v
                    Google Gemini AI
                           |
              +------------+-------------+
              |            |             |
              v            v             v
          Insights   Recommendations   AI Coach
```

Deterministic calculations form the foundation. AI adds interpretation, context, and personalization.

---

## Architecture

```
                         MediTwin AI
                              |
             +----------------+----------------+
             |                                 |
             v                                 v
        Next.js Frontend                 FastAPI Backend
             |                                 |
             |                    +------------+------------+
             |                    |            |            |
             |                    v            v            v
             |               Health Engine  Simulation  Services
             |                    |            |            |
             |                    +------------+------------+
             |                                 |
             |                                 v
             |                            Database
             |                                 |
             +------------- REST API -----------+
                              |
                              v
                       Google Gemini
```

The backend follows a modular architecture separating API routes, services, domain logic, repositories, database models, and AI integrations.

---

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

---

## Project Structure

```
MediTwin-AI/
├── app/                         # Next.js frontend application
├── components/                  # Reusable React components
├── lib/                         # Frontend utilities and helpers
├── public/                      # Static assets
├── backend/                     # FastAPI backend implementation
│   ├── app/
│   ├── services/
│   ├── models/
│   ├── repositories/
│   └── schemas/
├── tests/                       # Test suite (Pytest)
├── docs/                        # Architecture documentation
├── AI_INTEGRATION.md            # AI integration guide
├── FRONTEND_INTEGRATION.md      # Frontend setup guide
├── MediTwin.postman_collection.json  # API testing collection
├── package.json                 # Node.js dependencies
├── requirements.txt             # Python dependencies
└── README.md
```

---

## Getting Started

### Prerequisites

* Python 3.12+
* Node.js 18+ and npm
* Git
* Google Gemini API key

### Clone the Repository

```bash
git clone https://github.com/lakshya0101/MediTwin-AI.git
cd MediTwin-AI
```

### Backend Setup

Create a virtual environment:

```bash
python -m venv venv
```

Activate virtual environment:

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

Create `.env` file:

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

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

---

## API Documentation

The FastAPI backend provides comprehensive endpoints for:

* Health checks
* Profile management
* Health scoring and metrics
* Digital Twin simulations
* Future predictions and projections
* AI recommendations
* Scenario analysis
* AI health coaching

### Interactive API Documentation

Swagger UI:
```
http://localhost:8000/docs
```

ReDoc Documentation:
```
http://localhost:8000/redoc
```

The backend exposes a complete REST API that can be consumed independently by the frontend or other clients.

---

## AI Integration

MediTwin AI uses Google Gemini as the intelligence layer on top of deterministic health calculations.

```
Health Data
     |
     v
Deterministic Backend
     |
     +---- Health Score
     +---- BMI
     +---- Risk Level
     +---- Sleep Score
     +---- Activity Score
     |
     v
Google Gemini
     |
     +---- Health Summary
     +---- Recommendations
     +---- Future Prediction
     +---- Scenario Analysis
     +---- Health Coach
```

**Important:** AI is used for interpretation and personalization, not for generating critical health scores.

---

## Demo Profiles

The project includes 10 realistic demo profiles covering different health and lifestyle patterns.

These profiles are available for:

* Testing and validation
* API integration testing
* Feature demonstrations
* Hackathon presentations

Profiles cover various demographics:

* Young professionals
* Athletes and active individuals
* Sedentary lifestyles
* Health-conscious individuals
* Various age groups

---

## Design Principles

### Deterministic First

Health calculations are handled by deterministic backend logic using established clinical standards.

### AI on Top

Gemini provides explanation, contextualization, recommendations, and conversational interaction.

### Separation of Concerns

```
API Layer
   |
   v
Services Layer
   |
   v
Domain Logic
   |
   v
Repositories
   |
   v
Database
```

### Explainability

Users should understand the factors contributing to their health scores and risk assessments.

### Safety by Design

AI-generated health information is accompanied by appropriate disclaimers and is not presented as medical diagnosis.

---

## Documentation

Additional documentation is available in the repository:

* `docs/PROJECT_ARCHITECTURE.md` - Detailed system architecture
* `AI_INTEGRATION.md` - AI integration guide
* `FRONTEND_INTEGRATION.md` - Frontend setup guide
* `MediTwin.postman_collection.json` - Postman API collection

---

## Future Scope

* Wearable and health-platform integrations (Apple Health, Fitbit, Garmin, Oura)
* Advanced authentication and authorization (OAuth 2.0, JWT)
* Real-time AI responses via WebSocket
* Multilingual support
* Production PostgreSQL deployment
* Health trend analytics and insights
* Mobile applications (iOS and Android)
* PDF and CSV health report generation

---

## Medical Disclaimer

**MediTwin AI is a simulation and educational tool, not a medical diagnostic system.**

Important considerations:

* Does not diagnose, treat, cure, or prevent medical conditions
* Should not replace professional medical advice
* AI insights and simulated outcomes are for informational purposes only
* Always consult a qualified healthcare professional before making medical decisions

---

## Team

| Role               | Contributor    | Expertise                    |
| ------------------ | --------------- | ---------------------------- |
| Backend Architect  | Lakshya Dogra   | FastAPI, Python, System Design |
| Frontend Developer | Vishesh Nigam   | React, Next.js, TypeScript   |
| AI Engineer        | Aditya Agrawal  | Gemini, Prompt Engineering   |

---

## License

This project is licensed under the MIT License - feel free to use, modify, and distribute.

See LICENSE for more details.

---

## The Vision

Don't just track your health. Simulate it.

MediTwin AI brings together Digital Twins, deterministic health analytics, scenario simulation, and generative AI to create a more interactive and forward-looking approach to personal health.

The future of health isn't about analyzing the past—it's about simulating tomorrow.

---

Simulate tomorrow's health today with your AI-powered Digital Health Twin.

Built for the hackathon. Advancing digital health innovation.

---

## Contributing

Contributions are welcome. Please:

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

---

## Support

For questions, issues, or feedback:

* Open an issue on GitHub
* Start a discussion
* Check existing documentation

---

Last Updated: August 2026
Made by the MediTwin AI Team
