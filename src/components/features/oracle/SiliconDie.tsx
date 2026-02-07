'use client';

/**
 * SiliconDie — v5.0: The Wallet Heart
 *
 * Premium stylized Wallet SVG — the Mechanical Heart of Oracle.
 * 4 layers: Wallet Body → Neon Circuit Traces → Core Energy Coin → Wallet Frame.
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

// Neon Silicon Resonance — Dual-Tone Energy Palette
const NEON_CYAN = '#00F0FF';
const NEON_CYAN_MID = '#00D4E8';
const NEON_CYAN_DEEP = '#00B8D4';

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

  // Neon intensity — dormant: subtle standby, peaks at active/dock
  const neonIntensity = useTransform(progress, [0, 0.2, 0.5, 0.7, 1.0], [0.15, 0.25, 0.6, 1.0, 0.8]);
  const neonHaloOpacity = useTransform(progress, [0, 0.2, 0.5, 0.7, 1.0], [0.08, 0.15, 0.4, 0.7, 0.5]);
  const neonHaloScale = useTransform(progress, [0, 0.5, 0.7, 1.0], [0.8, 1.0, 1.2, 1.0]);

  return (
    <motion.div
      layoutId={layoutId}
      className={`silicon-die-wrapper ${className}`}
      animate={{ width: dim, height: dim }}
      transition={ASSEMBLY_SPRING}
      style={{ rotateX }}
    >
      {/* Neon Ambient Halo — large soft radiating glow behind entire die */}
      <motion.div
        className="silicon-neon-halo"
        style={{ opacity: neonHaloOpacity, scale: neonHaloScale }}
        aria-hidden="true"
      />

      {/* Light Leaks — radial gradient overlays (now with neon cyan tint) */}
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
        className="silicon-light-leak silicon-light-leak--center"
        style={{ opacity: neonIntensity }}
        aria-hidden="true"
      />

      {/* 4-Layer Premium Wallet SVG */}
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
        aria-hidden="true"
        style={{ filter: isActive
          ? `drop-shadow(0 0 16px rgba(0, 240, 255, 0.5)) drop-shadow(0 0 40px rgba(0, 184, 212, 0.35)) drop-shadow(0 0 60px rgba(79, 70, 229, 0.2))`
          : `drop-shadow(0 0 8px rgba(0, 240, 255, 0.15)) drop-shadow(0 0 20px rgba(79, 70, 229, 0.1))`
        }}
      >
        {/* Layer 1 (bottom): Wallet Body — dark indigo base with subtle grid */}
        <motion.g style={{ translateZ: layer1Z }}>
          {/* Main wallet body */}
          <rect
            x="12" y="24" width="76" height="56" rx="12"
            fill="url(#walletBodyGradient)"
            stroke="#4338CA"
            strokeWidth="0.6"
          />
          {/* Wallet flap / top section */}
          <path
            d="M24 24 V17 C24 11 29 6 35 6 L65 6 C71 6 76 11 76 17 L76 24"
            fill="url(#walletFlapGradient)"
            stroke="#4338CA"
            strokeWidth="0.6"
          />
          {/* Interior grid lines */}
          <line x1="35" y1="24" x2="35" y2="80" stroke="#4338CA" strokeWidth="0.25" opacity="0.35" />
          <line x1="50" y1="24" x2="50" y2="80" stroke="#4338CA" strokeWidth="0.25" opacity="0.35" />
          <line x1="65" y1="24" x2="65" y2="80" stroke="#4338CA" strokeWidth="0.25" opacity="0.35" />
          <line x1="12" y1="42" x2="88" y2="42" stroke="#4338CA" strokeWidth="0.25" opacity="0.35" />
          <line x1="12" y1="58" x2="88" y2="58" stroke="#4338CA" strokeWidth="0.25" opacity="0.35" />
        </motion.g>

        {/* Layer 2: Neon Circuit Traces — energy flowing inside wallet */}
        <motion.g style={{ translateZ: layer2Z }}>
          {/* Horizontal energy conduits */}
          <path
            d="M18 38 H38 M62 38 H82"
            stroke={NEON_CYAN}
            strokeWidth="1.2"
            opacity="0.85"
            className="silicon-trace-neon"
            style={{ filter: `drop-shadow(0 0 4px ${NEON_CYAN})` }}
          />
          <path
            d="M18 52 H32 M68 52 H82"
            stroke={NEON_CYAN_MID}
            strokeWidth="0.8"
            opacity="0.6"
            className="silicon-trace-neon-secondary"
            style={{ filter: `drop-shadow(0 0 3px ${NEON_CYAN_MID})` }}
          />
          <path
            d="M18 66 H40 M60 66 H82"
            stroke={NEON_CYAN_DEEP}
            strokeWidth="0.6"
            opacity="0.5"
            className="silicon-trace-neon-secondary"
            style={{ filter: `drop-shadow(0 0 2px ${NEON_CYAN_DEEP})` }}
          />
          {/* Wallet card chip — embedded payment chip detail */}
          <rect x="20" y="30" width="22" height="16" rx="3" fill="none" stroke={NEON_CYAN_MID} strokeWidth="0.8" opacity="0.55" />
          <line x1="20" y1="36" x2="42" y2="36" stroke={NEON_CYAN_MID} strokeWidth="0.4" opacity="0.35" />
          <line x1="31" y1="30" x2="31" y2="46" stroke={NEON_CYAN_MID} strokeWidth="0.4" opacity="0.35" />
          {/* Flap energy traces */}
          <path
            d="M34 6 V16 M50 6 V20 M66 6 V16"
            stroke={NEON_CYAN}
            strokeWidth="0.4"
            opacity="0.4"
            className="silicon-trace-neon-secondary"
            style={{ filter: `drop-shadow(0 0 2px ${NEON_CYAN})` }}
          />
        </motion.g>

        {/* Layer 3: Core Energy Coin — glowing currency core */}
        <motion.g style={{ translateZ: layer3Z }}>
          {/* Outer coin ring */}
          <circle
            cx="65" cy="52" r="14"
            fill="url(#coinCoreGradient)"
            className={isActive ? 'silicon-core-neon--active' : ''}
            style={{ filter: isActive ? `drop-shadow(0 0 8px ${NEON_CYAN}) drop-shadow(0 0 16px rgba(0,240,255,0.3))` : '' }}
          />
          {/* Inner coin detail ring */}
          <circle cx="65" cy="52" r="10" fill="none" stroke="rgba(0,240,255,0.25)" strokeWidth="0.5" />
          {/* Currency symbol — geometric ₺ shape */}
          <path
            d="M62 46 L62 58 M59 49 L68 49 M59 53 L66 53"
            stroke={NEON_CYAN}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.9"
          />
          {/* Center energy dot */}
          <circle
            cx="65" cy="52" r="2"
            fill={NEON_CYAN}
            className={isActive ? 'silicon-core-neon--active' : ''}
            style={{ filter: `drop-shadow(0 0 6px ${NEON_CYAN}) drop-shadow(0 0 12px rgba(0,240,255,0.4))` }}
          />
          {/* Neon energy ring around coin */}
          {isActive && (
            <circle
              cx="65" cy="52" r="18"
              fill="none"
              stroke={NEON_CYAN}
              strokeWidth="0.3"
              opacity="0.4"
              className="silicon-neon-ring-pulse"
              style={{ filter: `drop-shadow(0 0 4px ${NEON_CYAN})` }}
            />
          )}
        </motion.g>

        {/* Layer 4 (top): Wallet Frame — neon edge highlight */}
        <motion.g style={{ translateZ: layer4Z }}>
          <rect
            x="12" y="24" width="76" height="56" rx="12"
            fill="none"
            stroke="rgba(0,240,255,0.1)"
            strokeWidth="1.5"
          />
          <path
            d="M24 24 V17 C24 11 29 6 35 6 L65 6 C71 6 76 11 76 17 L76 24"
            fill="none"
            stroke="rgba(0,240,255,0.08)"
            strokeWidth="1"
          />
          {/* Corner accent pads */}
          <rect x="14" y="26" width="5" height="5" rx="1.5" fill="rgba(0,240,255,0.05)" stroke="rgba(0,240,255,0.15)" strokeWidth="0.5" />
          <rect x="81" y="26" width="5" height="5" rx="1.5" fill="rgba(0,240,255,0.05)" stroke="rgba(0,240,255,0.15)" strokeWidth="0.5" />
          <rect x="14" y="73" width="5" height="5" rx="1.5" fill="rgba(0,240,255,0.05)" stroke="rgba(0,240,255,0.15)" strokeWidth="0.5" />
          <rect x="81" y="73" width="5" height="5" rx="1.5" fill="rgba(0,240,255,0.05)" stroke="rgba(0,240,255,0.15)" strokeWidth="0.5" />
        </motion.g>

        {/* Gradient definitions — Neon Wallet Resonance */}
        <defs>
          <linearGradient id="walletBodyGradient" x1="12" y1="24" x2="88" y2="80">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#1a1a3e" />
            <stop offset="100%" stopColor="#0f0f2e" />
          </linearGradient>
          <linearGradient id="walletFlapGradient" x1="24" y1="6" x2="76" y2="24">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#151332" />
          </linearGradient>
          <radialGradient id="coinCoreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3730A3" />
            <stop offset="40%" stopColor="#4F46E5" />
            <stop offset="70%" stopColor="#00B8D4" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id="neonHaloGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,240,255,0.3)" />
            <stop offset="40%" stopColor="rgba(0,184,212,0.15)" />
            <stop offset="70%" stopColor="rgba(79,70,229,0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </motion.svg>
    </motion.div>
  );
}

export default SiliconDie;
