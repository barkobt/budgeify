'use client';

/**
 * AnalyticsPage — v6.0 M6 Desktop Analytics Full-Page
 *
 * Stitch 3 detailedanalysis + analysis fusion for desktop (lg+):
 * - Header: "Finansal İstihbarat" badge + "Detaylı Finansal Analiz" gradient title + time period toggles
 * - KPI cards row (4-col): Current Balance, Net Change, Risk Factor, Monthly Burn
 * - Main chart section: Portfolio Performance SVG area chart (bezier curves, gradient fill, interactive)
 * - Secondary widgets (3-col): Monthly Burn Rate, Top Spending (SVG donut), Wealth Prediction
 * - Spending Category Breakdown: Full-width interactive bars
 * - AI Insights Banner: gradient card with savings recommendation
 *
 * Data: useBudgetStore + @/lib/oracle heuristics
 * Mobile: SpendingVelocity + CategoryChart + ExpenseChart preserved in DashboardClient
 */

import React, { useState, useMemo, useId } from 'react';
import { motion } from 'framer-motion';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatCurrency, formatCurrencyCompact } from '@/utils';
import {
  getFinancialSnapshot,
  getCategoryBreakdown,
  getSpendingTrend,
  calculateHealthScore,
  generateInsights,
  analyzeGoals,
} from '@/lib/oracle';
import { getCategoryIcon } from '@/lib/category-icons';
import {
  BarChart3,
  Wallet,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldCheck,
  Flame,
  Activity,
  Sparkles,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
} from 'lucide-react';
import type { CurrencyCode, Expense } from '@/types';

// ─── Types ───────────────────────────────────────────────────
type TimePeriod = '7d' | '30d' | '90d';

const PERIOD_LABELS: Record<TimePeriod, string> = {
  '7d': '7 Gün',
  '30d': '30 Gün',
  '90d': '90 Gün',
};

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

