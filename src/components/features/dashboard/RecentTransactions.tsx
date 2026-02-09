'use client';

/**
 * RecentTransactions — v6.0 M3 Desktop Recent Transactions List
 *
 * Stitch 3 inspired transaction list for desktop dashboard:
 * - Last 5 transactions (expenses + incomes merged)
 * - Category icon + name + date + amount
 * - "Tümünü Gör" (View All) button
 * - Glass panel styling
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { getCategoryIcon } from '@/lib/category-icons';
import { formatCurrency, formatDateShort } from '@/utils';

interface RecentTransactionsProps {
  onViewAll: () => void;
}

interface MergedTransaction {
  id: string;
  type: 'income' | 'expense';
  label: string;
  categoryId: string;
  amount: number;
  date: string;
  categoryColor?: string;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ onViewAll }) => {
  const getMonthlyExpenses = useBudgetStore((s) => s.getMonthlyExpenses);
  const getMonthlyIncomes = useBudgetStore((s) => s.getMonthlyIncomes);
  const getCategoryById = useBudgetStore((s) => s.getCategoryById);
  const currency = useBudgetStore((s) => s.currency);

  const monthlyExpenses = getMonthlyExpenses();
  const monthlyIncomes = getMonthlyIncomes();

  const transactions = useMemo(() => {
    const merged: MergedTransaction[] = [];

    monthlyExpenses.forEach((exp) => {
      const cat = getCategoryById(exp.categoryId);
      merged.push({
        id: exp.id,
        type: 'expense',
        label: cat?.name || 'Gider',
        categoryId: exp.categoryId,
        amount: exp.amount,
        date: exp.date || exp.createdAt,
        categoryColor: cat?.color,
      });
    });

    monthlyIncomes.forEach((inc) => {
      merged.push({
        id: inc.id,
        type: 'income',
        label: inc.description || 'Gelir',
        categoryId: inc.category,
        amount: inc.amount,
        date: inc.date || inc.createdAt,
      });
    });

    // Sort by date descending, take latest 5
    merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return merged.slice(0, 5);
  }, [monthlyExpenses, monthlyIncomes, getCategoryById]);

  return (
    <div className="glass-panel rounded-2xl p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold font-display text-white">Son İşlemler</h3>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-medium text-secondary hover:text-accent-cyan transition-colors"
        >
          Tümünü Gör
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Transaction List */}
      <div className="flex-1 flex flex-col gap-1.5 min-h-0">
        {transactions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-slate-600">Henüz işlem yok</p>
          </div>
        ) : (
          transactions.map((tx, idx) => {
            const Icon = getCategoryIcon(tx.categoryId);
            const isIncome = tx.type === 'income';

            return (
              <motion.div
                key={tx.id}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/3 transition-colors group"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Category Icon */}
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
                  style={{
                    backgroundColor: isIncome
                      ? 'rgba(16, 185, 129, 0.15)'
                      : `${tx.categoryColor || '#6366F1'}20`,
                  }}
                >
                  <Icon
                    size={14}
                    strokeWidth={1.8}
                    style={{
                      color: isIncome ? '#10B981' : (tx.categoryColor || '#6366F1'),
                    }}
                  />
                </div>

                {/* Label + Date */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{tx.label}</p>
                  <p className="text-[10px] text-slate-500">{formatDateShort(tx.date)}</p>
                </div>

                {/* Amount */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isIncome ? (
                    <ArrowUpRight size={12} className="text-emerald-400" />
                  ) : (
                    <ArrowDownRight size={12} className="text-rose-400" />
                  )}
                  <span className={`text-sm font-semibold tabular-nums ${
                    isIncome ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
