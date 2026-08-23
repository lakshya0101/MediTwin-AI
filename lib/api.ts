/**
 * MediTwin AI — Real API Client
 * All calls go to the FastAPI backend at http://localhost:8000/api/v1
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `API Error ${res.status}`);
  }
  const json = await res.json();
  return json.data ?? json;
}

// ─── Profile ────────────────────────────────────────────────────────────────

export interface ProfileCreate {
  full_name: string;
  age: number;
  biological_sex: string;
  height_cm: number;
  weight_kg: number;
  systolic_bp: number;
  diastolic_bp: number;
  fasting_glucose: number;
  total_cholesterol: number;
  hdl_cholesterol: number;
  ldl_cholesterol: number;
  exercise_hours_per_week: number;
  sleep_hours_per_night: number;
  stress_level: number;
  smoking_status: string;
  alcohol_drinks_per_week: number;
  water_intake_liters: number;
}

export interface ProfileResponse extends ProfileCreate {
  id: number;
  created_at: string;
  updated_at: string;
}

export async function createProfile(data: ProfileCreate): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>('/profile', { method: 'POST', body: JSON.stringify(data) });
}

export async function getProfile(id: number): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>(`/profile/${id}`);
}

// ─── Score ───────────────────────────────────────────────────────────────────

export interface SubScores {
  bmi_score: number;
  bp_score: number;
  glucose_score: number;
  cholesterol_score: number;
  exercise_score: number;
  sleep_score: number;
  stress_score: number;
  smoking_score: number;
  alcohol_score: number;
  water_score: number;
}

export interface ScoreResponse {
  id: number;
  profile_id: number;
  overall_score: number;
  bmi: number;
  bmi_category: string;
  cardiovascular_score: number;
  metabolic_score: number;
  lifestyle_score: number;
  sub_scores: SubScores;
  risk_category: string;
  calculated_at: string;
}

export async function calculateScore(profileId: number): Promise<ScoreResponse> {
  return apiFetch<ScoreResponse>(`/score/calculate/${profileId}`, { method: 'POST' });
}

export async function getScore(profileId: number): Promise<ScoreResponse> {
  return apiFetch<ScoreResponse>(`/score/${profileId}`);
}

// ─── Simulation ───────────────────────────────────────────────────────────────

export interface SimulationInput {
  weight_kg?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  fasting_glucose?: number;
  exercise_hours_per_week?: number;
  sleep_hours_per_night?: number;
  stress_level?: number;
  smoking_status?: string;
  alcohol_drinks_per_week?: number;
  water_intake_liters?: number;
}

export interface SimulationResponse {
  id: number;
  profile_id: number;
  input_changes: Record<string, unknown>;
  projected_score: Record<string, unknown>;
  created_at: string;
}

export async function runSimulation(profileId: number, changes: SimulationInput): Promise<SimulationResponse> {
  return apiFetch<SimulationResponse>(`/simulation/${profileId}`, {
    method: 'POST',
    body: JSON.stringify(changes),
  });
}

// ─── AI Intelligence ─────────────────────────────────────────────────────────

export async function getAIHealthSummary(profileId: number): Promise<Record<string, unknown>> {
  return apiFetch(`/ai/health-summary/${profileId}`, { method: 'POST' });
}

export async function getAIFuturePrediction(profileId: number): Promise<Record<string, unknown>> {
  return apiFetch(`/ai/future-prediction/${profileId}`, { method: 'POST' });
}

export async function getAIRecommendations(profileId: number): Promise<Record<string, unknown>> {
  return apiFetch(`/ai/recommendations/${profileId}`, { method: 'POST' });
}

export async function getAIScenario(profileId: number, scenario: string): Promise<Record<string, unknown>> {
  return apiFetch(`/ai/scenario/${profileId}?scenario=${encodeURIComponent(scenario)}`, { method: 'POST' });
}

export async function askAICoach(profileId: number, question: string): Promise<Record<string, unknown>> {
  return apiFetch(`/ai/coach/${profileId}?question=${encodeURIComponent(question)}`, { method: 'POST' });
}
