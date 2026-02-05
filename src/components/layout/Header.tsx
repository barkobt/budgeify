'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, UserButton } from '@clerk/nextjs';
import { Logo } from '@/components/ui/Logo';
import { ArrowRight } from 'lucide-react';

/**
 * Header - Cosmic Indigo Theme Header
 *
 * Glassmorphism 2.0 header for dark backgrounds.
 * Works on both landing (/) and dashboard (/dashboard) pages.
 */
export const Header = () => {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50
                       bg-cosmic-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo */}
          <Logo size="sm" showText={true} />

          {/* Right Side - Auth UI */}
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                {/* Show Dashboard link on landing page when signed in */}
                {isLanding && (
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-white/80 hover:text-white
                               transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                )}

                {/* Clerk UserButton with Kral İndigo theme */}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-9 h-9',
                      userButtonPopoverCard: 'bg-cosmic-800 border border-white/10',
                      userButtonPopoverActionButton: 'text-white hover:bg-white/10',
                    }
                  }}
                />
              </>
            ) : (
              /* Show "Hemen Başla" CTA button when not signed in */
              <Link
                href="/sign-up"
                className="group flex items-center gap-2 px-4 py-2 rounded-xl
                           bg-accent-700 hover:bg-accent-800
                           text-white text-sm font-medium
                           transition-all duration-200
                           shadow-lg shadow-accent-700/25 hover:shadow-accent-800/30
                           hover:scale-105 active:scale-95"
              >
                Hemen Başla
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform duration-200"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
