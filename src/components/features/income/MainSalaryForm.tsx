'use client';

import React, { useState } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { generateId, getCurrentISODate } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import type { IncomeCategory } from '@/types';
import { INCOME_CATEGORIES } from '@/constants/categories';

/**
 * MainSalaryForm - Ana Maaş Giriş Formu
 *
 * Kullanıcının gelir eklemesini sağlar.
 * Zod validation olmadan basit form validation kullanır.
 */
export const MainSalaryForm = () => {
  const { addIncome } = useBudgetStore();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IncomeCategory>('salary');
  const [isRecurring, setIsRecurring] = useState(true);
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const numericAmount = parseFloat(amount);

      addIncome({
        id: generateId(),
        type: category === 'salary' ? 'salary' : 'additional',
        category,
        amount: numericAmount,
        description: description.trim() || undefined,
        isRecurring,
        createdAt: getCurrentISODate(),
        updatedAt: getCurrentISODate(),
      });

      // Reset form
      setAmount('');
      setDescription('');
      setCategory('salary');
      setIsRecurring(true);
      setErrors({});

      // Success feedback
      alert('✅ Gelir başarıyla eklendi!');
    } catch (error) {
      console.error('Error adding income:', error);
      alert('❌ Gelir eklenirken hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>💰 Gelir Ekle</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          />

          {/* Category Select */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as IncomeCategory)}
              className="w-full rounded-xl border-2 border-slate-200 bg-white/50 px-4 py-3 text-slate-900 backdrop-blur-sm outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {INCOME_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description Input */}
          <Input
            label="Açıklama (Opsiyonel)"
            type="text"
            placeholder="Örn: Ocak maaşı, proje ödemesi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            helperText="Gelir kaynağını tanımlayın"
            maxLength={100}
          />

          {/* Recurring Checkbox */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <input
              id="isRecurring"
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
            <label htmlFor="isRecurring" className="flex-1 cursor-pointer">
              <span className="block text-sm font-medium text-slate-700">
                Düzenli gelir
              </span>
              <span className="text-xs text-slate-500">
                Her ay düzenli olarak gelir mi? (maaş gibi)
              </span>
            </label>
          </div>

          {/* Info Box */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs text-blue-700">
              <strong>💡 İpucu:</strong> Maaş, freelance ödemesi, kira geliri gibi tüm
              gelirlerinizi ekleyebilirsiniz. Düzenli gelirler bütçe planlamanızda
              dikkate alınır.
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
        >
          {isSubmitting ? 'Ekleniyor...' : 'Gelir Ekle'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          isFullWidth
          onClick={() => {
            setAmount('');
            setDescription('');
            setCategory('salary');
            setIsRecurring(true);
            setErrors({});
          }}
          disabled={isSubmitting}
        >
          Temizle
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MainSalaryForm;
