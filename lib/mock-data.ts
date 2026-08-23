export type HealthStatus = 'Healthy' | 'Moderate' | 'High Risk';

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  status: 'optimal' | 'warning' | 'critical';
  history: { time: string; value: number }[];
}

export interface TwinData {
  id: string;
  name: string;
  vitalityScore: number;
  status: HealthStatus;
  predictionConfidence: number;
  summary: string;
  lastSimulation: string;
  primaryRecommendation: string;
  metrics: Record<string, Metric>;
}

export const mockTwinData: TwinData = {
  id: 'twin-alex',
  name: 'Alex Morgan',
  vitalityScore: 88,
  status: 'Healthy',
  predictionConfidence: 94,
  summary: 'Your metabolic age is tracking 4 years younger than your chronological age. Cardiovascular indicators show exceptional resilience.',
  lastSimulation: '10 mins ago',
  primaryRecommendation: 'Maintain hydration targets to support recent increases in daily activity volume.',
  metrics: {
    heartRate: {
      id: 'm-heart',
      name: 'Heart Rate',
      value: 62,
      unit: 'bpm',
      trend: 'down',
      trendValue: 3,
      status: 'optimal',
      history: Array.from({ length: 7 }).map((_, i) => ({ time: `Day ${i + 1}`, value: 65 - Math.random() * 4 }))
    },
    sleep: {
      id: 'm-sleep',
      name: 'Sleep Duration',
      value: 7.6,
      unit: 'h',
      trend: 'up',
      trendValue: 8,
      status: 'optimal',
      history: Array.from({ length: 7 }).map((_, i) => ({ time: `Day ${i + 1}`, value: 7 + Math.random() }))
    },
    hydration: {
      id: 'm-hydration',
      name: 'Hydration',
      value: 2.4,
      unit: 'L',
      trend: 'stable',
      trendValue: 0,
      status: 'warning',
      history: Array.from({ length: 7 }).map((_, i) => ({ time: `Day ${i + 1}`, value: 2.0 + Math.random() }))
    },
    steps: {
      id: 'm-steps',
      name: 'Daily Steps',
      value: 8450,
      unit: 'steps',
      trend: 'up',
      trendValue: 12,
      status: 'optimal',
      history: Array.from({ length: 7 }).map((_, i) => ({ time: `Day ${i + 1}`, value: 7000 + Math.random() * 3000 }))
    },
    bmi: {
      id: 'm-bmi',
      name: 'BMI',
      value: 23.4,
      unit: '',
      trend: 'stable',
      trendValue: 0,
      status: 'optimal',
      history: Array.from({ length: 7 }).map((_, i) => ({ time: `Day ${i + 1}`, value: 23.4 + (Math.random() - 0.5) * 0.2 }))
    },
    bloodPressure: {
      id: 'm-bp',
      name: 'Blood Pressure',
      value: 122,
      unit: '/78',
      trend: 'stable',
      trendValue: 0,
      status: 'optimal',
      history: Array.from({ length: 7 }).map((_, i) => ({ time: `Day ${i + 1}`, value: 120 + Math.random() * 5 }))
    },
    stress: {
      id: 'm-stress',
      name: 'Stress Level',
      value: 45,
      unit: '/100',
      trend: 'stable',
      trendValue: 2,
      status: 'warning',
      history: Array.from({ length: 7 }).map((_, i) => ({ time: `Day ${i + 1}`, value: 40 + Math.random() * 10 }))
    },
    weight: {
      id: 'm-weight',
      name: 'Weight',
      value: 72,
      unit: 'kg',
      trend: 'stable',
      trendValue: 0,
      status: 'optimal',
      history: Array.from({ length: 7 }).map((_, i) => ({ time: `Day ${i + 1}`, value: 72 + (Math.random() - 0.5) }))
    },
    calories: {
      id: 'm-cal',
      name: 'Calories Burned',
      value: 2450,
      unit: 'kcal',
      trend: 'up',
      trendValue: 120,
      status: 'optimal',
      history: Array.from({ length: 7 }).map((_, i) => ({ time: `Day ${i + 1}`, value: 2200 + Math.random() * 500 }))
    },
  }
};

export const mockTimelineEvents = [
  { id: '1', timeframe: 'Today', description: 'Simulated impact of deep sleep protocol. Vitality projected to hit 90+.', risk: 'low' },
  { id: '2', timeframe: 'Last Week', description: 'Detected mild dehydration trend during afternoon hours.', risk: 'medium' },
  { id: '3', timeframe: 'Last Month', description: 'Metabolic adaptation confirmed after adjusting nutritional macros.', risk: 'low' },
];

export const mockAIRecommendations = [
  { id: 'r1', title: 'Hydration Target', description: 'You are currently 0.6L short of your daily optimal hydration. Drink a glass of water now.', priority: 'high' },
  { id: 'r2', title: 'Evening Routine', description: 'Begin wind-down protocol at 21:30 to guarantee 7.5+ hours of restorative sleep.', priority: 'medium' },
  { id: 'r3', title: 'Zone 2 Cardio', description: 'Add 30 mins of low-intensity cardio tomorrow to maintain cardiovascular efficiency.', priority: 'low' },
];
