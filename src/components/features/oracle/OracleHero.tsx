'use client';

/**
 * WalletCore Hero — HubX-grade fintech hero
 *
 * Central glowing wallet orb with 5 surrounding module chips.
 * Hover: module glows and circuit line intensifies.
 * Scroll-driven reveal with Framer Motion.
 */

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Lightbulb,
} from 'lucide-react';

const MODULES = [
  { id: 'income', label: 'Gelir', Icon: TrendingUp, angle: -72, color: '#10B981' },
  { id: 'expense', label: 'Gider', Icon: TrendingDown, angle: 0, color: '#F43F5E' },
  { id: 'goals', label: 'Hedefler', Icon: Target, angle: 72, color: '#8B5CF6' },
  { id: 'analytics', label: 'Analiz', Icon: BarChart3, angle: 144, color: '#3B82F6' },
  { id: 'insights', label: 'Icerik', Icon: Lightbulb, angle: -144, color: '#F59E0B' },
] as const;

// Position modules in a semicircle arc above the core
function getModulePosition(angle: number, radius: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
  };
}

export function OracleHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const coreScale = useTransform(scrollYProgress, [0, 0.4], [0.85, 1]);
  const coreGlow = useTransform(scrollYProgress, [0, 0.3], [0.3, 1]);

  const RADIUS = 110;
  const CENTER = { x: 160, y: 150 };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-col items-center py-6">
        {/* Wallet Core Assembly */}
        <div className="relative w-full max-w-[340px] mx-auto" style={{ height: 300 }}>
          {/* SVG Circuit Lines */}
          <svg
            viewBox="0 0 320 300"
            fill="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            {MODULES.map((mod) => {
              const pos = getModulePosition(mod.angle, RADIUS);
              const isHovered = hoveredId === mod.id;
              return (
                <motion.line
                  key={mod.id}
                  x1={CENTER.x}
                  y1={CENTER.y}
                  x2={CENTER.x + pos.x}
                  y2={CENTER.y + pos.y}
                  stroke={isHovered ? mod.color : 'rgba(255,255,255,0.06)'}
                  strokeWidth={isHovered ? 1.5 : 0.5}
                  strokeLinecap="round"
                  initial={false}
                  animate={{
                    stroke: isHovered ? mod.color : 'rgba(255,255,255,0.06)',
                    strokeWidth: isHovered ? 1.5 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                />
              );
            })}

            {/* Core outer ring */}
            <motion.circle
              cx={CENTER.x}
              cy={CENTER.y}
              r="32"
              stroke="rgba(59, 130, 246, 0.2)"
              strokeWidth="0.5"
              fill="none"
              style={{ opacity: coreGlow }}
            />
            <motion.circle
              cx={CENTER.x}
              cy={CENTER.y}
              r="44"
              stroke="rgba(59, 130, 246, 0.08)"
              strokeWidth="0.5"
              fill="none"
              style={{ opacity: coreGlow }}
            />
          </svg>

          {/* Module Chips */}
          {MODULES.map((mod, i) => {
            const pos = getModulePosition(mod.angle, RADIUS);
            const isHovered = hoveredId === mod.id;
            return (
              <motion.div
                key={mod.id}
                className="absolute"
                style={{
                  left: CENTER.x + pos.x - 40,
                  top: CENTER.y + pos.y - 18,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                onMouseEnter={() => setHoveredId(mod.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <motion.div
                  className="flex items-center gap-2 rounded-2xl px-3 py-2 cursor-default select-none
                             border transition-colors duration-300"
                  animate={{
                    borderColor: isHovered ? `${mod.color}40` : 'rgba(255,255,255,0.05)',
                    backgroundColor: isHovered ? `${mod.color}08` : 'rgba(24,24,27,0.5)',
                    boxShadow: isHovered
                      ? `0 0 20px ${mod.color}15, 0 0 40px ${mod.color}08`
                      : '0 0 0 transparent',
                    x: isHovered ? (pos.x > 0 ? -3 : pos.x < 0 ? 3 : 0) : 0,
                    y: isHovered ? (pos.y > 0 ? -3 : pos.y < 0 ? 3 : 0) : 0,
                  }}
                  transition={{ duration: 0.25 }}
                >
                  <mod.Icon
                    size={14}
                    style={{ color: isHovered ? mod.color : '#64748B' }}
                    strokeWidth={2}
                    className="transition-colors duration-300"
                  />
                  <span
                    className="text-[11px] font-medium transition-colors duration-300"
                    style={{ color: isHovered ? '#E2E8F0' : '#64748B' }}
                  >
                    {mod.label}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}

          {/* Central Wallet Core */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: CENTER.y - 28,
              scale: coreScale,
            }}
          >
            <div className="relative">
              {/* Glow backdrop */}
              <motion.div
                className="absolute inset-0 rounded-2xl ai-gradient blur-xl"
                style={{ opacity: coreGlow }}
              />
              {/* Core chip */}
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl ai-gradient
                              shadow-lg shadow-accent-500/20">
                <Wallet size={24} className="text-white" strokeWidth={1.5} />
              </div>
              {/* Pulse ring */}
              <motion.div
                className="absolute -inset-2 rounded-2xl border border-accent-400/20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Status chip */}
        <AnimatePresence mode="wait">
          <motion.div
            key={hoveredId ?? 'default'}
            className="flex items-center gap-2 rounded-full bg-zinc-900/50 border border-white/5
                       px-4 py-1.5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {hoveredId ? (
              <>
                {(() => {
                  const mod = MODULES.find((m) => m.id === hoveredId);
                  if (!mod) return null;
                  return (
                    <>
                      <mod.Icon size={12} style={{ color: mod.color }} strokeWidth={2} />
                      <span className="text-xs font-medium text-slate-300">{mod.label} modulu aktif</span>
                    </>
                  );
                })()}
              </>
            ) : (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-slate-400">Wallet Core hazir</span>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Title */}
        <h2 className="mt-3 text-center text-lg font-bold text-white tracking-tight">
          Wallet <span className="text-gradient">Core</span>
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 max-w-[260px] leading-relaxed">
          Tum finansal verileriniz tek merkezde. Moduller arasinda gezinerek durumunuzu gorun.
        </p>
      </div>
    </div>
  );
}

export default OracleHero;
