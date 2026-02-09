'use client';

/**
 * GoalsPage — v6.0 M5 Desktop Goals Full-Page
 *
 * Stitch 3 milestones + goals fusion for desktop (lg+):
 * - Header: "Finansal Hedefler" gradient title + "Yeni Hedef Oluştur" CTA
 * - Stats summary bar: Total Saved | Pending Savings | Goals Completed (3-col KPI)
 * - Goals grid (md:2col, xl:3col) with GoalMilestoneCard
 * - "Add New Goal" dashed placeholder card
 *
 * Data: useBudgetStore.goals
 * Mobile: GoalForm + GoalList preserved in DashboardClient
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatCurrency } from '@/utils';
import { GoalMilestoneCard } from './GoalMilestoneCard';
import {
  Target,
  TrendingUp,
  CheckCircle2,
  Plus,
  X,
} from 'lucide-react';

/** KPI stat card for the summary bar */
function KPIStat({
  icon: Icon,
  label,
  value,
  iconColor,
  iconBg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="glass-panel rounded-xl p-4 flex items-center gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon size={20} strokeWidth={1.8} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 mb-0.5">{label}</p>
        <p className="text-lg font-bold text-white tabular-nums truncate">{value}</p>
      </div>
    </div>
  );
}

/** Inline Goal Form — appears when "Yeni Hedef Oluştur" is clicked */
function InlineGoalForm({ onClose }: { onClose: () => void }) {
  const GoalFormDynamic = React.lazy(
    () => import('@/components/features/goals/GoalForm').then((mod) => ({ default: mod.GoalForm }))
  );

  return (
    <motion.div
      className="glass-panel rounded-2xl p-6 relative"
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, mass: 1 }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
        aria-label="Formu kapat"
      >
        <X size={16} />
      </button>
      <React.Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 rounded-full border-2 border-white/10 border-t-primary animate-spin" />
        </div>
      }>
        <GoalFormDynamic onSuccess={onClose} />
      </React.Suspense>
    </motion.div>
  );
}

export function GoalsPage() {
  const goals = useBudgetStore((s) => s.goals);
  const getActiveGoals = useBudgetStore((s) => s.getActiveGoals);
  const getCompletedGoals = useBudgetStore((s) => s.getCompletedGoals);
  const currency = useBudgetStore((s) => s.currency);

  const [showForm, setShowForm] = useState(false);

  const activeGoals = getActiveGoals();
  const completedGoals = getCompletedGoals();
  const allGoals = [...activeGoals, ...completedGoals];

  // KPI calculations
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const pendingSavings = activeGoals.reduce((sum, g) => sum + Math.max(g.targetAmount - g.currentAmount, 0), 0);
  const completedCount = completedGoals.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-semibold text-primary uppercase tracking-wider">
              <Target size={12} />
              Hedef Takibi
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Finansal{' '}
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Hedefler
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tasarruf hedeflerinizi oluşturun, takip edin ve başarıya ulaşın.
          </p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 active:scale-95 shadow-[0_0_24px_rgba(124,58,237,0.2)]"
        >
          <Plus size={16} />
          Yeni Hedef Oluştur
        </button>
      </div>

      {/* Inline Goal Form — toggled */}
      <AnimatePresence>
        {showForm && <InlineGoalForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <KPIStat
          icon={TrendingUp}
          label="Toplam Birikim"
          value={formatCurrency(totalSaved, currency)}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/15"
        />
        <KPIStat
          icon={Target}
          label="Bekleyen Tasarruf"
          value={formatCurrency(pendingSavings, currency)}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/15"
        />
        <KPIStat
          icon={CheckCircle2}
          label="Tamamlanan"
          value={`${completedCount} hedef`}
          iconColor="text-primary"
          iconBg="bg-primary/15"
        />
      </div>

      {/* Goals Grid */}
      {allGoals.length === 0 && !showForm ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
            <Target size={32} className="text-slate-500" />
          </div>
          <p className="text-lg font-semibold text-white font-display mb-2">Henüz hedef eklenmemiş</p>
          <p className="text-sm text-slate-500 mb-6">
            İlk tasarruf hedefinizi oluşturarak finansal yolculuğunuza başlayın.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 active:scale-95"
          >
            <Plus size={16} />
            Hedef Oluştur
          </button>
        </div>
      ) : (
        <>
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <h2 className="text-sm font-semibold text-slate-400">
                  Aktif Hedefler ({activeGoals.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {activeGoals.map((goal, index) => (
                  <GoalMilestoneCard
                    key={goal.id}
                    goal={goal}
                    themeIndex={index}
                    currency={currency}
                  />
                ))}

                {/* Add New Goal — Dashed Placeholder Card */}
                <motion.button
                  onClick={() => setShowForm(true)}
                  className="glass-panel rounded-2xl p-5 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 min-h-50 transition-all hover:border-primary/30 hover:bg-primary/5 group cursor-pointer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 * activeGoals.length }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 group-hover:bg-primary/15 transition-colors">
                    <Plus size={24} className="text-slate-500 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-slate-500 group-hover:text-slate-300 transition-colors">
                    Yeni Hedef Ekle
                  </span>
                </motion.button>
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <h2 className="text-sm font-semibold text-slate-400">
                  Tamamlanan Hedefler ({completedGoals.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {completedGoals.map((goal, index) => (
                  <GoalMilestoneCard
                    key={goal.id}
                    goal={goal}
                    themeIndex={index + activeGoals.length}
                    currency={currency}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
