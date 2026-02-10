'use client';

/**
 * DayDetailPanel — Seçilen Günün Detayları
 *
 * xl+ side panel: transactions + reminders for selected day.
 * Spring slide-in animation, glass-panel styling.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Receipt,
  Target,
  AlertTriangle,
  CalendarDays,
} from 'lucide-react';
import { formatCurrency } from '@/utils';
import { useBudgetStore } from '@/store/useBudgetStore';
import { fromAnyToLocalDateKey, toLocalDateKey } from '@/lib/dateKey';
import type { Reminder } from '@/db/schema';

export interface DayTransaction {
  id: string;
  type: 'income' | 'expense';
  label: string;
  amount: number;
  categoryName: string;
  categoryColor: string;
}

interface DayDetailPanelProps {
  date: Date | null;
  reminders: Reminder[];
  onClose: () => void;
  onTransactionClick?: (tx: DayTransaction) => void;
}

const REMINDER_TYPE_ICON: Record<string, React.ElementType> = {
  bill_payment: Receipt,
  goal_deadline: Target,
  budget_limit: AlertTriangle,
  custom: Bell,
};

const REMINDER_TYPE_COLOR: Record<string, string> = {
  bill_payment: 'text-rose-400 bg-rose-500/15',
  goal_deadline: 'text-violet-400 bg-violet-500/15',
  budget_limit: 'text-amber-400 bg-amber-500/15',
  custom: 'text-cyan-400 bg-cyan-500/15',
};

export function DayDetailPanel({ date, reminders, onClose, onTransactionClick }: DayDetailPanelProps) {
  const expenses = useBudgetStore((s) => s.expenses);
  const incomes = useBudgetStore((s) => s.incomes);
  const getCategoryById = useBudgetStore((s) => s.getCategoryById);
  const currency = useBudgetStore((s) => s.currency);

  if (!date) return null;

  const dateStr = toLocalDateKey(date);

  const dayTransactions: DayTransaction[] = [];

  expenses.forEach((exp) => {
    const expDate = fromAnyToLocalDateKey(exp.date || exp.createdAt);
    if (expDate === dateStr) {
      const cat = getCategoryById(exp.categoryId);
      dayTransactions.push({
        id: exp.id,
        type: 'expense',
        label: cat?.name || 'Gider',
        amount: exp.amount,
        categoryName: cat?.name || 'Diğer',
        categoryColor: cat?.color || '#6B7280',
      });
    }
  });

  incomes.forEach((inc) => {
    const incDate = fromAnyToLocalDateKey(inc.date || inc.createdAt);
    if (incDate === dateStr) {
      dayTransactions.push({
        id: inc.id,
        type: 'income',
        label: inc.description || 'Gelir',
        amount: inc.amount,
        categoryName: 'Gelir',
        categoryColor: '#10B981',
      });
    }
  });

  const formattedDate = date.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <AnimatePresence>
      <motion.div
        className="glass-panel rounded-2xl p-5 sticky top-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, mass: 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-primary" />
            <h3 className="text-sm font-bold text-white">{formattedDate}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
            aria-label="Paneli kapat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Transactions */}
        {dayTransactions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              İşlemler ({dayTransactions.length})
            </h4>
            <div className="space-y-2">
              {dayTransactions.map((tx) => (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => onTransactionClick?.(tx)}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3 w-full text-left hover:bg-white/6 transition-colors"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    tx.type === 'income' ? 'bg-emerald-500/15' : 'bg-rose-500/15'
                  }`}>
                    {tx.type === 'income' ? (
                      <ArrowUpRight size={14} className="text-emerald-400" />
                    ) : (
                      <ArrowDownRight size={14} className="text-rose-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{tx.label}</p>
                    <p className="text-[10px] text-zinc-500">{tx.categoryName}</p>
                  </div>
                  <span className={`text-sm font-mono font-bold ${
                    tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reminders */}
        {reminders.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Hatırlatıcılar ({reminders.length})
            </h4>
            <div className="space-y-2">
              {reminders.map((rem) => {
                const Icon = REMINDER_TYPE_ICON[rem.type] || Bell;
                const colorClasses = REMINDER_TYPE_COLOR[rem.type] || 'text-cyan-400 bg-cyan-500/15';
                const [textColor, bgColor] = colorClasses.split(' ');
                return (
                  <div key={rem.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bgColor}`}>
                      <Icon size={14} className={textColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{rem.title}</p>
                      {rem.amount && (
                        <p className="text-[10px] text-zinc-500">{formatCurrency(parseFloat(rem.amount), currency)}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {dayTransactions.length === 0 && reminders.length === 0 && (
          <div className="text-center py-6">
            <CalendarDays size={32} className="text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-500">Bu güne ait kayıt yok</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default DayDetailPanel;
