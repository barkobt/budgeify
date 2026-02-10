'use client';

/**
 * DesktopAICard — v6.0 M3 Desktop AI Assistant Preview
 *
 * Stitch 3 inspired inline AI assistant card for desktop dashboard:
 * - Oracle Brain health score ring
 * - Spending velocity + Goal pace metrics
 * - "AI Asistanı Aç" CTA that dispatches oracle:open-assistant
 * - Glass panel styling
 */

import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, Target, MessageCircle } from 'lucide-react';
import { useBudgetStore } from '@/store/useBudgetStore';
import {
  getFinancialSnapshot,
  calculateHealthScore,
  getSpendingTrend,
  analyzeGoals,
  type HealthScore,
} from '@/lib/oracle';

function getScoreColor(score: number): string {
  if (score >= 80) return '#10B981';
  if (score >= 60) return '#F59E0B';
  return '#F43F5E';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Mükemmel';
  if (score >= 60) return 'İyi';
  if (score >= 40) return 'Orta';
  return 'Dikkat';
}

export const DesktopAICard: React.FC = () => {
  // Subscribe to store slices so we recalculate when data changes
  const incomes = useBudgetStore((s) => s.incomes);
  const expenses = useBudgetStore((s) => s.expenses);
  const goals = useBudgetStore((s) => s.goals);

  const { health, velocityLabel, goalLabel } = useMemo(() => {
    const snapshot = getFinancialSnapshot();

    let computedHealth: HealthScore | null = null;
    let computedVelocity = 'Veri bekleniyor';
    let computedGoal = 'Hedef belirlenmemiş';

    if (snapshot.dataAvailability.hasExpenses || snapshot.dataAvailability.hasIncomes) {
      computedHealth = calculateHealthScore(snapshot);
    }

    // Spending velocity
    if (snapshot.dataAvailability.hasExpenses) {
      const trend = getSpendingTrend(snapshot.currentMonthExpenses, snapshot.previousMonthExpenses);
      if (trend.previousTotal > 0) {
        if (trend.direction === 'up') {
          computedVelocity = `Harcama %${trend.changePercent} arttı`;
        } else if (trend.direction === 'down') {
          computedVelocity = `Harcama %${Math.abs(trend.changePercent)} azaldı`;
        } else {
          computedVelocity = 'Harcama hızı sabit';
        }
      } else {
        computedVelocity = 'İlk ay verisi toplanıyor';
      }
    }

    // Goal pace
    const goalInsights = analyzeGoals(snapshot.goals);
    if (goalInsights.length > 0) {
      const closest = goalInsights.reduce((best, gi) =>
        gi.progressPercent > best.progressPercent ? gi : best, goalInsights[0]);
      const remaining = 100 - closest.progressPercent;
      if (remaining <= 0) {
        computedGoal = `${closest.goal.name} tamamlandı!`;
      } else {
        computedGoal = `${closest.goal.name}: %${remaining} kaldı`;
      }
    }

    return { health: computedHealth, velocityLabel: computedVelocity, goalLabel: computedGoal };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: subscribe to store slices for reactivity
  }, [incomes, expenses, goals]);

  const handleOpenAssistant = useCallback(() => {
    window.dispatchEvent(new CustomEvent('oracle:open-assistant'));
  }, []);

  const score = health?.score ?? 0;
  const circumference = 2 * Math.PI * 28;
  const strokeDash = (score / 100) * circumference;

  return (
    <div className="glass-panel rounded-2xl p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg ai-gradient">
          <Brain size={16} className="text-white" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-sm font-semibold font-display text-white">Oracle AI</h3>
          <p className="text-[10px] text-slate-500">Finansal Asistan</p>
        </div>
        <Sparkles size={14} className="text-accent-purple ml-auto" />
      </div>

      {/* Health Score Ring — centered */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="relative flex items-center justify-center">
          <svg width="72" height="72" viewBox="0 0 64 64" className="-rotate-90">
            <circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="4"
            />
            <motion.circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke={getScoreColor(score)}
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${strokeDash} ${circumference}` }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-lg font-black tabular-nums text-white">{score}</span>
            <span className="text-[8px] text-slate-500 uppercase tracking-wider">Skor</span>
          </div>
        </div>

        <p className="text-xs font-semibold" style={{ color: getScoreColor(score) }}>
          {getScoreLabel(score)}
        </p>
      </div>

      {/* Metrics */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 rounded-lg bg-white/3 px-3 py-2">
          <TrendingUp size={12} className="text-accent-purple shrink-0" />
          <p className="text-[11px] text-slate-300 truncate">{velocityLabel}</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/3 px-3 py-2">
          <Target size={12} className="text-secondary shrink-0" />
          <p className="text-[11px] text-slate-300 truncate">{goalLabel}</p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleOpenAssistant}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/15 border border-primary/25 text-sm font-semibold text-accent-purple hover:bg-primary/25 transition-all"
      >
        <MessageCircle size={14} />
        AI Asistanı Aç
      </button>
    </div>
  );
};

export default DesktopAICard;
