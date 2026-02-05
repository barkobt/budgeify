'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet } from 'lucide-react';

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
  const pathname = usePathname();
  const { icon, text, padding } = sizeMap[size];

  // Smart linking: if href is provided, use it; otherwise determine from pathname
  const linkHref = href ?? (pathname?.startsWith('/dashboard') ? '/dashboard' : '/');

  const logoContent = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Wallet Icon - AI Gradient with glow */}
      <div className="relative">
        <div className="absolute inset-0 ai-gradient rounded-xl blur-md opacity-50" />
        <div className={`relative ai-gradient ${padding} rounded-xl shadow-lg shadow-accent-500/30`}>
          <Wallet
            size={icon}
            className="text-white"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Budgeify Text - Bright for dark backgrounds */}
      {showText && (
        <span className={`${text} font-bold tracking-tight text-gradient`}>
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
