'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { ArrowRight } from 'lucide-react';

let useAuth: () => { isSignedIn: boolean | undefined };
let UserButton: React.ComponentType<{ appearance?: unknown }>;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const clerk = require('@clerk/nextjs');
  useAuth = clerk.useAuth;
  UserButton = clerk.UserButton;
} catch {
  useAuth = () => ({ isSignedIn: undefined });
  const Noop = () => null;
  Noop.displayName = 'UserButtonFallback';
  UserButton = Noop;
}

/**
 * Header — Premium fintech header
 *
 * Crash-proof: works without Clerk.
 */
export const Header = () => {
  let isSignedIn: boolean | undefined = undefined;
  try {
    const auth = useAuth();
    isSignedIn = auth.isSignedIn;
  } catch {
    isSignedIn = undefined;
  }

  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50
                       bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="sm" showText={true} />

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                {isLanding && (
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-white/80 hover:text-white
                               transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                )}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-9 h-9',
                    }
                  }}
                />
              </>
            ) : (
              <Link
                href="/sign-up"
                className="group flex items-center gap-2 px-4 py-2 rounded-xl
                           bg-accent-700 hover:bg-accent-800
                           text-white text-sm font-medium
                           transition-all duration-200
                           shadow-lg shadow-accent-700/25 hover:shadow-accent-800/30
                           hover:scale-105 active:scale-95"
              >
                Hemen Basla
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
