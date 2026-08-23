'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, LayoutDashboard, BrainCircuit, LineChart, History, Settings, LogOut, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './ui';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'simulations', label: 'Simulations', icon: Activity },
    { id: 'insights', label: 'Insights', icon: BrainCircuit },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
  ];

  const bottomItems = [
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 100 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-screen fixed left-0 top-0 pt-8 pb-6 px-6 z-50 flex"
    >
      <div className="w-full h-full glass-card border border-card-border/50 bg-surface/60 backdrop-blur-3xl flex flex-col pt-8 pb-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] rounded-[32px] overflow-hidden relative group">
        
        {/* Collapse Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-10 w-8 h-8 rounded-full bg-surface border border-card-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-50 hover:bg-card hover:text-primary"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Brand */}
        <div className="flex items-center justify-between px-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="min-w-10 min-h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <span className={cn("font-sans font-bold text-2xl tracking-tight text-foreground whitespace-nowrap transition-all duration-300", isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto")}>
              MediTwin
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            const Icon = item.icon;
            return (
              <a key={item.id} href={`#${item.id}`} onClick={(e) => handleNavClick(item.id, e)} title={isCollapsed ? item.label : undefined}>
                <motion.div
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors duration-300 relative group/item",
                    isActive ? "text-primary" : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeSidebarTab" 
                      className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] pointer-events-none"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className={cn("w-5 h-5 z-10 transition-transform group-hover/item:translate-x-0.5", isActive ? "text-primary drop-shadow-[0_0_8px_rgba(79,140,255,0.5)]" : "")} />
                  <span className={cn("font-medium text-[15px] z-10 tracking-wide whitespace-nowrap transition-all duration-300", isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto ml-2")}>
                    {item.label}
                  </span>
                </motion.div>
              </a>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto px-4 flex flex-col gap-2">
          {bottomItems.map((item) => {
            const isActive = activeId === item.id;
            const Icon = item.icon;
            return (
              <a key={item.id} href={`#${item.id}`} onClick={(e) => handleNavClick(item.id, e)} title={isCollapsed ? item.label : undefined}>
                <motion.div
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors duration-300 relative group/item",
                    isActive ? "text-primary" : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeSidebarTab" 
                      className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] pointer-events-none"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className={cn("w-5 h-5 z-10 transition-transform group-hover/item:translate-x-0.5", isActive ? "text-primary drop-shadow-[0_0_8px_rgba(79,140,255,0.5)]" : "")} />
                  <span className={cn("font-medium text-[15px] z-10 tracking-wide whitespace-nowrap transition-all duration-300", isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto ml-2")}>
                    {item.label}
                  </span>
                </motion.div>
              </a>
            );
          })}
          
          <div className="h-px bg-card-border/50 my-2" />

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors group/theme"
              title={isCollapsed ? "Toggle Theme" : undefined}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 transition-transform group-hover/theme:rotate-90" />
              ) : (
                <Moon className="w-5 h-5 transition-transform group-hover/theme:-rotate-12" />
              )}
              <span className={cn("font-medium text-[15px] tracking-wide whitespace-nowrap transition-all duration-300", isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto ml-2")}>
                Theme
              </span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
