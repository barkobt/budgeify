'use client';

/**
 * BudgetAlertForm — Bütçe Uyarısı Oluşturma Formu
 *
 * Drawer içinde kullanılır. Zod validated form:
 * name, thresholdAmount, alertType (below_balance/above_spending), period (daily/weekly/monthly)
 */

import React, { useState } from 'react';
import { createBudgetAlert } from '@/actions/budget-alert';
import { toast } from 'sonner';
import {
  TrendingDown,
  TrendingUp,
  Loader2,
} from 'lucide-react';

const ALERT_TYPES = [
  { value: 'above_spending' as const, label: 'Harcama Aşımı', icon: TrendingUp, color: 'text-rose-400', desc: 'Harcama eşiği aşıldığında' },
  { value: 'below_balance' as const, label: 'Düşük Bakiye', icon: TrendingDown, color: 'text-amber-400', desc: 'Bakiye eşiğin altına düşünce' },
];

const PERIODS = [
  { value: 'daily' as const, label: 'Günlük' },
  { value: 'weekly' as const, label: 'Haftalık' },
  { value: 'monthly' as const, label: 'Aylık' },
];

interface BudgetAlertFormProps {
  onSuccess?: () => void;
}

export function BudgetAlertForm({ onSuccess }: BudgetAlertFormProps) {
  const [name, setName] = useState('');
  const [thresholdAmount, setThresholdAmount] = useState('');
  const [alertType, setAlertType] = useState<'below_balance' | 'above_spending'>('above_spending');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !thresholdAmount) {
      toast.error('Ad ve eşik tutarı gerekli');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createBudgetAlert({
        name: name.trim(),
        thresholdAmount: parseFloat(thresholdAmount),
        alertType,
        period,
      });

      if (result.success) {
        toast.success('Bütçe uyarısı oluşturuldu');
        setName('');
        setThresholdAmount('');
        setAlertType('above_spending');
        setPeriod('monthly');
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
      {/* Name */}
      <div>
        <label htmlFor="alert-name" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
          Uyarı Adı
        </label>
        <input
          id="alert-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Aylık harcama limiti..."
          maxLength={100}
          className="neon-input w-full"
          required
        />
      </div>

      {/* Alert Type */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
          Uyarı Türü
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ALERT_TYPES.map((at) => {
            const Icon = at.icon;
            const isSelected = alertType === at.value;
            return (
              <button
                key={at.value}
                type="button"
                onClick={() => setAlertType(at.value)}
                className={`flex flex-col items-start gap-1 rounded-xl px-3 py-3 text-left transition-all duration-200 border ${
                  isSelected
                    ? 'bg-primary/15 border-primary/40 text-white'
                    : 'bg-white/3 border-white/8 text-zinc-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} className={isSelected ? at.color : 'text-zinc-500'} />
                  <span className="text-sm font-medium">{at.label}</span>
                </div>
                <span className="text-[10px] text-zinc-500">{at.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Threshold Amount */}
      <div>
        <label htmlFor="alert-threshold" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
          Eşik Tutarı (₺)
        </label>
        <input
          id="alert-threshold"
          type="number"
          value={thresholdAmount}
          onChange={(e) => setThresholdAmount(e.target.value)}
          placeholder="5000"
          min="1"
          step="0.01"
          className="neon-input w-full"
          required
        />
      </div>

      {/* Period */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
          Değerlendirme Periyodu
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={`rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-200 border ${
                period === p.value
                  ? 'bg-primary/15 border-primary/40 text-white'
                  : 'bg-white/3 border-white/8 text-zinc-400 hover:bg-white/5'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !name.trim() || !thresholdAmount}
        className="btn-portal-gradient w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Oluşturuluyor...
          </>
        ) : (
          'Uyarı Oluştur'
        )}
      </button>
    </form>
  );
}

export default BudgetAlertForm;
