'use client';

import React from 'react';
import { Home, TrendingUp, BarChart3, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Ana Sayfa', icon: Home, href: '/' },
  { name: 'İşlemler', icon: TrendingUp, href: '/transactions' },
  { name: 'Analiz', icon: BarChart3, href: '/analytics' },
  { name: 'Ayarlar', icon: Settings, href: '/settings' },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md bg-white/80 border-t border-white/20 pb-safe">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <button
                key={item.name}
                className="flex flex-col items-center justify-center gap-1 min-w-[60px] transition-all duration-200"
                aria-label={item.name}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
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
