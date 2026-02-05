/**
 * Framer Motion Presets — Budgeify Sovereign v2.0
 *
 * Centralized animation variants for consistent,
 * premium motion across the app.
 */
import type { Variants, Transition } from 'framer-motion';

// ========================================
// SPRING CONFIGS
// ========================================

export const springs = {
  gentle: { type: 'spring', stiffness: 120, damping: 14 } as Transition,
  snappy: { type: 'spring', stiffness: 300, damping: 20 } as Transition,
  bouncy: { type: 'spring', stiffness: 400, damping: 10 } as Transition,
  smooth: { type: 'spring', stiffness: 200, damping: 24 } as Transition,
} as const;

// ========================================
// FADE VARIANTS
// ========================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: springs.gentle },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: springs.gentle },
};

// ========================================
// STAGGER CONTAINERS
// ========================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
};

// ========================================
// SCROLL-AWARE VARIANTS
// ========================================

export const revealOnScroll: Variants = {
  offscreen: {
    opacity: 0,
    y: 30,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      ...springs.gentle,
      duration: 0.5,
    },
  },
};

export const scaleOnScroll: Variants = {
  offscreen: {
    opacity: 0,
    scale: 0.92,
  },
  onscreen: {
    opacity: 1,
    scale: 1,
    transition: springs.gentle,
  },
};

// ========================================
// VIEWPORT CONFIG
// ========================================

export const viewportConfig = {
  once: true,
  amount: 0.2,
  margin: '-50px',
} as const;

// ========================================
// SLIDE VARIANTS
// ========================================

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: springs.gentle },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: springs.gentle },
};

// ========================================
// INTERACTIVE VARIANTS
// ========================================

export const tapScale = {
  whileTap: { scale: 0.97 },
  transition: springs.snappy,
};

export const hoverLift = {
  whileHover: { y: -4, transition: springs.gentle },
};

export const pressable = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: springs.snappy,
};
