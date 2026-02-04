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
import { TrendingUp } from 'lucide-react';

type ChartType = 'line' | 'bar';

/**
 * ExpenseChart - Harcama Trend Grafiği
 *
 * Aylık harcama trendini line veya bar chart ile gösterir.
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
  const chartData: any[] = [];
  const months = 6;

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString('tr-TR', { month: 'short' });

    const dataPoint: any = { month: monthName };

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

  const categoryColors = topCategories.map(
    (id) => categories.find((c) => c.id === id)?.color || '#6B7280'
  );

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📈 Harcama Trendi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <TrendingUp className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">Trend verisi yok</p>
            <p className="text-sm text-slate-400 mt-2">
              Harcama ekledikçe trend grafiği oluşacak
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>📈 Harcama Trendi (Son 6 Ay)</CardTitle>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('bar')}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                chartType === 'bar'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                chartType === 'line'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
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
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickLine={{ stroke: '#E2E8F0' }}
                  tickFormatter={(value) => formatCompactNumber(value)}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '8px 12px',
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => (
                    <span className="text-sm text-slate-700">{value}</span>
                  )}
                />
                {topCategories.map((categoryId, index) => {
                  const category = categories.find((c) => c.id === categoryId);
                  return (
                    <Bar
                      key={categoryId}
                      dataKey={category?.name || categoryId}
                      fill={categoryColors[index]}
                      radius={[8, 8, 0, 0]}
                    />
                  );
                })}
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickLine={{ stroke: '#E2E8F0' }}
                  tickFormatter={(value) => formatCompactNumber(value)}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '8px 12px',
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => (
                    <span className="text-sm text-slate-700">{value}</span>
                  )}
                />
                {topCategories.map((categoryId, index) => {
                  const category = categories.find((c) => c.id === categoryId);
                  return (
                    <Line
                      key={categoryId}
                      type="monotone"
                      dataKey={category?.name || categoryId}
                      stroke={categoryColors[index]}
                      strokeWidth={2}
                      dot={{ fill: categoryColors[index], r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  );
                })}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-xs text-slate-500 text-center">
          En çok harcama yapılan 3 kategorinin aylık trendi
        </p>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
