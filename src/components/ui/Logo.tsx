'use client';

import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
}

const sizeMap = {
  sm: { icon: 20, text: 'text-lg', padding: 'p-1.5' },
  md: { icon: 28, text: 'text-2xl', padding: 'p-2' },
  lg: { icon: 36, text: 'text-3xl', padding: 'p-2.5' },
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  href
}) => {
  const { icon, text, padding } = sizeMap[size];

  // Always route to /dashboard — the middleware handles auth redirects
  const linkHref = href ?? '/dashboard';

  const logoContent = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Silicon Wallet Icon — Neon Cyan Glow + Mechanical Heart */}
      <div className="relative">
        <div className="absolute inset-0 rounded-xl blur-md opacity-60" style={{ background: 'linear-gradient(135deg, #00F0FF 0%, #4F46E5 50%, #00B8D4 100%)' }} />
        <div
          className={`relative ai-gradient ${padding} rounded-xl flex items-center justify-center`}
          style={{ boxShadow: '0 0 20px rgba(0,240,255,0.4), 0 0 40px rgba(0,184,212,0.2), 0 4px 12px rgba(79,70,229,0.3)' }}
        >
          <svg width={icon} height={icon} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0,240,255,0.5))' }}
          >
            {/* Wallet body */}
            <rect x="14" y="28" width="72" height="52" rx="10" stroke="#00D4E8" strokeWidth="2.5" fill="rgba(30,27,75,0.5)" />
            {/* Wallet flap */}
            <path d="M26 28 V20 C26 13 31 8 38 8 H62 C69 8 74 13 74 20 V28" stroke="#00D4E8" strokeWidth="2.5" fill="rgba(30,27,75,0.3)" />
            {/* Circuit traces */}
            <line x1="22" y1="44" x2="40" y2="44" stroke="#00F0FF" strokeWidth="1.2" opacity="0.6" />
            <line x1="22" y1="56" x2="36" y2="56" stroke="#00F0FF" strokeWidth="1.2" opacity="0.5" />
            <line x1="22" y1="68" x2="40" y2="68" stroke="#00F0FF" strokeWidth="1.2" opacity="0.6" />
            {/* Coin core */}
            <circle cx="64" cy="54" r="14" fill="url(#logoCoinGlow)" />
            <circle cx="64" cy="54" r="10" fill="none" stroke="rgba(0,240,255,0.3)" strokeWidth="0.8" />
            {/* Currency mark */}
            <path d="M61 48 L61 60 M58 51 L67 51 M58 55 L65 55" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
            <circle cx="64" cy="54" r="2" fill="#00F0FF" opacity="0.8" />
            <defs>
              <radialGradient id="logoCoinGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3730A3" />
                <stop offset="60%" stopColor="#4F46E5" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00B8D4" stopOpacity="0.2" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Budgeify Text - Bright for dark backgrounds */}
      {showText && (
        <span className={`${text} font-bold tracking-widest text-gradient`}>
          Budgeify
        </span>
      )}
    </div>
  );

  return (
    <Link
      href={linkHref}
      className="transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      {logoContent}
    </Link>
  );
};
