'use client';

import React from 'react';
import { Sidebar } from '@/components/sidebar';
import { DashboardOverview } from '@/components/dashboard';
import { ScenarioStudio } from '@/components/scenario-studio';
import { AICoach } from '@/components/ai-coach';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 ml-[300px] relative overflow-hidden">
        {/* Ambient background glows for dashboard */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4 mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple/5 blur-[150px] rounded-full pointer-events-none translate-y-1/4 -translate-x-1/4 mix-blend-screen" />
        
        <div className="h-full overflow-y-auto overflow-x-hidden pt-12 custom-scrollbar flex flex-col pb-32">
           <motion.div
             initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
             animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           >
             <DashboardOverview />
           </motion.div>
        </div>
      </main>
    </div>
  );
}
