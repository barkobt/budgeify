'use client';

import React from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { calculateSavingsGoal } from '@/lib/analytics';
import { formatCurrency, formatDate } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Target, TrendingUp, Calendar } from 'lucide-react';
import type { Goal } from '@/types';

interface GoalCardProps {
  goal: Goal;
}

/**
 * GoalCard - Tekil Hedef Kartı
 *
 * Bir hedefin detaylarını, ilerleme çubuğunu ve kalan süreyi gösterir.
 */
export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
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

  return (
    <div
      className={`rounded-2xl border-2 p-5 transition-all ${
        isCompleted
          ? 'border-green-200 bg-green-50'
          : 'border-slate-200 bg-white hover:border-blue-300'
      }`}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
              isCompleted ? 'bg-green-100' : 'bg-blue-100'
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
        {isCompleted && (
          <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
            ✓ Tamamlandı
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">İlerleme</span>
          <span className="font-bold text-blue-600">%{progress}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-green-500' : 'bg-blue-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      {!isCompleted && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="mb-1 flex items-center gap-1 text-slate-500">
              <Target className="h-3 w-3" />
              <span className="text-xs">Kalan</span>
            </div>
            <p className="text-sm font-bold text-slate-900">
              {formatCurrency(remaining)}
            </p>
          </div>
          {goal.targetDate && (
            <>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="mb-1 flex items-center gap-1 text-slate-500">
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs">Süre</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{daysLeft} gün</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="mb-1 flex items-center gap-1 text-slate-500">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs">Günlük</span>
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
      <Card>
        <CardHeader>
          <CardTitle>🎯 Tasarruf Hedeflerim</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <span className="text-3xl">🎯</span>
            </div>
            <p className="text-slate-600 font-medium">Henüz hedef eklenmemiş</p>
            <p className="text-sm text-slate-400 mt-2">
              İlk tasarruf hedefini ekleyerek başla
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          🎯 Tasarruf Hedeflerim ({activeGoals.length + completedGoals.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-600">Aktif Hedefler</h4>
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-600">
                Tamamlanan Hedefler
              </h4>
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalList;
