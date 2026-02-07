'use client';

import Link from 'next/link';
import { NeonWalletIcon } from '@/components/ui/NeonWalletIcon';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
}

const sizeMap = {
  sm: { icon: 28, text: 'text-lg' },
  md: { icon: 36, text: 'text-2xl' },
  lg: { icon: 44, text: 'text-3xl' },
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  href
}) => {
  const { icon, text } = sizeMap[size];

  // Always route to /dashboard — the middleware handles auth redirects
  const linkHref = href ?? '/dashboard';

  const logoContent = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <NeonWalletIcon size={icon} style={{ filter: 'drop-shadow(0 0 6px rgba(0,240,255,0.5))' }} />

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
