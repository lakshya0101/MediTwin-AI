'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button, GlassCard, Heading, Subheading } from './ui';
import { createProfile, calculateScore, ProfileCreate } from '@/lib/api';
import {
  User, HeartPulse, Activity, ArrowRight, ArrowLeft,
  ChevronRight, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';

// ─── Step Config ─────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, title: 'Identity', subtitle: 'Tell us about yourself', icon: User },
  { id: 2, title: 'Vitals', subtitle: 'Your clinical biomarkers', icon: HeartPulse },
  { id: 3, title: 'Lifestyle', subtitle: 'Your daily habits', icon: Activity },
];

// ─── Field Components ─────────────────────────────────────────────────────────

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground/70 tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-xs text-foreground/40">{hint}</p>}
    </div>
  );
}

const inputClass =
  'w-full bg-surface border border-card-border rounded-2xl px-4 py-3.5 text-foreground outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(79,140,255,0.12)] transition-all font-sans placeholder:text-foreground/30 text-sm';

const selectClass = inputClass + ' appearance-none cursor-pointer';

// ─── Main Form ────────────────────────────────────────────────────────────────

const defaultForm: ProfileCreate = {
  full_name: '',
  age: 30,
  biological_sex: 'male',
  height_cm: 170,
  weight_kg: 70,
  systolic_bp: 120,
  diastolic_bp: 80,
  fasting_glucose: 95,
  total_cholesterol: 190,
  hdl_cholesterol: 55,
  ldl_cholesterol: 110,
  exercise_hours_per_week: 3,
  sleep_hours_per_night: 7.5,
  stress_level: 4,
  smoking_status: 'never',
  alcohol_drinks_per_week: 2,
  water_intake_liters: 2.5,
};

type FormState = typeof defaultForm;

