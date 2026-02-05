'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useBudgetStore } from '@/store/useBudgetStore';
import { calculateMonthlyTrend } from '@/lib/analytics';
import { formatCurrency, formatCompactNumber } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { TrendingUp, BarChart3, LineChart as LineChartIcon } from 'lucide-react';

type ChartType = 'line' | 'bar';

// Cosmic dark theme chart colors - Indigo & Slate palette
const CHART_COLORS = [
  '#3B82F6', // accent-500 (Indigo)
  '#10B981', // emerald-500
  '#F43F5E', // rose-500
];

/**
 * ExpenseChart - Expense Trend Analysis
 *
 * Shows monthly expense trends with line or bar chart.
 * Uses cosmic dark theme styling with Lucide icons.
 */
export const ExpenseChart = () => {
  const { expenses, getActiveCategories } = useBudgetStore();
  const [chartType, setChartType] = useState<ChartType>('bar');

  // Get top 3 categories for trend
  const categories = getActiveCategories();
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.categoryId] = (acc[exp.categoryId] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id]) => id);

  // Calculate trends for top categories
  const chartData: Record<string, string | number>[] = [];
  const months = 6;

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString('tr-TR', { month: 'short' });

    const dataPoint: Record<string, string | number> = { month: monthName };

    topCategories.forEach((categoryId) => {
      const trend = calculateMonthlyTrend(expenses, categoryId, months);
      const monthData = trend.find((t) =>
        t.month.toLowerCase().includes(monthName.toLowerCase())
      );
      const category = categories.find((c) => c.id === categoryId);
      dataPoint[category?.name || categoryId] = monthData?.total || 0;
    });

    chartData.push(dataPoint);
  }

  if (expenses.length === 0) {
    return (
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <TrendingUp className="h-5 w-5 text-accent-400" strokeWidth={2} />
            Harcama Trendi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            variant="trend"
            title="Trend verisi yok"
            description="Harcama ekledikce trend grafigi burada gorunecek"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <TrendingUp className="h-5 w-5 text-accent-400" strokeWidth={2} />
            Harcama Trendi (Son 6 Ay)
          </CardTitle>
          <div className="flex gap-1 p-1 rounded-lg glass-subtle">
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                chartType === 'bar'
                  ? 'bg-accent-600 text-white shadow-lg shadow-accent-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <BarChart3 className="h-4 w-4" strokeWidth={2} />
              Bar
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                chartType === 'line'
                  ? 'bg-accent-600 text-white shadow-lg shadow-accent-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <LineChartIcon className="h-4 w-4" strokeWidth={2} />
              Line
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCompactNumber(value)}
                />
                <Tooltip
                  formatter={(value: number) => (
                    <span className="tabular-nums">{formatCurrency(value)}</span>
                  )}
                  contentStyle={{
                    backgroundColor: 'rgba(21, 30, 49, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    color: '#E2E8F0',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                  itemStyle={{ color: '#E2E8F0' }}
                  labelStyle={{ color: '#94A3B8' }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => (
                    <span className="text-sm text-slate-300">{value}</span>
                  )}
                />
                {topCategories.map((categoryId, index) => {
                  const category = categories.find((c) => c.id === categoryId);
                  return (
                    <Bar
                      key={categoryId}
                      dataKey={category?.name || categoryId}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      radius={[6, 6, 0, 0]}
                    />
                  );
                })}
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCompactNumber(value)}
                />
                <Tooltip
                  formatter={(value: number) => (
                    <span className="tabular-nums">{formatCurrency(value)}</span>
                  )}
                  contentStyle={{
                    backgroundColor: 'rgba(21, 30, 49, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    color: '#E2E8F0',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                  itemStyle={{ color: '#E2E8F0' }}
                  labelStyle={{ color: '#94A3B8' }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => (
                    <span className="text-sm text-slate-300">{value}</span>
                  )}
                />
                {topCategories.map((categoryId, index) => {
                  const category = categories.find((c) => c.id === categoryId);
                  const color = CHART_COLORS[index % CHART_COLORS.length];
                  return (
                    <Line
                      key={categoryId}
                      type="monotone"
                      dataKey={category?.name || categoryId}
                      stroke={color}
                      strokeWidth={2.5}
                      dot={{ fill: color, r: 4, strokeWidth: 2, stroke: '#151E31' }}
                      activeDot={{
                        r: 6,
                        fill: color,
                        stroke: '#151E31',
                        strokeWidth: 2,
                      }}
                    />
                  );
                })}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-xs text-slate-400 text-center">
          En cok harcama yapilan 3 kategorinin aylik trendi
        </p>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
