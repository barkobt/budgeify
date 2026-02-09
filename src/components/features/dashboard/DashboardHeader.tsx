'use client';

/**
 * DashboardHeader — v6.0 M3 Desktop Dashboard Header
 *
 * Stitch 3 inspired page header bar for desktop (lg+):
 * - Page title + greeting
 * - Search input (cosmetic)
 * - Notification bell
 * - "Add New" CTA button
 */

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardHeaderProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onAddIncome, onAddExpense }) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
    };
    if (showAddMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAddMenu]);

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      {/* Left: Title */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Finansal durumunuzun genel görünümü
        </p>
      </div>

      {/* Right: Search + Notification + Add New */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Ara..."
            readOnly
            onClick={() => window.dispatchEvent(new CustomEvent('open:command-palette'))}
            className="h-9 w-48 rounded-xl bg-white/5 border border-white/8 pl-9 pr-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/8">
            ⌘K
          </kbd>
        </div>

        {/* Notification Bell */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:bg-white/8 transition-all"
          aria-label="Bildirimler"
        >
          <Bell size={16} strokeWidth={1.8} />
        </button>

        {/* Add New CTA — Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowAddMenu((prev) => !prev)}
            className="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/25"
          >
            <Plus size={16} strokeWidth={2} />
            <span>Yeni Ekle</span>
          </button>

          {showAddMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-card-dark border border-white/10 shadow-2xl z-50 overflow-hidden">
              <button
                onClick={() => { onAddIncome(); setShowAddMenu(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-200 hover:bg-white/5 transition-colors"
              >
                <ArrowUpRight size={16} className="text-emerald-400" />
                Gelir Ekle
              </button>
              <div className="h-px bg-white/8" />
              <button
                onClick={() => { onAddExpense(); setShowAddMenu(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-200 hover:bg-white/5 transition-colors"
              >
                <ArrowDownRight size={16} className="text-rose-400" />
                Gider Ekle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