// ─── SVG Chart Helpers ───────────────────────────────────────
function getExpenseDataPoints(expenses: Expense[], period: TimePeriod): number[] {
  const now = new Date();
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const bucketCount = period === '7d' ? 7 : period === '30d' ? 10 : 12;
  const bucketSize = Math.ceil(days / bucketCount);
  const buckets = new Array(bucketCount).fill(0) as number[];

  expenses.forEach((exp) => {
    const expDate = new Date(exp.date);
    const diffDays = Math.floor((now.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < days) {
      const bucketIdx = Math.min(bucketCount - 1 - Math.floor(diffDays / bucketSize), bucketCount - 1);
      if (bucketIdx >= 0) buckets[bucketIdx] += exp.amount;
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

// ─── KPI Card ────────────────────────────────────────────────
function KPICard({
  icon: Icon,
  label,
  value,
  sub,
  iconColor,
  iconBg,
  valueColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  iconColor: string;
  iconBg: string;
  valueColor?: string;
}) {
  return (
    <div className="glass-panel rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon size={18} strokeWidth={1.8} className={iconColor} />
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
        <p className={`text-lg font-bold tabular-nums truncate ${valueColor ?? 'text-white'}`}>{value}</p>
        {sub && <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── SVG Donut Chart ─────────────────────────────────────────
function DonutChart({
  data,
  size = 120,
}: {
  data: { name: string; value: number; color: string; percentage: number }[];
  size?: number;
}) {
  const id = useId();
  const radius = (size - 16) / 2;
  const innerRadius = radius * 0.6;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  if (data.length === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={size / 2 - innerRadius} />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((segment, i) => {
        const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
        const strokeDashoffset = -cumulativePercent / 100 * circumference;
        cumulativePercent += segment.percentage;

        return (
          <circle
            key={`${id}-${i}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={size / 2 - innerRadius}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${segment.color}40)` }}
          />
        );
      })}
    </svg>
  );
}

// ─── Category Bar ────────────────────────────────────────────
function CategoryBar({
  name,
  categoryId,
  total,
  percentage,
  color,
  maxPercentage,
  currency,
}: {
  name: string;
  categoryId: string;
  total: number;
  percentage: number;
  color: string;
  maxPercentage: number;
  currency: CurrencyCode;
}) {
  const Icon = getCategoryIcon(categoryId);
  const barWidth = maxPercentage > 0 ? (percentage / maxPercentage) * 100 : 0;

  return (
    <div className="flex items-center gap-4 group">
      <div className="flex items-center gap-3 w-36 shrink-0">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={14} style={{ color }} strokeWidth={2} />
        </div>
        <span className="text-sm font-medium text-slate-300 truncate">{name}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
            initial={{ width: 0 }}
            whileInView={{ width: `${barWidth}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          />
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 w-32 justify-end">
        <span className="text-xs font-semibold text-slate-400 tabular-nums">%{percentage}</span>
        <span className="text-sm font-bold text-white tabular-nums">{formatCurrencyCompact(total, currency)}</span>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────
export function AnalyticsPage() {
  const [period, setPeriod] = useState<TimePeriod>('30d');

  const expenses = useBudgetStore((s) => s.expenses);
  const incomes = useBudgetStore((s) => s.incomes);
  const currency = useBudgetStore((s) => s.currency);
  const selectedMonth = useBudgetStore((s) => s.selectedMonth);
  const setSelectedMonth = useBudgetStore((s) => s.setSelectedMonth);
  const getActiveCategories = useBudgetStore((s) => s.getActiveCategories);

  const categories = getActiveCategories();

  // Month-aware snapshot
  const monthParam = useMemo(() => ({ year: selectedMonth.year, month: selectedMonth.month }), [selectedMonth.year, selectedMonth.month]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const snapshot = useMemo(() => getFinancialSnapshot(monthParam), [expenses.length, incomes.length, monthParam]);

  const totalIncome = snapshot.totalIncome;
  const totalExpenses = snapshot.totalExpenses;
  const balance = snapshot.balance;

  const trend = useMemo(
    () => getSpendingTrend(snapshot.currentMonthExpenses, snapshot.previousMonthExpenses),
    [snapshot]
  );
  const health = useMemo(() => calculateHealthScore(snapshot), [snapshot]);
  const insights = useMemo(() => generateInsights(snapshot), [snapshot]);
  const goalInsights = useMemo(() => analyzeGoals(snapshot.goals), [snapshot]);
  const categoryBreakdown = useMemo(
    () => getCategoryBreakdown(snapshot.currentMonthExpenses, categories),
    [snapshot, categories]
  );

  // Chart data — filter expenses by selected month for chart
  const monthExpenses = snapshot.currentMonthExpenses;
  const chartData = useMemo(() => getExpenseDataPoints(monthExpenses, period), [monthExpenses, period]);
  const svgW = 600;
  const svgH = 200;
  const gradientId = useId();
  const { line, area } = useMemo(() => buildSvgPath(chartData, svgW, svgH, 12), [chartData]);

  // Monthly burn
  const now = new Date();
  const isCurrentMonth = selectedMonth.year === now.getFullYear() && selectedMonth.month === now.getMonth();
  const dayOfMonth = isCurrentMonth ? now.getDate() : new Date(selectedMonth.year, selectedMonth.month + 1, 0).getDate();
  const currentMonthTotal = snapshot.currentMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const dailyVelocity = dayOfMonth > 0 ? currentMonthTotal / dayOfMonth : 0;
  const daysInMonth = new Date(selectedMonth.year, selectedMonth.month + 1, 0).getDate();
  const projectedMonthly = isCurrentMonth ? dailyVelocity * daysInMonth : currentMonthTotal;
  const burnRatio = totalIncome > 0 ? Math.round((currentMonthTotal / totalIncome) * 100) : 0;

  // Net change
  const netChange = totalIncome - totalExpenses;
  const isPositive = netChange >= 0;

  // Month navigation helpers
  const goToPrevMonth = () => {
    const prev = selectedMonth.month === 0 ? 11 : selectedMonth.month - 1;
    const year = selectedMonth.month === 0 ? selectedMonth.year - 1 : selectedMonth.year;
    setSelectedMonth(year, prev);
  };
  const goToNextMonth = () => {
    const next = selectedMonth.month === 11 ? 0 : selectedMonth.month + 1;
    const year = selectedMonth.month === 11 ? selectedMonth.year + 1 : selectedMonth.year;
    setSelectedMonth(year, next);
  };
  const canGoNext = selectedMonth.year < now.getFullYear() || (selectedMonth.year === now.getFullYear() && selectedMonth.month < now.getMonth());

  // Risk factor from health score
  const riskLevel = health.score >= 70 ? 'Düşük' : health.score >= 40 ? 'Orta' : 'Yüksek';
  const riskColor = health.score >= 70 ? 'text-emerald-400' : health.score >= 40 ? 'text-amber-400' : 'text-rose-400';

  // Donut chart data
  const donutData = categoryBreakdown.slice(0, 6).map((cat) => ({
    name: cat.categoryName,
    value: cat.total,
    color: cat.color,
    percentage: cat.percentage,
  }));

  // Max percentage for bar scaling
  const maxPercentage = categoryBreakdown[0]?.percentage ?? 0;

  // Closest goal
  const closestGoal = goalInsights[0];

  // Top insight
  const topInsight = insights.find((i) => i.type === 'tip' || i.type === 'health' || i.type === 'trend');

  const hasData = monthExpenses.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 border border-secondary/20 px-3 py-1 text-[11px] font-semibold text-secondary uppercase tracking-wider">
              <BarChart3 size={12} />
              Finansal İstihbarat
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Detaylı Finansal{' '}
            <span className="bg-linear-to-r from-secondary to-primary bg-clip-text text-transparent">
              Analiz
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Harcamalarınızı analiz edin, trendleri takip edin ve akıllı kararlar verin.
          </p>
        </div>

        {/* Month Navigation + Time Period Toggles */}
        <div className="flex items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
            <button
              onClick={goToPrevMonth}
              className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              ←
            </button>
            <span className="px-2 py-1.5 text-xs font-semibold text-white min-w-25 text-center">
              {MONTH_NAMES[selectedMonth.month]} {selectedMonth.year}
            </span>
            <button
              onClick={goToNextMonth}
              disabled={!canGoNext}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                canGoNext ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-700 cursor-not-allowed'
              }`}
            >
              →
            </button>
          </div>
          {/* Chart Period Toggles */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
            {(Object.keys(PERIOD_LABELS) as TimePeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
      </div>

      {/* KPI Cards Row — 4-col */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard
          icon={Wallet}
          label="Mevcut Bakiye"
          value={formatCurrency(balance, currency)}
          iconColor="text-accent-purple"
          iconBg="bg-primary/15"
          valueColor={balance >= 0 ? 'text-white' : 'text-rose-400'}
        />
        <KPICard
          icon={isPositive ? TrendingUp : TrendingDown}
          label="Net Değişim"
          value={`${isPositive ? '+' : ''}${formatCurrency(netChange, currency)}`}
          sub={trend.previousTotal > 0
            ? `Geçen aya göre ${trend.direction === 'up' ? '+' : ''}${trend.changePercent}%`
            : undefined
          }
          iconColor={isPositive ? 'text-emerald-400' : 'text-rose-400'}
          iconBg={isPositive ? 'bg-emerald-500/15' : 'bg-rose-500/15'}
          valueColor={isPositive ? 'text-emerald-400' : 'text-rose-400'}
        />
        <KPICard
          icon={ShieldCheck}
          label="Risk Faktörü"
          value={`${health.score}/100 (${health.grade})`}
          sub={riskLevel}
          iconColor={riskColor}
          iconBg={health.score >= 70 ? 'bg-emerald-500/15' : health.score >= 40 ? 'bg-amber-500/15' : 'bg-rose-500/15'}
          valueColor={riskColor}
        />
        <KPICard
          icon={Flame}
          label="Aylık Yakma"
          value={formatCurrency(currentMonthTotal, currency)}
          sub={totalIncome > 0 ? `Gelirin %${burnRatio}'i` : undefined}
          iconColor={burnRatio > 80 ? 'text-rose-400' : burnRatio > 50 ? 'text-amber-400' : 'text-emerald-400'}
          iconBg={burnRatio > 80 ? 'bg-rose-500/15' : burnRatio > 50 ? 'bg-amber-500/15' : 'bg-emerald-500/15'}
        />
      </div>

      {/* Main Chart Section — Portfolio Performance */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <Activity size={20} className="text-accent-purple" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-base font-semibold text-white font-display">Harcama Performansı</p>
              <p className="text-xs text-slate-500">{PERIOD_LABELS[period]} dönem görünümü</p>
            </div>
          </div>

          {/* Trend badge */}
          {trend.previousTotal > 0 && (
            <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              trend.direction === 'down' ? 'bg-emerald-500/15 text-emerald-400'
                : trend.direction === 'up' ? 'bg-rose-500/15 text-rose-400'
                : 'bg-white/5 text-slate-400'
            }`}>
              {trend.direction === 'up' ? <ArrowUpRight size={14} strokeWidth={2.5} />
                : trend.direction === 'down' ? <ArrowDownRight size={14} strokeWidth={2.5} />
                : <Minus size={14} strokeWidth={2.5} />}
              <span className="text-xs font-bold tabular-nums">
                {trend.direction === 'up' ? '+' : ''}{trend.changePercent}%
              </span>
            </div>
          )}
        </div>

        {/* SVG Area Chart */}
        {hasData ? (
          <div className="h-52 relative">
            <svg
              viewBox={`0 0 ${svgW} ${svgH}`}
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`${gradientId}-fill`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id={`${gradientId}-stroke`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color-secondary)" />
                  <stop offset="100%" stopColor="var(--color-primary)" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map((ratio) => (
                <line
                  key={ratio}
                  x1="12" y1={12 + ratio * (svgH - 24)}
                  x2={svgW - 12} y2={12 + ratio * (svgH - 24)}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
                />
              ))}
              {area && (
                <motion.path
                  d={area}
                  fill={`url(#${gradientId}-fill)`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                />
              )}
              {line && (
                <motion.path
                  d={line}
                  fill="none"
                  stroke={`url(#${gradientId}-stroke)`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              {/* Data points */}
              {chartData.length > 0 && (() => {
                const maxVal = Math.max(...chartData, 1);
                const stepX = (svgW - 24) / (chartData.length - 1 || 1);
                return chartData.map((val, i) => {
                  const x = 12 + i * stepX;
                  const y = 12 + (1 - val / maxVal) * (svgH - 24);
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3"
                      fill="var(--color-primary)"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(124,58,237,0.3))' }}
                    />
                  );
                });
              })()}
            </svg>
          </div>
        ) : (
          <div className="h-52 flex items-center justify-center">
            <p className="text-sm text-slate-500">Grafik verisi için harcama ekleyin</p>
          </div>
        )}

        {/* Chart summary */}
        <div className="flex gap-6 mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-500">Gelir</span>
            <span className="text-sm font-semibold text-emerald-400 tabular-nums">{formatCurrency(totalIncome, currency)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="text-xs text-slate-500">Gider</span>
            <span className="text-sm font-semibold text-rose-400 tabular-nums">{formatCurrency(totalExpenses, currency)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent-purple" />
            <span className="text-xs text-slate-500">Günlük Ort.</span>
            <span className="text-sm font-semibold text-accent-purple tabular-nums">{formatCurrencyCompact(dailyVelocity, currency)}</span>
          </div>
        </div>
      </div>

      {/* Secondary Widgets — 3-col */}
      <div className="grid grid-cols-3 gap-4">
        {/* Monthly Burn Rate */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-amber-400" />
            <p className="text-sm font-semibold text-white">Aylık Yakma Hızı</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white tabular-nums">
              {formatCurrencyCompact(currentMonthTotal, currency)}
            </p>
            {totalIncome > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                / {formatCurrencyCompact(totalIncome, currency)} gelir
              </p>
            )}
          </div>
          {/* Progress bar */}
          <div>
            <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: burnRatio > 80 ? '#F43F5E' : burnRatio > 50 ? '#F59E0B' : '#10B981',
                  boxShadow: burnRatio > 80
                    ? '0 0 8px rgba(244,63,94,0.4)'
                    : burnRatio > 50
                      ? '0 0 8px rgba(245,158,11,0.4)'
                      : '0 0 8px rgba(16,185,129,0.4)',
                }}
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(burnRatio, 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-slate-500">%{burnRatio} kullanıldı</span>
              {burnRatio > 80 && (
                <span className="text-[10px] font-semibold text-rose-400">Dikkat!</span>
              )}
            </div>
          </div>
          {/* Projected */}
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[10px] text-slate-500 mb-0.5">Ay Sonu Tahmini</p>
            <p className="text-sm font-bold text-amber-400 tabular-nums">
              {formatCurrencyCompact(projectedMonthly, currency)}
            </p>
          </div>
        </div>

        {/* Top Spending — Donut Chart */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-secondary" />
            <p className="text-sm font-semibold text-white">Harcama Dağılımı</p>
          </div>
          {hasData ? (
            <>
              <div className="flex items-center justify-center py-2">
                <div className="relative">
                  <DonutChart data={donutData} size={110} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-lg font-bold text-white tabular-nums">{categoryBreakdown.length}</p>
                    <p className="text-[9px] text-slate-500">Kategori</p>
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="space-y-1.5">
                {donutData.slice(0, 4).map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-slate-400 truncate">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-300 tabular-nums">%{item.percentage}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-slate-500 text-center">Veri bekleniyor...</p>
            </div>
          )}
        </div>

        {/* Wealth Prediction / Goal Pace */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <p className="text-sm font-semibold text-white">Finansal Projeksiyon</p>
          </div>
          {/* Savings rate */}
          <div>
            <p className="text-[10px] text-slate-500 mb-1">Tasarruf Oranı</p>
            <p className="text-2xl font-bold text-white tabular-nums">
              %{snapshot.savingsRate}
            </p>
          </div>
          {/* Goal pace */}
          {closestGoal ? (
            <div className="rounded-lg bg-white/5 px-3 py-2">
              <p className="text-[10px] text-slate-500 mb-0.5">En Yakın Hedef</p>
              <p className="text-xs font-semibold text-white truncate">{closestGoal.goal.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(closestGoal.progressPercent, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-primary tabular-nums">
                  %{closestGoal.progressPercent}
                </span>
              </div>
              {closestGoal.daysRemaining !== null && closestGoal.daysRemaining > 0 && (
                <p className="text-[10px] text-slate-500 mt-1">
                  {closestGoal.daysRemaining} gün kaldı
                  {closestGoal.dailySavingsNeeded !== null
                    ? ` · Günlük ${formatCurrencyCompact(closestGoal.dailySavingsNeeded, currency)}`
                    : ''}
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-lg bg-white/5 px-3 py-2">
              <p className="text-xs text-slate-500">Aktif hedef yok</p>
            </div>
          )}
          {/* Health factors preview */}
          <div className="space-y-1">
            {health.factors.slice(0, 3).map((f) => (
              <div key={f.name} className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">{f.name}</span>
                <span className={`text-[10px] font-bold tabular-nums ${
                  f.score >= 70 ? 'text-emerald-400' : f.score >= 40 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {f.score}/100
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spending Category Breakdown — Full-width */}
      {categoryBreakdown.length > 0 && (
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/15">
              <BarChart3 size={20} className="text-secondary" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-base font-semibold text-white font-display">Kategori Bazlı Harcamalar</p>
              <p className="text-xs text-slate-500">Bu ay — {categoryBreakdown.length} kategori</p>
            </div>
          </div>
          <div className="space-y-3">
            {categoryBreakdown.map((cat) => (
              <CategoryBar
                key={cat.categoryId}
                name={cat.categoryName}
                categoryId={cat.categoryId}
                total={cat.total}
                percentage={cat.percentage}
                color={cat.color}
                maxPercentage={maxPercentage}
                currency={currency}
              />
            ))}
          </div>
        </div>
      )}

      {/* AI Insights Banner */}
      {topInsight && (
        <motion.div
          className="glass-panel rounded-2xl p-6 border border-primary/20 relative overflow-hidden"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Gradient accent */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20">
              <Brain size={24} className="text-primary" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-white font-display">Oracle AI İçgörüsü</p>
                <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {topInsight.confidence === 'high' ? 'Yüksek Güven' : topInsight.confidence === 'medium' ? 'Orta Güven' : 'Düşük Güven'}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{topInsight.content}</p>
              {insights.length > 1 && (
                <p className="text-[11px] text-slate-500 mt-2">
                  +{insights.length - 1} daha fazla içgörü mevcut
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!hasData && (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
            <BarChart3 size={32} className="text-slate-500" />
          </div>
          <p className="text-lg font-semibold text-white font-display mb-2">Henüz analiz verisi yok</p>
          <p className="text-sm text-slate-500">
            Gelir ve gider ekledikçe detaylı analizler burada görünecek.
          </p>
        </div>
      )}
    </div>
  );
}
