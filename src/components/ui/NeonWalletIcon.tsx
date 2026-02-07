'use client';

/**
 * NeonWalletIcon — Unified Neon Wallet SVG v5.1
 *
 * The canonical Budgeify icon used across all surfaces:
 * PortalNavbar, DockBar (Home), Auth spinners, OracleHero center.
 * Line-art wallet with banknotes + clasp.
 * Neon cyan palette: #00D4E8 (structure) + #00F0FF (accent).
 */

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
      {/* Banknote 1 (back) */}
      <path d="M15 34 L28 8 L60 17 L50 34" stroke="#00D4E8" strokeWidth="5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {/* Banknote 2 (front) */}
      <path d="M30 34 L44 5 L74 15 L64 34" stroke="#00D4E8" strokeWidth="5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {/* Wallet body */}
      <rect x="4" y="34" width="76" height="63" rx="7" stroke="#00D4E8" strokeWidth="5" fill="none" />
      {/* Clasp outer */}
      <rect x="76" y="53" width="21" height="21" rx="6" stroke="#00D4E8" strokeWidth="5" fill="none" />
      {/* Clasp inner */}
      <rect x="82" y="59" width="9" height="9" rx="3" stroke="#00F0FF" strokeWidth="3.5" fill="none" />
    </svg>
  );
};

export default NeonWalletIcon;
