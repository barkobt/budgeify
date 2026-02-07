'use client';

import React from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatCurrencyCompact } from '@/utils';
import {
  getSpendingTrend,
  getCategoryBreakdown,
  calculateHealthScore,
  getFinancialSnapshot,
} from '@/lib/oracle';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

/**
 * SpendingVelocity — M20 Spending Velocity & Category Delta Card
 *
 * Shows real-time spending velocity, category-wise month-over-month
 * delta comparisons, and health score summary.
 */
export const SpendingVelocity: React.FC = () => {
  const { expenses, getActiveCategories, currency } = useBudgetStore();
  const categories = getActiveCategories();

  const snapshot = getFinancialSnapshot();
  const trend = getSpendingTrend(
    snapshot.currentMonthExpenses,
    snapshot.previousMonthExpenses
  );
  const health = calculateHealthScore(snapshot);

  const currentBreakdown = getCategoryBreakdown(
    snapshot.currentMonthExpenses,
    categories
  );
  const previousBreakdown = getCategoryBreakdown(
    snapshot.previousMonthExpenses,
    categories
  );

  // Category deltas — compare current vs previous month per category
  const categoryDeltas = currentBreakdown.slice(0, 5).map((current) => {
    const previous = previousBreakdown.find(
      (p) => p.categoryId === current.categoryId
    );
    const prevTotal = previous?.total ?? 0;
    const delta =
      prevTotal > 0
        ? Math.round(((current.total - prevTotal) / prevTotal) * 100)
        : current.total > 0
          ? 100
          : 0;
    return {
      ...current,
      prevTotal,
      delta,
      direction: delta > 5 ? 'up' : delta < -5 ? 'down' : 'stable',
    };
  });

  // Daily spending velocity
  const now = new Date();
  const dayOfMonth = now.getDate();
  const currentMonthTotal = snapshot.currentMonthExpenses.reduce(
    (s, e) => s + e.amount,
    0
  );
  const dailyVelocity = dayOfMonth > 0 ? currentMonthTotal / dayOfMonth : 0;
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();
  const projectedMonthly = dailyVelocity * daysInMonth;

  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/15">
            <Zap size={20} className="text-accent-400" strokeWidth={2} />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              Harcama Hızı
            </p>
            <p className="text-xs text-slate-500">
              Veri bekleniyor...
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-400 text-center py-6">
          Harcama ekledikçe hız analizi burada görünecek
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/15">
          <Zap size={20} className="text-accent-400" strokeWidth={2} />
        </div>
        <div>
          <p className="text-lg font-semibold text-white">Harcama Hızı</p>
          <p className="text-xs text-slate-500">
            Aylık trend ve kategori karşılaştırması
          </p>
        </div>
      </div>

      {/* Velocity Metrics — 3-col grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Daily Velocity */}
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-[10px] font-medium text-slate-500 mb-1">
            Günlük Ort.
          </p>
          <p className="text-sm font-bold text-white tabular-nums truncate">
            {formatCurrencyCompact(dailyVelocity, currency)}
          </p>
        </div>

        {/* Projected Monthly */}
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-[10px] font-medium text-slate-500 mb-1">
            Ay Sonu Tahmini
          </p>
          <p className="text-sm font-bold text-amber-400 tabular-nums truncate">
            {formatCurrencyCompact(projectedMonthly, currency)}
          </p>
        </div>

        {/* Health Score */}
        <div className="rounded-xl bg-white/5 p-3">
          <div className="flex items-center gap-1 mb-1">
            <Activity size={10} className="text-slate-500" />
            <p className="text-[10px] font-medium text-slate-500">Sağlık</p>
          </div>
          <p
            className={`text-sm font-bold tabular-nums ${
              health.score >= 70
                ? 'text-emerald-400'
                : health.score >= 40
                  ? 'text-amber-400'
                  : 'text-rose-400'
            }`}
          >
            {health.score}/100 ({health.grade})
          </p>
        </div>
      </div>

      {/* Month-over-Month Trend */}
      <div className="rounded-xl bg-white/5 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {trend.direction === 'up' ? (
              <ArrowUpRight size={16} className="text-rose-400" />
            ) : trend.direction === 'down' ? (
              <ArrowDownRight size={16} className="text-emerald-400" />
            ) : (
              <Minus size={16} className="text-slate-400" />
            )}
            <span className="text-sm font-medium text-slate-300">
              Geçen Aya Göre
            </span>
          </div>
          <span
            className={`text-sm font-bold tabular-nums ${
              trend.direction === 'up'
                ? 'text-rose-400'
                : trend.direction === 'down'
                  ? 'text-emerald-400'
                  : 'text-slate-400'
            }`}
          >
            {trend.direction === 'up' ? '+' : ''}
            {trend.changePercent}%
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
          <span className="tabular-nums">
            {formatCurrencyCompact(trend.currentTotal, currency)}
          </span>
          <span>vs</span>
          <span className="tabular-nums">
            {formatCurrencyCompact(trend.previousTotal, currency)}
          </span>
        </div>
      </div>

      {/* Category Deltas */}
      {categoryDeltas.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400">
            Kategori Karşılaştırması
          </p>
          {categoryDeltas.map((cat) => (
            <div
              key={cat.categoryId}
              className="flex items-center justify-between rounded-lg bg-white/3 px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs font-medium text-slate-300 truncate">
                  {cat.categoryName}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-slate-500 tabular-nums">
                  {formatCurrencyCompact(cat.total, currency)}
                </span>
                <span
                  className={`text-xs font-bold tabular-nums text-right ${
                    cat.direction === 'up'
                      ? 'text-rose-400'
                      : cat.direction === 'down'
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                  }`}
                  style={{ minWidth: '40px' }}
                >
                  {cat.direction === 'up' ? (
                    <span className="inline-flex items-center gap-0.5">
                      <TrendingUp size={10} />+{cat.delta}%
                    </span>
                  ) : cat.direction === 'down' ? (
                    <span className="inline-flex items-center gap-0.5">
                      <TrendingDown size={10} />
                      {cat.delta}%
                    </span>
                  ) : (
                    <span>—</span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpendingVelocity;
