import { Wallet } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 20, text: 'text-lg' },
  md: { icon: 28, text: 'text-2xl' },
  lg: { icon: 36, text: 'text-3xl' },
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const { icon, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Wallet Icon - Kral İndigo with subtle gradient */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-lg blur-sm opacity-50" />
        <div className="relative bg-gradient-to-br from-indigo-700 to-indigo-800 p-1.5 rounded-lg shadow-lg shadow-indigo-900/30">
          <Wallet
            size={icon}
            className="text-white"
            strokeWidth={2.5}
          />
        </div>
      </div>

      {/* Budgeify Text */}
      {showText && (
        <span className={`${text} font-bold tracking-tight`}>
          <span className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 bg-clip-text text-transparent">
            Budgeify
          </span>
        </span>
      )}
    </div>
  );
};
