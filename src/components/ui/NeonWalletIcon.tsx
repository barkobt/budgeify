'use client';

/**
 * NeonWalletIcon — Unified Neon Wallet SVG v5.0
 *
 * The canonical Budgeify icon used across all surfaces:
 * PortalNavbar, DockBar (Home), Auth spinners.
 * Wallet body + flap + circuit traces + coin core + currency mark.
 * Dual-tone palette: structure (#1e1b4b/#4338CA) + energy (#00F0FF/#00D4E8/#00B8D4).
 * Uses React useId() for unique gradient IDs per instance.
 */

import { useId } from 'react';

interface NeonWalletIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number; // accepted for LucideIcon compat — not used
}

export const NeonWalletIcon: React.FC<NeonWalletIconProps> = ({
  size = 22,
  className = '',
  style,
}) => {
  const uid = useId();
  const gid = `nwg${uid.replace(/:/g, '')}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 0 4px rgba(0,240,255,0.4))', ...style }}
      aria-hidden="true"
    >
      {/* Wallet body */}
      <rect x="14" y="28" width="72" height="52" rx="10" stroke="#00D4E8" strokeWidth="2" fill="rgba(30,27,75,0.6)" />
      {/* Wallet flap */}
      <path d="M26 28 V20 C26 13 31 8 38 8 H62 C69 8 74 13 74 20 V28" stroke="#00D4E8" strokeWidth="2" fill="rgba(30,27,75,0.4)" />
      {/* Neon energy traces */}
      <line x1="22" y1="44" x2="40" y2="44" stroke="#00F0FF" strokeWidth="1" opacity="0.6" />
      <line x1="22" y1="56" x2="36" y2="56" stroke="#00F0FF" strokeWidth="1" opacity="0.5" />
      <line x1="22" y1="68" x2="40" y2="68" stroke="#00F0FF" strokeWidth="1" opacity="0.6" />
      {/* Coin core */}
      <circle cx="64" cy="54" r="14" fill={`url(#${gid})`} />
      <circle cx="64" cy="54" r="10" fill="none" stroke="rgba(0,240,255,0.3)" strokeWidth="0.8" />
      {/* Currency mark */}
      <path d="M61 48 L61 60 M58 51 L67 51 M58 55 L65 55" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <circle cx="64" cy="54" r="2" fill="#00F0FF" opacity="0.8" />
      <defs>
        <radialGradient id={gid} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3730A3" />
          <stop offset="60%" stopColor="#4F46E5" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00B8D4" stopOpacity="0.2" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default NeonWalletIcon;
