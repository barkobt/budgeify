'use client';

import React from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

/**
 * MainBalanceCard — HubX-grade balance display
 *
 * Pure dark theme, glass-card aesthetic, tabular-nums currency.
 */
export const MainBalanceCard = () => {
  const { getTotalIncome, getTotalExpenses, getBalance, getSavingsRate } = useBudgetStore();

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  const savingsRate = getSavingsRate();
  const isPositive = balance >= 0;

  return (
    <section className="rounded-2xl glass-card overflow-hidden transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl ai-gradient shadow-lg shadow-accent-500/20">
              <Wallet size={22} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Mevcut Bakiye</p>
              <p className="text-xs text-slate-500">Bu ay</p>
            </div>
          </div>

          {/* Trend Indicator */}
          {balance !== 0 && (
            <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
              isPositive
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-rose-500/15 text-rose-400'
            }`}>
              {isPositive ? (
                <TrendingUp size={14} strokeWidth={2.5} />
              ) : (
                <TrendingDown size={14} strokeWidth={2.5} />
              )}
              <span className="text-xs font-bold tabular-nums">
                {isPositive ? '+' : ''}{savingsRate}%
              </span>
            </div>
          )}
        </div>

        {/* Main Balance */}
        <div className="mb-6">
          <div className={`text-4xl sm:text-5xl font-black tracking-tight tabular-nums ${
            isPositive ? 'text-white' : 'text-rose-400'
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
          <div className="rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/20 transition-all hover:bg-emerald-500/15">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Gelir</p>
            </div>
            <div className="text-xl font-bold text-emerald-400 tabular-nums">
              <AnimatedCounter
                value={totalIncome}
                prefix="₺"
                duration={1200}
                decimals={2}
              />
            </div>
          </div>

          {/* Expense */}
          <div className="rounded-xl bg-rose-500/10 p-4 border border-rose-500/20 transition-all hover:bg-rose-500/15">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Gider</p>
            </div>
            <div className="text-xl font-bold text-rose-400 tabular-nums">
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
        <div className="border-t border-white/5 bg-accent-500/10 px-6 py-4">
          <p className="text-sm text-accent-400 text-center font-medium">
            Gelir ve giderlerinizi ekleyerek başlayın
          </p>
        </div>
      )}
    </section>
  );
};

export default MainBalanceCard;
