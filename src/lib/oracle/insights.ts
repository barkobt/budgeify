/**
 * Oracle AI — Insight Generation (C-003)
 *
 * Combines heuristics with Turkish-language templates
 * to produce readable financial insights.
 */

import type { FinancialSnapshot } from './data-access';
import {
  getCategoryBreakdown,
  getSpendingTrend,
  detectAnomalies,
  calculateHealthScore,
  analyzeGoals,
} from './heuristics';
import { estimateConfidence, type ConfidenceLevel } from './confidence';
import { formatCurrencyCompact } from '@/utils';

export interface Insight {
  id: string;
  type: 'summary' | 'trend' | 'anomaly' | 'health' | 'goal' | 'tip';
  title: string;
  content: string;
  confidence: ConfidenceLevel;
  priority: number; // 1-10, higher = more important
  createdAt: string;
}

const formatCurrency = (amount: number) => formatCurrencyCompact(amount, 'TRY');

export function generateInsights(snapshot: FinancialSnapshot): Insight[] {
  const insights: Insight[] = [];
  const now = new Date().toISOString();
  let id = 0;

  const nextId = () => `insight_${++id}`;

  // ========================================
  // MONTHLY SUMMARY
  // ========================================
  if (snapshot.dataAvailability.hasExpenses || snapshot.dataAvailability.hasIncomes) {
    const conf = estimateConfidence(snapshot.dataAvailability, 'summary');
    insights.push({
      id: nextId(),
      type: 'summary',
      title: 'Aylik Ozet',
      content: `Toplam geliriniz ${formatCurrency(snapshot.totalIncome)}, toplam harcamaniz ${formatCurrency(snapshot.totalExpenses)}. ` +
        `Bakiyeniz ${formatCurrency(snapshot.balance)}. ` +
        (snapshot.savingsRate > 0
          ? `Tasarruf oraniniz %${snapshot.savingsRate}.`
          : 'Bu ay tasarruf yapilmadi.'),
      confidence: conf.level,
      priority: 8,
      createdAt: now,
    });
  }

  // ========================================
  // SPENDING TREND
  // ========================================
  if (snapshot.dataAvailability.hasExpenses && snapshot.dataAvailability.dataSpanDays > 7) {
    const trend = getSpendingTrend(snapshot.currentMonthExpenses, snapshot.previousMonthExpenses);
    const conf = estimateConfidence(snapshot.dataAvailability, 'trend');

    if (trend.previousTotal > 0) {
      const trendText = trend.direction === 'up'
        ? `Bu ay harcamalariniz gecen aya gore %${trend.changePercent} artti (${formatCurrency(trend.currentTotal)} vs ${formatCurrency(trend.previousTotal)}).`
        : trend.direction === 'down'
        ? `Bu ay harcamalariniz gecen aya gore %${Math.abs(trend.changePercent)} azaldi. Harika!`
        : `Harcamalariniz gecen aya gore sabit kaldi.`;

      insights.push({
        id: nextId(),
        type: 'trend',
        title: 'Harcama Trendi',
        content: trendText,
        confidence: conf.level,
        priority: trend.direction === 'up' ? 7 : 5,
        createdAt: now,
      });
    }
  }

  // ========================================
  // CATEGORY DOMINANCE
  // ========================================
  if (snapshot.currentMonthExpenses.length >= 3) {
    const breakdown = getCategoryBreakdown(snapshot.currentMonthExpenses, snapshot.categories);
    if (breakdown.length > 0 && breakdown[0].percentage > 30) {
      insights.push({
        id: nextId(),
        type: 'trend',
        title: 'En Buyuk Harcama',
        content: `Bu ayin en buyuk harcama kalemi: ${breakdown[0].categoryName} (${formatCurrency(breakdown[0].total)}, %${breakdown[0].percentage}). ` +
          (breakdown[1] ? `Ikinci sirada ${breakdown[1].categoryName} (${formatCurrency(breakdown[1].total)}).` : ''),
        confidence: 'high',
        priority: 6,
        createdAt: now,
      });
    }
  }

  // ========================================
  // ANOMALIES
  // ========================================
  const anomalies = detectAnomalies(snapshot);
  for (const anomaly of anomalies.slice(0, 3)) {
    const conf = estimateConfidence(snapshot.dataAvailability, 'anomaly');
    insights.push({
      id: nextId(),
      type: 'anomaly',
      title: 'Dikkat',
      content: anomaly.description + ` (${formatCurrency(anomaly.amount)})`,
      confidence: conf.level,
      priority: anomaly.severity === 'high' ? 9 : anomaly.severity === 'medium' ? 7 : 5,
      createdAt: now,
    });
  }

  // ========================================
  // HEALTH SCORE
  // ========================================
  if (snapshot.dataAvailability.hasExpenses) {
    const health = calculateHealthScore(snapshot);
    const conf = estimateConfidence(snapshot.dataAvailability, 'health');
    insights.push({
      id: nextId(),
      type: 'health',
      title: 'Butce Sagligi',
      content: `Butce saglik puaniniz: ${health.score}/100 (${health.grade}). ` +
        health.factors
          .filter((f) => f.score < 50)
          .map((f) => f.detail)
          .join('. ') +
        (health.score >= 70 ? ' Finansal durumunuz iyi gorunuyor!' : ''),
      confidence: conf.level,
      priority: 8,
      createdAt: now,
    });
  }

  // ========================================
  // GOAL INSIGHTS
  // ========================================
  const goalInsights = analyzeGoals(snapshot.goals);
  for (const gi of goalInsights) {
    const conf = estimateConfidence(snapshot.dataAvailability, 'goal');
    let content = `"${gi.goal.name}" hedefi: %${gi.progressPercent} tamamlandi.`;

    if (gi.daysRemaining !== null && gi.daysRemaining > 0) {
      content += ` ${gi.daysRemaining} gun kaldi.`;
      if (gi.dailySavingsNeeded !== null) {
        content += ` Gunluk ${formatCurrency(gi.dailySavingsNeeded)} biriktirmeniz gerekiyor.`;
      }
      if (gi.onTrack === false) {
        content += ' Hedefinizin gerisinde kaliyor olabilirsiniz.';
      }
    }

    insights.push({
      id: nextId(),
      type: 'goal',
      title: 'Hedef Durumu',
      content,
      confidence: conf.level,
      priority: gi.onTrack === false ? 7 : 5,
      createdAt: now,
    });
  }

  // ========================================
  // TIPS (always available)
  // ========================================
  if (!snapshot.dataAvailability.hasExpenses) {
    insights.push({
      id: nextId(),
      type: 'tip',
      title: 'Ipucu',
      content: 'Harcamalarinizi kaydetmeye baslayin! Ne kadar cok veri olursa, analizlerim o kadar dogru olur.',
      confidence: 'high',
      priority: 6,
      createdAt: now,
    });
  }

  if (snapshot.savingsRate < 10 && snapshot.totalIncome > 0) {
    insights.push({
      id: nextId(),
      type: 'tip',
      title: 'Tasarruf Onerisi',
      content: 'Gelirinizin en az %20\'sini biriktirmeyi hedefleyin. 50/30/20 kurali iyi bir baslangic noktasidir.',
      confidence: 'high',
      priority: 6,
      createdAt: now,
    });
  }

  // Sort by priority (highest first)
  return insights.sort((a, b) => b.priority - a.priority);
}