export function HealthForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof FormState, val: string | number) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const num = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    set(key, parseFloat(e.target.value) || 0);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await createProfile(form);
      await calculateScore(profile.id);
      localStorage.setItem('meditwin_profile_id', String(profile.id));
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please check your inputs.');
      setLoading(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30, filter: 'blur(8px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { type: 'spring' as const, stiffness: 80, damping: 22 } },
    exit: { opacity: 0, x: -30, filter: 'blur(8px)', transition: { duration: 0.25 } },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-16 relative">
      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] bg-primary/8 blur-[130px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple/6 blur-[130px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl relative z-10"
      >
        <GlassCard className="p-8 md:p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)]">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-primary/70 tracking-widest uppercase">Initialize Twin</span>
            </div>
            <Heading className="text-3xl md:text-4xl">
              {STEPS[step - 1].title}
            </Heading>
            <Subheading className="mt-2 text-base">{STEPS[step - 1].subtitle}</Subheading>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-0 mb-10">
            {STEPS.map((s, i) => {
              const done = s.id < step;
              const active = s.id === step;
              const Icon = s.icon;
              return (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center gap-2 relative">
                    <motion.div
                      animate={{
                        backgroundColor: active ? 'rgb(79,140,255)' : done ? 'rgba(79,140,255,0.2)' : 'var(--surface)',
                        borderColor: active ? 'rgb(79,140,255)' : done ? 'rgba(79,140,255,0.4)' : 'var(--card-border)',
                        boxShadow: active ? '0 0 20px rgba(79,140,255,0.4)' : 'none',
                      }}
                      className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all"
                    >
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-foreground/40'}`} />
                      )}
                    </motion.div>
                    <span className={`text-xs font-medium tracking-wide hidden sm:block ${active ? 'text-primary' : 'text-foreground/40'}`}>
                      {s.title}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <motion.div
                      animate={{ backgroundColor: done ? 'rgba(79,140,255,0.4)' : 'var(--card-border)' }}
                      className="flex-1 h-px mx-3 mb-5 transition-colors duration-500"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="min-h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-5"
              >
                {step === 1 && (
                  <>
                    <Field label="Full Name">
                      <input className={inputClass} placeholder="e.g. Alex Sterling"
                        value={form.full_name} onChange={e => set('full_name', e.target.value)} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Age">
                        <input type="number" className={inputClass} placeholder="30" min={1} max={120}
                          value={form.age} onChange={num('age')} />
                      </Field>
                      <Field label="Biological Sex">
                        <select className={selectClass} value={form.biological_sex}
                          onChange={e => set('biological_sex', e.target.value)}>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Height (cm)">
                        <input type="number" className={inputClass} placeholder="170" min={50} max={280}
                          value={form.height_cm} onChange={num('height_cm')} />
                      </Field>
                      <Field label="Weight (kg)">
                        <input type="number" className={inputClass} placeholder="70" min={20} max={300}
                          value={form.weight_kg} onChange={num('weight_kg')} />
                      </Field>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Systolic BP (mmHg)" hint="The top number, e.g. 120">
                        <input type="number" className={inputClass} placeholder="120" min={60} max={260}
                          value={form.systolic_bp} onChange={num('systolic_bp')} />
                      </Field>
                      <Field label="Diastolic BP (mmHg)" hint="The bottom number, e.g. 80">
                        <input type="number" className={inputClass} placeholder="80" min={30} max={160}
                          value={form.diastolic_bp} onChange={num('diastolic_bp')} />
                      </Field>
                    </div>
                    <Field label="Fasting Glucose (mg/dL)" hint="Normal fasting range: 70–99">
                      <input type="number" className={inputClass} placeholder="95" min={40} max={500}
                        value={form.fasting_glucose} onChange={num('fasting_glucose')} />
                    </Field>
                    <div className="grid grid-cols-3 gap-4">
                      <Field label="Total Cholesterol" hint="mg/dL">
                        <input type="number" className={inputClass} placeholder="190" min={70} max={600}
                          value={form.total_cholesterol} onChange={num('total_cholesterol')} />
                      </Field>
                      <Field label="HDL Cholesterol" hint="mg/dL (good)">
                        <input type="number" className={inputClass} placeholder="55" min={10} max={150}
                          value={form.hdl_cholesterol} onChange={num('hdl_cholesterol')} />
                      </Field>
                      <Field label="LDL Cholesterol" hint="mg/dL (bad)">
                        <input type="number" className={inputClass} placeholder="110" min={20} max={400}
                          value={form.ldl_cholesterol} onChange={num('ldl_cholesterol')} />
                      </Field>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Exercise (hrs/week)">
                        <input type="number" className={inputClass} placeholder="3" min={0} max={56} step={0.5}
                          value={form.exercise_hours_per_week} onChange={num('exercise_hours_per_week')} />
                      </Field>
                      <Field label="Sleep (hrs/night)">
                        <input type="number" className={inputClass} placeholder="7.5" min={1} max={12} step={0.5}
                          value={form.sleep_hours_per_night} onChange={num('sleep_hours_per_night')} />
                      </Field>
                    </div>
                    <Field label="Stress Level" hint="1 = very relaxed, 10 = extremely stressed">
                      <div className="flex items-center gap-4">
                        <input type="range" min={1} max={10} step={1} className="flex-1 accent-warning h-1"
                          value={form.stress_level} onChange={num('stress_level')} />
                        <span className="text-lg font-mono font-bold text-warning w-6 text-right">{form.stress_level}</span>
                      </div>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Alcohol (drinks/week)">
                        <input type="number" className={inputClass} placeholder="2" min={0} max={100}
                          value={form.alcohol_drinks_per_week} onChange={num('alcohol_drinks_per_week')} />
                      </Field>
                      <Field label="Water Intake (L/day)">
                        <input type="number" className={inputClass} placeholder="2.5" min={0} max={10} step={0.5}
                          value={form.water_intake_liters} onChange={num('water_intake_liters')} />
                      </Field>
                    </div>
                    <Field label="Smoking Status">
                      <select className={selectClass} value={form.smoking_status}
                        onChange={e => set('smoking_status', e.target.value)}>
                        <option value="never">Never smoked</option>
                        <option value="former">Former smoker</option>
                        <option value="current">Current smoker</option>
                      </select>
                    </Field>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-sm"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors px-4 py-2 rounded-full border border-card-border hover:border-foreground/20"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button onClick={() => setStep(s => s + 1)} className="group min-w-[160px]">
                Continue
                <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="group min-w-[200px]">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Building your Twin...
                  </>
                ) : (
                  <>
                    Launch Dashboard
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
