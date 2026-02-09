'use client';

import Link from 'next/link';
import { PiggyBank } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
}

const sizeMap = {
  sm: { icon: 24, text: 'text-base', gap: 'gap-2' },
  md: { icon: 30, text: 'text-xl', gap: 'gap-2.5' },
  lg: { icon: 38, text: 'text-2xl', gap: 'gap-3' },
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  href
}) => {
  const { icon, text, gap } = sizeMap[size];

  // Always route to /dashboard — the middleware handles auth redirects
  const linkHref = href ?? '/dashboard';

  const logoContent = (
    <div className={`flex items-center ${gap} ${className}`}>
      <div className="relative logo-icon-gradient">
        <PiggyBank size={icon} className="text-[#9d00ff]" strokeWidth={2.2} />
      </div>

      {showText && (
        <span className={`${text} font-black uppercase tracking-widest text-gradient-logo`}>
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
