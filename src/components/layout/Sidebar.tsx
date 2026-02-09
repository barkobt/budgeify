'use client';

/**
 * Sidebar — v6.0 Desktop Sidebar Navigation
 *
 * Stitch 3 inspired collapsible sidebar for desktop (lg+).
 * - Collapsed: w-20 (icon only)
 * - Expanded: w-64 (icon + label)
 * - glass-panel background with neon-border-purple active state
 * - NeonWalletIcon logo + gradient "Budgeify" text
 * - Bottom: Settings link + Clerk UserButton
 * - Hidden on mobile (< lg) — DockBar + PortalNavbar used instead
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  PiggyBank,
} from 'lucide-react';

type TabType = 'dashboard' | 'transactions' | 'goals' | 'analytics' | 'settings';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const NAV_ITEMS: { label: string; icon: React.ElementType; tab: TabType }[] = [
  { label: 'Dashboard', icon: LayoutDashboard, tab: 'dashboard' },
  { label: 'İşlemler', icon: ArrowLeftRight, tab: 'transactions' },
  { label: 'Hedefler', icon: Target, tab: 'goals' },
  { label: 'Analiz', icon: BarChart3, tab: 'analytics' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const [expanded, setExpanded] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ClerkUserBtn, setClerkUserBtn] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import('@clerk/nextjs')
      .then((clerk) => setClerkUserBtn(() => clerk.UserButton))
      .catch(() => {});
  }, []);

  const handleLogoClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('oracle:reset-dashboard'));
  }, []);

  const toggleExpanded = useCallback(() => setExpanded((prev) => !prev), []);

  return (
    <aside
      className={`sidebar-root hidden lg:flex flex-col ${expanded ? 'w-64' : 'w-20'}`}
      role="navigation"
      aria-label="Sidebar navigation"
    >
      {/* Logo */}
      <button
        onClick={handleLogoClick}
        className="sidebar-logo-btn flex items-center gap-3 px-4 py-6 transition-transform duration-200 hover:scale-[1.02] active:scale-95"
        aria-label="Dashboard ana ekranına dön"
      >
        <div className="logo-icon-gradient" style={{ flexShrink: 0 }}>
          <PiggyBank size={28} className="text-[#9d00ff]" strokeWidth={2.2} />
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.span
              className="text-base font-black uppercase tracking-widest text-gradient-logo whitespace-nowrap select-none"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              BUDGEIFY
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/8" />

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.tab;
          const Icon = item.icon;
          return (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              className={`sidebar-nav-item group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'sidebar-nav-item--active bg-primary/20 text-white neon-border-purple'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-secondary'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={20}
                strokeWidth={1.8}
                className={`shrink-0 transition-colors duration-200 ${
                  isActive ? 'text-accent-purple' : 'text-zinc-500 group-hover:text-secondary'
                }`}
              />
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    className="whitespace-nowrap overflow-hidden"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto flex flex-col gap-2 px-3 pb-4">
        {/* Divider */}
        <div className="mx-1 h-px bg-white/8 mb-2" />

        {/* Settings */}
        <button
          onClick={() => onTabChange('settings')}
          className={`sidebar-nav-item group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
            activeTab === 'settings'
              ? 'sidebar-nav-item--active bg-primary/20 text-white neon-border-purple'
              : 'text-zinc-400 hover:bg-white/5 hover:text-secondary'
          }`}
          aria-label="Ayarlar"
          aria-current={activeTab === 'settings' ? 'page' : undefined}
        >
          <Settings
            size={20}
            strokeWidth={1.8}
            className="shrink-0 text-zinc-500 group-hover:text-secondary transition-colors duration-200"
          />
          <AnimatePresence>
            {expanded && (
              <motion.span
                className="whitespace-nowrap overflow-hidden"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                Ayarlar
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User Profile Card */}
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-white/3">
          {ClerkUserBtn ? (
            <ClerkUserBtn
              appearance={{
                variables: {
                  colorPrimary: '#7C3AED',
                  colorBackground: '#0A0A0F',
                  colorText: '#E2E8F0',
                  colorTextSecondary: '#94A3B8',
                  borderRadius: '0.75rem',
                },
                elements: {
                  avatarBox: 'w-8 h-8 ring-2 ring-[var(--color-primary)]/30',
                  userButtonPopoverCard: '!bg-[#121223] border border-white/10 shadow-2xl',
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
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse shrink-0" />
          )}
          <AnimatePresence>
            {expanded && (
              <motion.div
                className="overflow-hidden whitespace-nowrap"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <p className="text-xs font-medium text-white/80">Hesabım</p>
                <p className="text-[10px] text-zinc-500">Profil & Ayarlar</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={toggleExpanded}
          className="flex items-center justify-center h-8 rounded-lg bg-white/3 hover:bg-white/6 text-zinc-500 hover:text-zinc-300 transition-all duration-200"
          aria-label={expanded ? 'Sidebar\'ı daralt' : 'Sidebar\'ı genişlet'}
        >
          {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
