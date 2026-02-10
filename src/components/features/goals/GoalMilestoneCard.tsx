'use client';

/**
 * GoalMilestoneCard — v6.0 M5 Desktop Goal Card
 *
 * Stitch 3 inspired milestone card for desktop (lg+):
 * - Gradient icon box with per-goal theme
 * - Title + current/target amounts
 * - Gradient progress bar + completion % badge
 * - Range badge (SHORT / MEDIUM / LONG)
 * - Status text + days remaining
 * - Add funds + delete actions
 *
 * Mobile: existing GoalCard.tsx preserved
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useDataSyncOptional } from '@/providers/DataSyncProvider';
import { calculateSavingsGoal } from '@/lib/analytics';
import { formatCurrency, formatDate, toTitleCase, getTodayDate, getCurrencySymbol } from '@/utils';
import {
  Target, TrendingUp, Calendar, Trash2, Check, X, Plus, Settings,
  Home, Car, Plane, Heart, GraduationCap, Laptop,
  PiggyBank, Umbrella, Gift, Smartphone, Trophy,
  type LucideIcon,
} from 'lucide-react';
import type { Goal, CurrencyCode } from '@/types';

const GOAL_ICON_MAP: Record<string, LucideIcon> = {
  'Ev': Home,
  'Araba': Car,
  'Tatil': Plane,
  'Sağlık': Heart,
  'Eğitim': GraduationCap,
  'Teknoloji': Laptop,
  'Hedef': Target,
  'Tasarruf': PiggyBank,
  'Acil Durum': Umbrella,
  'Hediye': Gift,
  'Telefon': Smartphone,
  'Başarı': Trophy,
};

function getGoalIcon(label: string): LucideIcon {
  return GOAL_ICON_MAP[label] ?? Target;
}

/** Gradient themes for goal cards — cycles through based on index */
const GRADIENT_THEMES = [
  {
    id: 'indigo-purple',
    iconBg: 'bg-linear-to-br from-indigo-500 to-purple-600',
    progressBar: 'bg-linear-to-r from-indigo-500 to-purple-500',
    progressGlow: '0 0 12px rgba(99,102,241,0.5), 0 0 24px rgba(147,51,234,0.25)',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    rangeBadge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  {
    id: 'orange-pink',
    iconBg: 'bg-linear-to-br from-orange-500 to-pink-600',
    progressBar: 'bg-linear-to-r from-orange-500 to-pink-500',
    progressGlow: '0 0 12px rgba(249,115,22,0.5), 0 0 24px rgba(219,39,119,0.25)',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    rangeBadge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  {
    id: 'emerald-teal',
    iconBg: 'bg-linear-to-br from-emerald-500 to-teal-600',
    progressBar: 'bg-linear-to-r from-emerald-500 to-teal-500',
    progressGlow: '0 0 12px rgba(16,185,129,0.5), 0 0 24px rgba(13,148,136,0.25)',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    rangeBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'blue-cyan',
    iconBg: 'bg-linear-to-br from-blue-500 to-cyan-600',
    progressBar: 'bg-linear-to-r from-blue-500 to-cyan-500',
    progressGlow: '0 0 12px rgba(59,130,246,0.5), 0 0 24px rgba(6,182,212,0.25)',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    rangeBadge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    id: 'slate',
    iconBg: 'bg-linear-to-br from-slate-500 to-zinc-600',
    progressBar: 'bg-linear-to-r from-slate-500 to-zinc-500',
    progressGlow: '0 0 12px rgba(100,116,139,0.5), 0 0 24px rgba(113,113,122,0.25)',
    badge: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    rangeBadge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
];

/** Determine range badge based on target date */
function getRangeBadge(targetDate?: string): { label: string; key: string } | null {
  if (!targetDate) return null;
  const now = new Date();
  const target = new Date(targetDate);
  const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 90) return { label: 'KISA VADE', key: 'short' };
  if (diffDays <= 365) return { label: 'ORTA VADE', key: 'medium' };
  return { label: 'UZUN VADE', key: 'long' };
}

interface GoalMilestoneCardProps {
  goal: Goal;
  themeIndex: number;
  currency: CurrencyCode;
}

export const GoalMilestoneCard: React.FC<GoalMilestoneCardProps> = ({
  goal,
  themeIndex,
  currency,
}) => {
  const { deleteGoal, addToGoal } = useBudgetStore();
  const dataSync = useDataSyncOptional();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [editName, setEditName] = useState(goal.name);
  const [editTargetAmount, setEditTargetAmount] = useState(goal.targetAmount.toString());
  const [editTargetDate, setEditTargetDate] = useState(goal.targetDate || '');
  const [editIcon, setEditIcon] = useState(goal.icon);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const symbol = getCurrencySymbol(currency);

  const theme = GRADIENT_THEMES[themeIndex % GRADIENT_THEMES.length];
  const progress = Math.min(
    Math.round((goal.currentAmount / goal.targetAmount) * 100),
    100
  );
  const isCompleted = goal.status === 'completed' || progress >= 100;
  const { remaining, daysLeft, dailySavingsNeeded } = calculateSavingsGoal(
    goal.currentAmount,
    goal.targetAmount,
    goal.targetDate
  );
  const rangeBadge = getRangeBadge(goal.targetDate);
  const GoalIcon = getGoalIcon(goal.icon);

  const handleOpenEdit = () => {
    setEditName(goal.name);
    setEditTargetAmount(goal.targetAmount.toString());
    setEditTargetDate(goal.targetDate || '');
    setEditIcon(goal.icon);
    setShowEdit(true);
  };

  const handleSaveEdit = async () => {
    const newTarget = parseFloat(editTargetAmount);
    if (!editName.trim() || !newTarget || newTarget <= 0) return;
    setIsSavingEdit(true);
    try {
      const updateData: { name?: string; targetAmount?: number; icon?: string; targetDate?: Date | null } = {};
      if (editName.trim() !== goal.name) updateData.name = editName.trim();
      if (newTarget !== goal.targetAmount) updateData.targetAmount = newTarget;
      if (editIcon !== goal.icon) updateData.icon = editIcon;
      if (editTargetDate !== (goal.targetDate || '')) {
        updateData.targetDate = editTargetDate ? new Date(editTargetDate) : null;
      }
      if (Object.keys(updateData).length > 0) {
        if (dataSync) {
          await dataSync.updateGoal(goal.id, updateData);
        } else {
          const { updateGoal } = useBudgetStore.getState();
          updateGoal(goal.id, {
            ...updateData,
            targetDate: updateData.targetDate === null ? undefined : updateData.targetDate?.toISOString().split('T')[0],
          });
        }
      }
      setShowEdit(false);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (dataSync) {
      await dataSync.deleteGoal(goal.id);
    } else {
      deleteGoal(goal.id);
    }
    setShowDeleteConfirm(false);
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
    } finally {
      setIsAddingFunds(false);
    }
  };

  return (
    <motion.div
      className="glass-panel rounded-2xl p-5 relative overflow-hidden group transition-all duration-300 hover:border-white/15"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Overlay: Add Funds */}
      {showAddFunds && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-bg-dark/95 backdrop-blur-sm">
          <div className="text-center p-5 w-full max-w-xs">
            <p className="text-sm font-medium text-slate-300 mb-3 font-display">
              Hedefe Birikim Ekle
            </p>
            <input
              type="number"
              value={addAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddAmount(e.target.value)}
              placeholder="Tutar"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 mb-3"
              step="0.01"
              min="0"
              autoFocus
            />
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleAddFunds}
                disabled={!addAmount || parseFloat(addAmount) <= 0 || isAddingFunds}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={14} />
                {isAddingFunds ? 'Ekleniyor...' : 'Ekle'}
              </button>
              <button
                onClick={() => { setShowAddFunds(false); setAddAmount(''); }}
                className="flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/15 active:scale-95"
              >
                <X size={14} />
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay: Edit Goal */}
      {showEdit && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-bg-dark/95 backdrop-blur-sm overflow-y-auto">
          <div className="p-5 w-full max-w-xs space-y-3">
            <p className="text-sm font-semibold text-white mb-3 font-display text-center">Hedefi Düzenle</p>
            <input
              type="text"
              value={editName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(toTitleCase(e.target.value))}
              placeholder="Hedef adı"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              maxLength={50}
            />
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">{symbol}</span>
              <input
                type="number"
                value={editTargetAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTargetAmount(e.target.value)}
                placeholder="Hedef tutar"
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-8 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                step="0.01"
                min="0"
              />
            </div>
            <input
              type="date"
              value={editTargetDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTargetDate(e.target.value)}
              min={getTodayDate()}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
            <div className="grid grid-cols-6 gap-1.5">
              {Object.entries(GOAL_ICON_MAP).map(([label, Icon]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setEditIcon(label)}
                  className={`flex items-center justify-center rounded-lg p-2 transition-all ${
                    editIcon === label
                      ? 'bg-primary/20 border border-primary/40 text-primary'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                  title={label}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={handleSaveEdit}
                disabled={!editName.trim() || !editTargetAmount || parseFloat(editTargetAmount) <= 0 || isSavingEdit}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={14} />
                {isSavingEdit ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button
                onClick={() => setShowEdit(false)}
                className="flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/15 active:scale-95"
              >
                <X size={14} />
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay: Delete Confirm */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-bg-dark/95 backdrop-blur-sm">
          <div className="text-center p-5">
            <p className="text-sm font-medium text-slate-300 mb-3">
              Bu hedefi silmek istediğinize emin misiniz?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-rose-600 active:scale-95"
              >
                <Trash2 size={14} />
                Sil
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/15 active:scale-95"
              >
                <X size={14} />
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header: Icon + Title + Range Badge */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          isCompleted ? 'bg-linear-to-br from-emerald-500 to-teal-600' : theme.iconBg
        } shadow-lg`}>
          <GoalIcon size={22} strokeWidth={1.8} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-semibold text-white truncate font-display">{goal.name}</h3>
            {!isCompleted && (
              <button
                onClick={handleOpenEdit}
                className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-all shrink-0 opacity-0 group-hover:opacity-100"
                aria-label="Hedefi düzenle"
                title="Düzenle"
              >
                <Settings size={13} />
              </button>
            )}
            {isCompleted && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300 uppercase tracking-wider shrink-0">
                <Check size={10} />
                Tamamlandı
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-400 tabular-nums">
              {formatCurrency(goal.currentAmount, currency)}
              <span className="text-slate-600 mx-1">/</span>
              {formatCurrency(goal.targetAmount, currency)}
            </p>
            {rangeBadge && !isCompleted && (
              <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest shrink-0 ${theme.rangeBadge}`}>
                {rangeBadge.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-500">İlerleme</span>
          <span className={`text-xs font-bold tabular-nums px-2 py-0.5 rounded-full border ${
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : theme.badge
          }`}>
            %{progress}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/8">
          <motion.div
            className={`h-full rounded-full ${
              isCompleted
                ? 'bg-linear-to-r from-emerald-400 to-teal-500'
                : theme.progressBar
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ boxShadow: isCompleted
              ? '0 0 12px rgba(16,185,129,0.5), 0 0 24px rgba(16,185,129,0.25)'
              : theme.progressGlow
            }}
          />
        </div>
      </div>

      {/* Stats Row */}
      {!isCompleted && (
        <div className="flex flex-wrap items-center gap-3 min-w-0 mb-4">
          <div className="flex items-center gap-1.5 min-w-0 text-slate-500">
            <Target size={13} className="shrink-0" />
            <span className="text-xs">Kalan:</span>
            <span className="text-xs font-semibold text-slate-300 tabular-nums truncate">
              {formatCurrency(remaining, currency)}
            </span>
          </div>
          {goal.targetDate && daysLeft > 0 && (
            <>
              <div className="h-3 w-px bg-white/10 shrink-0" />
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar size={13} className="shrink-0" />
                <span className="text-xs">{daysLeft} gün</span>
              </div>
              <div className="h-3 w-px bg-white/10 shrink-0" />
              <div className="flex items-center gap-1.5 min-w-0 text-slate-500">
                <TrendingUp size={13} className="shrink-0" />
                <span className="text-xs">Günlük:</span>
                <span className="text-xs font-semibold text-slate-300 tabular-nums truncate">
                  {formatCurrency(dailySavingsNeeded, currency)}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Target Date */}
      {goal.targetDate && !isCompleted && (
        <p className="text-[11px] text-slate-600 mb-3">
          Hedef Tarihi: {formatDate(goal.targetDate)}
        </p>
      )}

      {/* Action Buttons */}
      {!isCompleted && (
        <div className="flex items-center gap-2 pt-2 border-t border-white/6">
          <button
            onClick={() => setShowAddFunds(true)}
            className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:bg-emerald-500/15 hover:text-emerald-400 active:scale-95"
          >
            <Plus size={13} />
            Birikim Ekle
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:bg-rose-500/15 hover:text-rose-400 active:scale-95 ml-auto"
          >
            <Trash2 size={13} />
            Sil
          </button>
        </div>
      )}
    </motion.div>
  );
};
