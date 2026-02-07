/**
 * Framer Motion Presets — Budgeify Sovereign v2.1
 *
 * Apple/Stripe-grade motion: tok (weighty), akıcı (fluid).
 * Springs tuned for 60fps on mobile. No overshoot on data surfaces.
 */
import type { Variants, Transition } from 'framer-motion';

// ========================================
// SPRING CONFIGS — Apple-grade
// ========================================

export const springs = {
  /** Smooth entrance. No overshoot. Great for content reveals. */
  gentle: { type: 'spring', stiffness: 170, damping: 26, mass: 1 } as Transition,
  /** Quick interaction feedback (taps, toggles). Slight snap. */
  snappy: { type: 'spring', stiffness: 400, damping: 30, mass: 0.8 } as Transition,
  /** Bouncy micro-interactions (FABs, badges). Controlled overshoot. */
  bouncy: { type: 'spring', stiffness: 500, damping: 15, mass: 0.6 } as Transition,
  /** Heavy, deliberate movement (drawers, sheets). Tok = weighty. */
  heavy: { type: 'spring', stiffness: 200, damping: 28, mass: 1.2 } as Transition,
} as const;

/** v4.6: Canonical assembly spring — scroll-driven convergence */
export const ASSEMBLY_SPRING = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 20,
  mass: 1,
};

/** v4.6: Dock Bar hover bounce — fast & reactive (Apple-tier) */
export const DOCK_SPRING = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 10,
};

// ========================================
// FADE VARIANTS
// ========================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: springs.gentle },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
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
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
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
    y: 24,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: springs.heavy,
  },
};

export const scaleOnScroll: Variants = {
  offscreen: {
    opacity: 0,
    scale: 0.94,
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
  amount: 0.25,
  margin: '-40px',
} as const;

// ========================================
// SLIDE VARIANTS
// ========================================

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: springs.gentle },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
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
  whileHover: { y: -3, transition: springs.gentle },
};

export const pressable = {
  whileHover: { scale: 1.015 },
  whileTap: { scale: 0.97 },
  transition: springs.snappy,
};
