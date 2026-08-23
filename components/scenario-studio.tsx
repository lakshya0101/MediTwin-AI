'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, Heading, IconContainer } from './ui';
import { FlaskConical, Activity, Loader2, CheckCircle, ChevronRight } from 'lucide-react';
import { runSimulation, SimulationResponse, getAIScenario } from '@/lib/api';

interface ScenarioStudioProps {
  profileId: number;
}

interface SliderConfig {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  color: string;
  colorClass: string;
}

const SLIDERS: SliderConfig[] = [
  { key: 'exercise_hours_per_week', label: 'Weekly Exercise', unit: 'hrs/wk', min: 0, max: 20, step: 0.5, color: '#32D583', colorClass: 'accent-emerald' },
  { key: 'sleep_hours_per_night',   label: 'Sleep Duration', unit: 'hrs/night', min: 4, max: 12, step: 0.5, color: '#52D3FF', colorClass: 'accent-secondary' },
  { key: 'stress_level',            label: 'Stress Level', unit: '/10', min: 1, max: 10, step: 1, color: '#FDB022', colorClass: 'accent-warning' },
  { key: 'water_intake_liters',     label: 'Daily Hydration', unit: 'L/day', min: 0.5, max: 5, step: 0.5, color: '#4F8CFF', colorClass: 'accent-primary' },
  { key: 'alcohol_drinks_per_week', label: 'Alcohol Intake', unit: 'drinks/wk', min: 0, max: 30, step: 1, color: '#7A5AF8', colorClass: 'accent-purple' },
  { key: 'weight_kg',               label: 'Weight', unit: 'kg', min: 40, max: 200, step: 1, color: '#F97066', colorClass: 'accent-danger' },
];

const QUICK_SCENARIOS = [
  'Quit smoking completely',
  'Walk 10,000 steps daily',
  'Sleep 8 hours every night',
  'Lose 5 kg over 3 months',
  'Reduce alcohol to 0 drinks per week',
  'Exercise 5 hours per week',
];

export function ScenarioStudio({ profileId }: ScenarioStudioProps) {
  const [values, setValues] = useState<Record<string, number>>({
    exercise_hours_per_week: 3,
    sleep_hours_per_night: 7.5,
    stress_level: 5,
    water_intake_liters: 2.5,
    alcohol_drinks_per_week: 2,
    weight_kg: 75,
  });
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResponse | null>(null);
  const [aiResult, setAiResult] = useState<Record<string, unknown> | null>(null);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const handleRun = async () => {
    setLoading(true);
    setSimResult(null);
    setAiResult(null);
    try {
      const [simRes, aiRes] = await Promise.all([
        runSimulation(profileId, values),
        getAIScenario(profileId, activeScenario || `Adjust lifestyle variables: exercise ${values.exercise_hours_per_week}h/wk, sleep ${values.sleep_hours_per_night}h/night, stress ${values.stress_level}/10`),
      ]);
      setSimResult(simRes);
      setAiResult(aiRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickScenario = async (scenario: string) => {
    setActiveScenario(scenario);
    setLoading(true);
    setSimResult(null);
    setAiResult(null);
    try {
      const [simRes, aiRes] = await Promise.all([
        runSimulation(profileId, values),
        getAIScenario(profileId, scenario),
      ]);
      setSimResult(simRes);
      setAiResult(aiRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const proj = simResult?.projected_score as Record<string, unknown> | undefined;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <IconContainer colorClass="bg-primary/10 text-primary border-primary/20">
          <FlaskConical className="w-5 h-5" />
        </IconContainer>
        <div>
          <Heading className="text-3xl">Scenario Studio</Heading>
          <p className="text-foreground/50 text-sm mt-1">Simulate lifestyle changes and project health outcomes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left: Sliders */}
        <GlassCard className="p-6 md:p-8 flex flex-col gap-6">
          <h3 className="text-sm font-mono text-foreground/50 uppercase tracking-widest">Variable Controls</h3>
          {SLIDERS.map(s => (
            <div key={s.key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/70">{s.label}</span>
                <span className="text-sm font-mono font-bold" style={{ color: s.color }}>
                  {values[s.key]} {s.unit}
                </span>
              </div>
              <input
                type="range" min={s.min} max={s.max} step={s.step}
                value={values[s.key]}
                onChange={e => setValues(prev => ({ ...prev, [s.key]: parseFloat(e.target.value) }))}
                className={`w-full ${s.colorClass} h-1 rounded-full appearance-none outline-none`}
              />
              <div className="flex justify-between text-xs font-mono text-foreground/25">
                <span>{s.min}{s.unit.split('/')[0]}</span>
                <span>{s.max}{s.unit.split('/')[0]}</span>
              </div>
            </div>
          ))}

          <button
            onClick={handleRun}
            disabled={loading}
            className="mt-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-white font-medium flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(79,140,255,0.3)] disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
            {loading ? 'Simulating...' : 'Run Simulation'}
          </button>
        </GlassCard>

        {/* Right: Quick Scenarios + Results */}
        <div className="flex flex-col gap-6">
          {/* Quick Scenarios */}
          <GlassCard className="p-6 flex flex-col gap-3">
            <h3 className="text-sm font-mono text-foreground/50 uppercase tracking-widest mb-1">Quick Scenarios</h3>
            {QUICK_SCENARIOS.map(scenario => (
              <button
                key={scenario}
                onClick={() => handleQuickScenario(scenario)}
                disabled={loading}
                className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ${
                  activeScenario === scenario && !loading
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-card-border hover:border-primary/20 hover:bg-surface text-foreground/70'
                }`}
              >
                <span>{scenario}</span>
                {activeScenario === scenario && !loading
                  ? <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  : <ChevronRight className="w-4 h-4 opacity-40 shrink-0" />}
              </button>
            ))}
          </GlassCard>

          {/* Results Panel */}
          <AnimatePresence>
            {(simResult || loading) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              >
                <GlassCard className="p-6 flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <h3 className="text-sm font-mono text-foreground/50 uppercase tracking-widest">
                      {loading ? 'Running simulation...' : 'Simulation Results'}
                    </h3>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      {proj && (
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(proj).slice(0, 6).map(([k, v]) => (
                            <div key={k} className="p-3 rounded-xl bg-surface/50 border border-card-border/50">
                              <p className="text-xs text-foreground/40 capitalize mb-1">{k.replace(/_/g, ' ')}</p>
                              <p className="text-sm font-mono font-bold">{typeof v === 'number' ? v.toFixed(1) : String(v)}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {aiResult && (
                        <div className="flex flex-col gap-3 pt-2 border-t border-card-border/50">
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {String((aiResult as Record<string, unknown>).summary)}
                          </p>
                          {((aiResult as Record<string, unknown>).metrics_improved as string[])?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {((aiResult as Record<string, unknown>).metrics_improved as string[]).map((m: string, i: number) => (
                                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-emerald/10 text-emerald border border-emerald/20">
                                  ↑ {m}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-foreground/40 leading-relaxed border-t border-card-border/50 pt-3">
                            {String((aiResult as Record<string, unknown>).disclaimer)}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
