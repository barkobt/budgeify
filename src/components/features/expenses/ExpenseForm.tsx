'use client';

import React, { useState } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useDataSyncOptional } from '@/providers/DataSyncProvider';
import { generateId, getCurrentISODate, getTodayDate } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { reportError } from '@/lib/error-reporting';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { Check, Clock, CheckCircle2 } from 'lucide-react';
import type { TransactionStatus } from '@/types';
import { getCategoryIcon } from '@/lib/category-icons';

/**
 * ExpenseForm - Drawer-optimized Expense Form
 *
 * 🎓 MENTOR NOTU - Hybrid Persistence:
 * ------------------------------------
 * Bu form hem localStorage (Zustand) hem de server (Neon) ile çalışır.
 * - Auth varsa: DataSyncProvider kullanır (server persistence)
 * - Auth yoksa: Sadece Zustand kullanır (localStorage demo mode)
 */
interface ExpenseFormProps {
  onSuccess?: () => void;
  editingExpense?: { id: string; categoryId: string; amount: number; note?: string; date: string; status: TransactionStatus; expectedDate?: string } | null;
  onCancelEdit?: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSuccess, editingExpense, onCancelEdit }) => {
  const { addExpense, updateExpense: updateExpenseLocal } = useBudgetStore();
  const dataSync = useDataSyncOptional();

  const isEditMode = !!editingExpense;

  const [amount, setAmount] = useState(editingExpense ? String(editingExpense.amount) : '');
  const [categoryId, setCategoryId] = useState(editingExpense?.categoryId || '');
  const [note, setNote] = useState(editingExpense?.note || '');
  const [date, setDate] = useState(editingExpense?.date || getTodayDate());
  const [status, setStatus] = useState<TransactionStatus>(editingExpense?.status || 'completed');
  const [expectedDate, setExpectedDate] = useState(editingExpense?.expectedDate || '');
  const [errors, setErrors] = useState<{
    amount?: string;
    categoryId?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Removed inline icon map — using shared getCategoryIcon utility

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Geçerli bir tutar giriniz';
    }

    if (!categoryId) {
      newErrors.categoryId = 'Kategori seçimi zorunludur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const expenseData = {
        amount: parseFloat(amount),
        note: note.trim() || undefined,
        categoryId,
        date,
        status,
        expectedDate: expectedDate || undefined,
      };

      if (isEditMode && editingExpense) {
        // Edit mode: Update existing expense
        updateExpenseLocal(editingExpense.id, {
          categoryId,
          amount: parseFloat(amount),
          note: note.trim() || undefined,
          date,
          status,
          expectedDate: expectedDate || undefined,
        });
      } else if (dataSync) {
        // Use server persistence if available
        await dataSync.createExpense(expenseData);
      } else {
        // Demo mode: Local storage only
        addExpense({
          id: generateId(),
          categoryId,
          amount: parseFloat(amount),
          note: note.trim() || undefined,
          date,
          status,
          expectedDate: expectedDate || undefined,
          createdAt: getCurrentISODate(),
          updatedAt: getCurrentISODate(),
        });
      }

      setShowSuccess(true);
      setAmount('');
      setCategoryId('');
      setNote('');
      setDate(getTodayDate());
      setStatus('completed');
      setExpectedDate('');

      setTimeout(() => {
        setShowSuccess(false);
        onSuccess?.();
      }, 1500);
    } catch (error) {
      reportError(error instanceof Error ? error : new Error(String(error)), { context: 'ExpenseForm' });
      // Show error state here if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 mb-4">
          <Check size={32} className="text-emerald-400" strokeWidth={3} />
        </div>
        <p className="text-lg font-semibold text-white">{isEditMode ? 'Gider Güncellendi' : 'Gider Eklendi'}</p>
        <p className="text-sm text-slate-500 mt-1">Başarıyla kaydedildi</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Amount */}
      <Input
        label="Tutar"
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        iconLeft="₺"
        error={errors.amount}
        isRequired
        step="0.01"
        min="0"
      />

      {/* Category Grid */}
      <div>
        <label className="mb-3 block text-sm font-medium text-slate-300">
          Kategori <span className="text-rose-400">*</span>
        </label>
        {errors.categoryId && (
          <p className="mb-2 text-sm text-rose-400">{errors.categoryId}</p>
        )}
        <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pr-1">
          {DEFAULT_CATEGORIES.slice(0, 12).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                categoryId === cat.id
                  ? 'border-accent-500/50 bg-accent-500/15 text-accent-400'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              {(() => { const Icon = getCategoryIcon(cat.id); return <Icon size={18} />; })()}
              <span className="text-xs font-medium truncate w-full text-center">{cat.name}</span>
            </button>
          ))}
        </div>
        {/* Show More Categories */}
        <details className="mt-2">
          <summary className="text-xs text-slate-500 cursor-pointer hover:text-accent-400">
            Daha fazla kategori göster
          </summary>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {DEFAULT_CATEGORIES.slice(12).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                  categoryId === cat.id
                    ? 'border-accent-500/50 bg-accent-500/15 text-accent-400'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                {(() => { const Icon = getCategoryIcon(cat.id); return <Icon size={18} />; })()}
                <span className="text-xs font-medium truncate w-full text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </details>
      </div>

      {/* Date */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Tarih
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={getTodayDate()}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none transition-all focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
        />
      </div>

      {/* Status Toggle */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Durum
        </label>
        <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
          <button
            type="button"
            onClick={() => { setStatus('completed'); setExpectedDate(''); }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              status === 'completed'
                ? 'bg-emerald-500/15 text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <CheckCircle2 size={16} />
            Tamamlandı
          </button>
          <button
            type="button"
            onClick={() => setStatus('pending')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              status === 'pending'
                ? 'bg-amber-500/15 text-amber-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Clock size={16} />
            Bekliyor
          </button>
        </div>
      </div>

      {/* Expected Date — only visible when status is pending */}
      {status === 'pending' && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Beklenen Tarih
          </label>
          <input
            type="date"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
            min={getTodayDate()}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none transition-all focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
          />
        </div>
      )}

      {/* Note */}
      <Input
        label="Not (Opsiyonel)"
        type="text"
        placeholder="Örn: Market alışverişi"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={200}
      />

      {/* Submit */}
      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          variant="primary"
          isFullWidth
          isLoading={isSubmitting}
          size="lg"
        >
          {isEditMode ? 'Güncelle' : 'Gider Ekle'}
        </Button>
        {isEditMode && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            İptal
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;
