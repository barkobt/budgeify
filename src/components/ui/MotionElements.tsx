'use client';

/**
 * Motion Elements - Reusable Animated Components
 *
 * 🎓 MENTOR NOTU - Framer Motion:
 * ------------------------------
 * Framer Motion, React için en güçlü animasyon kütüphanesidir.
 *
 * Temel kavramlar:
 * - motion.div → Animasyonlu div elementi
 * - initial → Başlangıç durumu
 * - animate / whileInView → Hedef durum
 * - transition → Animasyon özellikleri (duration, easing)
 * - viewport → Scroll trigger ayarları
 *
 * Best Practices:
 * 1. GPU-accelerated properties kullan (transform, opacity)
 * 2. will-change CSS property'si otomatik eklenir
 * 3. Layout animations için layoutId kullan
 */

import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

// ========================================
// ANIMATION VARIANTS
// ========================================

/**
 * 🎓 MENTOR NOTU - Variants:
 * Variants, animasyon state'lerini merkezi olarak tanımlar.
 * Bu sayede:
 * 1. Kod tekrarı önlenir
 * 2. Staggered animations kolaylaşır
 * 3. Animasyonlar tutarlı olur
 */

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
    },
  },
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const fadeInScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1], // easeOutBack - slight overshoot
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ========================================
// SCROLL-TRIGGERED COMPONENTS
// ========================================

interface MotionSectionProps extends HTMLMotionProps<'section'> {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * FadeInSection - Scroll ile görünür olduğunda fade in
 *
 * 🎓 MENTOR NOTU:
 * viewport={{ once: true }} → Animasyon sadece bir kez çalışır
 * amount: 0.3 → Element'in %30'u görünür olduğunda tetiklenir
 */
export function FadeInSection({
  children,
  className = '',
  delay = 0,
  ...props
}: MotionSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, y: 60 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            delay,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

interface MotionDivProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
}

/**
 * FadeInDiv - Yön belirtebilen fade animasyonu
 */
export function FadeInDiv({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  ...props
}: MotionDivProps) {
  const variants: Record<string, Variants> = {
    up: fadeInUp,
    down: fadeInDown,
    left: fadeInLeft,
    right: fadeInRight,
    scale: fadeInScale,
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={variants[direction]}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer - Çocuk elementleri sırayla animate eder
 *
 * 🎓 MENTOR NOTU:
 * Stagger = Kademe kademe
 * Her çocuk element belirli bir gecikmeyle görünür.
 * Bu "cascade" efekti profesyonel bir his verir.
 */
export function StaggerContainer({
  children,
  className = '',
  delay = 0,
  ...props
}: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.12,
            delayChildren: delay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem - StaggerContainer içinde kullanılır
 */
export function StaggerItem({
  children,
  className = '',
  ...props
}: Omit<MotionDivProps, 'delay' | 'direction'>) {
  return (
    <motion.div variants={staggerItem} className={className} {...props}>
      {children}
    </motion.div>
  );
}

// ========================================
// INTERACTIVE COMPONENTS
// ========================================

interface GlowButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

/**
 * GlowButton - Hover'da parlayan buton
 *
 * 🎓 MENTOR NOTU:
 * whileHover ve whileTap, etkileşim animasyonları için.
 * scale: 1.02 → %2 büyüme (subtle ama fark edilir)
 * boxShadow → Glow efekti
 */
export function GlowButton({
  children,
  className = '',
  glowColor = 'rgba(59, 130, 246, 0.5)',
  ...props
}: GlowButtonProps) {
  return (
    <motion.button
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor}`,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

interface HoverCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
}

/**
 * HoverCard - Hover'da yükselen kart
 */
export function HoverCard({
  children,
  className = '',
  ...props
}: HoverCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ========================================
// HERO ANIMATIONS
// ========================================

/**
 * HeroText - Hero section için özel text animasyonu
 */
export function HeroText({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * FloatingElement - Sürekli yüzen animasyon (ambient)
 */
export function FloatingElement({
  children,
  className = '',
  duration = 4,
  distance = 10,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
}) {
  return (
    <motion.div
      animate={{
        y: [-distance, distance, -distance],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * PulseGlow - Nefes alan glow efekti
 */
export function PulseGlow({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          '0 0 20px rgba(59, 130, 246, 0.3)',
          '0 0 40px rgba(59, 130, 246, 0.5)',
          '0 0 20px rgba(59, 130, 246, 0.3)',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
