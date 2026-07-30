'use client';

import React, { useState } from 'react';
import { Landing } from '@/components/landing';
import { HealthForm } from '@/components/health-form';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 relative overflow-hidden bg-background transition-colors duration-500">
      {/* Global Scroll Progress */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple z-50 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div 
            key="landing" 
            className="w-full"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)', y: -50, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Landing onStart={() => setStarted(true)} />
          </motion.div>
        ) : (
          <motion.div 
            key="form" 
            className="w-full"
            initial={{ opacity: 0, filter: 'blur(10px)', y: 50, scale: 1.05 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <HealthForm />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
