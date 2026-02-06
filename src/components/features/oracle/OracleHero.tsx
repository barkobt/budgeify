'use client';

/**
 * OracleHero — HubX Assembly v3.2
 *
 * Scroll-driven module convergence with spring physics (260/20/1).
 * 3-state transitions: identifying → predicting → active.
 * Real-time data from useBudgetStore.
 */

import { useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Target, BarChart3, Sparkles } from 'lucide-react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { OracleModuleChip } from './OracleModuleChip';

export type WalletModuleId = 'income' | 'expense' | 'goals' | 'analytics' | 'insights';

const MODULES = [
  { id: 'income' as WalletModuleId, label: 'Gelir', Icon: TrendingUp, angle: -72, color: '#10B981', scrollStart: 0.05, scrollEnd: 0.20 },
  { id: 'expense' as WalletModuleId, label: 'Gider', Icon: TrendingDown, angle: 0, color: '#F43F5E', scrollStart: 0.12, scrollEnd: 0.30 },
  { id: 'goals' as WalletModuleId, label: 'Hedefler', Icon: Target, angle: 72, color: '#8B5CF6', scrollStart: 0.20, scrollEnd: 0.40 },
  { id: 'analytics' as WalletModuleId, label: 'Analiz', Icon: BarChart3, angle: 144, color: '#4F46E5', scrollStart: 0.25, scrollEnd: 0.45 },
  { id: 'insights' as WalletModuleId, label: 'Oracle', Icon: Sparkles, angle: -144, color: '#F59E0B', scrollStart: 0.30, scrollEnd: 0.50 },
];

const RADIUS = 110;
const ASSEMBLY_SPRING = { type: 'spring' as const, stiffness: 260, damping: 20, mass: 1 };

function getModulePosition(angle: number, radius: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
}


interface OracleHeroProps {
  onModuleClick?: (moduleId: WalletModuleId) => void;
}

export function OracleHero({ onModuleClick }: OracleHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Store bindings
  const balance = useBudgetStore((s) => s.getBalance());
  const savingsRate = useBudgetStore((s) => s.getSavingsRate());

  // Scroll-driven assembly
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Core animations driven by scroll
  const coreScale = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.8, 0.95, 1]);
  const coreGlow = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.2, 0.6, 1]);
  const ringOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);


  // Module positions (memoized)
  const modulePositions = useMemo(
    () => MODULES.map((mod) => getModulePosition(mod.angle, RADIUS)),
    []
  );

  // Status display
  const hoveredModule = hoveredId ? MODULES.find((m) => m.id === hoveredId) : null;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-col items-center py-6">
        <div className="relative w-full max-w-85 mx-auto" style={{ height: 300 }}>
          {/* SVG Circuit Lines */}
          <svg viewBox="0 0 320 300" fill="none" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            {MODULES.map((mod, i) => (
              <motion.line
                key={mod.id}
                x1={160} y1={150}
                x2={160 + modulePositions[i].x} y2={150 + modulePositions[i].y}
                stroke={hoveredId === mod.id ? mod.color : 'rgba(255,255,255,0.04)'}
                strokeWidth={hoveredId === mod.id ? 1.5 : 0.5}
                strokeLinecap="round"
                initial={false}
                animate={{ stroke: hoveredId === mod.id ? mod.color : 'rgba(255,255,255,0.04)' }}
                transition={{ duration: 0.2 }}
              />
            ))}
            <motion.circle cx={160} cy={150} r="32" stroke="rgba(79,70,229,0.2)" strokeWidth="0.5" fill="none" style={{ opacity: coreGlow }} />
            <motion.circle cx={160} cy={150} r="44" stroke="rgba(79,70,229,0.08)" strokeWidth="0.5" fill="none" style={{ opacity: coreGlow }} />
          </svg>

          {/* Module Chips — scroll-driven convergence */}
          {MODULES.map((mod, i) => (
            <OracleModuleChip
              key={mod.id}
              id={mod.id}
              label={mod.label}
              Icon={mod.Icon}
              color={mod.color}
              baseX={modulePositions[i].x}
              baseY={modulePositions[i].y}
              scrollProgress={scrollYProgress}
              scrollStart={mod.scrollStart}
              scrollEnd={mod.scrollEnd}
              isHovered={hoveredId === mod.id}
              onHover={setHoveredId}
              onClick={() => onModuleClick?.(mod.id)}
              index={i}
            />
          ))}

          {/* Central Wallet Core */}
          <motion.div className="absolute left-1/2 -translate-x-1/2" style={{ top: 122, scale: coreScale }}>
            <div className="relative">
              <motion.div className="absolute -inset-3 rounded-2xl bg-indigo-600/30 blur-xl" style={{ opacity: coreGlow }} />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-indigo-800 shadow-[0_0_32px_rgba(79,70,229,0.3)]">
                <Wallet size={24} className="text-white" strokeWidth={1.5} />
              </div>
              <motion.div
                className="absolute -inset-2 rounded-2xl border border-indigo-400/20"
                style={{ opacity: ringOpacity }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </div>

        {/* Status Chip — context-aware */}
        <AnimatePresence mode="wait">
          <motion.div
            key={hoveredId ?? 'status'}
            className="flex items-center gap-2 rounded-full bg-black/60 border border-white/5 px-4 py-1.5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={ASSEMBLY_SPRING}
          >
            {hoveredModule ? (
              <>
                <hoveredModule.Icon size={12} style={{ color: hoveredModule.color }} strokeWidth={2} />
                <span className="text-xs font-medium text-zinc-300">{hoveredModule.label} modulu</span>
              </>
            ) : (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs font-medium text-zinc-500">
                  {balance !== 0 ? `Bakiye: ${savingsRate}% tasarruf` : 'Oracle Core hazir'}
                </span>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Title */}
        <h2 className="mt-3 text-center text-lg font-bold text-white tracking-tight">
          Oracle <span className="bg-linear-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Core</span>
        </h2>
        <p className="mt-1 text-center text-xs text-zinc-500 max-w-65 leading-relaxed">
          Modullere tiklayarak hizli islem yapin.
        </p>
      </div>
    </div>
  );
}

export default OracleHero;
