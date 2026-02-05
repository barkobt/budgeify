'use client';

import React from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

/**
 * MainBalanceCard - Premium Balance Display with Animated Numbers
 *
 * Kral İndigo Strategy: Clean card, bold animated numbers, subtle accents
 * Features smooth counting animation on page load.
 */
export const MainBalanceCard = () => {
  const { getTotalIncome, getTotalExpenses, getBalance, getSavingsRate } = useBudgetStore();

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const savingsRate = getSavingsRate();
  const isPositive = balance >= 0;

  return (
    <section className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-700/50 shadow-lg shadow-slate-900/5 dark:shadow-black/20 overflow-hidden backdrop-blur-sm transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-700 to-accent-800 shadow-lg shadow-accent-700/25">
              <Wallet size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mevcut Bakiye</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Bu ay</p>
            </div>
          </div>

          {/* Trend Indicator */}
          {balance !== 0 && (
            <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
              isPositive
                ? 'bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                : 'bg-rose-100/80 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
            }`}>
              {isPositive ? (
                <TrendingUp size={14} strokeWidth={2.5} />
              ) : (
                <TrendingDown size={14} strokeWidth={2.5} />
              )}
              <span className="text-xs font-bold">
                {isPositive ? '+' : ''}{savingsRate}%
              </span>
            </div>
          )}
        </div>

        {/* Main Balance - ANIMATED & PROMINENT */}
        <div className="mb-6">
          <div className={`text-4xl sm:text-5xl font-black tracking-tight ${
            isPositive ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'
          }`}>
            <AnimatedCounter
              value={balance}
              prefix="₺"
              duration={1400}
              decimals={2}
            />
          </div>
        </div>

        {/* Income / Expense Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Income */}
          <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 p-4 border border-emerald-200/50 dark:border-emerald-700/30 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Gelir</p>
            </div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              <AnimatedCounter
                value={totalIncome}
                prefix="₺"
                duration={1200}
                decimals={2}
              />
            </div>
          </div>

          {/* Expense */}
          <div className="rounded-xl bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/20 dark:to-rose-800/10 p-4 border border-rose-200/50 dark:border-rose-700/30 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Gider</p>
            </div>
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
              <AnimatedCounter
                value={totalExpenses}
                prefix="₺"
                duration={1200}
                decimals={2}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Empty State Hint */}
      {totalIncome === 0 && totalExpenses === 0 && (
        <div className="border-t border-slate-100 dark:border-slate-800 bg-gradient-to-r from-accent-50/50 to-accent-100/30 dark:from-accent-900/20 dark:to-accent-800/10 px-6 py-4">
          <p className="text-sm text-accent-700 dark:text-accent-400 text-center font-medium">
            Gelir ve giderlerinizi ekleyerek başlayın
          </p>
        </div>
      )}
    </section>
  );
};

export default MainBalanceCard;
