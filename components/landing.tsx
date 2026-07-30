'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Activity, Heart, ArrowRight, ShieldCheck, Sparkles, Brain } from 'lucide-react';
import { Button, GlassCard, Heading, Subheading, IconContainer } from './ui';

export function Landing({ onStart }: { onStart: () => void }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const containerVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 50, damping: 20 }
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-screen pt-40 pb-40 overflow-hidden relative">
      
      {/* ---------------------------
          HERO SECTION (Story Step 1)
          --------------------------- */}
      <motion.section 
        className="w-full max-w-[1400px] px-8 flex flex-col items-center justify-center text-center relative z-10 min-h-[90vh]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ opacity, y }}
      >
        {/* The Digital Twin Orb Preview (Now a massive cohesive background element) */}
        <motion.div 
          variants={itemVariants}
          className="absolute inset-0 m-auto w-[600px] h-[600px] pointer-events-none -z-10 opacity-70"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[150px] rounded-full mix-blend-screen" />
          <motion.div 
            animate={{ scale: [1, 1.05, 1], filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="w-full h-full rounded-full bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] bg-gradient-to-tr from-primary/40 to-purple/40 blur-[4px] shadow-[0_0_100px_rgba(79,140,255,0.3),inset_0_0_80px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 border-[1px] border-white/10 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-0 border-[1px] border-white/5 rounded-full animate-spin-slow-reverse" style={{ animationDuration: '30s' }} />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-card-border bg-surface/50 backdrop-blur-2xl mb-12 shadow-glass relative z-20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground/80 tracking-wide">Introducing MediTwin Intelligence</span>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-8 w-full max-w-5xl relative z-20 px-4">
          <Heading className="text-[clamp(3rem,8vw,6rem)] leading-[1.1] tracking-tight drop-shadow-2xl text-center">
            Meet Your <br />
            <span className="text-gradient">Digital Health Twin.</span>
          </Heading>
          <Subheading className="max-w-2xl text-[clamp(1.1rem,3vw,1.5rem)] mt-4 font-sans text-foreground/80 drop-shadow-md text-center px-4">
            An intelligent operating system that simulates tomorrow’s health before it becomes today’s problem.
          </Subheading>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16 relative z-20">
          <Button size="lg" onClick={onStart} className="group min-w-[220px] shadow-[0_0_40px_rgba(79,140,255,0.4)]">
            Create My Twin
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.section>

      {/* ---------------------------
          THE PROBLEM & NARRATIVE (Story Step 2)
          --------------------------- */}
      <section className="w-full max-w-[1200px] px-8 mt-[30vh]">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-200px" }}
          variants={itemVariants}
          className="max-w-3xl"
        >
          <Heading className="text-5xl md:text-7xl mb-8">
            Healthcare is reactive.<br/>You shouldn't be.
          </Heading>
          <Subheading className="text-2xl">
            By the time clinical symptoms appear, the underlying systemic imbalances have been progressing for years. MediTwin identifies the subtle correlations in your data to project future states.
          </Subheading>
        </motion.div>
      </section>

      {/* ---------------------------
          CAPABILITIES (Story Step 3)
          --------------------------- */}
      <section className="w-full max-w-[1400px] px-8 mt-[30vh]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8"
          >
            <GlassCard glowEffect className="h-[600px] flex flex-col justify-end p-12 relative overflow-hidden">
              <div className="absolute top-12 left-12">
                 <IconContainer colorClass="bg-purple/10 text-purple border-purple/20">
                   <ShieldCheck className="w-6 h-6" />
                 </IconContainer>
              </div>
              <Heading className="text-5xl mb-6">Risk Intelligence</Heading>
              <Subheading className="max-w-xl text-xl">
                Identify cardiovascular, metabolic, and neurological risks years before they manifest in clinical settings.
              </Subheading>
            </GlassCard>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 flex flex-col gap-8"
          >
            <GlassCard glowEffect className="flex-1 flex flex-col justify-end p-10">
              <IconContainer colorClass="bg-emerald/10 text-emerald border-emerald/20 mb-8">
                <Heart className="w-6 h-6" />
              </IconContainer>
              <Heading as="h3" className="text-3xl mb-4">Lifestyle Simulation</Heading>
              <Subheading className="text-lg">Dial in sleep and nutrition to instantly visualize the 5-year impact.</Subheading>
            </GlassCard>

            <GlassCard glowEffect className="flex-1 flex flex-col justify-end p-10">
              <IconContainer colorClass="bg-secondary/10 text-secondary border-secondary/20 mb-8">
                <Brain className="w-6 h-6" />
              </IconContainer>
              <Heading as="h3" className="text-3xl mb-4">Active AI Coach</Heading>
              <Subheading className="text-lg">A continuous observer that adjusts recommendations seamlessly.</Subheading>
            </GlassCard>
          </motion.div>

        </div>
      </section>
      
      {/* ---------------------------
          CTA (Story Step 4)
          --------------------------- */}
      <section className="w-full max-w-[1000px] px-8 mt-[30vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-200px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassCard className="p-20 text-center border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
            <Heading className="text-6xl md:text-7xl mb-8 relative z-10">
              Take control of your timeline.
            </Heading>
            <Button size="lg" onClick={onStart} className="relative z-10 mt-8 min-w-[240px]">
              Initialize Twin
            </Button>
          </GlassCard>
        </motion.div>
      </section>

    </div>
  );
}
