'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, Heading, Subheading, AnimatedNumber, IconContainer } from './ui';
import { ScoreResponse } from '@/lib/api';
import {
  Heart, Moon, Zap, Activity, Droplets, Scale,
  ShieldCheck, TrendingUp, TrendingDown, Minus, Loader2
} from 'lucide-react';

// ─── Animated Score Ring ──────────────────────────────────────────────────────

function ScoreRing({ score, size = 240 }: { score: number; size?: number }) {
  const radius = (size / 2) - 16;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - score / 100);

  const color = score >= 75 ? '#32D583' : score >= 50 ? '#FDB022' : '#F97066';
  const gradientId = `ring-grad-${score}`;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={score >= 75 ? '#4F8CFF' : score >= 50 ? '#F97066' : '#7A5AF8'} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="currentColor" strokeWidth={10} className="text-card-border" />
        {/* Animated progress */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={`url(#${gradientId})`} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      {/* Inner orb */}
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="relative z-10 flex flex-col items-center justify-center rounded-full"
        style={{
          width: size - 48, height: size - 48,
          background: `radial-gradient(ellipse at 30% 20%, ${color}20, transparent 60%), var(--card)`,
          boxShadow: `0 0 40px ${color}30, inset 0 0 30px rgba(0,0,0,0.1)`,
          border: `1px solid ${color}20`,
        }}
      >
        <span className="text-5xl font-sans font-bold tracking-tight">
          <AnimatedNumber value={Math.round(score)} />
        </span>
        <span className="text-xs font-mono text-foreground/50 uppercase tracking-widest mt-1">Health Score</span>
      </motion.div>
    </div>
  );
}

// ─── Sub-score Bar ─────────────────────────────────────────────────────────

function ScoreBar({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0`}
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-foreground/60 truncate">{label}</span>
          <span className="text-xs font-mono font-bold text-foreground ml-2">{value.toFixed(0)}</span>
        </div>
        <div className="h-1.5 bg-surface rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}90, ${color})` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Metric Card ───────────────────────────────────────────────────────────

function MetricCard({ label, value, unit, trend }: { label: string; value: number; unit: string; trend?: 'up' | 'down' | 'stable' }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald' : trend === 'down' ? 'text-danger' : 'text-foreground/40';

  return (
    <GlassCard className="p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground/50 tracking-wide">{label}</span>
        <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-sans font-bold">{value.toFixed(1)}</span>
        <span className="text-xs font-mono text-foreground/40">{unit}</span>
      </div>
    </GlassCard>
  );
}

// ─── Risk Badge ────────────────────────────────────────────────────────────

function RiskBadge({ risk }: { risk: string }) {
  const config: Record<string, { color: string; bg: string; border: string; dot: string }> = {
    'Very Low Risk': { color: '#32D583', bg: 'rgba(50,213,131,0.1)', border: 'rgba(50,213,131,0.25)', dot: '#32D583' },
    'Low Risk':      { color: '#4F8CFF', bg: 'rgba(79,140,255,0.1)', border: 'rgba(79,140,255,0.25)', dot: '#4F8CFF' },
    'Moderate Risk': { color: '#FDB022', bg: 'rgba(253,176,34,0.1)', border: 'rgba(253,176,34,0.25)', dot: '#FDB022' },
    'High Risk':     { color: '#F97066', bg: 'rgba(249,112,102,0.1)', border: 'rgba(249,112,102,0.25)', dot: '#F97066' },
  };
  const c = config[risk] || config['Moderate Risk'];
  return (
    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wide"
      style={{ color: c.color, background: c.bg, border: `1px solid ${c.border}` }}>
      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: c.dot }} />
      {risk}
    </span>
  );
}

// ─── Main Dashboard Overview ───────────────────────────────────────────────

interface DashboardOverviewProps {
  score: ScoreResponse;
  profileName: string;
}

