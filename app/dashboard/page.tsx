'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { DashboardOverview, DashboardLoading, DashboardError } from '@/components/dashboard';
import { ScenarioStudio } from '@/components/scenario-studio';
import { AICoach } from '@/components/ai-coach';
import { getProfile, getScore, ScoreResponse, ProfileResponse } from '@/lib/api';

const PAGE_VARIANTS = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
  exit:   { opacity: 0, y: -20, filter: 'blur(8px)', transition: { duration: 0.3 } },
};

export default function DashboardPage() {
  const router = useRouter();
  const [active, setActive] = useState('overview');
  const [profileId, setProfileId] = useState<number | null>(null);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [score, setScore] = useState<ScoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const [prof, sc] = await Promise.all([getProfile(id), getScore(id)]);
      setProfile(prof);
      setScore(sc);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load twin data.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('meditwin_profile_id');
    if (!stored) {
      router.replace('/');
      return;
    }
    const id = parseInt(stored, 10);
    setProfileId(id);
    load(id);
  }, []);

  const profileForSidebar = profile && score
    ? { name: profile.full_name, overall_score: score.overall_score, risk_category: score.risk_category }
    : undefined;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar active={active} onNavigate={setActive} profile={profileForSidebar} />

      {/* Main Content */}
      <main className="flex-1 ml-[72px] md:ml-64 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">

          {/* Page Heading */}
          <div className="mb-10">
            <p className="text-xs font-mono text-foreground/30 uppercase tracking-widest mb-1">MediTwin AI</p>
            <h1 className="text-2xl font-sans font-semibold text-foreground">
              {active === 'overview'   && 'Health Overview'}
              {active === 'biomarkers'&& 'Biomarkers'}
              {active === 'simulation'&& 'Scenario Studio'}
              {active === 'ai'        && 'AI Intelligence'}
            </h1>
          </div>

          {/* Content */}
          {loading ? (
            <DashboardLoading />
          ) : error ? (
            <DashboardError message={error} onRetry={() => profileId && load(profileId)} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={active} variants={PAGE_VARIANTS} initial="hidden" animate="visible" exit="exit">
                {active === 'overview' && score && profile && (
                  <DashboardOverview score={score} profileName={profile.full_name} />
                )}
                {active === 'biomarkers' && score && profile && (
                  <DashboardOverview score={score} profileName={profile.full_name} />
                )}
                {active === 'simulation' && profileId && (
                  <ScenarioStudio profileId={profileId} />
                )}
                {active === 'ai' && profileId && (
                  <AICoach profileId={profileId} />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
