'use client';

import React, { useState } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useDataSyncOptional } from '@/providers/DataSyncProvider';
import { generateId, getCurrentISODate, getTodayDate } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { reportError } from '@/lib/error-reporting';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { Check } from 'lucide-react';
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
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSuccess }) => {
  const { addExpense } = useBudgetStore();
  const dataSync = useDataSyncOptional();

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getTodayDate());
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
      };

      // Use server persistence if available, otherwise fall back to local storage
      if (dataSync) {
        await dataSync.createExpense(expenseData);
      } else {
        // Demo mode: Local storage only
        addExpense({
          id: generateId(),
          categoryId,
          amount: parseFloat(amount),
          note: note.trim() || undefined,
          date,
          status: 'completed',
          createdAt: getCurrentISODate(),
          updatedAt: getCurrentISODate(),
        });
      }

      setShowSuccess(true);
      setAmount('');
      setCategoryId('');
      setNote('');
      setDate(getTodayDate());

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
        <p className="text-lg font-semibold text-white">Gider Eklendi</p>
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
      <Button
        type="submit"
        variant="primary"
        isFullWidth
        isLoading={isSubmitting}
        size="lg"
      >
        Gider Ekle
      </Button>
    </form>
  );
};

export default ExpenseForm;
