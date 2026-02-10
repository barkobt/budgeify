'use client';

/**
 * CommandPalette — v7.0 M10 Global Search (⌘K)
 *
 * Full-screen modal command palette:
 * - ⌘K / Ctrl+K keyboard shortcut to open
 * - Listens for 'open:command-palette' CustomEvent (from DashboardHeader search input)
 * - Real-time search via useBudgetStore.searchAll()
 * - Results grouped by type (Gelir / Gider / Hedef)
 * - Keyboard navigation (↑↓ arrows + Enter to select)
 * - Escape to close
 * - Click result → dispatches action (navigate to tab / select transaction)
 */

import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  CornerDownLeft,
} from 'lucide-react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatCurrency } from '@/utils';
import type { CurrencyCode } from '@/types';

type SearchResultItem = {
  type: 'income' | 'expense' | 'goal';
  id: string;
  label: string;
  amount: number;
  date?: string;
  categoryName?: string;
};

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (tab: 'transactions' | 'goals') => void;
}

const TYPE_CONFIG = {
  income: { icon: ArrowUpRight, label: 'Gelir', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  expense: { icon: ArrowDownRight, label: 'Gider', color: 'text-rose-400', bg: 'bg-rose-500/15' },
  goal: { icon: Target, label: 'Hedef', color: 'text-violet-400', bg: 'bg-violet-500/15' },
} as const;

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  const searchAll = useBudgetStore((s) => s.searchAll);
  const currency = useBudgetStore((s) => s.currency);

  const results: SearchResultItem[] = query.length >= 1 ? searchAll(query) : [];

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      // Focus input after animation
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleSelect = useCallback((item: SearchResultItem) => {
    onClose();
    if (item.type === 'goal') {
      onNavigate('goals');
    } else {
      onNavigate('transactions');
    }
  }, [onClose, onNavigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResultItem[]>>((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  // Flat index mapping for keyboard nav
  let flatIndex = 0;
  const groupOrder: Array<'income' | 'expense' | 'goal'> = ['income', 'expense', 'goal'];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Palette */}
          <motion.div
            className="fixed inset-0 z-101 flex items-start justify-center pt-[15vh] px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="w-full max-w-lg glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, y: -8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Komut paleti"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
                <Search size={18} className="text-slate-500 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="İşlem, hedef veya kategori ara..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
                  aria-label="Ara"
                  aria-controls={`${uid}-results`}
                  aria-activedescendant={results.length > 0 ? `${uid}-item-${activeIndex}` : undefined}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  onClick={onClose}
                  className="flex items-center justify-center h-6 w-6 rounded-md bg-white/5 text-slate-500 hover:text-white transition-colors"
                  aria-label="Kapat"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Results */}
              <div
                id={`${uid}-results`}
                ref={listRef}
                className="max-h-80 overflow-y-auto overscroll-contain"
                role="listbox"
              >
                {query.length >= 1 && results.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-slate-500">Sonuç bulunamadı</p>
                    <p className="text-xs text-slate-600 mt-1">&ldquo;{query}&rdquo; için eşleşme yok</p>
                  </div>
                )}

                {query.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-xs text-slate-600">Aramaya başlamak için yazın</p>
                  </div>
                )}

                {groupOrder.map((type) => {
                  const items = grouped[type];
                  if (!items || items.length === 0) return null;
                  const config = TYPE_CONFIG[type];

                  return (
                    <div key={type}>
                      {/* Group header */}
                      <div className="px-4 pt-3 pb-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                          {config.label}
                        </span>
                      </div>

                      {/* Items */}
                      {items.map((item) => {
                        const idx = flatIndex++;
                        const isActive = idx === activeIndex;
                        const Icon = config.icon;

                        return (
                          <button
                            key={item.id}
                            id={`${uid}-item-${idx}`}
                            data-index={idx}
                            role="option"
                            aria-selected={isActive}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors ${
                              isActive ? 'bg-white/5' : 'hover:bg-white/3'
                            }`}
                          >
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                              <Icon size={15} className={config.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">{item.label}</p>
                              {item.categoryName && (
                                <p className="text-[11px] text-slate-500 truncate">{item.categoryName}</p>
                              )}
                            </div>
                            <div className="shrink-0 text-right">
                              <p className={`text-sm font-mono tabular-nums ${
                                item.type === 'income' ? 'text-emerald-400' : item.type === 'expense' ? 'text-rose-400' : 'text-violet-400'
                              }`}>
                                {item.type === 'expense' ? '-' : ''}{formatCurrency(item.amount, currency as CurrencyCode)}
                              </p>
                              {item.date && (
                                <p className="text-[10px] text-slate-600 tabular-nums">
                                  {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                </p>
                              )}
                            </div>
                            {isActive && (
                              <CornerDownLeft size={12} className="text-slate-600 shrink-0 ml-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Footer hints */}
              <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/8">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/8 font-mono">↑↓</kbd>
                  <span>Gezin</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/8 font-mono">↵</kbd>
                  <span>Seç</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/8 font-mono">esc</kbd>
                  <span>Kapat</span>
                </div>
                {results.length > 0 && (
                  <span className="ml-auto text-[10px] text-slate-600 tabular-nums">
                    {results.length} sonuç
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