export function DashboardOverview({ score, profileName }: DashboardOverviewProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring' as const, stiffness: 80, damping: 22 } },
  };

  const s = score.sub_scores;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col gap-8">

      {/* ─── Hero ─── */}
      <motion.div variants={item} className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <RiskBadge risk={score.risk_category} />
            <span className="text-xs font-mono text-foreground/30">Digital Twin Active</span>
          </div>
          <Heading className="text-4xl md:text-5xl lg:text-6xl">{profileName}</Heading>
          <Subheading className="mt-3 text-lg max-w-md">
            Your digital twin is online. All metrics are computed by the health engine.
          </Subheading>
          <div className="flex flex-wrap gap-6 mt-6">
            <div>
              <p className="text-xs text-foreground/40 uppercase tracking-widest mb-1">BMI</p>
              <p className="text-2xl font-sans font-bold">{score.bmi.toFixed(1)}</p>
              <p className="text-xs text-foreground/40 mt-0.5">{score.bmi_category}</p>
            </div>
            <div className="w-px bg-card-border hidden sm:block" />
            <div>
              <p className="text-xs text-foreground/40 uppercase tracking-widest mb-1">Cardiovascular</p>
              <p className="text-2xl font-sans font-bold">{score.cardiovascular_score.toFixed(0)}<span className="text-sm font-mono text-foreground/40">/100</span></p>
            </div>
            <div className="w-px bg-card-border hidden sm:block" />
            <div>
              <p className="text-xs text-foreground/40 uppercase tracking-widest mb-1">Metabolic</p>
              <p className="text-2xl font-sans font-bold">{score.metabolic_score.toFixed(0)}<span className="text-sm font-mono text-foreground/40">/100</span></p>
            </div>
          </div>
        </div>

        {/* Score Ring */}
        <motion.div
          variants={item}
          className="flex-shrink-0 mx-auto lg:mx-0"
          whileHover={{ scale: 1.03 }}
        >
          <ScoreRing score={score.overall_score} size={220} />
        </motion.div>
      </motion.div>

      {/* ─── Sub-scores Breakdown ─── */}
      {s && (
        <motion.div variants={item}>
          <GlassCard className="p-6 md:p-8">
            <h3 className="text-lg font-sans font-semibold mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Biomarker Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ScoreBar label="Blood Pressure" value={s.bp_score} icon={Heart} color="#F97066" />
              <ScoreBar label="Glucose" value={s.glucose_score} icon={Activity} color="#FDB022" />
              <ScoreBar label="Cholesterol" value={s.cholesterol_score} icon={Zap} color="#7A5AF8" />
              <ScoreBar label="Exercise" value={s.exercise_score} icon={TrendingUp} color="#32D583" />
              <ScoreBar label="Sleep" value={s.sleep_score} icon={Moon} color="#52D3FF" />
              <ScoreBar label="Stress" value={s.stress_score} icon={Zap} color="#FDB022" />
              <ScoreBar label="Hydration" value={s.water_score} icon={Droplets} color="#4F8CFF" />
              <ScoreBar label="Smoking" value={s.smoking_score} icon={ShieldCheck} color="#32D583" />
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ─── Metric Grid ─── */}
      <motion.div variants={item}>
        <h3 className="text-lg font-sans font-semibold mb-4 text-foreground/70">Key Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="BMI" value={score.bmi} unit="" />
          <MetricCard label="Cardiovascular" value={score.cardiovascular_score} unit="/100" />
          <MetricCard label="Metabolic" value={score.metabolic_score} unit="/100" />
          <MetricCard label="Lifestyle" value={score.lifestyle_score} unit="/100" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────

export function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-purple blur-md"
      />
      <p className="font-mono text-xs text-foreground/40 uppercase tracking-widest">
        Initializing Twin...
      </p>
    </div>
  );
}

// ─── Error State ───────────────────────────────────────────────────────────────

export function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <GlassCard className="p-8 flex flex-col items-center text-center gap-4">
      <div className="w-12 h-12 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center">
        <Zap className="w-6 h-6 text-danger" />
      </div>
      <Heading className="text-2xl">Connection Error</Heading>
      <p className="text-foreground/60 text-sm max-w-sm">{message}</p>
      <button onClick={onRetry}
        className="mt-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
        Retry
      </button>
    </GlassCard>
  );
}
