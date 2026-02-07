'use client';

/**
 * OracleModuleChip — Silicon Assembly v4.0
 *
 * Hardware-aesthetic chip with layoutId transitions, dock glow,
 * and circuit-trace animation. Part of the Oracle Chip Core system.
 */

import { motion, type MotionValue, useTransform } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

const ASSEMBLY_SPRING = { type: 'spring' as const, stiffness: 260, damping: 20, mass: 1 };
const CONVERGENCE_SPRING = { type: 'spring' as const, stiffness: 300, damping: 15, mass: 1 };

export type ChipDockState = 'scattered' | 'docking' | 'docked';

interface OracleModuleChipProps {
  id: string;
  label: string;
  Icon: LucideIcon;
  color: string;
  baseX: number;
  baseY: number;
  dockX: number;
  dockY: number;
  scrollProgress: MotionValue<number>;
  scrollStart: number;
  scrollEnd: number;
  dockState: ChipDockState;
  onHover: (id: string | null) => void;
  isHovered: boolean;
  onClick: () => void;
  index: number;
}

export function OracleModuleChip({
  id,
  label,
  Icon,
  color,
  baseX,
  baseY,
  dockX,
  dockY,
  scrollProgress,
  scrollStart,
  scrollEnd,
  dockState,
  onHover,
  isHovered,
  onClick,
  index: _index,
}: OracleModuleChipProps) {
  // Non-linear convergence: scattered → dock position (M11 tighter physics)
  const convergeFactor = useTransform(scrollProgress, [scrollStart, scrollEnd], [0, 1]);
  const x = useTransform(convergeFactor, [0, 1], [baseX, dockX]);
  const y = useTransform(convergeFactor, [0, 1], [baseY, dockY]);
  const chipOpacity = useTransform(scrollProgress, [scrollStart - 0.05, scrollStart], [0, 1]);

  // Phase 4: Label fade-out during dock (70–90%)
  const labelOpacity = useTransform(scrollProgress, [0.70, 0.90], [1, 0]);

  const isDocked = dockState === 'docked';
  const dockedClass = isDocked ? `oracle-chip--docked-${id}` : '';

  return (
    <motion.div
      layoutId={`oracle-chip-${id}`}
      className="absolute left-1/2 top-1/2"
      style={{ x, y, opacity: chipOpacity }}
      transition={CONVERGENCE_SPRING}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.button
        className={`oracle-chip flex items-center gap-2.5 select-none cursor-pointer
                   -translate-x-1/2 -translate-y-1/2 ${dockedClass}`}
        onClick={onClick}
        whileTap={{ scale: 0.97 }}
        animate={{
          scale: isDocked ? 1 : isHovered ? 1.05 : 0.95,
        }}
        transition={ASSEMBLY_SPRING}
        aria-label={`${label} modulu`}
      >
        {/* Circuit trace SVG — appears on dock */}
        {isDocked && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 40"
            fill="none"
            aria-hidden="true"
          >
            <rect
              className="dock-trace-path"
              x="1" y="1" width="98" height="38" rx="15"
              stroke={color}
              strokeWidth="0.5"
              strokeOpacity="0.4"
              fill="none"
            />
          </svg>
        )}

        <Icon
          size={14}
          style={{ color: isDocked || isHovered ? color : '#71717A' }}
          strokeWidth={2}
          className="transition-colors duration-200 shrink-0"
        />
        <motion.span
          className="text-[11px] font-medium transition-colors duration-200 whitespace-nowrap"
          style={{ color: isDocked || isHovered ? '#E4E4E7' : '#71717A', opacity: labelOpacity }}
        >
          {label}
        </motion.span>

        {/* Haptic glow dot — visible when docked */}
        {isDocked && (
          <motion.div
            className="h-1.5 w-1.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: [0, 1, 0.6] }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
        )}
      </motion.button>
    </motion.div>
  );
}
