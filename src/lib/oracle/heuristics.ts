/**
 * Oracle AI — Financial Heuristics Engine (C-002)
 *
 * Pure, deterministic computation functions.
 * All numbers come from here — never from an LLM.
 */

import type { Expense, Category, Goal } from '@/types';
import type { FinancialSnapshot } from './data-access';

// ========================================
// CATEGORY ANALYSIS
// ========================================

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  color: string;
  total: number;
  count: number;
  percentage: number;
}

export function getCategoryBreakdown(
  expenses: Expense[],
  categories: Category[]
): CategoryBreakdown[] {
  const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);
  if (totalSpend === 0) return [];

  const map = new Map<string, { total: number; count: number }>();

  for (const e of expenses) {
    const key = e.categoryId;
    const existing = map.get(key) ?? { total: 0, count: 0 };
    existing.total += e.amount;
    existing.count += 1;
    map.set(key, existing);
  }

  return Array.from(map.entries())
    .map(([categoryId, { total, count }]) => {
      const cat = categories.find((c) => c.id === categoryId);
      return {
        categoryId,
        categoryName: cat?.name ?? 'Diger',
        color: cat?.color ?? '#6B7280',
        total,
        count,
        percentage: Math.round((total / totalSpend) * 100),
      };
    })
    .sort((a, b) => b.total - a.total);
}

export function getDominantCategory(
  expenses: Expense[],
  categories: Category[]
): CategoryBreakdown | null {
  const breakdown = getCategoryBreakdown(expenses, categories);
  return breakdown[0] ?? null;
}

// ========================================
// SPENDING TRENDS
// ========================================

export interface SpendingTrend {
  currentTotal: number;
  previousTotal: number;
  changePercent: number;
  direction: 'up' | 'down' | 'stable';
}

export function getSpendingTrend(
  currentMonthExpenses: Expense[],
  previousMonthExpenses: Expense[]
): SpendingTrend {
  const currentTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const previousTotal = previousMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  if (previousTotal === 0) {
    return { currentTotal, previousTotal, changePercent: 0, direction: 'stable' };
  }

  const changePercent = Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
  const direction = changePercent > 5 ? 'up' : changePercent < -5 ? 'down' : 'stable';

  return { currentTotal, previousTotal, changePercent, direction };
}

// ========================================
// ANOMALY DETECTION
// ========================================

export interface Anomaly {
  type: 'spike' | 'unusual_category' | 'large_transaction';
  description: string;
  amount: number;
  severity: 'low' | 'medium' | 'high';
}

export function detectAnomalies(snapshot: FinancialSnapshot): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const { currentMonthExpenses, previousMonthExpenses, categories } = snapshot;

  // Large single transactions (> 30% of monthly income)
  const monthlyIncome = snapshot.totalIncome;
  if (monthlyIncome > 0) {
    for (const e of currentMonthExpenses) {
      if (e.amount > monthlyIncome * 0.3) {
        const cat = categories.find((c) => c.id === e.categoryId);
        anomalies.push({
          type: 'large_transaction',
          description: `${cat?.name ?? 'Diger'} kategorisinde buyuk harcama`,
          amount: e.amount,
          severity: e.amount > monthlyIncome * 0.5 ? 'high' : 'medium',
        });
      }
    }
  }

  // Category spend spike (> 50% increase vs last month)
  const currentBreakdown = getCategoryBreakdown(currentMonthExpenses, categories);
  const previousBreakdown = getCategoryBreakdown(previousMonthExpenses, categories);

  for (const current of currentBreakdown) {
    const previous = previousBreakdown.find((p) => p.categoryId === current.categoryId);
    if (previous && previous.total > 0) {
      const increase = ((current.total - previous.total) / previous.total) * 100;
      if (increase > 50) {
        anomalies.push({
          type: 'spike',
          description: `${current.categoryName} harcamalari gecen aya gore %${Math.round(increase)} artti`,
          amount: current.total - previous.total,
          severity: increase > 100 ? 'high' : 'medium',
        });
      }
    }
  }

  return anomalies;
}

// ========================================
// BUDGET HEALTH SCORE
// ========================================

export interface HealthScore {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  factors: HealthFactor[];
}

interface HealthFactor {
  name: string;
  score: number;
  weight: number;
  detail: string;
}

