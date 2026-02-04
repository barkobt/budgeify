'use client';

import React, { useState } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { generateId, getCurrentISODate, getTodayDate } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { CategoryAutocomplete } from './CategoryAutocomplete';

/**
 * ExpenseForm - Harcama Ekleme Formu
 *
 * Kullanıcının harcama eklemesini sağlar.
 * CategoryAutocomplete ile kategori seçimi yapar.
 */
export const ExpenseForm = () => {
  const { addExpense } = useBudgetStore();

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [errors, setErrors] = useState<{
    amount?: string;
    categoryId?: string;
    date?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Geçerli bir tutar giriniz';
    }

    if (!categoryId) {
      newErrors.categoryId = 'Kategori seçimi zorunludur';
    }

    if (!date) {
      newErrors.date = 'Tarih seçimi zorunludur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const numericAmount = parseFloat(amount);

      addExpense({
        id: generateId(),
        categoryId,
        amount: numericAmount,
        note: note.trim() || undefined,
        date,
        createdAt: getCurrentISODate(),
        updatedAt: getCurrentISODate(),
      });

      // Reset form
      setAmount('');
      setCategoryId('');
      setNote('');
      setDate(getTodayDate());
      setErrors({});

      // Success feedback
      alert('✅ Harcama başarıyla eklendi!');
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('❌ Harcama eklenirken hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setAmount('');
    setCategoryId('');
    setNote('');
    setDate(getTodayDate());
    setErrors({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>➖ Harcama Ekle</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Autocomplete */}
          <CategoryAutocomplete
            value={categoryId}
            onChange={setCategoryId}
            error={errors.categoryId}
            disabled={isSubmitting}
          />

          {/* Amount Input */}
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
            disabled={isSubmitting}
          />

          {/* Date Input */}
          <div>
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Tarih <span className="text-red-500">*</span>
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={getTodayDate()}
              disabled={isSubmitting}
              className={`w-full rounded-xl border-2 bg-white/50 px-4 py-3 text-slate-900 backdrop-blur-sm outline-none transition-all duration-200 ${
                errors.date
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              } ${isSubmitting ? 'cursor-not-allowed bg-slate-50 text-slate-400' : ''}`}
            />
            {errors.date && (
              <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                <span>⚠</span>
                {errors.date}
              </p>
            )}
          </div>

          {/* Note Input */}
          <Input
            label="Not (Opsiyonel)"
            type="text"
            placeholder="Örn: Market alışverişi, restoran"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            helperText="Harcama hakkında ek bilgi ekleyin"
            maxLength={200}
            disabled={isSubmitting}
          />

          {/* Info Box */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-xs text-red-700">
              <strong>💡 İpucu:</strong> Tüm harcamalarınızı kategorize ederek
              ekleyin. Bu sayede nereye ne kadar harcadığınızı kolayca görebilirsiniz.
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          variant="primary"
          isFullWidth
          isLoading={isSubmitting}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Ekleniyor...' : 'Harcama Ekle'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          isFullWidth
          onClick={handleClear}
          disabled={isSubmitting}
        >
          Temizle
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpenseForm;
