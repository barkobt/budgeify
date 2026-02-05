/**
 * Oracle AI — Main Entry Point (C-006)
 *
 * Hybrid architecture:
 * - Heuristics engine for all calculations (deterministic)
 * - Optional LLM layer for natural language (if API key exists)
 * - Falls back to template-based text if no LLM
 *
 * The LLM never generates numbers. All financial data
 * comes from the heuristics engine.
 */

export { getFinancialSnapshot } from './data-access';
export type { FinancialSnapshot, DataAvailability } from './data-access';

export {
  getCategoryBreakdown,
  getSpendingTrend,
  detectAnomalies,
  calculateHealthScore,
  analyzeGoals,
} from './heuristics';
export type {
  CategoryBreakdown,
  SpendingTrend,
  Anomaly,
  HealthScore,
  GoalInsight,
} from './heuristics';

export { generateInsights, answerQuery } from './insights';
export type { Insight } from './insights';

export { estimateConfidence } from './confidence';
export type { ConfidenceLevel, ConfidenceEstimate } from './confidence';

export { storeInsights, getRecentInsights, getLastAnalysisTime } from './memory';
