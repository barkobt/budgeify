'use client';

/**
 * OracleBrainCard — Oracle AI v2.0 (M7)
 *
 * Dynamic 1×1 Brain widget for the Bento dashboard.
 * Shows real-time health score with animated ring + top insight preview.
 * Compact "Control Center" aesthetic — no padding waste.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import {
  getFinancialSnapshot,
  generateInsights,
  calculateHealthScore,
  type Insight,
  type HealthScore,
} from '@/lib/oracle';

function getScoreColor(score: number): string {
  if (score >= 80) return '#10B981';
  if (score >= 60) return '#F59E0B';
  return '#F43F5E';
}

function getScoreTextClass(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-rose-400';
}

export function OracleBrainCard() {
  const [health, setHealth] = useState<HealthScore | null>(null);
  const [topInsight, setTopInsight] = useState<Insight | null>(null);

  useEffect(() => {
    const snapshot = getFinancialSnapshot();
    const insights = generateInsights(snapshot);
    if (insights.length > 0) setTopInsight(insights[0]);

    if (snapshot.dataAvailability.hasExpenses || snapshot.dataAvailability.hasIncomes) {
      setHealth(calculateHealthScore(snapshot));
    }
  }, []);

  const score = health?.score ?? 0;
  const circumference = 2 * Math.PI * 18;
  const strokeDash = (score / 100) * circumference;

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg ai-gradient">
          <Brain size={14} className="text-white" strokeWidth={2} />
        </div>

        {health && (
          <div className="relative flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
              <circle
                cx="20" cy="20" r="18"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2.5"
              />
              <motion.circle
                cx="20" cy="20" r="18"
                fill="none"
                stroke={getScoreColor(score)}
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${strokeDash} ${circumference}` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              />
            </svg>
            <span className={`absolute text-[10px] font-black tabular-nums ${getScoreTextClass(score)}`}>
              {score}
            </span>
          </div>
        )}
      </div>

      <div className="mt-auto">
        {topInsight ? (
          <>
            <p className="text-[11px] font-semibold text-slate-200 line-clamp-1">
              {topInsight.title}
            </p>
            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
              {topInsight.content}
            </p>
          </>
        ) : (
          <>
            <p className="text-[11px] font-semibold text-slate-200">Oracle AI</p>
            <p className="text-[10px] text-slate-500">Veri bekliyor</p>
          </>
        )}
      </div>
    </div>
  );
}

export default OracleBrainCard;
