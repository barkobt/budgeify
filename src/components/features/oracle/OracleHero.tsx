'use client';

/**
 * OracleHero — Silicon Chip Core v4.0
 *
 * Scroll-driven silicon chip assembly with 3-speed concentric rings,
 * central die processor, 3-state machine (dormant→assembling→active),
 * and real-time data readout. Spring physics 260/20/1.
 */

import { useRef, useState, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Target, BarChart3, Sparkles } from 'lucide-react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatCurrency } from '@/utils';
import { OracleModuleChip, type ChipDockState } from './OracleModuleChip';

export type WalletModuleId = 'income' | 'expense' | 'goals' | 'analytics' | 'insights';
type OracleState = 'dormant' | 'assembling' | 'active';

const MODULES = [
  { id: 'income' as WalletModuleId, label: 'Gelir', Icon: TrendingUp, angle: -72, color: '#10B981', scrollStart: 0.05, scrollEnd: 0.20 },
  { id: 'expense' as WalletModuleId, label: 'Gider', Icon: TrendingDown, angle: 0, color: '#F43F5E', scrollStart: 0.12, scrollEnd: 0.30 },
  { id: 'goals' as WalletModuleId, label: 'Hedefler', Icon: Target, angle: 72, color: '#8B5CF6', scrollStart: 0.20, scrollEnd: 0.40 },
  { id: 'analytics' as WalletModuleId, label: 'Analiz', Icon: BarChart3, angle: 144, color: '#4F46E5', scrollStart: 0.25, scrollEnd: 0.45 },
  { id: 'insights' as WalletModuleId, label: 'Oracle', Icon: Sparkles, angle: -144, color: '#F59E0B', scrollStart: 0.30, scrollEnd: 0.50 },
];

const SCATTER_RADIUS = 160;
const DOCK_RADIUS = 100;
const ASSEMBLY_SPRING = { type: 'spring' as const, stiffness: 260, damping: 20, mass: 1 };

function getRadialPos(angle: number, radius: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
}

function getOracleState(progress: number): OracleState {
  if (progress < 0.25) return 'dormant';
  if (progress < 0.60) return 'assembling';
  return 'active';
}

function getChipDockState(progress: number, scrollEnd: number): ChipDockState {
  if (progress < scrollEnd - 0.05) return 'scattered';
  if (progress < scrollEnd) return 'docking';
  return 'docked';
}

interface OracleHeroProps {
  onModuleClick?: (moduleId: WalletModuleId) => void;
}

