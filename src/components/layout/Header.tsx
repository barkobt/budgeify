'use client';

import React from 'react';
import { Logo } from '@/components/ui/Logo';
import { User } from 'lucide-react';

export const Header = () => {
  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 glass border-b border-white/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Professional Logo */}
          <Logo size="sm" showText={true} />

          {/* Right Side - User Profile (subtle, professional) */}
          <button
            className="group relative w-9 h-9 rounded-full bg-white border border-slate-200
                       flex items-center justify-center transition-all duration-200
                       hover:border-accent-700 hover:shadow-accent-sm focus-ring"
            aria-label="User profile"
          >
            <User
              size={18}
              className="text-slate-600 group-hover:text-accent-700 transition-colors duration-200"
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;