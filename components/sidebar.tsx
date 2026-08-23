'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard, FlaskConical, BrainCircuit, Sun, Moon,
  Dna, LogOut, TrendingUp
} from 'lucide-react';

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'biomarkers', label: 'Biomarkers', icon: TrendingUp },
  { id: 'simulation', label: 'Simulation', icon: FlaskConical },
  { id: 'ai', label: 'AI Coach', icon: BrainCircuit },
];

interface SidebarProps {
  active: string;
  onNavigate: (id: string) => void;
  profile?: { name: string; overall_score: number; risk_category: string };
}

export function Sidebar({ active, onNavigate, profile }: SidebarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 bottom-0 w-[72px] md:w-64 flex flex-col z-40"
      style={{
        background: 'var(--card)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        borderRight: '1px solid var(--card-border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 md:px-6 pt-7 pb-6 border-b border-card-border/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(79,140,255,0.3)]">
          <Dna className="w-4 h-4 text-white" />
        </div>
        <div className="hidden md:flex flex-col">
          <span className="font-display text-base text-foreground leading-tight">MediTwin</span>
          <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">Health Twin</span>
        </div>
      </div>

      {/* Profile Card */}
      {profile && (
        <div className="hidden md:block mx-4 mt-5 p-4 rounded-2xl border border-card-border/50 bg-surface/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-white font-bold text-sm shrink-0">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{profile.name.split(' ')[0]}</p>
              <p className="text-xs text-foreground/40 font-mono">{profile.risk_category}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-foreground/50">Score</span>
            <span className="text-sm font-mono font-bold text-primary">{profile.overall_score.toFixed(0)}</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-surface overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${profile.overall_score}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-emerald"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-2 md:px-4 mt-5 flex-1">
        {NAV.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative ${
                isActive
                  ? 'bg-primary/15 text-primary shadow-[0_0_20px_rgba(79,140,255,0.1)]'
                  : 'text-foreground/50 hover:text-foreground hover:bg-surface'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 shrink-0 relative z-10" />
              <span className="hidden md:block text-sm font-medium tracking-wide relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <div className="flex flex-col gap-1 px-2 md:px-4 pb-6 pt-4 border-t border-card-border/50">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground/50 hover:text-foreground hover:bg-surface transition-all"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
          <span className="hidden md:block text-sm font-medium tracking-wide">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
        <button
          onClick={() => { localStorage.removeItem('meditwin_profile_id'); window.location.href = '/'; }}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground/50 hover:text-danger hover:bg-danger/5 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="hidden md:block text-sm font-medium tracking-wide">Reset Twin</span>
        </button>
      </div>
    </motion.aside>
  );
}
