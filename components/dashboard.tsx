'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTwinData } from '@/lib/api';
import { TwinData, mockTwinData, mockTimelineEvents } from '@/lib/mock-data';
import { GlassCard, Heading, Subheading, IconContainer, AnimatedNumber } from './ui';
import { Activity, Heart, Moon, Zap, Coffee, ArrowUpRight, ArrowDownRight, ArrowRight, History, Settings } from 'lucide-react';
import { MiniTrendChart } from './charts';
import { ScenarioStudio } from './scenario-studio';
import { AICoach } from './ai-coach';

export function DashboardOverview() {
  const [data, setData] = useState<TwinData>(mockTwinData);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    // Re-sync data if needed
    getTwinData().then(setData);
  }, []);

  const handleSimulateState = (state: boolean) => {
    setIsSimulating(state);
    if (!state) {
      // Re-fetch data to trigger animations on update
      getTwinData().then(setData);
    }
  };


  const orbBaseColor = data.status === 'Healthy' ? 'from-emerald to-primary' : data.status === 'Moderate' ? 'from-warning to-primary' : 'from-danger to-purple';
  const shadowColor = data.status === 'Healthy' ? 'rgba(50,213,131,0.3)' : data.status === 'Moderate' ? 'rgba(253,176,34,0.3)' : 'rgba(249,112,102,0.3)';

  const getIconForMetric = (name: string) => {
    if (name.includes('Heart')) return <Heart className="w-5 h-5" />;
    if (name.includes('Sleep')) return <Moon className="w-5 h-5" />;
    if (name.includes('Stress')) return <Zap className="w-5 h-5" />;
    if (name.includes('Activity')) return <Activity className="w-5 h-5" />;
    return <Coffee className="w-5 h-5" />;
  };

  // Cinematic Entrance Stagger Variants
  const containerVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 80, damping: 20 }
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="w-full max-w-[1200px] mx-auto px-10 flex flex-col gap-32"
    >
      
      {/* ---------------------------
          CINEMATIC TWIN SNAPSHOT
          --------------------------- */}
      <section id="dashboard" className="w-full relative flex flex-col lg:flex-row items-center justify-between gap-16 min-h-[60vh] pt-10">
        
        {/* Left Side: Summary & Status */}
        <div className="flex-1 flex flex-col gap-8 z-10">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-card-border bg-surface/30 backdrop-blur-xl shadow-glass w-max">
             <div className={`w-2 h-2 rounded-full ${data.status === 'Healthy' ? 'bg-emerald' : 'bg-warning'} ${isSimulating ? 'animate-ping' : 'animate-pulse'}`} />
             <span className="text-xs font-mono text-foreground/80 uppercase tracking-widest font-semibold">{data.status} State</span>
          </motion.div>
          
          <div className="flex flex-col gap-4">
            <motion.div variants={itemVariants}>
              <Heading className="text-6xl lg:text-7xl">{data.name}</Heading>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Subheading className="text-xl max-w-lg mt-2">
                {data.summary}
              </Subheading>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="flex items-center gap-12 mt-4">
            <div>
              <p className="text-sm font-medium text-foreground/50 mb-1 tracking-wide">Prediction Confidence</p>
              <p className="text-3xl font-sans font-bold text-foreground">
                <AnimatedNumber value={data.predictionConfidence} suffix="%" />
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/50 mb-1 tracking-wide">Last Simulation</p>
              <p className="text-3xl font-sans font-bold text-foreground">{data.lastSimulation}</p>
            </div>
          </motion.div>
        </div>

        {/* Center: Digital Twin Orb (Signature Element) */}
        <motion.div 
          variants={itemVariants} 
          className="flex-1 flex justify-center items-center relative min-h-[500px] group"
        >
           {/* Layer 1: Ambient Glow */}
           <motion.div 
             animate={{ scale: isSimulating ? [1, 1.4, 1] : [1, 1.2, 1], opacity: isSimulating ? [0.6, 0.9, 0.6] : [0.3, 0.5, 0.3] }}
             transition={{ repeat: Infinity, duration: isSimulating ? 2 : 6, ease: "easeInOut" }}
             className={`absolute w-[450px] h-[450px] bg-gradient-to-tr ${orbBaseColor} blur-[120px] mix-blend-screen transition-colors duration-1000 pointer-events-none`}
           />

           {/* Layer 2: Outer Ring */}
           <motion.div 
             animate={{ rotate: isSimulating ? 360 : 0 }}
             transition={{ repeat: Infinity, duration: isSimulating ? 8 : 40, ease: "linear" }}
             className="absolute w-[420px] h-[420px] rounded-full border border-card-border/10 border-t-card-border/30 border-b-card-border/30 pointer-events-none"
           />

           {/* Layer 3: Rotating Ring */}
           <motion.div 
             animate={{ rotate: isSimulating ? -360 : 0 }}
             transition={{ repeat: Infinity, duration: isSimulating ? 12 : 60, ease: "linear" }}
             className="absolute w-[380px] h-[380px] rounded-full border border-dashed border-card-border/20 pointer-events-none"
           />

           {/* Layer 7: Floating Particles */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute w-[350px] h-[350px]">
                 <div className={`absolute top-[10%] left-[20%] w-2 h-2 rounded-full ${data.status !== 'Healthy' ? 'bg-danger' : 'bg-emerald'} shadow-[0_0_10px_rgba(255,255,255,0.8)] blur-[1px] animate-pulse`} />
                 <div className={`absolute bottom-[20%] right-[15%] w-3 h-3 rounded-full ${data.status === 'Healthy' ? 'bg-emerald' : 'bg-purple'} shadow-[0_0_10px_rgba(255,255,255,0.8)] blur-[2px] animate-pulse`} style={{ animationDelay: '1s' }} />
                 <div className={`absolute top-[40%] right-[5%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse`} style={{ animationDelay: '2s' }} />
              </motion.div>
           </div>

           {/* Core Orb Container (Layers 4, 5, 6, 8) */}
           <motion.div 
             whileHover={{ scale: 1.05, filter: 'brightness(1.2)' }}
             animate={{ scale: isSimulating ? [1, 1.08, 1] : [1, 1.03, 1] }}
             transition={{ scale: { repeat: Infinity, duration: isSimulating ? 1.5 : 4, ease: "easeInOut" } }}
             className={`w-[320px] h-[320px] rounded-full relative overflow-hidden transition-all duration-1000 cursor-crosshair z-30 shadow-2xl`}
             style={{ boxShadow: `0 20px 60px ${shadowColor}, inset 0 0 40px rgba(0,0,0,0.5)` }}
           >
              {/* Layer 4: Glass Ring (Inner Border) */}
              <div className="absolute inset-0 rounded-full border border-white/20 z-30 pointer-events-none mix-blend-overlay" />

              {/* Layer 5: Core Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${orbBaseColor} opacity-90 transition-colors duration-1000`} />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.7)_100%)] pointer-events-none" />

              {/* Layer 6: Health Pulse */}
              <motion.div 
                animate={{ opacity: isSimulating ? [0, 0.4, 0] : [0, 0.1, 0], scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: isSimulating ? 1.5 : 4, ease: "easeInOut" }}
                className={`absolute inset-0 rounded-full bg-gradient-to-t ${data.status !== 'Healthy' ? 'from-danger' : 'from-white'} mix-blend-overlay`}
              />

              {/* Layer 8: Reflection (Top inner highlight) */}
              <div className="absolute top-[2%] left-[10%] right-[10%] h-[35%] bg-gradient-to-b from-white/40 to-transparent rounded-full blur-md mix-blend-overlay opacity-80 pointer-events-none" />
              <div className="absolute bottom-[2%] left-[20%] right-[20%] h-[15%] bg-gradient-to-t from-white/10 to-transparent rounded-full blur-sm mix-blend-overlay opacity-40 pointer-events-none" />

              {/* Data Overlay inside Orb */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-40 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                 <span className="text-8xl font-sans font-bold text-white tracking-tighter" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
                   <AnimatedNumber value={data.vitalityScore} />
                 </span>
                 <span className="text-sm font-mono text-white/80 tracking-widest uppercase mt-4 shadow-black mix-blend-overlay">Vitality</span>
              </div>
           </motion.div>
        </motion.div>
      </section>

      {/* ---------------------------
          HEALTH OVERVIEW CARDS (ANALYTICS)
          --------------------------- */}
      <section id="analytics" className="flex flex-col gap-10">
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <Heading className="text-4xl">Biomarker Overview</Heading>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-2 font-medium tracking-wide">
            View Analysis <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(data.metrics).map((metric) => (
             <GlassCard key={metric.id} glowEffect className="p-6 flex flex-col gap-6 h-full justify-between">
                <div className="flex justify-between items-start">
                  <IconContainer colorClass={metric.status === 'optimal' ? 'bg-emerald/10 text-emerald border-emerald/20' : 'bg-warning/10 text-warning border-warning/20'}>
                    {getIconForMetric(metric.name)}
                  </IconContainer>
                  
                  <motion.div 
                    key={metric.trendValue}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex items-center gap-1 text-xs font-mono font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm border transition-colors duration-500 ${metric.trend === 'up' ? 'bg-emerald/10 text-emerald border-emerald/20' : metric.trend === 'down' ? 'bg-danger/10 text-danger border-danger/20' : 'bg-secondary/10 text-secondary border-secondary/20'}`}
                  >
                    {metric.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : metric.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                    <AnimatedNumber value={metric.trendValue} prefix={metric.trendValue > 0 ? '+' : ''} suffix="%" />
                  </motion.div>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-foreground/60 text-sm font-medium tracking-wide">{metric.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-sans font-bold tracking-tight">
                       <AnimatedNumber value={metric.value} />
                    </span>
                    <span className="text-sm font-mono text-foreground/40">{metric.unit}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-card-border/50">
                  <MiniTrendChart data={metric.history} trend={metric.trend} />
                </div>
              </GlassCard>
          ))}
        </motion.div>
      </section>

      <motion.div variants={itemVariants} id="simulations">
        <ScenarioStudio onSimulationStateChange={handleSimulateState} />
      </motion.div>
      
      <motion.div variants={itemVariants} id="insights">
        <AICoach />
      </motion.div>

      {/* ---------------------------
          HISTORY (SIMULATION TIMELINE)
          --------------------------- */}
      <section id="history" className="flex flex-col gap-10 py-10">
        <motion.div variants={itemVariants}>
          <Heading className="text-4xl">Simulation Timeline</Heading>
          <Subheading className="mt-2 text-lg">Your recent scenario interactions and their outcomes.</Subheading>
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          {mockTimelineEvents.map((event, i) => (
            <GlassCard key={event.id} className="p-6 flex items-center justify-between border-l-4 border-l-primary/50 relative overflow-hidden group hover:border-l-primary transition-colors">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-12 h-12 rounded-full bg-surface/50 border border-card-border flex items-center justify-center shadow-inner">
                  <History className="w-5 h-5 text-foreground/60" />
                </div>
                <div>
                  <h5 className="font-sans font-bold text-lg text-foreground">{event.timeframe}</h5>
                  <p className="text-foreground/60 text-sm mt-1">{event.description}</p>
                </div>
              </div>
              <div className="relative z-10">
                 <span className={`text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border ${event.risk === 'low' ? 'bg-emerald/10 text-emerald border-emerald/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                   {event.risk} Risk
                 </span>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </section>

      {/* ---------------------------
          SETTINGS PANEL
          --------------------------- */}
      <section id="settings" className="flex flex-col gap-10 py-10">
        <motion.div variants={itemVariants}>
          <Heading className="text-4xl">Settings Panel</Heading>
          <Subheading className="mt-2 text-lg">Manage your digital twin parameters and preferences.</Subheading>
        </motion.div>
        <motion.div variants={itemVariants}>
          <GlassCard className="p-10 flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-purple flex items-center justify-center shadow-[0_0_30px_rgba(79,140,255,0.3)]">
                 <span className="font-sans font-bold text-3xl text-white">
                   {data.name.split(' ').map(n => n[0]).join('')}
                 </span>
               </div>
               <div className="flex flex-col gap-1">
                 <h5 className="font-sans text-2xl text-foreground">{data.name}</h5>
                 <p className="text-foreground/50 text-sm tracking-widest uppercase font-mono">Premium Twin Plan</p>
               </div>
            </div>
            <button className="px-8 py-3 rounded-full border border-card-border hover:bg-surface transition-colors font-medium text-foreground tracking-wide flex items-center gap-2">
              <Settings className="w-4 h-4" /> Manage Account
            </button>
          </GlassCard>
        </motion.div>
      </section>
    </motion.div>
  );
}
