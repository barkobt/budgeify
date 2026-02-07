'use client';

/**
 * SiliconDie — M12: The Mechanical Heart
 *
 * Multi-layered Silicon Die SVG replacing the amateur Wallet icon.
 * 4 layers: Substrate → Circuit Traces → Core Logic Block → Heat Spreader.
 * Z-axis parallax via useTransform on scroll progress.
 * Light leaks with radial-gradient + mix-blend-mode: screen.
 * 3 size states: dormant (100px), active (120px), docked (64px).
 * Spring physics: 260/20/1 canonical.
 */

import { motion, type MotionValue, useTransform, useMotionValue } from 'framer-motion';

const ASSEMBLY_SPRING = { type: 'spring' as const, stiffness: 260, damping: 20, mass: 1 };

const SIZE_MAP = {
  dormant: 100,
  active: 120,
  docked: 64,
} as const;

interface SiliconDieProps {
  size: 'dormant' | 'active' | 'docked';
  scrollProgress?: MotionValue<number>;
  layoutId?: string;
  className?: string;
}

export function SiliconDie({ size, scrollProgress, layoutId, className = '' }: SiliconDieProps) {
  const dim = SIZE_MAP[size];
  const isActive = size === 'active';

  // Static fallback MotionValue — hooks must be called unconditionally
  const staticProgress = useMotionValue(0);
  const progress = scrollProgress ?? staticProgress;

  // Z-axis parallax — subtle tilt driven by scroll
  const rotateX = useTransform(progress, [0, 1], [0, 2]);

  // Per-layer translateZ offsets for depth illusion
  const layer1Z = useTransform(progress, [0, 1], [0, -2]);
  const layer2Z = useTransform(progress, [0, 1], [0, -1]);
  const layer3Z = useTransform(progress, [0, 1], [0, 1]);
  const layer4Z = useTransform(progress, [0, 1], [0, 2]);

  // Light leak opacity driven by scroll
  const leakOpacity = useTransform(progress, [0.3, 0.6, 0.8], [0, 0.8, 0.4]);

  return (
    <motion.div
      layoutId={layoutId}
      className={`silicon-die-wrapper ${className}`}
      animate={{ width: dim, height: dim }}
      transition={ASSEMBLY_SPRING}
      style={{ rotateX }}
    >
      {/* Light Leaks — radial gradient overlays */}
      <motion.div
        className="silicon-light-leak silicon-light-leak--tl"
        style={{ opacity: leakOpacity }}
        aria-hidden="true"
      />
      <motion.div
        className="silicon-light-leak silicon-light-leak--br"
        style={{ opacity: leakOpacity }}
        aria-hidden="true"
      />
      <motion.div
        className="silicon-light-leak silicon-light-leak--tr"
        style={{ opacity: leakOpacity }}
        aria-hidden="true"
      />

      {/* 4-Layer SVG */}
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
        aria-hidden="true"
        style={{ filter: isActive
          ? 'drop-shadow(0 0 16px rgba(99, 102, 241, 0.5)) drop-shadow(0 0 40px rgba(79, 70, 229, 0.3)) drop-shadow(0 0 60px rgba(139, 92, 246, 0.15))'
          : 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.2)) drop-shadow(0 0 20px rgba(79, 70, 229, 0.1))'
        }}
      >
        {/* Layer 1 (bottom): Substrate — dark indigo base with grid pattern */}
        <motion.g style={{ translateZ: layer1Z }}>
          <rect
            x="10" y="10" width="80" height="80" rx="16"
            fill="url(#substrateGradient)"
            stroke="#4338CA"
            strokeWidth="0.6"
          />
          {/* Grid lines */}
          <line x1="30" y1="10" x2="30" y2="90" stroke="#4338CA" strokeWidth="0.3" opacity="0.5" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="#4338CA" strokeWidth="0.3" opacity="0.5" />
          <line x1="70" y1="10" x2="70" y2="90" stroke="#4338CA" strokeWidth="0.3" opacity="0.5" />
          <line x1="10" y1="30" x2="90" y2="30" stroke="#4338CA" strokeWidth="0.3" opacity="0.5" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="#4338CA" strokeWidth="0.3" opacity="0.5" />
          <line x1="10" y1="70" x2="90" y2="70" stroke="#4338CA" strokeWidth="0.3" opacity="0.5" />
        </motion.g>

        {/* Layer 2: Circuit Traces — animated indigo stroke paths */}
        <motion.g style={{ translateZ: layer2Z }}>
          <path
            d="M25 50 H40 M60 50 H75 M50 25 V40 M50 60 V75"
            stroke="#818CF8"
            strokeWidth="1.2"
            opacity="0.7"
            className="silicon-trace"
          />
          <path
            d="M30 30 L40 40 M60 40 L70 30 M30 70 L40 60 M60 60 L70 70"
            stroke="#A5B4FC"
            strokeWidth="0.8"
            opacity="0.5"
            className="silicon-trace-secondary"
          />
          {/* Additional fine traces for detail */}
          <path
            d="M20 40 H35 M65 40 H80 M20 60 H35 M65 60 H80"
            stroke="#6366F1"
            strokeWidth="0.6"
            opacity="0.4"
            className="silicon-trace-secondary"
          />
          {/* Energy conduits — diagonal micro-traces */}
          <path
            d="M22 22 L28 28 M72 22 L78 28 M22 72 L28 78 M72 72 L78 78"
            stroke="#C7D2FE"
            strokeWidth="0.4"
            opacity="0.3"
            className="silicon-trace-secondary"
          />
        </motion.g>

        {/* Layer 3: Core Logic Block — bright indigo center with glow */}
        <motion.g style={{ translateZ: layer3Z }}>
          <rect
            x="35" y="35" width="30" height="30" rx="8"
            fill="url(#siliconCoreGradient)"
            className={isActive ? 'silicon-core--active' : ''}
          />
          {/* Inner detail — micro chip pattern */}
          <rect x="41" y="41" width="18" height="18" rx="4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <rect x="45" y="45" width="10" height="10" rx="2" fill="url(#coreCenterGlow)" />
          {/* Center energy dot */}
          <circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.3)" className={isActive ? 'silicon-core--active' : ''} />
        </motion.g>

        {/* Layer 4 (top): Heat Spreader Frame — metallic edge, subtle */}
        <motion.g style={{ translateZ: layer4Z }}>
          <rect
            x="10" y="10" width="80" height="80" rx="16"
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1.5"
          />
          {/* Corner contact pads — brighter */}
          <rect x="12" y="12" width="6" height="6" rx="1.5" fill="rgba(99,102,241,0.1)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          <rect x="82" y="12" width="6" height="6" rx="1.5" fill="rgba(99,102,241,0.1)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          <rect x="12" y="82" width="6" height="6" rx="1.5" fill="rgba(99,102,241,0.1)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          <rect x="82" y="82" width="6" height="6" rx="1.5" fill="rgba(99,102,241,0.1)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        </motion.g>

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="substrateGradient" x1="10" y1="10" x2="90" y2="90">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#252262" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="siliconCoreGradient" x1="35" y1="35" x2="65" y2="65">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="40%" stopColor="#6366F1" />
            <stop offset="70%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#A5B4FC" />
          </linearGradient>
          <radialGradient id="coreCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(165,180,252,0.3)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0.05)" />
          </radialGradient>
        </defs>
      </motion.svg>
    </motion.div>
  );
}

export default SiliconDie;
