'use client';

import React, { useCallback } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { getCurrencySymbol } from '@/utils';
import { Wallet, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

/**
 * MainBalanceCard — HubX-grade balance display
 *
 * Pure dark theme, glass-card aesthetic, tabular-nums currency.
 */
export const MainBalanceCard = () => {
  const selectedMonth = useBudgetStore((s) => s.selectedMonth);
  const setSelectedMonth = useBudgetStore((s) => s.setSelectedMonth);
  const getMonthlyIncomes = useBudgetStore((s) => s.getMonthlyIncomes);
  const getMonthlyExpenses = useBudgetStore((s) => s.getMonthlyExpenses);
  const currency = useBudgetStore((s) => s.currency);

  const monthlyIncomes = getMonthlyIncomes();
  const monthlyExpensesList = getMonthlyExpenses();
  const totalIncome = monthlyIncomes.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = monthlyExpensesList.reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
  const isPositive = balance >= 0;
  const symbol = getCurrencySymbol(currency);

  const goToPrevMonth = useCallback(() => {
    const m = selectedMonth.month === 0 ? 11 : selectedMonth.month - 1;
    const y = selectedMonth.month === 0 ? selectedMonth.year - 1 : selectedMonth.year;
    setSelectedMonth(y, m);
  }, [selectedMonth, setSelectedMonth]);

  const goToNextMonth = useCallback(() => {
    const m = selectedMonth.month === 11 ? 0 : selectedMonth.month + 1;
    const y = selectedMonth.month === 11 ? selectedMonth.year + 1 : selectedMonth.year;
    setSelectedMonth(y, m);
  }, [selectedMonth, setSelectedMonth]);

  return (
    <section className="rounded-2xl glass-card overflow-hidden transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl ai-gradient shadow-lg shadow-accent-500/20">
              <Wallet size={22} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Aylık Bakiye</p>
              <p className="text-xs text-slate-500">Gelir &amp; Gider Özeti</p>
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

        {/* Month Navigator */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <button
            onClick={goToPrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/8 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
            aria-label="Önceki ay"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-white min-w-28 text-center tabular-nums">
            {MONTH_NAMES[selectedMonth.month]} {selectedMonth.year}
          </span>
          <button
            onClick={goToNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/8 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
            aria-label="Sonraki ay"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Main Balance */}
        <div className="mb-6">
          <div className={`text-4xl sm:text-5xl font-black tracking-tight tabular-nums ${
            isPositive ? 'text-white' : 'text-rose-400'
          }`}>
            <AnimatedCounter
              value={balance}
              prefix={symbol}
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
                prefix={symbol}
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
                prefix={symbol}
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
