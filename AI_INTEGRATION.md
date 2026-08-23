# MediTwin AI - AI Provider Integration Guide

This guide details the architectural integration points for attaching Google Gemini (or alternative LLM providers) to MediTwin AI.

---

## 🏗️ Architecture Overview

The MediTwin AI backend uses an abstract provider pattern (`BaseAIProvider`) to separate clinical calculation logic from generative AI language processing.

```
       ┌──────────────────────────────────────┐
       │   app/services/score_service.py      │
       │   app/services/simulation_service.py │
       └──────────────────┬───────────────────┘
                          │
                          │ Calls extension hooks (non-blocking)
                          ▼
       ┌──────────────────────────────────────┐
       │  app/integrations/base_ai.py         │ (Abstract Interface)
       └──────────────────┬───────────────────┘
                          │
                          ▼
       ┌──────────────────────────────────────┐
       │ app/integrations/gemini_provider.py  │ (Gemini Implementation)
       └──────────────────┬───────────────────┘
                          │
                          ▼
             Google Gemini API (Phase 2)
```

---

## 🔌 Extension Point Hooks

Hooks are already embedded inside `ScoreService` and `SimulationService`:

1. `ScoreService.trigger_ai_insights_hook(profile_data, health_assessment)`
2. `SimulationService.trigger_ai_feedback_hook(baseline, simulation_result)`

These hooks execute safely in the background. If the provider is disabled or fails, the core calculation continues unaffected.

---

## 🛠️ Implementing `GeminiAIProvider`

To complete Phase 2 AI integration, edit [`app/integrations/gemini_provider.py`](file:///c:/Users/HP/MediTwin-AI/app/integrations/gemini_provider.py):

```python
import json
import google.generativeai as genai
from app.integrations.base_ai import BaseAIProvider
from app.integrations.prompts import HEALTH_INSIGHTS_PROMPT_TEMPLATE

class GeminiAIProvider(BaseAIProvider):
    def __init__(self, api_key: str) -> None:
        self.api_key = api_key
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")

    async def generate_health_insights(
        self, profile_data: dict, health_assessment: dict
    ) -> str:
        prompt = HEALTH_INSIGHTS_PROMPT_TEMPLATE.format(
            profile_json=json.dumps(profile_data, indent=2),
            assessment_json=json.dumps(health_assessment, indent=2),
        )
        response = await self.model.generate_content_async(prompt)
        return response.text
```

---

## 📝 Prompt Specifications

Prompt templates are centrally declared in [`app/integrations/prompts.py`](file:///c:/Users/HP/MediTwin-AI/app/integrations/prompts.py):
- `HEALTH_INSIGHTS_PROMPT_TEMPLATE`
- `SIMULATION_FEEDBACK_PROMPT_TEMPLATE`

---

## 🔐 Security & HIPAA / Privacy Best Practices

- **Sanitization**: Before passing `profile_data` to `generate_health_insights()`, strip any personally identifiable information (`full_name`).
- **Secret Management**: Store `GEMINI_API_KEY` in `.env` and load via `app/core/config.py`. Never hardcode API keys.
