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

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;

            return (
              <button
                key={item.tab}
                onClick={() => onTabChange(item.tab)}
                className="flex flex-col items-center justify-center gap-1 min-w-[60px]
                           transition-all duration-200 relative group"
                aria-label={item.name}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1
                                  bg-gradient-to-r from-accent-600 to-accent-700 rounded-full" />
                )}

                <Icon
                  size={22}
                  strokeWidth={2.5}
                  className={`transition-all duration-200 ${
                    isActive
                      ? 'text-accent-700 scale-110'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span
                  className={`text-[10px] font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'text-accent-700'
                      : 'text-slate-400 group-hover:text-slate-600'
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
