/**
 * Oracle AI — Confidence Estimation (C-005)
 *
 * Assigns confidence levels to insights based on data availability.
 */

import type { DataAvailability } from './data-access';

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'insufficient';

export interface ConfidenceEstimate {
  level: ConfidenceLevel;
  score: number; // 0-100
  reason: string;
}

export function estimateConfidence(
  availability: DataAvailability,
  insightType: 'trend' | 'anomaly' | 'health' | 'goal' | 'summary'
): ConfidenceEstimate {
  const { expenseCount, incomeCount, dataSpanDays } = availability;

  // Base score from data volume
  let baseScore = Math.min(100, expenseCount * 3 + incomeCount * 10);

  // Adjust by insight type
  switch (insightType) {
    case 'trend':
      // Trends need at least 2 months of data
      if (dataSpanDays < 30) baseScore = Math.min(baseScore, 20);
      else if (dataSpanDays < 60) baseScore = Math.min(baseScore, 50);
      break;

    case 'anomaly':
      // Anomalies need enough baseline
      if (expenseCount < 10) baseScore = Math.min(baseScore, 30);
      break;

    case 'health':
      // Health score improves with more data
      if (expenseCount < 5) baseScore = Math.min(baseScore, 40);
      break;

    case 'goal':
      // Goals just need goal data
      if (!availability.hasGoals) baseScore = 0;
      break;

    case 'summary':
      // Summary is always reasonable
      baseScore = Math.max(baseScore, 30);
      break;
  }

  const level: ConfidenceLevel =
    baseScore >= 70 ? 'high' :
    baseScore >= 40 ? 'medium' :
    baseScore >= 15 ? 'low' :
    'insufficient';

  const reason =
    level === 'high' ? 'Yeterli veri mevcut' :
    level === 'medium' ? 'Daha fazla veri ile dogruluk artacak' :
    level === 'low' ? 'Sinirli veri ile tahmin yapildi' :
    'Analiz icin yeterli veri yok';

  return { level, score: baseScore, reason };
}
