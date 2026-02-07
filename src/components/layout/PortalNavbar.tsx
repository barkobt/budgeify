'use client';

/**
 * PortalNavbar — v4.6 Command Strip Top Bar
 *
 * Replaces Header.tsx in dashboard context.
 * Atmospheric glass (blur(20px) + saturate(180%)), context-aware title,
 * Clerk UserButton (crash-proof dynamic import), mini die logo placeholder.
 * Header.tsx is kept for landing page usage.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'dashboard' | 'transactions' | 'goals' | 'analytics';

interface PortalNavbarProps {
  activeTab?: TabType;
}

const TAB_TITLES: Record<TabType, string> = {
  dashboard: 'Dashboard',
  transactions: 'İşlemler',
  goals: 'Hedefler',
  analytics: 'Analiz',
};

export const PortalNavbar: React.FC<PortalNavbarProps> = ({ activeTab = 'dashboard' }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ClerkUserBtn, setClerkUserBtn] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import('@clerk/nextjs')
      .then((clerk) => {
        setClerkUserBtn(() => clerk.UserButton);
      })
      .catch(() => {});
  }, []);

  const handleLogoClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('oracle:reset-dashboard'));
  }, []);

  return (
    <nav className="portal-navbar" role="navigation" aria-label="Portal navigation">
      <div className="max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Left: Budgeify Logo — Mini Silicon Die */}
        <button
          onClick={handleLogoClick}
          className="flex items-center justify-center w-8 h-8 rounded-lg
                     bg-accent-600/15 hover:bg-accent-600/25
                     transition-colors duration-200"
          aria-label="Dashboard ana ekranina don"
        >
          <svg width="18" height="18" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="10" y="10" width="80" height="80" rx="16" fill="#1e1b4b" stroke="#4338CA" strokeWidth="1" />
            <line x1="30" y1="10" x2="30" y2="90" stroke="#4338CA" strokeWidth="0.6" opacity="0.5" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="#4338CA" strokeWidth="0.6" opacity="0.5" />
            <line x1="70" y1="10" x2="70" y2="90" stroke="#4338CA" strokeWidth="0.6" opacity="0.5" />
            <line x1="10" y1="30" x2="90" y2="30" stroke="#4338CA" strokeWidth="0.6" opacity="0.5" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="#4338CA" strokeWidth="0.6" opacity="0.5" />
            <line x1="10" y1="70" x2="90" y2="70" stroke="#4338CA" strokeWidth="0.6" opacity="0.5" />
            <path d="M25 50 H40 M60 50 H75 M50 25 V40 M50 60 V75" stroke="#818CF8" strokeWidth="1.5" opacity="0.7" />
            <rect x="35" y="35" width="30" height="30" rx="8" fill="url(#navCoreLogo)" />
            <defs>
              <linearGradient id="navCoreLogo" x1="35" y1="35" x2="65" y2="65">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>
          </svg>
        </button>

        {/* Center: Context-aware page title */}
        <div className="absolute left-1/2 -translate-x-1/2 h-full flex items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeTab}
              className="text-sm font-semibold text-white/90 tracking-wide"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {TAB_TITLES[activeTab]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Right: Clerk UserButton + notification dot placeholder */}
        <div className="flex items-center gap-3">
          {/* Notification dot — future-ready */}
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-accent-500/0" />
          </div>

          {ClerkUserBtn ? (
            <ClerkUserBtn
              appearance={{
                variables: {
                  colorPrimary: '#4F46E5',
                  colorBackground: '#0A0A0F',
                  colorText: '#E2E8F0',
                  colorTextSecondary: '#94A3B8',
                  borderRadius: '0.75rem',
                },
                elements: {
                  avatarBox: 'w-8 h-8 ring-2 ring-accent-500/30',
                  userButtonPopoverCard: '!bg-zinc-900 border border-white/10 shadow-2xl',
                  userButtonPopoverActions: '!bg-transparent',
                  userButtonPopoverActionButton: '!text-slate-200 hover:!bg-white/10',
                  userButtonPopoverActionButtonText: '!text-slate-200',
                  userButtonPopoverActionButtonIcon: '!text-slate-400',
                  userPreviewMainIdentifier: '!text-white',
                  userPreviewSecondaryIdentifier: '!text-slate-400',
                  userButtonPopoverFooter: 'hidden',
                },
              }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default PortalNavbar;
