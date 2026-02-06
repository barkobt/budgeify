'use client';

/**
 * BentoGrid & BentoCard — Spatial Dashboard Layout v4.0
 *
 * Apple Control Center / Widget-inspired grid system.
 * 2-column CSS Grid with size variants: 1×1, 2×1, 1×2, 2×2, full.
 * Glassmorphism + VisionOS inner light + spring stagger animation.
 *
 * Spec: skills/ui/bento.md
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { Variants } from 'framer-motion';

// ========================================
// BENTO GRID — Container
// ========================================

interface BentoGridProps {
  children: ReactNode;
  className?: string;
  isMounted?: boolean;
}

const bentoStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

export function BentoGrid({ children, className = '', isMounted = true }: BentoGridProps) {
  return (
    <motion.div
      className={`bento-grid ${className}`}
      variants={bentoStagger}
      initial={isMounted ? 'hidden' : false}
      animate="visible"
      role="region"
      aria-label="Dashboard bento grid"
    >
      {children}
    </motion.div>
  );
}

// ========================================
// BENTO CARD — Cell
// ========================================

type BentoSize = '1x1' | '2x1' | '1x2' | '2x2' | 'full';

interface BentoCardProps {
  children: ReactNode;
  size?: BentoSize;
  pressable?: boolean;
  glow?: boolean;
  bare?: boolean;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

const SIZE_CLASS: Record<BentoSize, string> = {
  '1x1': 'bento-1x1',
  '2x1': 'bento-2x1',
  '1x2': 'bento-1x2',
  '2x2': 'bento-2x2',
  'full': 'bento-full',
};

const bentoItem: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
      mass: 0.8,
    },
  },
};

export function BentoCard({
  children,
  size = '1x1',
  pressable = false,
  glow = false,
  bare = false,
  className = '',
  onClick,
  ariaLabel,
}: BentoCardProps) {
  const sizeClass = SIZE_CLASS[size];
  const pressableClass = pressable ? 'bento-card--pressable' : '';
  const glowClass = glow ? 'bento-card--glow' : '';
  const cardClass = bare || size === 'full'
    ? sizeClass
    : `bento-card ${sizeClass} ${pressableClass} ${glowClass}`;

  return (
    <motion.div
      className={`${cardClass} ${className}`}
      variants={bentoItem}
      onClick={onClick}
      role={pressable ? 'button' : undefined}
      tabIndex={pressable ? 0 : undefined}
      aria-label={ariaLabel}
      whileTap={pressable ? { scale: 0.97 } : undefined}
      onKeyDown={
        pressable && onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
