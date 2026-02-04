'use client';

import React, { useState } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { generateId, getCurrentISODate, getTodayDate } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Goal } from '@/types';

/**
 * GoalForm - Tasarruf Hedefi Ekleme Formu
 *
 * Kullanıcıların yeni tasarruf hedefi oluşturmasını sağlar.
 * Hedef adı, tutar, emoji ve tarih bilgilerini alır.
 */

// Yaygın hedef emojileri
const GOAL_ICONS = [
  { emoji: '🏠', label: 'Ev' },
  { emoji: '🚗', label: 'Araba' },
  { emoji: '✈️', label: 'Tatil' },
  { emoji: '💍', label: 'Düğün' },
  { emoji: '🎓', label: 'Eğitim' },
  { emoji: '💻', label: 'Teknoloji' },
  { emoji: '🎯', label: 'Hedef' },
  { emoji: '💰', label: 'Tasarruf' },
  { emoji: '🏖️', label: 'Plaj' },
  { emoji: '🎁', label: 'Hediye' },
  { emoji: '📱', label: 'Telefon' },
  { emoji: '⚽', label: 'Hobi' },
];

export const GoalForm: React.FC = () => {
  const { addGoal } = useBudgetStore();

  // Form state
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎯');
  const [targetDate, setTargetDate] = useState('');

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Success state
  const [showSuccess, setShowSuccess] = useState(false);

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create new goal
    const newGoal: Goal = {
      id: generateId(),
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      icon: selectedIcon,
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
  };

  /**
   * Reset form
   */
  const handleReset = () => {
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setSelectedIcon('🎯');
    setTargetDate('');
    setErrors({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🎯 Yeni Tasarruf Hedefi</CardTitle>
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Hedef İkonu
            </label>
            <div className="grid grid-cols-6 gap-2">
              {GOAL_ICONS.map((icon) => (
                <button
                  key={icon.emoji}
                  type="button"
                  onClick={() => setSelectedIcon(icon.emoji)}
                  className={`flex h-12 w-full items-center justify-center rounded-lg border-2 text-2xl transition-all hover:scale-110 ${
                    selectedIcon === icon.emoji
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-blue-300'
                  }`}
                  title={icon.label}
                >
                  {icon.emoji}
                </button>
              ))}
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
        >
          Hedef Ekle
        </Button>
        <Button
          variant="ghost"
          isFullWidth
          onClick={handleReset}
        >
          Temizle
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoalForm;
