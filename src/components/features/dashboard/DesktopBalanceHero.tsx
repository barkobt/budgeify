'use client';

/**
 * DesktopBalanceHero — v6.0 M3 Desktop Balance Card
 *
 * Stitch 3 inspired hero balance card for desktop (lg+):
 * - Large balance display with animated counter
 * - Income / Expense summary
 * - SVG area chart showing expense trend (last 7 days)
 * - Time period toggles (7G, 30G, 90G)
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { getCurrencySymbol, formatCurrency } from '@/utils';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

type TimePeriod = '7d' | '30d' | '90d';

const PERIOD_LABELS: Record<TimePeriod, string> = {
  '7d': '7G',
  '30d': '30G',
  '90d': '90G',
};

function getExpenseDataPoints(expenses: { amount: number; date: string }[], period: TimePeriod): number[] {
  const now = new Date();
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const bucketCount = period === '7d' ? 7 : period === '30d' ? 10 : 12;
  const bucketSize = Math.ceil(days / bucketCount);

  const buckets = new Array(bucketCount).fill(0);

  expenses.forEach((exp) => {
    const expDate = new Date(exp.date);
    const diffDays = Math.floor((now.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < days) {
      const bucketIdx = Math.min(bucketCount - 1 - Math.floor(diffDays / bucketSize), bucketCount - 1);
      if (bucketIdx >= 0) {
        buckets[bucketIdx] += exp.amount;
      }
    }
  });

  return buckets;
}

function buildSvgPath(data: number[], width: number, height: number, padding: number): { line: string; area: string } {
  if (data.length === 0) return { line: '', area: '' };

  const maxVal = Math.max(...data, 1);
  const stepX = (width - padding * 2) / (data.length - 1 || 1);

  const points = data.map((val, i) => ({
    x: padding + i * stepX,
    y: padding + (1 - val / maxVal) * (height - padding * 2),
  }));

  // Smooth curve using bezier
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cp1x = points[i - 1].x + stepX * 0.4;
    const cp1y = points[i - 1].y;
    const cp2x = points[i].x - stepX * 0.4;
    const cp2y = points[i].y;
    linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
  }

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return { line: linePath, area: areaPath };
}

export const DesktopBalanceHero: React.FC = () => {
  const [period, setPeriod] = useState<TimePeriod>('7d');

  const selectedMonth = useBudgetStore((s) => s.selectedMonth);
  const setSelectedMonth = useBudgetStore((s) => s.setSelectedMonth);
  const getMonthlyIncomes = useBudgetStore((s) => s.getMonthlyIncomes);
  const getMonthlyExpenses = useBudgetStore((s) => s.getMonthlyExpenses);
  const currency = useBudgetStore((s) => s.currency);
  const _allExpenses = useBudgetStore((s) => s.expenses);

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

  const expenses = monthlyExpensesList;

  const chartData = useMemo(() => getExpenseDataPoints(expenses, period), [expenses, period]);
  const svgW = 400;
  const svgH = 120;
  const { line, area } = useMemo(() => buildSvgPath(chartData, svgW, svgH, 8), [chartData, svgW, svgH]);

  return (
    <div className="glass-panel rounded-2xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <Wallet size={20} className="text-accent-purple" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-300">Aylık Bakiye</p>
            <p className="text-xs text-slate-500">Gelir &amp; Gider Özeti</p>
          </div>
        </div>

        {/* Month Navigator */}
        <div className="flex items-center gap-2">
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

          {/* Trend badge */}
          {balance !== 0 && (
            <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ml-2 ${
              isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
            }`}>
              {isPositive ? <TrendingUp size={14} strokeWidth={2.5} /> : <TrendingDown size={14} strokeWidth={2.5} />}
              <span className="text-xs font-bold tabular-nums">
                {isPositive ? '+' : ''}{savingsRate}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Balance */}
      <div className="mb-4">
        <div className={`text-4xl font-black tracking-tight tabular-nums ${
          isPositive ? 'text-white' : 'text-rose-400'
        }`}>
          <AnimatedCounter value={balance} prefix={symbol} duration={1400} decimals={2} />
        </div>
      </div>

      {/* Income / Expense row */}
      <div className="flex gap-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-slate-500">Gelir</span>
          <span className="text-sm font-semibold text-emerald-400 tabular-nums">
            {formatCurrency(totalIncome, currency)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-rose-400" />
          <span className="text-xs text-slate-500">Gider</span>
          <span className="text-sm font-semibold text-rose-400 tabular-nums">
            {formatCurrency(totalExpenses, currency)}
          </span>
        </div>
      </div>

      {/* SVG Area Chart */}
      <div className="flex-1 min-h-0 relative">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="desktop-chart-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1="8" y1={8 + ratio * (svgH - 16)}
              x2={svgW - 8} y2={8 + ratio * (svgH - 16)}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          ))}
          {area && (
            <motion.path
              d={area}
              fill="url(#desktop-chart-gradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          )}
          {line && (
            <motion.path
              d={line}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </svg>
      </div>

      {/* Time toggles */}
      <div className="flex gap-1 mt-3">
        {(Object.keys(PERIOD_LABELS) as TimePeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              period === p
                ? 'bg-primary/20 text-accent-purple border border-primary/30'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DesktopBalanceHero;
