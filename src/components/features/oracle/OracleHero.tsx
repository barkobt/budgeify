'use client';

/**
 * OracleHero — Cinematic Assembly v4.6 (M11 + M12)
 *
 * 4-Phase scroll choreography over 200vh runway:
 *   Phase 1 — Awakening (0–20%): Core dormant, breathing, modules invisible
 *   Phase 2 — Assembly (20–50%): Modules converge, core warms up
 *   Phase 3 — Ignition (50–70%): Core active, data readout, ambient ignition
 *   Phase 4 — Dock (70–100%): Scale down, rings fade, chromatic + shake
 *
 * SiliconDie replaces Wallet icon (M12).
 * Spring physics: 260/20/1 canonical, 300/15/1 for assembly convergence.
 */

import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, LayoutGroup } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, BarChart3, Sparkles } from 'lucide-react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatCurrencyCompact } from '@/utils';
import { OracleModuleChip, type ChipDockState } from './OracleModuleChip';
import { SiliconDie } from './SiliconDie';

export type WalletModuleId = 'income' | 'expense' | 'goals' | 'analytics' | 'insights';
type OracleState = 'dormant' | 'assembling' | 'active';

// M11: Module scroll ranges shifted to 20–50% Assembly phase
const MODULES = [
  { id: 'income' as WalletModuleId, label: 'Gelir', Icon: TrendingUp, angle: -72, color: '#10B981', scrollStart: 0.20, scrollEnd: 0.35 },
  { id: 'expense' as WalletModuleId, label: 'Gider', Icon: TrendingDown, angle: 0, color: '#F43F5E', scrollStart: 0.24, scrollEnd: 0.38 },
  { id: 'goals' as WalletModuleId, label: 'Hedefler', Icon: Target, angle: 72, color: '#8B5CF6', scrollStart: 0.28, scrollEnd: 0.42 },
  { id: 'analytics' as WalletModuleId, label: 'Analiz', Icon: BarChart3, angle: 144, color: '#4F46E5', scrollStart: 0.32, scrollEnd: 0.46 },
  { id: 'insights' as WalletModuleId, label: 'Oracle', Icon: Sparkles, angle: -144, color: '#F59E0B', scrollStart: 0.36, scrollEnd: 0.50 },
];

const SCATTER_RADIUS = 160;
const DOCK_RADIUS = 100;
const ASSEMBLY_SPRING = { type: 'spring' as const, stiffness: 260, damping: 20, mass: 1 };

function getRadialPos(angle: number, radius: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
}

// M11: 4-phase state machine
function getOracleState(progress: number): OracleState {
  if (progress < 0.20) return 'dormant';
  if (progress < 0.50) return 'assembling';
  return 'active';
}

function getChipDockState(progress: number, scrollEnd: number): ChipDockState {
  if (progress < scrollEnd - 0.05) return 'scattered';
  if (progress < scrollEnd) return 'docking';
  return 'docked';
}

// M12: Die size from oracle state + dock phase
function getDieSize(state: OracleState, dockProgress: number): 'dormant' | 'active' | 'docked' {
  if (state === 'dormant') return 'dormant';
  if (dockProgress > 0.85) return 'docked';
  return 'active';
}

interface OracleHeroProps {
  onModuleClick?: (moduleId: WalletModuleId) => void;
  onScrollProgress?: (progress: number) => void;
}