export function calculateHealthScore(snapshot: FinancialSnapshot): HealthScore {
  const factors: HealthFactor[] = [];

  // Factor 1: Savings Rate (weight: 30)
  const savingsRate = snapshot.savingsRate;
  const savingsScore = Math.min(100, Math.max(0, savingsRate * 5)); // 20% = 100
  factors.push({
    name: 'Tasarruf Orani',
    score: savingsScore,
    weight: 30,
    detail: `%${savingsRate} tasarruf orani`,
  });

  // Factor 2: Spending Control (weight: 25)
  const trend = getSpendingTrend(snapshot.currentMonthExpenses, snapshot.previousMonthExpenses);
  const controlScore = trend.direction === 'down' ? 100 : trend.direction === 'stable' ? 70 : Math.max(0, 70 - trend.changePercent);
  factors.push({
    name: 'Harcama Kontrolu',
    score: controlScore,
    weight: 25,
    detail: trend.direction === 'down'
      ? `Harcamalar %${Math.abs(trend.changePercent)} azaldi`
      : trend.direction === 'stable'
      ? 'Harcamalar sabit'
      : `Harcamalar %${trend.changePercent} artti`,
  });

  // Factor 3: Goal Progress (weight: 20)
  const activeGoals = snapshot.activeGoals;
  let goalScore = 50; // default if no goals
  if (activeGoals.length > 0) {
    const avgProgress = activeGoals.reduce((sum, g) => {
      const progress = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
      return sum + Math.min(100, progress);
    }, 0) / activeGoals.length;
    goalScore = avgProgress;
  }
  factors.push({
    name: 'Hedef Ilerlemesi',
    score: goalScore,
    weight: 20,
    detail: activeGoals.length > 0
      ? `${activeGoals.length} aktif hedef`
      : 'Henuz hedef belirlenmemis',
  });

  // Factor 4: Diversification (weight: 15)
  const breakdown = getCategoryBreakdown(snapshot.currentMonthExpenses, snapshot.categories);
  const topCategoryPercent = breakdown[0]?.percentage ?? 0;
  const diversityScore = topCategoryPercent > 60 ? 30 : topCategoryPercent > 40 ? 60 : 90;
  factors.push({
    name: 'Harcama Cesitliligi',
    score: diversityScore,
    weight: 15,
    detail: breakdown[0]
      ? `En buyuk kategori: ${breakdown[0].categoryName} (%${breakdown[0].percentage})`
      : 'Harcama verisi yok',
  });

  // Factor 5: Data Quality (weight: 10)
  const dataScore = Math.min(100, snapshot.dataAvailability.expenseCount * 5);
  factors.push({
    name: 'Veri Kalitesi',
    score: dataScore,
    weight: 10,
    detail: `${snapshot.dataAvailability.expenseCount} harcama kaydedildi`,
  });

  // Weighted average
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const weightedScore = factors.reduce((sum, f) => sum + (f.score * f.weight), 0) / totalWeight;
  const score = Math.round(weightedScore);

  const grade: HealthScore['grade'] =
    score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : score >= 20 ? 'D' : 'F';

  return { score, grade, factors };
}

// ========================================
// GOAL ANALYSIS
// ========================================

export interface GoalInsight {
  goal: Goal;
  progressPercent: number;
  daysRemaining: number | null;
  dailySavingsNeeded: number | null;
  onTrack: boolean | null;
}

export function analyzeGoals(goals: Goal[]): GoalInsight[] {
  const now = new Date();

  return goals
    .filter((g) => g.status === 'active')
    .map((goal) => {
      const progressPercent = goal.targetAmount > 0
        ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
        : 0;

      let daysRemaining: number | null = null;
      let dailySavingsNeeded: number | null = null;
      let onTrack: boolean | null = null;

      if (goal.targetDate) {
        const targetDate = new Date(goal.targetDate);
        daysRemaining = Math.max(0, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

        const remaining = goal.targetAmount - goal.currentAmount;
        if (daysRemaining > 0 && remaining > 0) {
          dailySavingsNeeded = Math.ceil(remaining / daysRemaining);
        }

        // Check if on track based on elapsed time vs progress
        const totalDays = Math.ceil((targetDate.getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        const elapsedDays = totalDays - daysRemaining;
        const expectedProgress = totalDays > 0 ? (elapsedDays / totalDays) * 100 : 0;
        onTrack = progressPercent >= expectedProgress * 0.8; // 80% of expected is still on track
      }

      return { goal, progressPercent, daysRemaining, dailySavingsNeeded, onTrack };
    });
}
