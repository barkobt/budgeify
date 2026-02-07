'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import {
  getFinancialSnapshot,
  generateInsights,
  calculateHealthScore,
  type Insight,
  type HealthScore,
} from '@/lib/oracle';

/** Map insight type to visual style */
const TYPE_STYLES: Record<string, { bg: string; text: string; icon: typeof TrendingUp }> = {
  anomaly: { bg: 'bg-rose-500/15', text: 'text-rose-400', icon: AlertTriangle },
  health: { bg: 'bg-amber-500/15', text: 'text-amber-400', icon: Shield },
  trend: { bg: 'bg-accent-500/15', text: 'text-accent-400', icon: TrendingUp },
  summary: { bg: 'bg-accent-500/15', text: 'text-accent-400', icon: TrendingUp },
  goal: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', icon: TrendingUp },
  tip: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', icon: Sparkles },
};

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-rose-400';
}

function getScoreRingColor(score: number): string {
  if (score >= 80) return 'stroke-emerald-400';
  if (score >= 60) return 'stroke-amber-400';
  return 'stroke-rose-400';
}

/**
 * OracleInsightCard — Dashboard surface for Oracle AI insights
 *
 * Shows health score + top insight without opening the full chat.
 */
export function OracleInsightCard() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [health, setHealth] = useState<HealthScore | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const snapshot = getFinancialSnapshot();
    const generated = generateInsights(snapshot);
    setInsights(generated.slice(0, 3));

    if (snapshot.dataAvailability.hasExpenses || snapshot.dataAvailability.hasIncomes) {
      setHealth(calculateHealthScore(snapshot));
    }
  }, []);

  // Rotate insights every 5 seconds
  useEffect(() => {
    if (insights.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % insights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [insights.length]);

  const hasData = insights.length > 0;
  const currentInsight = insights[activeIndex];

  if (!hasData && !health) {
    return (
      <div className="rounded-2xl glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl ai-gradient">
            <Sparkles size={18} className="text-white" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-200">Oracle AI</p>
            <p className="text-xs text-slate-500">Veri ekleyin, analiz başlayacak</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass-card p-5 space-y-4">
      {/* Header row with health score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl ai-gradient shadow-lg shadow-accent-500/20">
            <Sparkles size={18} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">Oracle AI</p>
            <p className="text-xs text-slate-500">{insights.length} analiz hazir</p>
          </div>
        </div>

        {/* Health Score Ring */}
        {health && (
          <div className="relative flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
              <circle
                cx="24" cy="24" r="20"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="3"
              />
              <circle
                cx="24" cy="24" r="20"
                fill="none"
                className={getScoreRingColor(health.score)}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(health.score / 100) * 125.6} 125.6`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-sm font-black tabular-nums ${getScoreColor(health.score)}`}>
                {health.score}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Rotating insight */}
      {currentInsight && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="flex items-start gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {(() => {
              const insightType = currentInsight.type || 'summary';
              const style = TYPE_STYLES[insightType] || TYPE_STYLES.summary;
              const Icon = style.icon;
              return (
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.bg}`}>
                  <Icon size={14} className={style.text} strokeWidth={2} />
                </div>
              );
            })()}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-300">{currentInsight.title}</p>
              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{currentInsight.content}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Insight dots */}
      {insights.length > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {insights.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-4 bg-accent-400' : 'w-1 bg-white/15'
              }`}
              aria-label={`Analiz ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Health breakdown — compact */}
      {health && (
        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          <Shield size={12} className="text-slate-500" strokeWidth={2} />
          <p className="text-[11px] text-slate-500 flex-1">
            Bütçe Sağlığı: <span className={`font-semibold ${getScoreColor(health.score)}`}>Derece {health.grade}</span>
          </p>
          <ChevronRight size={12} className="text-slate-600" />
        </div>
      )}
    </div>
  );
}

export default OracleInsightCard;
