'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useBudgetStore } from '@/store/useBudgetStore';
import { groupExpensesByCategory } from '@/lib/analytics';
import { formatCurrencyCompact } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PieChart as PieChartIcon } from 'lucide-react';
import { getCategoryIcon } from '@/lib/category-icons';

// Cosmic dark theme chart colors - Indigo & Slate palette
const CHART_COLORS = [
  '#3B82F6', // accent-500 (Indigo)
  '#10B981', // emerald-500
  '#F43F5E', // rose-500
  '#8B5CF6', // violet-500
  '#F59E0B', // amber-500
  '#06B6D4', // cyan-500
  '#EC4899', // pink-500
  '#64748B', // slate-500
];

/**
 * CategoryChart - Category-based Expense Analysis
 *
 * Visualizes expenses by category using Recharts PieChart.
 * Uses Lucide icons and cosmic dark theme styling.
 */
export const CategoryChart = () => {
  const { getActiveCategories, getMonthlyExpenses } = useBudgetStore();
  const categories = getActiveCategories();
  const monthlyExpenses = getMonthlyExpenses();

  const categoryData = groupExpensesByCategory(monthlyExpenses, categories);

  // Prepare data for Recharts with custom colors
  const chartData = categoryData.map((item, index) => ({
    name: item.categoryName,
    value: item.total,
    percentage: item.percentage,
    color: CHART_COLORS[index % CHART_COLORS.length],
    categoryId: item.categoryId,
  }));

  if (monthlyExpenses.length === 0) {
    return (
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <PieChartIcon className="h-5 w-5 text-accent-400" strokeWidth={2} />
            Kategori Analizi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            variant="chart"
            title="Henüz harcama yok"
            description="Harcama eklediğinizde kategori analizi burada görünecek"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <PieChartIcon className="h-5 w-5 text-accent-400" strokeWidth={2} />
          Kategori Analizi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="h-64 overflow-visible">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `%${percentage}`}
                  outerRadius={75}
                  innerRadius={35}
                  fill="#3B82F6"
                  dataKey="value"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => (
                    <span className="tabular-nums">{formatCurrencyCompact(value)}</span>
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
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-slate-300">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category List */}
          <div className="space-y-2">
            {categoryData.slice(0, 5).map((item, index) => {
              const IconComponent = getCategoryIcon(item.categoryId);
              const color = CHART_COLORS[index % CHART_COLORS.length];

              return (
                <div
                  key={item.categoryId}
                  className="flex items-center justify-between rounded-xl glass-subtle p-3 hover-lift"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <IconComponent
                        className="h-4 w-4"
                        style={{ color }}
                        strokeWidth={2}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-200">
                      {item.categoryName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400 tabular-nums">
                      %{item.percentage}
                    </span>
                    <span className="text-sm font-bold text-slate-100 tabular-nums">
                      {formatCurrencyCompact(item.total)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
