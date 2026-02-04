'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useBudgetStore } from '@/store/useBudgetStore';
import { groupExpensesByCategory } from '@/lib/analytics';
import { formatCurrency } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

/**
 * CategoryChart - Kategori Bazlı Harcama Grafiği
 *
 * Recharts PieChart ile harcamaları kategori bazında görselleştirir.
 */
export const CategoryChart = () => {
  const { expenses, getActiveCategories } = useBudgetStore();
  const categories = getActiveCategories();

  const categoryData = groupExpensesByCategory(expenses, categories);

  // Prepare data for Recharts
  const chartData = categoryData.map((item) => ({
    name: item.categoryName,
    value: item.total,
    percentage: item.percentage,
    color: item.color,
  }));

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Kategori Analizi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <span className="text-3xl">📈</span>
            </div>
            <p className="text-slate-600 font-medium">Henüz harcama yok</p>
            <p className="text-sm text-slate-400 mt-2">
              Harcama eklediğinizde analiz görünecek
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Kategori Analizi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `%${percentage}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
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
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-slate-700">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category List */}
          <div className="space-y-2">
            {categoryData.slice(0, 5).map((item) => (
              <div
                key={item.categoryId}
                className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {item.categoryName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500">
                    %{item.percentage}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
