'use client';

import React, { useState } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useDataSyncOptional } from '@/providers/DataSyncProvider';
import { generateId, getCurrentISODate } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { reportError } from '@/lib/error-reporting';
import type { IncomeCategory } from '@/types';
import { INCOME_CATEGORIES } from '@/constants/categories';
import { Check } from 'lucide-react';
import { INCOME_ICON_MAP } from '@/lib/category-icons';

/**
 * MainSalaryForm - Drawer-optimized Income Form
 *
 * 🎓 MENTOR NOTU - Hybrid Persistence:
 * ------------------------------------
 * Bu form hem localStorage (Zustand) hem de server (Neon) ile çalışır.
 * - Auth varsa: DataSyncProvider kullanır (server persistence)
 * - Auth yoksa: Sadece Zustand kullanır (localStorage demo mode)
 */
export const MainSalaryForm = () => {
  const { addIncome } = useBudgetStore();
  const dataSync = useDataSyncOptional();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IncomeCategory>('salary');
  const [isRecurring, setIsRecurring] = useState(true);
  const [errors, setErrors] = useState<{ amount?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Removed inline icon map — using shared INCOME_ICON_MAP

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Geçerli bir tutar giriniz';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const incomeData = {
        amount: parseFloat(amount),
        description: description.trim() || undefined,
        isRecurring,
      };

      // Use server persistence if available, otherwise fall back to local storage
      if (dataSync) {
        await dataSync.createIncome(incomeData);
      } else {
        // Demo mode: Local storage only
        addIncome({
          id: generateId(),
          type: category === 'salary' ? 'salary' : 'additional',
          category,
          amount: parseFloat(amount),
          description: description.trim() || undefined,
          isRecurring,
          createdAt: getCurrentISODate(),
          updatedAt: getCurrentISODate(),
        });
      }

      setShowSuccess(true);
      setAmount('');
      setDescription('');
      setCategory('salary');
      setIsRecurring(true);

      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      reportError(error instanceof Error ? error : new Error(String(error)), { context: 'MainSalaryForm' });
      // Show error state here if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
          <Check size={32} className="text-emerald-600" strokeWidth={3} />
        </div>
        <p className="text-lg font-semibold text-slate-900">Gelir Eklendi</p>
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
        <label className="mb-3 block text-sm font-medium text-slate-700">
          Kategori
        </label>
        <div className="grid grid-cols-3 gap-2">
          {INCOME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id as IncomeCategory)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                category === cat.id
                  ? 'border-accent-700 bg-accent-50 text-accent-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {(() => { const Icon = INCOME_ICON_MAP[cat.id]; return Icon ? <Icon size={18} /> : null; })()}
              <span className="text-xs font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <Input
        label="Açıklama (Opsiyonel)"
        type="text"
        placeholder="Örn: Ocak maaşı"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={100}
      />

      {/* Recurring Toggle */}
      <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 cursor-pointer">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="h-5 w-5 rounded border-slate-300 text-accent-700 focus:ring-accent-700/20"
        />
        <div>
          <p className="text-sm font-medium text-slate-700">Düzenli gelir</p>
          <p className="text-xs text-slate-500">Her ay tekrarlayan gelir</p>
        </div>
      </label>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        isFullWidth
        isLoading={isSubmitting}
        size="lg"
      >
        Gelir Ekle
      </Button>
    </form>
  );
};

export default MainSalaryForm;
