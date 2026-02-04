'use client';

import React, { useState } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { generateId, getCurrentISODate, getTodayDate } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Goal } from '@/types';
import { Home, Car, Plane, Heart, GraduationCap, Laptop, Target, PiggyBank, Umbrella, Gift, Smartphone, Trophy } from 'lucide-react';

/**
 * GoalForm - Tasarruf Hedefi Ekleme Formu
 *
 * Kullanıcıların yeni tasarruf hedefi oluşturmasını sağlar.
 * Hedef adı, tutar, emoji ve tarih bilgilerini alır.
 */

// Hedef ikonları - Lucide React
const GOAL_ICONS = [
  { Icon: Home, id: 'home', label: 'Ev', color: 'text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-400' },
  { Icon: Car, id: 'car', label: 'Araba', color: 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:border-indigo-400' },
  { Icon: Plane, id: 'plane', label: 'Tatil', color: 'text-cyan-600 bg-cyan-50 border-cyan-200 hover:border-cyan-400' },
  { Icon: Heart, id: 'heart', label: 'Düğün', color: 'text-pink-600 bg-pink-50 border-pink-200 hover:border-pink-400' },
  { Icon: GraduationCap, id: 'education', label: 'Eğitim', color: 'text-purple-600 bg-purple-50 border-purple-200 hover:border-purple-400' },
  { Icon: Laptop, id: 'laptop', label: 'Teknoloji', color: 'text-slate-600 bg-slate-50 border-slate-200 hover:border-slate-400' },
  { Icon: Target, id: 'target', label: 'Hedef', color: 'text-accent-700 bg-accent-50 border-accent-200 hover:border-accent-400' },
  { Icon: PiggyBank, id: 'piggybank', label: 'Tasarruf', color: 'text-green-600 bg-green-50 border-green-200 hover:border-green-400' },
  { Icon: Umbrella, id: 'umbrella', label: 'Tatil', color: 'text-teal-600 bg-teal-50 border-teal-200 hover:border-teal-400' },
  { Icon: Gift, id: 'gift', label: 'Hediye', color: 'text-orange-600 bg-orange-50 border-orange-200 hover:border-orange-400' },
  { Icon: Smartphone, id: 'phone', label: 'Telefon', color: 'text-violet-600 bg-violet-50 border-violet-200 hover:border-violet-400' },
  { Icon: Trophy, id: 'trophy', label: 'Başarı', color: 'text-amber-600 bg-amber-50 border-amber-200 hover:border-amber-400' },
];

export const GoalForm: React.FC = () => {
  const { addGoal } = useBudgetStore();

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

  /**
   * Form validation
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Hedef adı gereklidir';
    } else if (name.length > 50) {
      newErrors.name = 'Hedef adı en fazla 50 karakter olabilir';
    }

    // Target amount validation
    const targetAmountNum = parseFloat(targetAmount);
    if (!targetAmount || isNaN(targetAmountNum)) {
      newErrors.targetAmount = 'Hedef tutar gereklidir';
    } else if (targetAmountNum <= 0) {
      newErrors.targetAmount = 'Hedef tutar 0\'dan büyük olmalıdır';
    }

    // Current amount validation (optional)
    if (currentAmount) {
      const currentAmountNum = parseFloat(currentAmount);
      if (isNaN(currentAmountNum) || currentAmountNum < 0) {
        newErrors.currentAmount = 'Geçersiz tutar';
      }
    }

    // Target date validation (optional)
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

    try {
      // Simulate async operation (for better UX with loading state)
      await new Promise(resolve => setTimeout(resolve, 300));

      // Create new goal
      // Find the selected icon emoji for backward compatibility
      const selectedIconData = GOAL_ICONS.find(i => i.id === selectedIcon);

      const newGoal: Goal = {
        id: generateId(),
        name: name.trim(),
        targetAmount: parseFloat(targetAmount),
        currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
        icon: selectedIconData?.label || '🎯', // Store label as fallback
        targetDate: targetDate || undefined,
        status: 'active',
        createdAt: getCurrentISODate(),
      };

      addGoal(newGoal);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Reset form
      handleReset();
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset form
   */
  const handleReset = () => {
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setSelectedIcon('target');
    setTargetDate('');
    setErrors({});
  };

  return (
    <Card variant="default" size="md">
      <CardHeader noBorder>
        <CardTitle className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
            <Target size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span>Yeni Tasarruf Hedefi</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Success Message */}
          {showSuccess && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
              ✓ Hedef başarıyla eklendi!
            </div>
          )}

          {/* Hedef Adı */}
          <Input
            label="Hedef Adı"
            type="text"
            placeholder="Örn: Yeni Araba"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            maxLength={50}
          />

          {/* Hedef Tutar */}
          <Input
            label="Hedef Tutar"
            type="number"
            placeholder="0.00"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            error={errors.targetAmount}
            iconLeft="₺"
            helperText="Ulaşmak istediğiniz tutar"
            min={0}
            step={0.01}
          />

          {/* Mevcut Birikim */}
          <Input
            label="Mevcut Birikim (Opsiyonel)"
            type="number"
            placeholder="0.00"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            error={errors.currentAmount}
            iconLeft="₺"
            helperText="Şu anki birikim miktarınız"
            min={0}
            step={0.01}
          />

          {/* Icon Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              Hedef İkonu
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {GOAL_ICONS.map(({ Icon, id, label, color }) => {
                const isSelected = selectedIcon === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedIcon(id)}
                    className={`flex h-14 w-full items-center justify-center rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-accent-700 shadow-lg scale-105'
                        : color
                    }`}
                    title={label}
                  >
                    <Icon
                      size={24}
                      strokeWidth={2}
                      className={isSelected ? 'text-accent-700' : ''}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hedef Tarihi */}
          <Input
            label="Hedef Tarihi (Opsiyonel)"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            error={errors.targetDate}
            helperText="Bu tarihe kadar hedefinize ulaşmak istiyorsunuz"
            min={getTodayDate()}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button
          variant="primary"
          isFullWidth
          onClick={handleSubmit}
          isLoading={isSubmitting}
        >
          {isSubmitting ? 'Ekleniyor...' : 'Hedef Ekle'}
        </Button>
        <Button
          variant="ghost"
          isFullWidth
          onClick={handleReset}
          disabled={isSubmitting}
        >
          Temizle
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoalForm;
