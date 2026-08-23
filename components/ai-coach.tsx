'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, Heading, IconContainer } from './ui';
import { BrainCircuit, Send, Loader2, TrendingUp, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { getAIHealthSummary, getAIRecommendations, askAICoach } from '@/lib/api';

interface AICoachProps {
  profileId: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  'Why is my score what it is?',
  'What should I focus on first?',
  'How can I improve my sleep?',
  'What is my biggest health risk?',
  'How does my BMI affect my score?',
];

export function AICoach({ profileId }: AICoachProps) {
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [recommendations, setRecommendations] = useState<Record<string, unknown> | null>(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [sum, recs] = await Promise.all([
          getAIHealthSummary(profileId),
          getAIRecommendations(profileId),
        ]);
        setSummary(sum);
        setRecommendations(recs);
        // Add welcome message
        setMessages([{
          role: 'assistant',
          content: (sum as Record<string, unknown>).summary as string ||
            'Hello! I am your MediTwin AI Health Coach. Ask me anything about your health data.',
          timestamp: new Date(),
        }]);
      } catch (e) {
        console.error('AI load error', e);
      } finally {
        setLoadingInit(false);
      }
    };
    load();
  }, [profileId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (question?: string) => {
    const q = question || input.trim();
    if (!q) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q, timestamp: new Date() }]);
    setChatLoading(true);

    try {
      const res = await askAICoach(profileId, q);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: (res as Record<string, unknown>).answer as string || 'I encountered an issue. Please try again.',
        timestamp: new Date(),
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble connecting to the AI service. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const recs = recommendations?.prioritized_recommendations as string[] | undefined;
  const insights = summary?.key_insights as string[] | undefined;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <IconContainer colorClass="bg-purple/10 text-purple border-purple/20">
          <BrainCircuit className="w-5 h-5" />
        </IconContainer>
        <div>
          <Heading className="text-3xl">AI Intelligence</Heading>
          <p className="text-foreground/50 text-sm mt-1">Powered by Gemini. Personalized to your health profile.</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald/10 border border-emerald/20">
          <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
          <span className="text-xs font-mono text-emerald">Online</span>
        </div>
      </div>

      {loadingInit ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
              <Loader2 className="w-8 h-8 text-primary" />
            </motion.div>
            <p className="text-sm font-mono text-foreground/40 uppercase tracking-widest">Consulting Gemini...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left: Summary + Recommendations */}
          <div className="flex flex-col gap-6">
            {/* Health Summary */}
            {summary && (
              <GlassCard className="p-6 border-l-4 border-l-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono text-primary/70 uppercase tracking-widest">Today's Summary</span>
                </div>
                <p className="text-foreground/80 leading-relaxed relative z-10">
                  {String(summary.summary)}
                </p>
              </GlassCard>
            )}

            {/* Key Insights */}
            {insights && insights.length > 0 && (
              <GlassCard className="p-6 flex flex-col gap-4">
                <h3 className="text-sm font-mono text-foreground/50 uppercase tracking-widest">Key Insights</h3>
                {insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <TrendingUp className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/70 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </GlassCard>
            )}

            {/* Recommendations */}
            {recs && recs.length > 0 && (
              <GlassCard className="p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-mono text-foreground/50 uppercase tracking-widest">Priority Actions</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">
                    AI Generated
                  </span>
                </div>
                {recs.map((rec, i) => {
                  const isHigh = rec.includes('High');
                  const isMed = rec.includes('Medium');
                  const badgeColor = isHigh ? 'bg-danger/10 text-danger border-danger/20'
                    : isMed ? 'bg-warning/10 text-warning border-warning/20'
                    : 'bg-emerald/10 text-emerald border-emerald/20';
                  const impact = isHigh ? 'High' : isMed ? 'Medium' : 'Low';
                  const text = rec.replace(/Expected Impact: (High|Medium|Low)/, '').replace(/Priority \d+: /, '').trim();
                  return (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl border border-card-border/50 bg-surface/30 hover:bg-surface transition-colors group">
                      <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono text-primary shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground/80 leading-relaxed">{text}</p>
                        <span className={`inline-flex mt-2 items-center text-xs px-2 py-0.5 rounded-full border font-mono ${badgeColor}`}>
                          {impact} Impact
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-colors shrink-0 mt-1" />
                    </div>
                  );
                })}
                {(recommendations as Record<string, unknown>)?.disclaimer
                  ? (
                    <p className="text-xs text-foreground/30 leading-relaxed pt-2 border-t border-card-border/50">
                      {String((recommendations as Record<string, unknown>).disclaimer)}
                    </p>
                  ) : null}
              </GlassCard>
            )}
          </div>

          {/* Right: Chat */}
          <div className="flex flex-col gap-4">
            <GlassCard className="flex flex-col overflow-hidden" style={{ height: '600px' }}>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-card-border/50 flex items-center gap-3 bg-surface/30">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald animate-pulse shadow-[0_0_8px_rgba(50,213,131,0.5)]" />
                <span className="text-sm font-medium">Chat with your Twin</span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-primary text-white rounded-[20px] rounded-tr-sm shadow-[0_4px_12px_rgba(79,140,255,0.3)]'
                            : 'bg-surface border border-card-border rounded-[20px] rounded-tl-sm text-foreground/80'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {chatLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="px-5 py-3.5 bg-surface border border-card-border rounded-[20px] rounded-tl-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.3s]" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              {/* Quick Questions */}
              <div className="px-5 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
                {QUICK_QUESTIONS.map(q => (
                  <button key={q} onClick={() => sendMessage(q)} disabled={chatLoading}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-card-border bg-surface hover:border-primary/30 hover:text-primary transition-all whitespace-nowrap text-foreground/60">
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-card-border/50 bg-surface/30">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Ask your digital twin anything..."
                    className="flex-1 bg-surface border border-card-border rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(79,140,255,0.1)] transition-all placeholder:text-foreground/30"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={chatLoading || !input.trim()}
                    className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shrink-0 hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(79,140,255,0.3)] disabled:opacity-40"
                  >
                    {chatLoading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* Risk Warning */}
            {(summary as Record<string, unknown>)?.score_explanation
              ? (
                <GlassCard className="p-5 border border-warning/20 bg-warning/5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      <strong className="text-foreground/90">Score Context: </strong>
                      {String((summary as Record<string, unknown>).score_explanation)}
                    </p>
                  </div>
                </GlassCard>
              ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
