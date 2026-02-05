'use client';

/**
 * OracleHero — Scroll-driven chip assembly with SVG circuit paths
 *
 * Sticky hero section. As user scrolls, chips connect to central Core
 * via neon indigo circuit paths (stroke-dashoffset animation).
 * Dynamic state text: Detecting → Predicting → Activated.
 */

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  TrendingUp,
  Target,
  ShieldAlert,
  Zap,
  Activity,
  Brain,
} from 'lucide-react';

/** Chip data for the assembly ring */
const ORACLE_CHIPS = [
  { id: 'transactions', label: 'Islemler', Icon: TrendingUp, delay: 0 },
  { id: 'goals', label: 'Hedefler', Icon: Target, delay: 0.15 },
  { id: 'risk', label: 'Risk Analizi', Icon: ShieldAlert, delay: 0.3 },
] as const;

/** State text progression */
const ORACLE_STATES = [
  { label: 'Kaliplari Tespit Ediyor', Icon: Activity },
  { label: 'Nakit Akisi Tahmin Ediyor', Icon: Zap },
  { label: 'Oracle Aktif', Icon: Brain },
] as const;

export function OracleHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stateIndex, setStateIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-driven transforms
  const coreScale = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.8, 1, 1.05]);
  const coreOpacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 1]);
  const glowIntensity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.6]);

  // Chip positions driven by scroll
  const chip0Y = useTransform(scrollYProgress, [0, 0.3], [40, 0]);
  const chip1Y = useTransform(scrollYProgress, [0.1, 0.4], [40, 0]);
  const chip2Y = useTransform(scrollYProgress, [0.2, 0.5], [40, 0]);
  const chipYs = [chip0Y, chip1Y, chip2Y];

  const chip0Opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const chip1Opacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const chip2Opacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const chipOpacities = [chip0Opacity, chip1Opacity, chip2Opacity];

  // Circuit path visibility
  const pathDraw = useTransform(scrollYProgress, [0.15, 0.5], [200, 0]);

  // State text rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setStateIndex((prev) => (prev + 1) % ORACLE_STATES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentState = ORACLE_STATES[stateIndex];

  return (
    <div ref={containerRef} className="relative min-h-[60vh]">
      <div className="sticky top-16 flex flex-col items-center justify-center py-8">
        {/* SVG Circuit Layer */}
        <div className="relative w-full max-w-sm mx-auto" style={{ height: 280 }}>
          <svg
            viewBox="0 0 320 280"
            fill="none"
            className="absolute inset-0 w-full h-full circuit-glow"
            aria-hidden="true"
          >
            {/* Circuit paths from chips to core center */}
            {/* Left path: Transactions → Core */}
            <motion.path
              d="M60 80 Q60 140 160 160"
              stroke="rgba(59, 130, 246, 0.6)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              style={{
                strokeDasharray: 200,
                strokeDashoffset: pathDraw,
              }}
            />
            {/* Top path: Goals → Core */}
            <motion.path
              d="M160 50 Q160 100 160 160"
              stroke="rgba(59, 130, 246, 0.6)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              style={{
                strokeDasharray: 200,
                strokeDashoffset: pathDraw,
              }}
            />
            {/* Right path: Risk → Core */}
            <motion.path
              d="M260 80 Q260 140 160 160"
              stroke="rgba(59, 130, 246, 0.6)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              style={{
                strokeDasharray: 200,
                strokeDashoffset: pathDraw,
              }}
            />

            {/* Core node glow ring */}
            <motion.circle
              cx="160"
              cy="160"
              r="28"
              stroke="rgba(59, 130, 246, 0.4)"
              strokeWidth="1"
              fill="none"
              style={{ opacity: glowIntensity }}
            />
            <motion.circle
              cx="160"
              cy="160"
              r="40"
              stroke="rgba(59, 130, 246, 0.15)"
              strokeWidth="0.5"
              fill="none"
              style={{ opacity: glowIntensity }}
            />
          </svg>

          {/* Chip nodes positioned over SVG */}
          <div className="absolute inset-0">
            {ORACLE_CHIPS.map((chip, i) => {
              const positions = [
                { left: '5%', top: '15%' },
                { left: '37%', top: '0%' },
                { left: '68%', top: '15%' },
              ];
              return (
                <motion.div
                  key={chip.id}
                  className="absolute"
                  style={{
                    ...positions[i],
                    y: chipYs[i],
                    opacity: chipOpacities[i],
                  }}
                >
                  <div className="flex items-center gap-2 rounded-full bg-zinc-900/60 border border-white/10 px-3.5 py-2 backdrop-blur-sm">
                    <chip.Icon size={14} className="text-accent-400" strokeWidth={2} />
                    <span className="text-xs font-medium text-slate-300">{chip.label}</span>
                  </div>
                </motion.div>
              );
            })}

            {/* Central Core Node */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: '48%',
                scale: coreScale,
                opacity: coreOpacity,
              }}
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl ai-gradient shadow-lg shadow-accent-500/30">
                <Brain size={28} className="text-white" strokeWidth={1.5} />
                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-accent-400/30"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* State Text — dynamic rotation */}
        <motion.div
          className="mt-6 flex flex-col items-center gap-2"
          key={stateIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 rounded-full bg-zinc-900/60 border border-white/10 px-4 py-2 backdrop-blur-sm">
            <currentState.Icon size={14} className="text-accent-400" strokeWidth={2} />
            <span className="text-sm font-medium text-slate-300">{currentState.label}</span>
          </div>
        </motion.div>

        {/* Title */}
        <h2 className="mt-4 text-center text-xl font-bold text-white tracking-tight">
          Oracle <span className="text-gradient">Core</span>
        </h2>
        <p className="mt-1 text-center text-sm text-slate-500 max-w-xs">
          Verileriniz birlesiyor. Harcama, hedef ve risk sinyalleri tek merkezde analiz ediliyor.
        </p>
      </div>
    </div>
  );
}

export default OracleHero;