// ========================================
// QUERY RESPONSE (for chat)
// ========================================

export function answerQuery(query: string, snapshot: FinancialSnapshot): string {
  const lower = query.toLowerCase();

  if (lower.includes('harcad') || lower.includes('harcama') || lower.includes('gider')) {
    const total = snapshot.currentMonthExpenses.reduce((s, e) => s + e.amount, 0);
    const breakdown = getCategoryBreakdown(snapshot.currentMonthExpenses, snapshot.categories);
    const top3 = breakdown.slice(0, 3);

    if (total === 0) {
      return 'Bu ay henuz harcama kaydiniz bulunmuyor. Harcamalarinizi kaydetmeye baslayin!';
    }

    let response = `Bu ay toplam ${formatCurrency(total)} harcadiniz.\n\n`;
    response += 'En buyuk harcama kalemleri:\n';
    for (const cat of top3) {
      response += `- ${cat.categoryName}: ${formatCurrency(cat.total)} (%${cat.percentage})\n`;
    }
    return response;
  }

  if (lower.includes('tasarruf') || lower.includes('biriktir')) {
    if (snapshot.totalIncome === 0) {
      return 'Gelirinizi kaydederek baslayin. Boylece tasarruf oraninizi hesaplayabilirim.';
    }

    const rate = snapshot.savingsRate;
    let response = `Tasarruf oraniniz: %${rate}.\n\n`;

    if (rate >= 20) {
      response += 'Harika! %20 ve uzerinde tasarruf yapiyorsunuz. Bu orani korumaya devam edin.';
    } else if (rate > 0) {
      response += `Hedefiniz en az %20 olmali. Ayda ${formatCurrency(snapshot.totalIncome * 0.2 - (snapshot.totalIncome - snapshot.totalExpenses))} daha biriktirmeniz gerekiyor.`;
    } else {
      response += 'Bu ay tasarruf yapilmamis. Kucuk adimlarla baslayin:\n';
      response += '1. Gereksiz abonelikleri iptal edin\n';
      response += '2. Kahve/atistirmalik harcamalarini azaltin\n';
      response += '3. Otomatik tasarruf kurun';
    }
    return response;
  }

  if (lower.includes('hedef') || lower.includes('yakin')) {
    const goalInsights = analyzeGoals(snapshot.goals);
    if (goalInsights.length === 0) {
      return 'Henuz aktif hedefiniz yok. Hedefler sekmesinden yeni bir tasarruf hedefi olusturabilirsiniz.';
    }

    let response = `${goalInsights.length} aktif hedefiniz var:\n\n`;
    for (const gi of goalInsights) {
      response += `- ${gi.goal.name}: %${gi.progressPercent}`;
      if (gi.daysRemaining !== null) response += ` (${gi.daysRemaining} gun kaldi)`;
      response += '\n';
    }
    return response;
  }

  if (lower.includes('saglik') || lower.includes('puan') || lower.includes('skor')) {
    const health = calculateHealthScore(snapshot);
    let response = `Butce saglik puaniniz: ${health.score}/100 (${health.grade})\n\n`;
    response += 'Detaylar:\n';
    for (const f of health.factors) {
      response += `- ${f.name}: ${Math.round(f.score)}/100 — ${f.detail}\n`;
    }
    return response;
  }

  // Default: return summary + tips
  const insights = generateInsights(snapshot);
  if (insights.length === 0) {
    return 'Verilerinizi kaydetmeye baslayin! Gelir ve giderlerinizi ekledikce size daha iyi yardimci olabilirim.';
  }

  return insights.slice(0, 3).map((i) => `${i.title}: ${i.content}`).join('\n\n');
}
