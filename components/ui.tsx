'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, HTMLMotionProps, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------
// Animated Number Component
// ---------------------------
export function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      const controls = animate(parseFloat(node.textContent?.replace(/[^\d.-]/g, '') || "0"), value, {
        duration: 1.2,
        type: 'spring',
        stiffness: 50,
        damping: 15,
        onUpdate(v) {
          if (nodeRef.current) {
            nodeRef.current.textContent = `${prefix}${v.toFixed(1).replace(/\.0$/, '')}${suffix}`;
          }
        },
      });
      return () => controls.stop();
    }
  }, [value, prefix, suffix]);

  return <span ref={nodeRef}>{prefix}{value}{suffix}</span>;
}

// ---------------------------
// Button Component (Magnetic & Animated)
// ---------------------------
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const hX = e.clientX - rect.left - rect.width / 2;
      const hY = e.clientY - rect.top - rect.height / 2;
      x.set(hX * 0.2);
      y.set(hY * 0.2);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };
    
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group";
    
    const variants = {
      primary: "primary-btn border border-primary/20",
      secondary: "glass-card hover:bg-card/80 text-foreground",
      outline: "border border-primary/50 text-primary hover:bg-primary/10",
      ghost: "hover:bg-foreground/5 text-foreground/80 hover:text-foreground",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg font-semibold",
    };

    return (
      <motion.button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        style={{ x: mouseXSpring, y: mouseYSpring }}
        whileTap={{ scale: 0.95 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...(props as any)}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <span className="relative z-10 flex items-center">{children}</span>
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-white/20 blur-[20px] rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out opacity-0 group-hover:opacity-100" />
        )}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

// ---------------------------
// Glass Card Component (3D Tilt & Glow)
// ---------------------------
interface GlassCardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
  glowEffect?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hoverEffect = true, glowEffect = false, isLoading = false, children, ...props }, ref) => {
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);
    
    const rotateX = useTransform(y, [0, 1], [4, -4]);
    const rotateY = useTransform(x, [0, 1], [-4, 4]);
    
    const springConfig = { stiffness: 150, damping: 20 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hoverEffect) return;
      const rect = e.currentTarget.getBoundingClientRect();
      x.set((e.clientX - rect.left) / rect.width);
      y.set((e.clientY - rect.top) / rect.height);
    };

    const handleMouseLeave = () => {
      if (!hoverEffect) return;
      x.set(0.5);
      y.set(0.5);
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "glass-card group",
          className
        )}
        style={hoverEffect ? { rotateX: springRotateX, rotateY: springRotateY, transformPerspective: 1000 } : {}}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-surface/50 backdrop-blur-xl z-50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
        
        {glowEffect && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-primary/10 to-transparent mix-blend-overlay" />
        )}
        
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      </motion.div>
    );
  }
);
GlassCard.displayName = 'GlassCard';

// ---------------------------
// Typography Components
// ---------------------------
export const Heading = ({ children, className, as: Component = 'h2' }: { children: React.ReactNode, className?: string, as?: any }) => (
  <Component className={cn("font-display text-5xl md:text-6xl text-foreground font-normal tracking-tight", className)}>
    {children}
  </Component>
);

export const Subheading = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <p className={cn("text-xl text-foreground/60 font-sans font-normal leading-relaxed tracking-wide", className)}>
    {children}
  </p>
);

// ---------------------------
// Premium Icon Container
// ---------------------------
export const IconContainer = ({ children, colorClass }: { children: React.ReactNode, colorClass?: string }) => (
  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden group border border-card-border transition-colors duration-500", colorClass || "bg-surface text-foreground")}>
    <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-transparent to-current mix-blend-overlay pointer-events-none" />
    <motion.div 
      className="relative z-10"
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      {children}
    </motion.div>
  </div>
);
