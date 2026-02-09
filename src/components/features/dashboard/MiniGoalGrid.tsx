'use client';

/**
 * MiniGoalGrid — v6.0 M3 Desktop Savings Goals Grid
 *
 * Stitch 3 inspired 2×2 mini goal cards for desktop dashboard:
 * - SVG progress ring per goal
 * - Goal name + current/target amounts
 * - Gradient themes per goal
 * - "Hedefleri Gör" (View Goals) link
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowRight } from 'lucide-react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatCurrencyCompact } from '@/utils';

interface MiniGoalGridProps {
  onViewAll: () => void;
}

const GOAL_THEMES = [
  { ring: '#7C3AED', bg: 'rgba(124, 58, 237, 0.12)', text: 'text-violet-400' },
  { ring: '#06B6D4', bg: 'rgba(6, 182, 212, 0.12)', text: 'text-cyan-400' },
  { ring: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', text: 'text-emerald-400' },
  { ring: '#F97316', bg: 'rgba(249, 115, 22, 0.12)', text: 'text-orange-400' },
];

export const MiniGoalGrid: React.FC<MiniGoalGridProps> = ({ onViewAll }) => {
  const goals = useBudgetStore((s) => s.goals);
  const currency = useBudgetStore((s) => s.currency);

  const activeGoals = useMemo(() => {
    return goals.filter((g) => g.status === 'active').slice(0, 4);
  }, [goals]);

  const circumference = 2 * Math.PI * 20;

  return (
    <div className="glass-panel rounded-2xl p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold font-display text-white">Tasarruf Hedefleri</h3>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-medium text-secondary hover:text-accent-cyan transition-colors"
        >
          Tümünü Gör
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Goal Cards Grid */}
      <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
        {activeGoals.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
              <Target size={18} className="text-slate-600" />
            </div>
            <p className="text-xs text-slate-600">Henüz hedef yok</p>
          </div>
        ) : (
          activeGoals.map((goal, idx) => {
            const theme = GOAL_THEMES[idx % GOAL_THEMES.length];
            const progress = goal.targetAmount > 0
              ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
              : 0;
            const strokeDash = (progress / 100) * circumference;

            return (
              <motion.div
                key={goal.id}
                className="rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 border border-white/5 hover:border-white/10 transition-all"
                style={{ backgroundColor: theme.bg }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* SVG Progress Ring */}
                <div className="relative flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
                    <circle
                      cx="24" cy="24" r="20"
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="3"
                    />
                    <motion.circle
                      cx="24" cy="24" r="20"
                      fill="none"
                      stroke={theme.ring}
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: `0 ${circumference}` }}
                      animate={{ strokeDasharray: `${strokeDash} ${circumference}` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 + idx * 0.1 }}
                    />
                  </svg>
                  <span className={`absolute text-[10px] font-bold tabular-nums ${theme.text}`}>
                    %{Math.round(progress)}
                  </span>
                </div>

                {/* Goal Info */}
                <p className="text-[11px] font-medium text-slate-200 truncate max-w-full text-center">
                  {goal.name}
                </p>
                <p className="text-[10px] text-slate-500 tabular-nums">
                  {formatCurrencyCompact(goal.currentAmount, currency)} / {formatCurrencyCompact(goal.targetAmount, currency)}
                </p>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MiniGoalGrid;