export function OracleHero({ onModuleClick }: OracleHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [oracleState, setOracleState] = useState<OracleState>('dormant');

  // Store bindings
  const balance = useBudgetStore((s) => s.getBalance());
  const savingsRate = useBudgetStore((s) => s.getSavingsRate());
  const currency = useBudgetStore((s) => s.currency);
  const totalGoalSavings = useBudgetStore((s) =>
    s.goals.reduce((sum, g) => sum + g.currentAmount, 0)
  );

  // Scroll-driven assembly
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Track oracle state from scroll
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const newState = getOracleState(latest);
    if (newState !== oracleState) setOracleState(newState);
  });

  // Core visual transforms
  const coreScale = useTransform(scrollYProgress, [0, 0.25, 0.6], [0.85, 0.95, 1]);
  const coreGlow = useTransform(scrollYProgress, [0, 0.25, 0.6], [0.15, 0.5, 1]);
  const dataReadoutOpacity = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);

  // Module positions (memoized)
  const scatterPositions = useMemo(
    () => MODULES.map((mod) => getRadialPos(mod.angle, SCATTER_RADIUS)),
    []
  );
  const dockPositions = useMemo(
    () => MODULES.map((mod) => getRadialPos(mod.angle, DOCK_RADIUS)),
    []
  );

  // Ring state class
  const ringStateClass = `chip-ring--${oracleState}`;

  // Die state class
  const dieClass = oracleState === 'dormant'
    ? 'oracle-die oracle-die--dormant'
    : oracleState === 'active'
      ? 'oracle-die oracle-die--active'
      : 'oracle-die';

  // Silicon glow class
  const siliconGlowClass = oracleState === 'active' ? 'silicon-glow--active' : 'silicon-glow';

  // Status display
  const hoveredModule = hoveredId ? MODULES.find((m) => m.id === hoveredId) : null;

  const handleHover = useCallback((id: string | null) => setHoveredId(id), []);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-col items-center py-6">
        {/* Silicon Assembly Container */}
        <div
          className={`relative w-full mx-auto rounded-full ${siliconGlowClass}`}
          style={{ height: 380, maxWidth: 380 }}
        >
          <LayoutGroup>
            {/* 3-Speed Concentric Rings */}
            <div className={`chip-ring chip-ring-3 ${ringStateClass}`} aria-hidden="true" />
            <div className={`chip-ring chip-ring-2 ${ringStateClass}`} aria-hidden="true" />
            <div className={`chip-ring chip-ring-1 ${ringStateClass}`} aria-hidden="true" />

            {/* Module Chips — scroll-driven convergence into ring positions */}
            {MODULES.map((mod, i) => (
              <OracleModuleChip
                key={mod.id}
                id={mod.id}
                label={mod.label}
                Icon={mod.Icon}
                color={mod.color}
                baseX={scatterPositions[i].x}
                baseY={scatterPositions[i].y}
                dockX={dockPositions[i].x}
                dockY={dockPositions[i].y}
                scrollProgress={scrollYProgress}
                scrollStart={mod.scrollStart}
                scrollEnd={mod.scrollEnd}
                dockState={getChipDockState(scrollYProgress.get(), mod.scrollEnd)}
                isHovered={hoveredId === mod.id}
                onHover={handleHover}
                onClick={() => onModuleClick?.(mod.id)}
                index={i}
              />
            ))}

            {/* Central Die — Silicon Processor */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ scale: coreScale }}
            >
              <div className="relative">
                {/* Ambient glow behind die */}
                <motion.div
                  className="absolute -inset-6 rounded-3xl bg-indigo-600/25 blur-2xl"
                  style={{ opacity: coreGlow }}
                />

                {/* The Die */}
                <div className={dieClass}>
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                    {/* Icon — always visible */}
                    <Wallet size={24} className="text-white/90" strokeWidth={1.5} />

                    {/* Data Readout — active state only */}
                    <AnimatePresence>
                      {oracleState === 'active' && (
                        <motion.div
                          className="flex flex-col items-center"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={ASSEMBLY_SPRING}
                          style={{ opacity: dataReadoutOpacity }}
                          role="status"
                          aria-label={`Bakiye: ${formatCurrency(balance, currency)}`}
                        >
                          <span className="text-lg font-bold tabular-nums text-white leading-none">
                            {formatCurrency(balance, currency)}
                          </span>
                          {totalGoalSavings > 0 && (
                            <span className="text-[9px] font-medium text-indigo-200/70 mt-0.5">
                              {formatCurrency(totalGoalSavings, currency)} tasarruf
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Pulse ring around die */}
                {oracleState === 'active' && (
                  <motion.div
                    className="absolute -inset-3 rounded-3xl border border-indigo-400/20"
                    animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </div>
            </motion.div>
          </LayoutGroup>
        </div>

        {/* Status Chip — context-aware */}
        <AnimatePresence mode="wait">
          <motion.div
            key={hoveredId ?? oracleState}
            className="flex items-center gap-2 rounded-full bg-black/60 border border-white/5 px-4 py-1.5 backdrop-blur-sm mt-2"
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
                <div className={`h-1.5 w-1.5 rounded-full ${oracleState === 'active' ? 'bg-emerald-400' : 'bg-indigo-400'} animate-pulse`} />
                <span className="text-xs font-medium text-zinc-500">
                  {oracleState === 'active'
                    ? `${savingsRate}% tasarruf orani`
                    : oracleState === 'assembling'
                      ? 'Moduller yukleniyor...'
                      : 'Oracle Core hazir'}
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
