'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export function MiniTrendChart({ data, trend }: { data: any[], trend: 'up' | 'down' | 'stable' }) {
  const strokeColor = trend === 'up' ? '#32D583' : trend === 'down' ? '#F97066' : '#52D3FF';
  const shadowColor = trend === 'up' ? 'rgba(50,213,131,0.5)' : trend === 'down' ? 'rgba(249,112,102,0.5)' : 'rgba(82,211,255,0.5)';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full h-[60px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            <linearGradient id={`gradient-${trend}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={1} />
            </linearGradient>
          </defs>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={`url(#gradient-${trend})`} 
            strokeWidth={3} 
            dot={false}
            isAnimationActive={true}
            animationDuration={1500}
            animationBegin={300}
            animationEasing="ease-out"
            style={{
              filter: `drop-shadow(0px 4px 8px ${shadowColor})`
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function DetailedTrendChart({ data }: { data: any[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F8CFF" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4F8CFF" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4F8CFF" />
              <stop offset="100%" stopColor="#7A5AF8" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'var(--font-mono)' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
          />
          <Tooltip 
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{ 
              backgroundColor: 'rgba(14, 23, 38, 0.6)', 
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.2s ease-out'
            }}
            itemStyle={{ color: '#4F8CFF', fontWeight: 600 }}
            labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="url(#lineColor)" 
            strokeWidth={4} 
            dot={false}
            activeDot={{ r: 8, fill: '#4F8CFF', stroke: '#fff', strokeWidth: 3, filter: 'drop-shadow(0 0 12px rgba(79,140,255,0.9))' }}
            isAnimationActive={true}
            animationDuration={2500}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
