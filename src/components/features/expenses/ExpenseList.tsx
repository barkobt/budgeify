'use client';

import React from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatCurrency, formatDate } from '@/utils';
import { getCategoryIcon } from '@/lib/category-icons';
import { Trash2, ClipboardList, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

/**
 * ExpenseList - Harcama Listesi
 *
 * Harcamalari tarih bazli gruplandirarak gosterir.
 * Uses Lucide icons for all categories.
 */
export const ExpenseList = () => {
  const { expenses, deleteExpense, getCategoryById, currency } = useBudgetStore();

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
    if (confirm('Bu harcamayi silmek istediginize emin misiniz?')) {
      deleteExpense(id);
    }
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-accent-400" strokeWidth={2} />
            Harcamalarim
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <FileText size={32} className="text-slate-500" />
            </div>
            <p className="text-slate-300 font-medium">Henuz harcama eklenmemis</p>
            <p className="text-sm text-slate-500 mt-2">
              Ilk harcamanizi ekleyerek baslayin
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-accent-400" strokeWidth={2} />
          Harcamalarim ({expenses.length})
        </CardTitle>
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
                  <h3 className="text-sm font-semibold text-slate-400">
                    {formatDate(date)}
                  </h3>
                  <span className="text-sm font-medium text-rose-400 tabular-nums">
                    {formatCurrency(dayTotal, currency)}
                  </span>
                </div>

                {/* Expense Items */}
                <div className="space-y-2">
                  {dayExpenses.map((expense) => {
                    const category = getCategoryById(expense.categoryId);
                    const IconComponent = getCategoryIcon(expense.categoryId);

                    return (
                      <div
                        key={expense.id}
                        className="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
                      >
                        {/* Category Icon */}
                        {category && (
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${category.color}15` }}
                          >
                            <IconComponent
                              size={18}
                              style={{ color: category.color }}
                              strokeWidth={2}
                            />
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-200">
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
                        <span className="text-sm font-semibold text-white tabular-nums">
                          {formatCurrency(expense.amount, currency)}
                        </span>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-500/20 hover:text-rose-400"
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
