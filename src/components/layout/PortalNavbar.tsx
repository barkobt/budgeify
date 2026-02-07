'use client';

/**
 * PortalNavbar — v4.6 Command Strip Top Bar
 *
 * Replaces Header.tsx in dashboard context.
 * Atmospheric glass (blur(20px) + saturate(180%)), context-aware title,
 * Clerk UserButton (crash-proof dynamic import), mini die logo placeholder.
 * Header.tsx is kept for landing page usage.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu } from 'lucide-react';

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="portal-navbar" role="navigation" aria-label="Portal navigation">
      <div className="max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Left: Mini Die Logo */}
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center w-8 h-8 rounded-lg
                     bg-accent-600/15 hover:bg-accent-600/25
                     transition-colors duration-200"
          aria-label="Sayfa başına dön"
        >
          <Cpu size={16} className="text-accent-400" strokeWidth={2} />
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
