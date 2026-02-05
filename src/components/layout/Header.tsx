'use client';

import React from 'react';
import { Logo } from '@/components/ui/Logo';
import { User } from 'lucide-react';

/**
 * Header - Cosmic Indigo Theme Header
 *
 * Glassmorphism 2.0 header for dark backgrounds.
 */
export const Header = () => {
  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50
                       bg-cosmic-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo */}
          <Logo size="sm" showText={true} />

          {/* Right Side - User Profile */}
          <button
            className="group relative w-9 h-9 rounded-full
                       bg-white/5 border border-white/10
                       flex items-center justify-center transition-all duration-200
                       hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95"
            aria-label="Kullanıcı profili"
          >
            <User
              size={18}
              className="text-slate-400 group-hover:text-white transition-colors duration-200"
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
