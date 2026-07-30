'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard, Heading, IconContainer } from './ui';
import { BrainCircuit, AlertCircle, TrendingUp, ShieldAlert, MessageSquare, ArrowRight } from 'lucide-react';
import { getAIRecommendations } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export function AICoach() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    getAIRecommendations().then(setRecommendations);
  }, []);

  return (
    <section className="w-full max-w-[1200px] mx-auto px-10 py-20 pb-40 border-t border-card-border/50 relative">
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-purple/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      
      <div className="flex items-center gap-6 mb-16 relative z-10">
        <IconContainer colorClass="bg-purple/10 text-purple border-purple/20">
          <BrainCircuit className="w-6 h-6" />
        </IconContainer>
        <Heading className="text-4xl">Twin Intelligence</Heading>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Intelligence Summary */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <GlassCard glowEffect className="p-10 border-l-4 border-l-primary relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
               <div className="flex items-start gap-6 relative z-10">
                  <div className="mt-1">
                    <IconContainer colorClass="bg-primary/10 text-primary border-primary/20 w-10 h-10">
                      <AlertCircle className="w-5 h-5" />
                    </IconContainer>
                  </div>
                  <div>
                    <h4 className="text-2xl font-sans font-bold mb-3 tracking-tight">Today's Observation</h4>
                    <p className="text-foreground/70 leading-relaxed text-lg font-sans">
                      Your digital twin indicates a persistent hydration deficit during afternoon focus blocks, which is slightly elevating your stress baseline. Immediate correction is advised to support your recent 12% increase in daily activity volume.
                    </p>
                  </div>
               </div>
            </GlassCard>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <GlassCard className="p-8 h-full flex flex-col gap-6 relative overflow-hidden group">
                {/* Floating Gradient Background */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                  className="absolute top-0 right-0 w-[200px] h-[200px] bg-warning/10 blur-[60px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4"
                />
                
                {/* Subtle Moving Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                   <motion.div animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-[20%] left-[80%] w-1.5 h-1.5 rounded-full bg-warning shadow-[0_0_8px_rgba(253,176,34,0.8)]" />
                   <motion.div animate={{ y: [0, 15, 0], opacity: [0.1, 0.4, 0.1] }} transition={{ repeat: Infinity, duration: 6, delay: 1 }} className="absolute bottom-[30%] left-[20%] w-2 h-2 rounded-full bg-danger shadow-[0_0_8px_rgba(249,112,102,0.8)]" />
                </div>

                <div className="flex items-center gap-4 relative z-10">
                  <IconContainer colorClass="bg-warning/10 text-warning border-warning/20 w-10 h-10">
                    <ShieldAlert className="w-5 h-5" />
                  </IconContainer>
                  <h5 className="font-sans text-xl text-foreground tracking-wide">Risk Intelligence</h5>
                </div>
                
                <div className="flex items-center gap-6 relative z-10 mt-2">
                  {/* Mini Radial Indicator */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-card-border" />
                      <motion.circle 
                        initial={{ strokeDasharray: '0, 251.2' }}
                        whileInView={{ strokeDasharray: '163.28, 251.2' }} // 65% of 2*PI*40
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" 
                        className="text-warning drop-shadow-[0_0_8px_rgba(253,176,34,0.6)]" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-mono text-xl font-bold text-foreground">65</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground/50 tracking-wide uppercase">Risk Score</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-display text-warning">Elevated</span>
                    </div>
                    <span className="text-xs font-mono text-foreground/40 mt-1">94% Prediction Confidence</span>
                  </div>
                </div>

                {/* Animated Mini Visualization (Pulse line) */}
                <div className="w-full h-8 relative z-10 flex items-center mt-2">
                   <div className="w-full h-[1px] bg-card-border/50 absolute" />
                   <motion.div 
                     initial={{ x: '-100%' }}
                     animate={{ x: '200%' }}
                     transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                     className="w-1/3 h-[2px] bg-gradient-to-r from-transparent via-warning to-transparent absolute shadow-[0_0_10px_rgba(253,176,34,0.8)]"
                   />
                </div>

                <div className="flex flex-col gap-3 mt-auto relative z-10">
                  <span className="text-xs font-medium text-foreground/50 tracking-wide uppercase mb-1">Top Detected Vectors</span>
                  <div className="text-sm text-foreground/70 flex items-center gap-3 bg-surface/50 px-4 py-2.5 rounded-xl border border-card-border hover:border-warning/30 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-warning shadow-[0_0_8px_rgba(253,176,34,0.6)] animate-pulse" /> 
                    Afternoon Dehydration (-0.6L)
                  </div>
                  <div className="text-sm text-foreground/70 flex items-center gap-3 bg-surface/50 px-4 py-2.5 rounded-xl border border-card-border hover:border-danger/30 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-danger shadow-[0_0_8px_rgba(249,112,102,0.6)] animate-pulse" style={{ animationDelay: '0.5s' }} /> 
                    Stress Baseline Drift (+2 points)
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <GlassCard className="p-8 h-full flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <IconContainer colorClass="bg-secondary/10 text-secondary border-secondary/20 w-10 h-10">
                    <TrendingUp className="w-5 h-5" />
                  </IconContainer>
                  <h5 className="font-sans text-xl text-foreground tracking-wide">Future Projection</h5>
                </div>
                <p className="text-base text-foreground/60 leading-relaxed mt-auto">
                  Maintaining current simulation variables yields a <span className="text-secondary font-semibold">2.4% increase</span> in baseline vitality over 90 days.
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </div>

        {/* Actionable Recommendations & Chat */}
        <div className="flex flex-col gap-8">
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <GlassCard className="flex-1 p-8 flex flex-col h-full">
              <h4 className="font-sans font-bold text-3xl mb-8 flex items-center justify-between tracking-tight">
                 Priority Actions
                 <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-mono uppercase tracking-widest border border-primary/20">AI Generated</span>
              </h4>
              
              <div className="flex flex-col gap-4 flex-1">
                {recommendations.map(rec => (
                  <div key={rec.id} className="p-5 rounded-2xl border border-card-border/50 bg-surface/30 hover:bg-surface hover:shadow-glass hover:-translate-y-1 transition-all cursor-pointer group">
                    <h6 className="font-sans text-lg mb-2 text-foreground flex justify-between items-center">
                      {rec.title}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                    </h6>
                    <p className="text-sm text-foreground/50 leading-relaxed">{rec.description}</p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => setChatOpen(!chatOpen)}
                className="mt-8 w-full py-4 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(79,140,255,0.2)]"
              >
                <MessageSquare className="w-5 h-5" />
                {chatOpen ? 'Close Consultation' : 'Consult Twin Intelligence'}
              </button>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Expandable Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 500, y: 0 }}
            exit={{ opacity: 0, height: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="w-full overflow-hidden mt-8 relative z-20"
          >
            <GlassCard className="w-full h-full flex flex-col p-0 overflow-hidden">
              <div className="px-8 py-5 border-b border-card-border flex items-center justify-between bg-surface/50">
                 <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald animate-pulse shadow-[0_0_10px_rgba(50,213,131,0.5)]" />
                   <span className="font-mono text-sm tracking-widest uppercase text-foreground/70">Intelligence Active</span>
                 </div>
              </div>
              <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-6 custom-scrollbar">
                <div className="self-start max-w-[70%] p-6 rounded-[24px] rounded-tl-sm bg-surface border border-card-border shadow-sm">
                  <p className="text-base text-foreground/80 leading-relaxed font-sans">
                    I noticed you modified your sleep variable in the Scenario Studio. How would you like me to adjust your upcoming nutrition plan to compensate for the recovery deficit?
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-card-border bg-surface/30">
                <input type="text" placeholder="Ask your digital twin anything..." className="w-full bg-surface border border-card-border rounded-full px-6 py-4 text-foreground text-base outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(79,140,255,0.1)] transition-all font-sans" />
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
