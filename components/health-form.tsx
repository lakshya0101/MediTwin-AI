'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, GlassCard, Heading, Subheading, IconContainer } from './ui';
import { Activity, ShieldCheck, HeartPulse, Dna, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const steps = [
  { id: 1, title: 'Identity', icon: Dna },
  { id: 2, title: 'Vitals', icon: HeartPulse },
  { id: 3, title: 'Synthesis', icon: Activity }
];

export function HealthForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const getStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground/80 tracking-wide font-sans">Full Name</label>
              <input type="text" className="w-full bg-surface border border-card-border rounded-xl px-4 py-4 text-foreground outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(79,140,255,0.1)] transition-all font-sans" placeholder="e.g. Alex Sterling" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground/80 tracking-wide font-sans">Biological Age</label>
              <input type="number" className="w-full bg-surface border border-card-border rounded-xl px-4 py-4 text-foreground outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(79,140,255,0.1)] transition-all font-sans" placeholder="32" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground/80 tracking-wide font-sans">Average Sleep (Hours)</label>
              <input type="number" className="w-full bg-surface border border-card-border rounded-xl px-4 py-4 text-foreground outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(79,140,255,0.1)] transition-all font-sans" placeholder="7.5" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground/80 tracking-wide font-sans">Activity Level</label>
              <select className="w-full bg-surface border border-card-border rounded-xl px-4 py-4 text-foreground outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(79,140,255,0.1)] transition-all font-sans appearance-none">
                <option>Sedentary</option>
                <option>Moderate</option>
                <option>Active</option>
                <option>Athlete</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center justify-center gap-8 py-10 w-full max-w-md mx-auto">
             <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-card-border/50 border-t-primary/50 animate-spin-slow" />
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} 
                  transition={{ duration: 4, repeat: Infinity }} 
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-purple blur-md mix-blend-screen" 
                />
             </div>
             <div className="text-center">
               <Heading as="h4" className="text-2xl mb-2">Synthesizing Twin</Heading>
               <p className="text-foreground/50 font-mono text-sm tracking-widest uppercase">Connecting variables...</p>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative p-6">
      
      {/* Background Ambient Layers */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl relative z-10"
      >
        <GlassCard className="p-12 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col items-center justify-center mb-12 text-center">
             <IconContainer colorClass="bg-primary/10 text-primary border-primary/20 mb-6">
               <ShieldCheck className="w-6 h-6" />
             </IconContainer>
             <Heading className="text-4xl mb-4">Initialize Twin</Heading>
             <Subheading className="text-lg">Please provide your baseline telemetry to calibrate the simulation engine.</Subheading>
          </div>

          <div className="flex items-center justify-center mb-12 max-w-sm mx-auto">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-primary text-white shadow-[0_0_20px_rgba(79,140,255,0.4)]' : isPast ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-surface border border-card-border text-foreground/40'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-4 transition-colors duration-500 ${isPast ? 'bg-primary/50' : 'bg-card-border'}`} />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          <div className="min-h-[250px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {getStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-12 flex justify-end">
            <Button onClick={handleNext} className="w-full sm:w-auto min-w-[200px] group">
              {currentStep === 3 ? 'Launch Dashboard' : 'Continue'}
              {currentStep < 3 && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
