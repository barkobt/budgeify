'use client';

import React, { useState } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useDataSyncOptional } from '@/providers/DataSyncProvider';
import { generateId, getCurrentISODate, getCurrencySymbol, getTodayDate } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { reportError } from '@/lib/error-reporting';
import type { IncomeCategory, Income, TransactionStatus } from '@/types';
import { INCOME_CATEGORIES } from '@/constants/categories';
import { Check, X, Clock, CheckCircle2 } from 'lucide-react';
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
interface MainSalaryFormProps {
  editingIncome?: Income | null;
  onCancelEdit?: () => void;
  onSuccess?: () => void;
}

export const MainSalaryForm: React.FC<MainSalaryFormProps> = ({ editingIncome, onCancelEdit, onSuccess }) => {
  const { addIncome, currency } = useBudgetStore();
  const dataSync = useDataSyncOptional();
  const symbol = getCurrencySymbol(currency);

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IncomeCategory>('salary');
  const [date, setDate] = useState(getTodayDate());
  const [isRecurring, setIsRecurring] = useState(true);
  const [status, setStatus] = useState<TransactionStatus>('completed');
  const [expectedDate, setExpectedDate] = useState('');
  const [errors, setErrors] = useState<{ amount?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Initialize form with editing income data
  React.useEffect(() => {
    if (editingIncome) {
      setAmount(editingIncome.amount.toString());
      setDescription(editingIncome.description || '');
      setCategory(editingIncome.category);
      setIsRecurring(editingIncome.isRecurring);
    } else {
      // Reset form for new income
      setAmount('');
      setDescription('');
      setCategory('salary');
      setIsRecurring(true);
    }
  }, [editingIncome]);

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
    setServerError(null);

    try {
      const incomeData = {
        amount: parseFloat(amount),
        description: description.trim() || undefined,
        isRecurring,
        date,
        status,
        expectedDate: expectedDate || undefined,
      };

      if (editingIncome && dataSync) {
        // Update existing income
        await dataSync.updateIncome(editingIncome.id, incomeData);
        onCancelEdit?.();
      } else if (editingIncome) {
        // Demo mode: Update local storage
        // Note: This would need updateIncome method in store
        onCancelEdit?.();
      } else {
        // Create new income
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
            date,
            isRecurring,
            status,
            expectedDate: expectedDate || undefined,
            createdAt: getCurrentISODate(),
            updatedAt: getCurrentISODate(),
          });
        }
      }

      // Reset form only for new income
      if (!editingIncome) {
        setAmount('');
        setDescription('');
        setCategory('salary');
        setDate(getTodayDate());
        setIsRecurring(true);
        setStatus('completed');
        setExpectedDate('');
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess?.();
      }, 1500);
    } catch (error) {
      reportError(error instanceof Error ? error : new Error(String(error)), { context: 'MainSalaryForm' });
      setServerError(error instanceof Error ? error.message : 'Gelir kaydedilirken bir hata oluştu');
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
        <p className="text-lg font-semibold text-white">
          {editingIncome ? 'Gelir Güncellendi' : 'Gelir Eklendi'}
        </p>
        <p className="text-sm text-slate-500 mt-1">Başarıyla kaydedildi</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Server error banner */}
      {serverError && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3">
          <p className="text-sm text-rose-400">{serverError}</p>
        </div>
      )}

      {/* Amount */}
      <Input
        label="Tutar"
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        iconLeft={symbol}
        error={errors.amount}
        isRequired
        step="0.01"
        min="0"
      />

      {/* Category Grid */}
      <div>
        <label className="mb-3 block text-sm font-medium text-slate-300">
          Kategori
        </label>
        <div className="grid grid-cols-3 gap-2">
          {INCOME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id as IncomeCategory)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                category === cat.id
                  ? 'border-accent-500/50 bg-accent-500/15 text-accent-400'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
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

      {/* Recurring Toggle */}
      <label className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-4 cursor-pointer">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="h-5 w-5 rounded border-white/20 bg-white/5 text-accent-500 focus:ring-accent-500/20"
        />
        <div>
          <p className="text-sm font-medium text-slate-300">Düzenli gelir</p>
          <p className="text-xs text-slate-500">Her ay tekrarlayan gelir</p>
        </div>
      </label>

      {/* Cancel button for edit mode */}
      {editingIncome && (
        <Button
          type="button"
          variant="secondary"
          isFullWidth
          onClick={onCancelEdit}
          disabled={isSubmitting}
          size="lg"
          className="mb-3"
        >
          <X size={16} className="mr-2" />
          İptal
        </Button>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        isFullWidth
        isLoading={isSubmitting}
        size="lg"
      >
        {editingIncome ? 'Geliri Güncelle' : 'Gelir Ekle'}
      </Button>
    </form>
  );
};

export default MainSalaryForm;
