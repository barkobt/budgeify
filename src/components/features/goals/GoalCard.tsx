'use client';

import React, { useState } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { calculateSavingsGoal } from '@/lib/analytics';
import { formatCurrency, formatDate } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Target, TrendingUp, Calendar, Trash2, Check, X } from 'lucide-react';
import type { Goal } from '@/types';

interface GoalCardProps {
  goal: Goal;
}

/**
 * GoalCard - Tekil Hedef Kartı with Delete Functionality
 *
 * Bir hedefin detaylarını, ilerleme çubuğunu ve kalan süreyi gösterir.
 * Minimalist delete button with confirmation.
 */
export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const { deleteGoal } = useBudgetStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const progress = Math.min(
    Math.round((goal.currentAmount / goal.targetAmount) * 100),
    100
  );

  const { remaining, daysLeft, dailySavingsNeeded } = calculateSavingsGoal(
    goal.currentAmount,
    goal.targetAmount,
    goal.targetDate
  );

  const isCompleted = goal.status === 'completed' || progress >= 100;

  const handleDelete = () => {
    deleteGoal(goal.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className={`relative rounded-2xl border-2 p-5 transition-all duration-300 hover-lift ${
        isCompleted
          ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50'
          : 'border-slate-200 bg-white hover:border-accent-200 hover:shadow-lg'
      }`}
    >
      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/95 backdrop-blur-sm animate-scaleIn">
          <div className="text-center p-4">
            <p className="text-sm font-medium text-slate-700 mb-3">
              Bu hedefi silmek istediğinize emin misiniz?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-rose-600 active:scale-95"
              >
                <Trash2 size={14} />
                Sil
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-200 active:scale-95"
              >
                <X size={14} />
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl shadow-sm ${
              isCompleted
                ? 'bg-emerald-100 border border-emerald-200'
                : 'bg-accent-50 border border-accent-100'
            }`}
          >
            {goal.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{goal.name}</h3>
            <p className="text-sm text-slate-500">
              {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
              <Check size={12} />
              Tamamlandı
            </span>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-95"
              aria-label="Hedefi sil"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">İlerleme</span>
          <span className={`font-bold ${isCompleted ? 'text-emerald-600' : 'text-accent-700'}`}>
            %{progress}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                : 'bg-gradient-to-r from-accent-500 to-accent-700'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      {!isCompleted && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-50 p-3 transition-all hover:bg-slate-100">
            <div className="mb-1 flex items-center gap-1 text-slate-500">
              <Target className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Kalan</span>
            </div>
            <p className="text-sm font-bold text-slate-900">
              {formatCurrency(remaining)}
            </p>
          </div>
          {goal.targetDate && (
            <>
              <div className="rounded-xl bg-slate-50 p-3 transition-all hover:bg-slate-100">
                <div className="mb-1 flex items-center gap-1 text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Süre</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{daysLeft} gün</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 transition-all hover:bg-slate-100">
                <div className="mb-1 flex items-center gap-1 text-slate-500">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Günlük</span>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {formatCurrency(dailySavingsNeeded)}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {goal.targetDate && !isCompleted && (
        <p className="mt-3 text-xs text-slate-500">
          Hedef Tarihi: {formatDate(goal.targetDate)}
        </p>
      )}
    </div>
  );
};

/**
 * GoalList - Hedef Listesi
 *
 * Tüm hedefleri gösterir.
 */
export const GoalList = () => {
  const { getActiveGoals, getCompletedGoals } = useBudgetStore();
  const activeGoals = getActiveGoals();
  const completedGoals = getCompletedGoals();

  if (activeGoals.length === 0 && completedGoals.length === 0) {
    return (
      <div className="rounded-2xl bg-white/95 border border-slate-200/80 shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-700">
            <Target size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">Tasarruf Hedeflerim</p>
            <p className="text-xs text-slate-500">Hedeflerinizi takip edin</p>
          </div>
        </div>
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Target size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">Henüz hedef eklenmemiş</p>
          <p className="text-sm text-slate-400 mt-2">
            Yukarıdaki formu kullanarak ilk hedefinizi oluşturun
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/95 border border-slate-200/80 shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-700">
          <Target size={20} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">
            Tasarruf Hedeflerim ({activeGoals.length + completedGoals.length})
          </p>
          <p className="text-xs text-slate-500">Hedeflerinizi takip edin</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent-500 animate-pulse" />
              Aktif Hedefler
            </h4>
            {activeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              Tamamlanan Hedefler
            </h4>
            {completedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalList;
