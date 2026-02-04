'use client';

import React from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatCurrency, formatDate } from '@/utils';
import { Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

/**
 * ExpenseList - Harcama Listesi
 *
 * Harcamaları tarih bazlı gruplandırarak gösterir.
 */
export const ExpenseList = () => {
  const { expenses, deleteExpense, getCategoryById } = useBudgetStore();

  // Group expenses by date
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const date = expense.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {} as Record<string, typeof expenses>);

  // Sort dates descending
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  const handleDelete = (id: string) => {
    if (confirm('Bu harcamayı silmek istediğinize emin misiniz?')) {
      deleteExpense(id);
    }
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📋 Harcamalarım</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <span className="text-3xl">📝</span>
            </div>
            <p className="text-slate-600 font-medium">Henüz harcama eklenmemiş</p>
            <p className="text-sm text-slate-400 mt-2">
              İlk harcamanızı ekleyerek başlayın
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📋 Harcamalarım ({expenses.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const dayExpenses = groupedExpenses[date];
            const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

            return (
              <div key={date}>
                {/* Date Header */}
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">
                    {formatDate(date)}
                  </h3>
                  <span className="text-sm font-medium text-red-600">
                    {formatCurrency(dayTotal)}
                  </span>
                </div>

                {/* Expense Items */}
                <div className="space-y-2">
                  {dayExpenses.map((expense) => {
                    const category = getCategoryById(expense.categoryId);

                    return (
                      <div
                        key={expense.id}
                        className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                      >
                        {/* Category Icon */}
                        {category && (
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                            style={{ backgroundColor: `${category.color}15` }}
                          >
                            {category.emoji}
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-800">
                              {category?.name || 'Bilinmeyen'}
                            </span>
                          </div>
                          {expense.note && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {expense.note}
                            </p>
                          )}
                        </div>

                        {/* Amount */}
                        <span className="text-sm font-semibold text-slate-900">
                          {formatCurrency(expense.amount)}
                        </span>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseList;
