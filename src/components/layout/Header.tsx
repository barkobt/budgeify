'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { ArrowRight, LayoutDashboard } from 'lucide-react';

/**
 * Header — Premium fintech header
 *
 * Crash-proof: dynamic-imports Clerk. Shows loading skeleton while Clerk loads.
 * Signed-in: UserButton + "Dashboard'a Git" (if not on dashboard).
 * Signed-out: "Hemen Basla" CTA.
 */
export const Header = () => {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  const [authState, setAuthState] = useState<boolean | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ClerkUserBtn, setClerkUserBtn] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import('@clerk/nextjs')
      .then((clerk) => {
        setClerkUserBtn(() => clerk.UserButton);
      })
      .catch(() => {
        setAuthState(false);
      });
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50
                       bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="sm" showText={true} href="/dashboard" />

          <div className="flex items-center gap-4">
            {ClerkUserBtn ? (
              <ClerkAuthControls
                UserButton={ClerkUserBtn}
                isDashboard={!!isDashboard}
              />
            ) : authState === false ? (
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
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

/**
 * ClerkAuthControls — loads useAuth hook dynamically, renders AuthButtons
 */
function ClerkAuthControls({
  UserButton,
  isDashboard,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UserButton: React.ComponentType<any>;
  isDashboard: boolean;
}) {
  const [authHook, setAuthHook] = useState<(() => { isSignedIn?: boolean }) | null>(null);

  useEffect(() => {
    import('@clerk/nextjs').then((clerk) => {
      setAuthHook(() => clerk.useAuth);
    }).catch(() => {});
  }, []);

  if (!authHook) {
    return <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />;
  }

  return <AuthButtons useAuth={authHook} UserButton={UserButton} isDashboard={isDashboard} />;
}

function AuthButtons({
  useAuth,
  UserButton,
  isDashboard,
}: {
  useAuth: () => { isSignedIn?: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UserButton: React.ComponentType<any>;
  isDashboard: boolean;
}) {
  let isSignedIn: boolean | undefined;
  try {
    const auth = useAuth();
    isSignedIn = auth.isSignedIn;
  } catch {
    isSignedIn = undefined;
  }

  if (isSignedIn === true) {
    return (
      <>
        {!isDashboard && (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white
                       transition-colors duration-200"
          >
            <LayoutDashboard size={16} />
            Dashboard&apos;a Git
          </Link>
        )}
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-9 h-9 ring-2 ring-accent-500/30',
            }
          }}
        />
      </>
    );
  }

  if (isSignedIn === false) {
    return (
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
    );
  }

  return <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />;
}

export default Header;
