'use client';

import React, { useState } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useDataSyncOptional } from '@/providers/DataSyncProvider';
import { formatCurrency, formatDate, getCurrencySymbol } from '@/utils';
import { Edit2, Trash2, X, Check } from 'lucide-react';
import type { Income } from '@/types';
import { INCOME_ICON_MAP } from '@/lib/category-icons';

interface IncomeListProps {
  onEditIncome?: (income: Income) => void;
}

/**
 * IncomeListItem — Single income item with edit/delete actions
 */
const IncomeListItem: React.FC<{
  income: Income;
  currency: string;
  onEdit: (income: Income) => void;
  onDelete: (incomeId: string) => void;
}> = ({ income, currency, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const symbol = getCurrencySymbol(currency);
  const Icon = INCOME_ICON_MAP[income.category];

  const handleDelete = () => {
    onDelete(income.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="relative rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20">
      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-zinc-900/95 backdrop-blur-sm">
          <div className="text-center p-3">
            <p className="text-sm font-medium text-slate-300 mb-3">
              Bu geliri silmek istediğinize emin misiniz?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-rose-600 active:scale-95"
              >
                <Trash2 size={14} />
                Sil
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/15 active:scale-95"
              >
                <X size={14} />
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <Icon size={18} />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-slate-200">
              {income.description || income.category}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{income.isRecurring ? 'Düzenli' : 'Tek seferlik'}</span>
              <span>•</span>
              <span>{formatDate(income.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-emerald-400 tabular-nums">
              +{symbol}
              {income.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(income)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-accent-500/20 hover:text-accent-400 active:scale-95"
              aria-label="Geliri düzenle"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-rose-500/20 hover:text-rose-400 active:scale-95"
              aria-label="Geliri sil"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * IncomeList — HubX-grade income list with CRUD actions
 */
export const IncomeList: React.FC<IncomeListProps> = ({ onEditIncome }) => {
  const { incomes, currency, deleteIncome } = useBudgetStore();
  const dataSync = useDataSyncOptional();

  const handleEdit = (income: Income) => {
    onEditIncome?.(income);
  };

  const handleDelete = async (incomeId: string) => {
    try {
      // Use server persistence if available, otherwise fall back to local storage
      if (dataSync) {
        await dataSync.deleteIncome(incomeId);
      } else {
        // Demo mode: Local storage only
        deleteIncome(incomeId);
      }
    } catch (error) {
      console.error('Failed to delete income:', error);
      // Error handling could be enhanced with toast notifications
    }
  };

  if (incomes.length === 0) {
    return (
      <div className="rounded-2xl glass-card p-6">
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
            <Edit2 size={32} className="text-slate-500" />
          </div>
          <p className="text-slate-300 font-medium">Henüz gelir eklenmemiş</p>
          <p className="text-sm text-slate-500 mt-2">
            İlk gelirinizi eklemek için yukarıdaki formu kullanın
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">
          Gelirlerim ({incomes.length})
        </h3>
        <div className="text-xs text-slate-500">
          Toplam: {formatCurrency(
            incomes.reduce((sum, inc) => sum + inc.amount, 0),
            currency
          )}
        </div>
      </div>

      <div className="space-y-3">
        {incomes.map((income) => (
          <IncomeListItem
            key={income.id}
            income={income}
            currency={currency}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
