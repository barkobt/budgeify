/**
 * Dashboard Loading — v7.1 Cinematic PiggyBank Pre-flight
 *
 * RSC Constraint: NO 'use client', NO framer-motion, NO hooks.
 * All animations are pure CSS @keyframes (globals.css).
 */
export default function DashboardLoading() {
  return (
    <div className="preflight-screen">
      {/* Ambient glow behind logo */}
      <div
        className="absolute rounded-full blur-xl animate-pulse"
        style={{
          width: 240,
          height: 240,
          background: 'radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 70%)',
        }}
      />

      {/* PiggyBank icon — spin-slow + pulsate */}
      <div className="loading-logo relative z-10">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7C3AED"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ filter: 'drop-shadow(0 0 20px rgba(124,58,237,0.5))' }}
        >
          <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.4-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2" />
          <path d="M2 9.5c1 0 2 1 2 2.5" />
          <path d="M15.5 9.5a0.5 0.5 0 1 0 0-1 0.5 0.5 0 0 0 0 1z" />
        </svg>
      </div>

      {/* Sequential status texts — pure CSS animation-delay */}
      <div className="preflight-status" aria-live="polite">
        <span className="preflight-text preflight-text-1">
          Sistemler uyanıyor...
        </span>
        <span className="preflight-text preflight-text-2">
          Finansal çekirdek hazırlanıyor...
        </span>
        <span className="preflight-text preflight-text-3">
          Veriler senkronize ediliyor...
        </span>
        <span className="preflight-text preflight-text-4">
          Sistem hazır
        </span>
      </div>

      {/* Progress bar — neon gradient */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-0.5 rounded-full bg-white/6 overflow-hidden">
        <div className="loading-progress-bar" />
      </div>
    </div>
  );
}
