'use client';

import React from 'react';
import { Home, TrendingUp, Target, BarChart3 } from 'lucide-react';

type TabType = 'dashboard' | 'transactions' | 'goals' | 'analytics';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems = [
  { name: 'Dashboard', icon: Home, tab: 'dashboard' as TabType },
  { name: 'İşlemler', icon: TrendingUp, tab: 'transactions' as TabType },
  { name: 'Hedefler', icon: Target, tab: 'goals' as TabType },
  { name: 'Analiz', icon: BarChart3, tab: 'analytics' as TabType },
];

/**
 * BottomNav - Cosmic Indigo Bottom Navigation
 *
 * Glassmorphism 2.0 with premium micro-animations.
 */
export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40
                    bg-cosmic-900/90 backdrop-blur-xl border-t border-white/5 safe-area-pb">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;

            return (
              <button
                key={item.tab}
                onClick={() => onTabChange(item.tab)}
                className="flex flex-col items-center justify-center gap-1.5 min-w-[70px] py-2
                           transition-all duration-300 relative group"
                aria-label={item.name}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active Indicator - Top glow line */}
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full
                              transition-all duration-300 ${
                                isActive
                                  ? 'w-10 bg-gradient-to-r from-accent-400 to-violet-500 shadow-lg shadow-accent-500/50'
                                  : 'w-0 bg-transparent'
                              }`}
                />

                {/* Icon with scale animation */}
                <div
                  className={`transition-all duration-300 ${
                    isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'
                  }`}
                >
                  <Icon
                    size={22}
                    strokeWidth={1.5}
                    className={`transition-all duration-300 ${
                      isActive
                        ? 'text-accent-400'
                        : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`text-[11px] font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-accent-400'
                      : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
