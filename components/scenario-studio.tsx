'use client';

import React, { useState } from 'react';
import { GlassCard, Heading, IconContainer } from './ui';
import { SlidersHorizontal, Activity } from 'lucide-react';
import { runSimulation } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export function ScenarioStudio({ onSimulationStateChange }: { onSimulationStateChange?: (isSimulating: boolean) => void }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [variables, setVariables] = useState({
    exercise: 5,
    sleep: 7.5,
    stress: 40,
    water: 2.5
  });

  const handleSliderChange = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: parseFloat(value) }));
    setIsSimulating(true);
    if (onSimulationStateChange) onSimulationStateChange(true);
    
    runSimulation({ ...variables, [key]: parseFloat(value) }).then(() => {
      setIsSimulating(false);
      if (onSimulationStateChange) onSimulationStateChange(false);
    });
  };

  return (
    <section className="w-full max-w-[1200px] mx-auto py-20 border-t border-card-border/50">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-6">
          <IconContainer colorClass="bg-primary/10 text-primary border-primary/20">
            <SlidersHorizontal className="w-6 h-6" />
          </IconContainer>
          <div>
            <Heading className="text-4xl">Scenario Studio</Heading>
            <p className="text-foreground/50 mt-2 text-lg">Modify variables to simulate future health trajectories.</p>
          </div>
        </div>
        
        <div className="h-10 flex items-center">
          <AnimatePresence mode="wait">
            {isSimulating ? (
              <motion.div 
                key="simulating"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-3 text-primary font-mono text-sm px-4 py-2 bg-primary/10 rounded-full border border-primary/20 shadow-[0_0_15px_rgba(79,140,255,0.2)]"
              >
                <Activity className="w-4 h-4 animate-spin" /> Simulating Future State...
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-3 text-foreground/40 font-mono text-sm px-4 py-2 bg-surface rounded-full border border-card-border transition-colors duration-500"
              >
                Simulation Engine Ready
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard hoverEffect={true} className="flex flex-col gap-10 p-10">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm font-medium tracking-wide">
              <span className="text-foreground/70 transition-colors duration-500">Weekly Exercise (Hours)</span>
              <span className="font-mono text-primary text-lg transition-all duration-300">{variables.exercise} hrs</span>
            </div>
            <div className="relative pt-2">
              <input 
                type="range" min="0" max="15" step="0.5" 
                value={variables.exercise} 
                onChange={(e) => handleSliderChange('exercise', e.target.value)} 
                className="w-full accent-primary h-1 bg-surface rounded-full appearance-none outline-none focus-visible:shadow-[0_0_15px_rgba(79,140,255,0.5)] transition-shadow duration-300" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm font-medium tracking-wide">
              <span className="text-foreground/70 transition-colors duration-500">Daily Sleep (Hours)</span>
              <span className="font-mono text-emerald text-lg transition-all duration-300">{variables.sleep} hrs</span>
            </div>
            <div className="relative pt-2">
              <input 
                type="range" min="4" max="12" step="0.5" 
                value={variables.sleep} 
                onChange={(e) => handleSliderChange('sleep', e.target.value)} 
                className="w-full accent-emerald h-1 bg-surface rounded-full appearance-none outline-none focus-visible:shadow-[0_0_15px_rgba(50,213,131,0.5)] transition-shadow duration-300" 
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={true} className="flex flex-col gap-10 p-10">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm font-medium tracking-wide">
              <span className="text-foreground/70 transition-colors duration-500">Stress Mitigation Index</span>
              <span className="font-mono text-warning text-lg transition-all duration-300">{variables.stress}%</span>
            </div>
            <div className="relative pt-2">
              <input 
                type="range" min="0" max="100" step="5" 
                value={variables.stress} 
                onChange={(e) => handleSliderChange('stress', e.target.value)} 
                className="w-full accent-warning h-1 bg-surface rounded-full appearance-none outline-none focus-visible:shadow-[0_0_15px_rgba(253,176,34,0.5)] transition-shadow duration-300" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm font-medium tracking-wide">
              <span className="text-foreground/70 transition-colors duration-500">Daily Hydration (Liters)</span>
              <span className="font-mono text-secondary text-lg transition-all duration-300">{variables.water} L</span>
            </div>
            <div className="relative pt-2">
              <input 
                type="range" min="0.5" max="5" step="0.5" 
                value={variables.water} 
                onChange={(e) => handleSliderChange('water', e.target.value)} 
                className="w-full accent-secondary h-1 bg-surface rounded-full appearance-none outline-none focus-visible:shadow-[0_0_15px_rgba(82,211,255,0.5)] transition-shadow duration-300" 
              />
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
