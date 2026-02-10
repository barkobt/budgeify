'use client';

/**
 * ReminderForm — Hatırlatıcı Oluşturma Formu
 *
 * Drawer içinde kullanılır. Zod validated form:
 * title, type (bill/goal/budget/custom), amount, dueDate, frequency, categoryId
 */

import React, { useState } from 'react';
import { createReminder } from '@/actions/reminder';
import { toast } from 'sonner';
import { useBudgetStore } from '@/store/useBudgetStore';
import {
  Receipt,
  Target,
  AlertTriangle,
  Bell,
  CalendarDays,
  Repeat,
  DollarSign,
  Tag,
  Loader2,
} from 'lucide-react';

const REMINDER_TYPES = [
  { value: 'bill_payment' as const, label: 'Fatura Ödeme', icon: Receipt, color: 'text-rose-400' },
  { value: 'goal_deadline' as const, label: 'Hedef Tarihi', icon: Target, color: 'text-violet-400' },
  { value: 'budget_limit' as const, label: 'Bütçe Limiti', icon: AlertTriangle, color: 'text-amber-400' },
  { value: 'custom' as const, label: 'Özel', icon: Bell, color: 'text-cyan-400' },
];

const FREQUENCIES = [
  { value: 'once' as const, label: 'Bir Kez' },
  { value: 'daily' as const, label: 'Günlük' },
  { value: 'weekly' as const, label: 'Haftalık' },
  { value: 'monthly' as const, label: 'Aylık' },
];

interface ReminderFormProps {
  onSuccess?: () => void;
}

export function ReminderForm({ onSuccess }: ReminderFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'bill_payment' | 'goal_deadline' | 'budget_limit' | 'custom'>('bill_payment');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = useBudgetStore((s) => s.categories);
  const [categoryId, setCategoryId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      toast.error('Başlık ve tarih gerekli');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createReminder({
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        amount: amount ? parseFloat(amount) : undefined,
        dueDate: new Date(dueDate),
        frequency,
        categoryId: categoryId || undefined,
      });

      if (result.success) {
        toast.success('Hatırlatıcı oluşturuldu');
        setTitle('');
        setDescription('');
        setAmount('');
        setDueDate('');
        setFrequency('once');
        setCategoryId('');
        onSuccess?.();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error('Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="reminder-title" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
          Başlık
        </label>
        <input
          id="reminder-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Elektrik faturası..."
          maxLength={100}
          className="neon-input w-full"
          required
        />
      </div>

      {/* Type Selector */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
          Tür
        </label>
        <div className="grid grid-cols-2 gap-2">
          {REMINDER_TYPES.map((rt) => {
            const Icon = rt.icon;
            const isSelected = type === rt.value;
            return (
              <button
                key={rt.value}
                type="button"
                onClick={() => setType(rt.value)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 border ${
                  isSelected
                    ? 'bg-primary/15 border-primary/40 text-white'
                    : 'bg-white/3 border-white/8 text-zinc-400 hover:bg-white/5'
                }`}
              >
                <Icon size={16} className={isSelected ? rt.color : 'text-zinc-500'} />
                {rt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="reminder-amount" className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
          <DollarSign size={12} />
          Tutar (opsiyonel)
        </label>
        <input
          id="reminder-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="neon-input w-full"
        />
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="reminder-date" className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
          <CalendarDays size={12} />
          Tarih
        </label>
        <input
          id="reminder-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="neon-input w-full"
          required
        />
      </div>

      {/* Frequency */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
          <Repeat size={12} />
          Tekrar
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {FREQUENCIES.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFrequency(f.value)}
              className={`rounded-lg px-2 py-2 text-xs font-medium transition-all duration-200 border ${
                frequency === f.value
                  ? 'bg-primary/15 border-primary/40 text-white'
                  : 'bg-white/3 border-white/8 text-zinc-400 hover:bg-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <label htmlFor="reminder-category" className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            <Tag size={12} />
            Kategori (opsiyonel)
          </label>
          <select
            id="reminder-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="neon-input w-full"
          >
            <option value="">Seçiniz</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Description */}
      <div>
        <label htmlFor="reminder-desc" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
          Açıklama (opsiyonel)
        </label>
        <textarea
          id="reminder-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detaylar..."
          maxLength={500}
          rows={2}
          className="neon-input w-full resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !title.trim() || !dueDate}
        className="btn-portal-gradient w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Oluşturuluyor...
          </>
        ) : (
          'Hatırlatıcı Oluştur'
        )}
      </button>
    </form>
  );
}

export default ReminderForm;
