'use client';

/**
 * DockBar — v4.6 macOS Dock Floating Pill
 *
 * Replaces BottomNav.tsx in dashboard context.
 * - Atmospheric Glass: blur(20px) + saturate(180%) with indigo-tinted background
 * - Physical Interaction: Spring bounce on hover (stiffness:400, damping:10)
 * - Energy Glow: Active tab pulsing indigo halo (CSS .dock-item--active::after)
 * - Center FAB: Quick-add radial menu with blur overlay (z-40 < DockBar z-50)
 * - prefers-reduced-motion respected via framer-motion
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Target,
  CalendarDays,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  X,
  PiggyBank,
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DockIcon = React.ComponentType<any>;
import { DOCK_SPRING, springs } from '@/lib/motion';

type TabType = 'dashboard' | 'transactions' | 'goals' | 'analytics' | 'calendar' | 'settings';
type DrawerType = 'income' | 'expense' | null;

interface DockBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenDrawer: (drawer: DrawerType) => void;
  hidden?: boolean;
}

const navItems: { name: string; icon: DockIcon; tab: TabType }[] = [
  { name: 'Dashboard', icon: PiggyBank, tab: 'dashboard' },
  { name: 'İşlemler', icon: TrendingUp, tab: 'transactions' },
];

const navItemsRight: { name: string; icon: DockIcon; tab: TabType }[] = [
  { name: 'Hedefler', icon: Target, tab: 'goals' },
  { name: 'Takvim', icon: CalendarDays, tab: 'calendar' },
];

export const DockBar: React.FC<DockBarProps> = ({
  activeTab,
  onTabChange,
  onOpenDrawer,
  hidden = false,
}) => {
  const [fabOpen, setFabOpen] = useState(false);

  const toggleFab = useCallback(() => {
    setFabOpen((prev) => !prev);
  }, []);

  const closeFab = useCallback(() => {
    setFabOpen(false);
  }, []);

  const handleQuickAction = useCallback(
    (drawer: DrawerType) => {
      closeFab();
      onOpenDrawer(drawer);
    },
    [closeFab, onOpenDrawer]
  );

  return (
    <>
      {/* Blur overlay — z-40, below DockBar z-50 */}
      <AnimatePresence>
        {fabOpen && (
          <motion.div
            className="dock-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeFab}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Radial Quick-Add Actions — positioned above DockBar */}
      <AnimatePresence>
        {fabOpen && (
          <div
            className="fixed z-50 flex gap-3"
            style={{
              bottom: 'calc(48px + 80px)',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {/* Gelir Ekle — up-left */}
            <motion.button
              className="dock-radial-action"
              onClick={() => handleQuickAction('income')}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ ...springs.snappy, delay: 0.05 }}
              aria-label="Gelir Ekle"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                <ArrowUpRight size={16} className="text-emerald-400" strokeWidth={2} />
              </div>
              <span className="text-sm font-medium text-white/90">Gelir Ekle</span>
            </motion.button>

            {/* Gider Ekle — up-right */}
            <motion.button
              className="dock-radial-action"
              onClick={() => handleQuickAction('expense')}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ ...springs.snappy, delay: 0.1 }}
              aria-label="Gider Ekle"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20">
                <ArrowDownRight size={16} className="text-rose-400" strokeWidth={2} />
              </div>
              <span className="text-sm font-medium text-white/90">Gider Ekle</span>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Dock Bar */}
      <motion.nav
        className="dock-bar"
        role="navigation"
        aria-label="Dock navigation"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: hidden ? 100 : 0, opacity: hidden ? 0 : 1 }}
        transition={springs.heavy}
      >
        <div className="flex items-center justify-around">
          {/* Left nav items */}
          {navItems.map((item) => (
            <DockItem
              key={item.tab}
              icon={item.icon}
              label={item.name}
              isActive={activeTab === item.tab}
              onClick={() => onTabChange(item.tab)}
            />
          ))}

          {/* Center FAB */}
          <motion.button
            className="dock-fab ai-gradient"
            onClick={toggleFab}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            transition={DOCK_SPRING}
            aria-label={fabOpen ? 'Menüyü kapat' : 'Hızlı ekle'}
            aria-expanded={fabOpen}
          >
            <motion.div
              animate={{ rotate: fabOpen ? 45 : 0 }}
              transition={DOCK_SPRING}
            >
              {fabOpen ? (
                <X size={22} strokeWidth={2} className="text-white" />
              ) : (
                <Plus size={22} strokeWidth={2} className="text-white" />
              )}
            </motion.div>
          </motion.button>

          {/* Right nav items */}
          {navItemsRight.map((item) => (
            <DockItem
              key={item.tab}
              icon={item.icon}
              label={item.name}
              isActive={activeTab === item.tab}
              onClick={() => onTabChange(item.tab)}
            />
          ))}
        </div>
      </motion.nav>
    </>
  );
};

/**
 * DockItem — Individual dock tab with spring bounce + energy glow
 */
interface DockItemProps {
  icon: DockIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const DockItem: React.FC<DockItemProps> = ({ icon: Icon, label, isActive, onClick }) => {
  const isPiggyBank = Icon === PiggyBank;

  return (
    <motion.button
      className={`dock-item ${isActive ? 'dock-item--active' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.15, y: -4 }}
      whileTap={{ scale: 0.95 }}
      transition={DOCK_SPRING}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <motion.div
        animate={isActive ? { scale: 1.15 } : { scale: 1 }}
        transition={DOCK_SPRING}
      >
        <Icon
          size={22}
          strokeWidth={isPiggyBank ? 2.2 : 1.5}
          className={
            isPiggyBank
              ? isActive ? 'text-[#9d00ff]' : 'text-zinc-500'
              : isActive
                ? 'text-cyan-400'
                : 'text-zinc-500'
          }
          style={
            isActive
              ? { filter: isPiggyBank ? 'drop-shadow(0 0 6px rgba(157,0,255,0.5))' : 'drop-shadow(0 0 4px rgba(0,240,255,0.5))' }
              : {}
          }
        />
      </motion.div>

      {/* Active label fade-in */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            className="text-[10px] font-medium text-cyan-400"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default DockBar;