export function OracleHero({ onModuleClick, onScrollProgress }: OracleHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [oracleState, setOracleState] = useState<OracleState>('dormant');
  const [hasDocked, setHasDocked] = useState(false);
  const [showChromatic, setShowChromatic] = useState(false);
  const [showShake, setShowShake] = useState(false);

  // Store bindings
  const balance = useBudgetStore((s) => s.getBalance());
  const savingsRate = useBudgetStore((s) => s.getSavingsRate());
  const currency = useBudgetStore((s) => s.currency);
  const totalGoalSavings = useBudgetStore((s) =>
    s.goals.reduce((sum, g) => sum + g.currentAmount, 0)
  );

  // Scroll-driven assembly over 200vh runway
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Track oracle state + dock effects from scroll
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const newState = getOracleState(latest);
    if (newState !== oracleState) setOracleState(newState);

    // Report scroll progress to parent (ambient ignition)
    onScrollProgress?.(latest);

    // M11 Phase 4: Chromatic + Shake at dock completion
    if (latest >= 0.95 && !hasDocked) {
      setHasDocked(true);
      setShowChromatic(true);
      setShowShake(true);
      // Auto-dismiss effects
      setTimeout(() => setShowChromatic(false), 250);
      setTimeout(() => setShowShake(false), 200);
    }
    if (latest < 0.90) {
      setHasDocked(false);
    }
  });

  // ===== PHASE 1 — Awakening (0–20%) =====
  // Core: scale 0.8, breathing pulse via CSS
  // Rings: opacity 0.2, slow rotation (CSS base)

  // ===== PHASE 2 — Assembly (20–50%) =====
  // Core: scale 0.8→0.95, modules converge

  // ===== PHASE 3 — Ignition (50–70%) =====
  // Core: scale 0.95→1.0, data readout fades in, glow peaks

  // ===== PHASE 4 — Dock (70–100%) =====
  // Core: scale 1.0→0.6, translateY toward bento, rings fade out

  // Core visual transforms — 4-phase
  const coreScale = useTransform(
    scrollYProgress,
    [0, 0.20, 0.50, 0.70, 1.0],
    [0.8, 0.8, 0.95, 1.0, 0.6]
  );
  const coreGlow = useTransform(
    scrollYProgress,
    [0, 0.20, 0.50, 0.70],
    [0.1, 0.15, 0.5, 1.0]
  );
  const dataReadoutOpacity = useTransform(scrollYProgress, [0.50, 0.60], [0, 1]);

  // Phase 4: Dock translateY — core moves down toward bento
  const coreDockY = useTransform(scrollYProgress, [0.70, 1.0], [0, 60]);

  // Phase 4: Ring fade out
  const ringOpacity = useTransform(scrollYProgress, [0.70, 0.90], [1, 0]);

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

  // Silicon glow class
  const siliconGlowClass = oracleState === 'active' ? 'silicon-glow--active' : 'silicon-glow';

  // Die size state
  const dieSize = getDieSize(oracleState, scrollYProgress.get());

  // Status display
  const hoveredModule = hoveredId ? MODULES.find((m) => m.id === hoveredId) : null;

  const handleHover = useCallback((id: string | null) => setHoveredId(id), []);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      setShowChromatic(false);
      setShowShake(false);
    };
  }, []);

  return (
    <div ref={containerRef} className="oracle-runway">
      <div className={`oracle-sticky ${showShake ? 'screen-shake' : ''}`}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-6">
        {/* Silicon Assembly Container */}
        <div
          className={`relative w-full mx-auto rounded-full ${siliconGlowClass} ${showChromatic ? 'chromatic-pulse' : ''} oracle-assembly-container`}
        >
          <LayoutGroup>
            {/* 3-Speed Concentric Rings — fade out in Phase 4 */}
            <motion.div className={`chip-ring chip-ring-3 ${ringStateClass}`} style={{ opacity: ringOpacity }} aria-hidden="true" />
            <motion.div className={`chip-ring chip-ring-2 ${ringStateClass}`} style={{ opacity: ringOpacity }} aria-hidden="true" />
            <motion.div className={`chip-ring chip-ring-1 ${ringStateClass}`} style={{ opacity: ringOpacity }} aria-hidden="true" />

            {/* Module Chips — Assembly phase convergence (20–50%) */}
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

            {/* Central Die — M12 Silicon Die replaces Wallet */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ scale: coreScale, y: coreDockY }}
            >
              <div className="relative">
                {/* Ambient glow behind die */}
                <motion.div
                  className="absolute -inset-8 rounded-3xl bg-indigo-600/25 blur-2xl"
                  style={{ opacity: coreGlow }}
                />

                {/* M12: Silicon Die — 4-layer SVG hardware chip */}
                <SiliconDie
                  size={dieSize}
                  scrollProgress={scrollYProgress}
                  layoutId="silicon-die-core"
                />

                {/* Data Readout — Ignition phase (50–70%) */}
                <AnimatePresence>
                  {oracleState === 'active' && (
                    <motion.div
                      className="absolute inset-0 flex flex-col items-center justify-center"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={ASSEMBLY_SPRING}
                      style={{ opacity: dataReadoutOpacity }}
                      role="status"
                      aria-label={`Bakiye: ${formatCurrencyCompact(balance, currency)}`}
                    >
                      <span className="text-sm font-bold tabular-nums text-white leading-none drop-shadow-lg max-w-[90%] truncate text-center">
                        {formatCurrencyCompact(balance, currency)}
                      </span>
                      {totalGoalSavings > 0 && (
                        <span className="text-[8px] font-medium text-indigo-200/70 mt-0.5 drop-shadow-sm max-w-[90%] truncate text-center">
                          {formatCurrencyCompact(totalGoalSavings, currency)}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pulse ring around die — active state */}
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
    </div>
  );
}

export default OracleHero;
