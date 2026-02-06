'use client';

import React, { useState } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useDataSyncOptional } from '@/providers/DataSyncProvider';
import { calculateSavingsGoal } from '@/lib/analytics';
import { formatCurrency, formatDate } from '@/utils';
import { Target, TrendingUp, Calendar, Trash2, Check, X, Plus } from 'lucide-react';
import type { Goal } from '@/types';

interface GoalCardProps {
  goal: Goal;
}

/**
 * GoalCard — HubX-grade goal card (dark theme)
 */
export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const { deleteGoal, currency, addToGoal } = useBudgetStore();
  const dataSync = useDataSyncOptional();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [isAddingFunds, setIsAddingFunds] = useState(false);

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

  const handleDelete = async () => {
    try {
      if (dataSync) {
        await dataSync.deleteGoal(goal.id);
      } else {
        deleteGoal(goal.id);
      }
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const handleAddFunds = async () => {
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0) return;

    setIsAddingFunds(true);
    try {
      if (dataSync) {
        await dataSync.addToGoal(goal.id, amount);
      } else {
        addToGoal(goal.id, amount);
      }
      setAddAmount('');
      setShowAddFunds(false);
    } catch (error) {
      console.error('Failed to add funds to goal:', error);
    } finally {
      setIsAddingFunds(false);
    }
  };

  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all duration-300 hover-lift ${
        isCompleted
          ? 'border-emerald-500/30 bg-emerald-500/10'
          : 'border-white/10 bg-zinc-900/40 hover:border-accent-500/30'
      }`}
    >
      {/* Add Funds Confirmation Overlay */}
      {showAddFunds && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-zinc-900/95 backdrop-blur-sm animate-scaleIn">
          <div className="text-center p-4 w-full max-w-xs">
            <p className="text-sm font-medium text-slate-300 mb-3">
              Hedefe birikim ekle
            </p>
            <div className="mb-3">
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="Tutar"
                className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
                step="0.01"
                min="0"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleAddFunds}
                disabled={!addAmount || parseFloat(addAmount) <= 0 || isAddingFunds}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={14} />
                {isAddingFunds ? 'Ekleniyor...' : 'Ekle'}
              </button>
              <button
                onClick={() => {
                  setShowAddFunds(false);
                  setAddAmount('');
                }}
                className="flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/15 active:scale-95"
              >
                <X size={14} />
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-zinc-900/95 backdrop-blur-sm animate-scaleIn">
          <div className="text-center p-4">
            <p className="text-sm font-medium text-slate-300 mb-3">
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
                className="flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/15 active:scale-95"
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
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
              isCompleted
                ? 'bg-emerald-500/20 border border-emerald-500/30'
                : 'bg-accent-500/15 border border-accent-500/20'
            }`}
          >
            {goal.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{goal.name}</h3>
            <p className="text-sm text-slate-400 tabular-nums">
              {formatCurrency(goal.currentAmount, currency)} / {formatCurrency(goal.targetAmount, currency)}
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
            <>
              <button
                onClick={() => setShowAddFunds(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-emerald-500/20 hover:text-emerald-400 active:scale-95"
                aria-label="Hedefe birikim ekle"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-rose-500/20 hover:text-rose-400 active:scale-95"
                aria-label="Hedefi sil"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-400">İlerleme</span>
          <span className={`font-bold tabular-nums ${isCompleted ? 'text-emerald-400' : 'text-accent-400'}`}>
            %{progress}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
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
          <div className="rounded-xl bg-white/5 p-3 transition-all hover:bg-white/10">
            <div className="mb-1 flex items-center gap-1 text-slate-500">
              <Target className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Kalan</span>
            </div>
            <p className="text-sm font-bold text-slate-200 tabular-nums">
              {formatCurrency(remaining, currency)}
            </p>
          </div>
          {goal.targetDate && (
            <>
              <div className="rounded-xl bg-white/5 p-3 transition-all hover:bg-white/10">
                <div className="mb-1 flex items-center gap-1 text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Süre</span>
                </div>
                <p className="text-sm font-bold text-slate-200 tabular-nums">{daysLeft} gün</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3 transition-all hover:bg-white/10">
                <div className="mb-1 flex items-center gap-1 text-slate-500">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Günlük</span>
                </div>
                <p className="text-sm font-bold text-slate-200 tabular-nums">
                  {formatCurrency(dailySavingsNeeded, currency)}
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
 * GoalList — HubX-grade goal list (dark theme)
 */
export const GoalList = () => {
  const { getActiveGoals, getCompletedGoals } = useBudgetStore();
  const activeGoals = getActiveGoals();
  const completedGoals = getCompletedGoals();

  if (activeGoals.length === 0 && completedGoals.length === 0) {
    return (
      <div className="rounded-2xl glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl ai-gradient">
            <Target size={20} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">Tasarruf Hedeflerim</p>
            <p className="text-xs text-slate-500">Hedeflerinizi takip edin</p>
          </div>
        </div>
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
            <Target size={32} className="text-slate-500" />
          </div>
          <p className="text-slate-300 font-medium">Henüz hedef eklenmemiş</p>
          <p className="text-sm text-slate-500 mt-2">
            Yukarıdaki formu kullanarak ilk hedefinizi oluşturun
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl ai-gradient">
          <Target size={20} className="text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="text-lg font-semibold text-white">
            Tasarruf Hedeflerim ({activeGoals.length + completedGoals.length})
          </p>
          <p className="text-xs text-slate-500">Hedeflerinizi takip edin</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
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
            <h4 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
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
