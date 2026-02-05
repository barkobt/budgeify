'use client';

import React, { useState } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useDataSyncOptional } from '@/providers/DataSyncProvider';
import { generateId, getCurrentISODate, getTodayDate } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import {
  Check,
  Pizza,
  Coffee,
  ShoppingCart,
  Car,
  Lightbulb,
  Home,
  Heart,
  Film,
  Shirt,
  Laptop,
  Scissors,
  BookOpen,
  CreditCard,
  Building2,
  Gift,
  Dumbbell,
  Dog,
  Package,
} from 'lucide-react';

/**
 * ExpenseForm - Drawer-optimized Expense Form
 *
 * 🎓 MENTOR NOTU - Hybrid Persistence:
 * ------------------------------------
 * Bu form hem localStorage (Zustand) hem de server (Neon) ile çalışır.
 * - Auth varsa: DataSyncProvider kullanır (server persistence)
 * - Auth yoksa: Sadece Zustand kullanır (localStorage demo mode)
 */
export const ExpenseForm = () => {
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

  // Category icons mapping
  const categoryIcons: Record<string, React.ReactNode> = {
    cat_food: <Pizza size={18} />,
    cat_coffee: <Coffee size={18} />,
    cat_market: <ShoppingCart size={18} />,
    cat_transport: <Car size={18} />,
    cat_bills: <Lightbulb size={18} />,
    cat_rent: <Home size={18} />,
    cat_health: <Heart size={18} />,
    cat_entertainment: <Film size={18} />,
    cat_clothing: <Shirt size={18} />,
    cat_tech: <Laptop size={18} />,
    cat_personal: <Scissors size={18} />,
    cat_education: <BookOpen size={18} />,
    cat_credit_card: <CreditCard size={18} />,
    cat_loan: <Building2 size={18} />,
    cat_gift: <Gift size={18} />,
    cat_sports: <Dumbbell size={18} />,
    cat_pet: <Dog size={18} />,
    cat_other: <Package size={18} />,
  };

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
          createdAt: getCurrentISODate(),
          updatedAt: getCurrentISODate(),
        });
      }

      setShowSuccess(true);
      setAmount('');
      setCategoryId('');
      setNote('');
      setDate(getTodayDate());

      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save expense:', error);
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
        <p className="text-lg font-semibold text-slate-900">Gider Eklendi</p>
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
          Kategori <span className="text-rose-500">*</span>
        </label>
        {errors.categoryId && (
          <p className="mb-2 text-sm text-rose-500">{errors.categoryId}</p>
        )}
        <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pr-1">
          {DEFAULT_CATEGORIES.slice(0, 12).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                categoryId === cat.id
                  ? 'border-accent-700 bg-accent-50 text-accent-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {categoryIcons[cat.id]}
              <span className="text-xs font-medium truncate w-full text-center">{cat.name}</span>
            </button>
          ))}
        </div>
        {/* Show More Categories */}
        <details className="mt-2">
          <summary className="text-xs text-slate-500 cursor-pointer hover:text-accent-700">
            Daha fazla kategori göster
          </summary>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {DEFAULT_CATEGORIES.slice(12).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                  categoryId === cat.id
                    ? 'border-accent-700 bg-accent-50 text-accent-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {categoryIcons[cat.id]}
                <span className="text-xs font-medium truncate w-full text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </details>
      </div>

      {/* Date */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Tarih
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={getTodayDate()}
          className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all focus:border-accent-700 focus:ring-2 focus:ring-accent-700/20"
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
