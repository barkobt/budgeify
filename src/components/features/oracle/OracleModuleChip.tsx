'use client';

/**
 * OracleModuleChip — Individual module chip for Oracle Assembly
 * Extracted to keep OracleHero under 200 lines.
 */

import { motion, type MotionValue, useTransform } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

const ASSEMBLY_SPRING = { type: 'spring' as const, stiffness: 260, damping: 20, mass: 1 };

interface OracleModuleChipProps {
  id: string;
  label: string;
  Icon: LucideIcon;
  color: string;
  baseX: number;
  baseY: number;
  scrollProgress: MotionValue<number>;
  scrollStart: number;
  scrollEnd: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
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
  scrollProgress,
  scrollStart,
  scrollEnd,
  isHovered,
  onHover,
  onClick,
  index,
}: OracleModuleChipProps) {
  // Non-linear convergence: modules fly toward center as user scrolls
  const convergeFactor = useTransform(scrollProgress, [scrollStart, scrollEnd], [0, 1]);
  const x = useTransform(convergeFactor, [0, 1], [baseX, 0]);
  const y = useTransform(convergeFactor, [0, 1], [baseY, 0]);
  const chipScale = useTransform(convergeFactor, [0, 0.8, 1], [1, 1, 0.85]);
  const chipOpacity = useTransform(convergeFactor, [0, 0.9, 1], [1, 1, 0]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ x, y, scale: chipScale, opacity: chipOpacity }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.08 + index * 0.06, ...ASSEMBLY_SPRING }}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.button
        className="flex items-center gap-2 rounded-2xl px-3 py-2 select-none
                   border transition-colors duration-200 cursor-pointer -translate-x-1/2 -translate-y-1/2"
        onClick={onClick}
        animate={{
          borderColor: isHovered ? `${color}40` : 'rgba(255,255,255,0.05)',
          backgroundColor: isHovered ? `${color}08` : 'rgba(15,15,15,0.6)',
          boxShadow: isHovered
            ? `0 0 20px ${color}15, 0 0 40px ${color}08`
            : '0 0 0 transparent',
        }}
        whileTap={{ scale: 0.92 }}
        transition={ASSEMBLY_SPRING}
      >
        <Icon
          size={14}
          style={{ color: isHovered ? color : '#71717A' }}
          strokeWidth={2}
          className="transition-colors duration-200"
        />
        <span
          className="text-[11px] font-medium transition-colors duration-200"
          style={{ color: isHovered ? '#E4E4E7' : '#71717A' }}
        >
          {label}
        </span>
      </motion.button>
    </motion.div>
  );
}
