'use client';

import React, { useState } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useDataSyncOptional } from '@/providers/DataSyncProvider';
import { generateId, getCurrentISODate, getTodayDate, getCurrencySymbol } from '@/utils';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { reportError } from '@/lib/error-reporting';
import type { Goal } from '@/types';
import {
  Home,
  Car,
  Plane,
  Heart,
  GraduationCap,
  Laptop,
  Target,
  PiggyBank,
  Umbrella,
  Gift,
  Smartphone,
  Trophy,
  Check,
} from 'lucide-react';

/**
 * GoalForm - Drawer-optimized Goal Form
 *
 * 🎓 MENTOR NOTU - Hybrid Persistence:
 * ------------------------------------
 * Bu form hem localStorage (Zustand) hem de server (Neon) ile çalışır.
 * - Auth varsa: DataSyncProvider kullanır (server persistence)
 * - Auth yoksa: Sadece Zustand kullanır (localStorage demo mode)
 */

// Goal icons with labels
const GOAL_ICONS = [
  { Icon: Home, id: 'home', label: 'Ev' },
  { Icon: Car, id: 'car', label: 'Araba' },
  { Icon: Plane, id: 'plane', label: 'Tatil' },
  { Icon: Heart, id: 'heart', label: 'Sağlık' },
  { Icon: GraduationCap, id: 'education', label: 'Eğitim' },
  { Icon: Laptop, id: 'laptop', label: 'Teknoloji' },
  { Icon: Target, id: 'target', label: 'Hedef' },
  { Icon: PiggyBank, id: 'piggybank', label: 'Tasarruf' },
  { Icon: Umbrella, id: 'umbrella', label: 'Acil Durum' },
  { Icon: Gift, id: 'gift', label: 'Hediye' },
  { Icon: Smartphone, id: 'phone', label: 'Telefon' },
  { Icon: Trophy, id: 'trophy', label: 'Başarı' },
];

export const GoalForm: React.FC = () => {
  const { addGoal, currency } = useBudgetStore();
  const dataSync = useDataSyncOptional();
  const symbol = getCurrencySymbol(currency);

  // Form state
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('target');
  const [targetDate, setTargetDate] = useState('');

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Success state
  const [showSuccess, setShowSuccess] = useState(false);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Server error state
  const [serverError, setServerError] = useState<string | null>(null);

  /**
   * Form validation
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Hedef adı gereklidir';
    } else if (name.length > 50) {
      newErrors.name = 'Hedef adı en fazla 50 karakter olabilir';
    }

    const targetAmountNum = parseFloat(targetAmount);
    if (!targetAmount || isNaN(targetAmountNum)) {
      newErrors.targetAmount = 'Hedef tutar gereklidir';
    } else if (targetAmountNum <= 0) {
      newErrors.targetAmount = 'Hedef tutar 0\'dan büyük olmalıdır';
    }

    if (currentAmount) {
      const currentAmountNum = parseFloat(currentAmount);
      if (isNaN(currentAmountNum) || currentAmountNum < 0) {
        newErrors.currentAmount = 'Geçersiz tutar';
      }
    }

    if (targetDate) {
      const today = getTodayDate();
      if (targetDate < today) {
        newErrors.targetDate = 'Hedef tarihi bugünden önce olamaz';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const selectedIconData = GOAL_ICONS.find(i => i.id === selectedIcon);
      const iconLabel = selectedIconData?.label || 'Hedef';

      // Use server persistence if available, otherwise fall back to local storage
      if (dataSync) {
        await dataSync.createGoal({
          name: name.trim(),
          targetAmount: parseFloat(targetAmount),
          icon: iconLabel,
          targetDate: targetDate ? new Date(targetDate) : undefined,
        });
      } else {
        // Demo mode: Local storage only
        const newGoal: Goal = {
          id: generateId(),
          name: name.trim(),
          targetAmount: parseFloat(targetAmount),
          currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
          icon: iconLabel,
          targetDate: targetDate || undefined,
          status: 'active',
          createdAt: getCurrentISODate(),
        };
        addGoal(newGoal);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Reset form
      setName('');
      setTargetAmount('');
      setCurrentAmount('');
      setSelectedIcon('target');
      setTargetDate('');
      setErrors({});
    } catch (error) {
      reportError(error instanceof Error ? error : new Error(String(error)), { context: 'GoalForm' });
      setServerError(error instanceof Error ? error.message : 'Hedef eklenirken bir hata olustu');
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
        <p className="text-lg font-semibold text-white">Hedef Eklendi</p>
        <p className="text-sm text-slate-500 mt-1">Başarıyla kaydedildi</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass-card overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl ai-gradient">
            <Target size={20} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">Yeni Hedef</p>
            <p className="text-xs text-slate-500">Tasarruf hedefinizi belirleyin</p>
          </div>
        </div>

        {/* Server error banner */}
        {serverError && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 mb-4">
            <p className="text-sm text-rose-400">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Goal Name */}
          <Input
            label="Hedef Adı"
            type="text"
            placeholder="Örn: Yeni Araba"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            isRequired
            maxLength={50}
          />

          {/* Target Amount */}
          <Input
            label="Hedef Tutar"
            type="number"
            placeholder="0.00"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            error={errors.targetAmount}
            iconLeft={symbol}
            isRequired
            min={0}
            step={0.01}
          />

          {/* Current Amount */}
          <Input
            label="Mevcut Birikim (Opsiyonel)"
            type="number"
            placeholder="0.00"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            error={errors.currentAmount}
            iconLeft={symbol}
            min={0}
            step={0.01}
          />

          {/* Icon Selector */}
          <div>
            <label className="mb-3 block text-sm font-medium text-slate-300">
              Hedef Simgesi
            </label>
            <div className="grid grid-cols-4 gap-2">
              {GOAL_ICONS.map(({ Icon, id, label }) => {
                const isSelected = selectedIcon === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedIcon(id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                      isSelected
                        ? 'border-accent-500/50 bg-accent-500/15 text-accent-400'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <Icon size={20} strokeWidth={2} />
                    <span className="text-[10px] font-medium">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Hedef Tarihi (Opsiyonel)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={getTodayDate()}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 outline-none transition-all focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
            />
            {errors.targetDate && (
              <p className="mt-2 text-sm text-rose-400">{errors.targetDate}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            isFullWidth
            isLoading={isSubmitting}
            size="lg"
          >
            Hedef Oluştur
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
