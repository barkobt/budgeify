'use client';

/**
 * TransactionDetailPanel — v6.0 M4 Transaction Detail Side Panel
 *
 * Stitch 3 inspired detail panel for xl+ breakpoint:
 * - Transaction icon + label + category badge
 * - Large mono amount (color-coded)
 * - Detail fields: Date, Category, Type, Description
 * - Action buttons: Delete / Edit (future)
 * - Animated slide-in from right
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Tag,
  FileText,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { getCategoryIcon } from '@/lib/category-icons';
import { formatCurrency, formatDate } from '@/utils';
import type { MergedTransaction } from './TransactionTable';
import type { CurrencyCode } from '@/types';

interface TransactionDetailPanelProps {
  transaction: MergedTransaction | null;
  onClose: () => void;
  onDelete?: (id: string, type: 'income' | 'expense') => void;
  currency: CurrencyCode;
}

const PANEL_VARIANTS = {
  hidden: { opacity: 0, x: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20, mass: 1 },
  },
  exit: {
    opacity: 0,
    x: 24,
    scale: 0.98,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

export const TransactionDetailPanel: React.FC<TransactionDetailPanelProps> = ({
  transaction,
  onClose,
  onDelete,
  currency,
}) => {
  return (
    <AnimatePresence mode="wait">
      {transaction && (
        <motion.div
          key={transaction.id}
          className="glass-panel rounded-2xl p-5 h-fit sticky top-6 flex flex-col gap-5"
          variants={PANEL_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold font-display text-white">İşlem Detayı</h3>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Paneli kapat"
            >
              <X size={14} />
            </button>
          </div>

          {/* Transaction Hero */}
          <div className="flex flex-col items-center gap-3 py-4">
            {/* Icon */}
            <TransactionIcon transaction={transaction} />

            {/* Label */}
            <div className="text-center">
              <p className="text-base font-semibold text-white">{transaction.label}</p>
              <span
                className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset mt-1"
                style={{
                  color: transaction.type === 'income' ? '#10B981' : transaction.categoryColor,
                  backgroundColor: transaction.type === 'income'
                    ? 'rgba(16, 185, 129, 0.10)'
                    : `${transaction.categoryColor}15`,
                  borderColor: transaction.type === 'income'
                    ? 'rgba(16, 185, 129, 0.25)'
                    : `${transaction.categoryColor}30`,
                }}
              >
                {transaction.categoryName}
              </span>
            </div>

            {/* Amount */}
            <div className="flex items-center gap-2 mt-2">
              {transaction.type === 'income' ? (
                <ArrowUpRight size={18} className="text-emerald-400" />
              ) : (
                <ArrowDownRight size={18} className="text-rose-400" />
              )}
              <span className={`text-2xl font-bold font-mono tabular-nums ${
                transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/8" />

          {/* Detail Fields */}
          <div className="flex flex-col gap-3">
            <DetailField
              icon={Calendar}
              label="Tarih"
              value={formatDate(transaction.date)}
            />
            <DetailField
              icon={Tag}
              label="Kategori"
              value={transaction.categoryName}
            />
            <DetailField
              icon={AlertCircle}
              label="Tür"
              value={transaction.type === 'income' ? 'Gelir' : 'Gider'}
              valueColor={transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}
            />
            {transaction.description && transaction.description !== transaction.label && (
              <DetailField
                icon={FileText}
                label="Açıklama"
                value={transaction.description}
              />
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/8" />

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {onDelete && (
              <button
                onClick={() => onDelete(transaction.id, transaction.type)}
                className="flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 text-xs font-medium text-rose-400 hover:bg-rose-500/20 transition-all"
              >
                <Trash2 size={13} />
                İşlemi Sil
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── SUB-COMPONENTS ──

function TransactionIcon({ transaction }: { transaction: MergedTransaction }) {
  const Icon = getCategoryIcon(transaction.categoryId);
  const isIncome = transaction.type === 'income';

  return (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-2xl"
      style={{
        backgroundColor: isIncome
          ? 'rgba(16, 185, 129, 0.15)'
          : `${transaction.categoryColor}20`,
      }}
    >
      <Icon
        size={24}
        strokeWidth={1.6}
        style={{ color: isIncome ? '#10B981' : transaction.categoryColor }}
      />
    </div>
  );
}

function DetailField({
  icon: Icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 shrink-0 mt-0.5">
        <Icon size={13} className="text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-slate-600 uppercase tracking-wider">{label}</p>
        <p className={`text-sm ${valueColor || 'text-slate-300'} truncate`}>{value}</p>
      </div>
    </div>
  );
}

export default TransactionDetailPanel;
