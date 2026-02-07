/**
 * Dashboard Loading — v4.6 M13-A Cinematic Pre-flight Screen
 *
 * RSC Constraint: NO 'use client', NO framer-motion, NO hooks.
 * All animations are pure CSS @keyframes.
 * Silicon Die SVG rotates slowly, scale-pulses, indigo glow ring behind.
 * Sequential status texts fade in/out with animation-delay.
 * Min 2s visual feel via CSS animation timing.
 */
export default function DashboardLoading() {
  return (
    <div className="preflight-screen">
      {/* Ambient glow behind die */}
      <div className="preflight-ambient" />

      {/* Silicon Die — 4-layer SVG */}
      <div className="preflight-die-container">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="preflight-die"
          aria-hidden="true"
        >
          {/* Layer 1: Substrate — dark indigo base with grid */}
          <rect
            x="10" y="10" width="80" height="80" rx="16"
            fill="#1e1b4b"
            stroke="#312e81"
            strokeWidth="0.5"
          />
          {/* Substrate grid lines */}
          <line x1="30" y1="10" x2="30" y2="90" stroke="#312e81" strokeWidth="0.3" opacity="0.4" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="#312e81" strokeWidth="0.3" opacity="0.4" />
          <line x1="70" y1="10" x2="70" y2="90" stroke="#312e81" strokeWidth="0.3" opacity="0.4" />
          <line x1="10" y1="30" x2="90" y2="30" stroke="#312e81" strokeWidth="0.3" opacity="0.4" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="#312e81" strokeWidth="0.3" opacity="0.4" />
          <line x1="10" y1="70" x2="90" y2="70" stroke="#312e81" strokeWidth="0.3" opacity="0.4" />

          {/* Layer 2: Circuit Traces — animated indigo paths */}
          <path
            d="M25 50 H40 M60 50 H75 M50 25 V40 M50 60 V75"
            stroke="#4F46E5"
            strokeWidth="1"
            opacity="0.6"
            className="preflight-trace"
          />
          <path
            d="M30 30 L40 40 M60 40 L70 30 M30 70 L40 60 M60 60 L70 70"
            stroke="#6366F1"
            strokeWidth="0.8"
            opacity="0.4"
            className="preflight-trace-secondary"
          />

          {/* Layer 3: Core Logic Block — bright indigo center */}
          <rect
            x="35" y="35" width="30" height="30" rx="8"
            fill="url(#coreGradient)"
            className="preflight-core"
          />

          {/* Layer 4: Heat Spreader Frame — metallic edge */}
          <rect
            x="10" y="10" width="80" height="80" rx="16"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.5"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="coreGradient" x1="35" y1="35" x2="65" y2="65">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
          </defs>
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
          Oracle aktif
        </span>
      </div>

      {/* Bottom progress bar */}
      <div className="preflight-progress">
        <div className="preflight-progress-bar" />
      </div>
    </div>
  );
}
