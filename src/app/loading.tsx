/**
 * Root Loading — v7.1 Cinematic PiggyBank Loading Screen
 * RSC Constraint: NO 'use client', NO hooks, NO framer-motion.
 * All animations via CSS @keyframes (globals.css).
 */
export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-60 flex flex-col items-center justify-center bg-[#050511]">
      {/* Ambient glow behind logo */}
      <div
        className="absolute rounded-full blur-xl animate-pulse"
        style={{
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 70%)',
        }}
      />

      {/* PiggyBank icon — spin-slow + pulsate */}
      <div className="loading-logo relative z-10 mb-8">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7C3AED"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ filter: 'drop-shadow(0 0 16px rgba(124,58,237,0.5))' }}
        >
          <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.4-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2" />
          <path d="M2 9.5c1 0 2 1 2 2.5" />
          <path d="M15.5 9.5a0.5 0.5 0 1 0 0-1 0.5 0.5 0 0 0 0 1z" />
        </svg>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 w-48 h-1 rounded-full bg-white/10 overflow-hidden mb-6">
        <div className="loading-progress-bar" />
      </div>

      {/* Status text */}
      <p className="relative z-10 text-sm font-medium text-slate-400 animate-pulse tracking-wide">
        Sistem Yükleniyor...
      </p>
    </div>
  );
}
