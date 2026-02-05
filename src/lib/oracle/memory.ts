/**
 * Oracle AI — Memory Architecture (C-004)
 *
 * Persists generated insights and conversation context
 * in localStorage for continuity across sessions.
 */

import type { Insight } from './insights';

const MEMORY_KEY = 'budgeify-oracle-memory';
const MAX_INSIGHTS = 50;
const MAX_CONVERSATIONS = 20;

interface OracleMemory {
  insights: StoredInsight[];
  lastAnalysis: string | null;
  conversationCount: number;
}

interface StoredInsight {
  insight: Insight;
  shownAt: string;
  dismissed: boolean;
}

function getMemory(): OracleMemory {
  if (typeof window === 'undefined') {
    return { insights: [], lastAnalysis: null, conversationCount: 0 };
  }

  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Corrupted data, reset
  }
  return { insights: [], lastAnalysis: null, conversationCount: 0 };
}

function saveMemory(memory: OracleMemory): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  } catch {
    // Storage full, prune old entries
    memory.insights = memory.insights.slice(-MAX_INSIGHTS / 2);
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  }
}

export function storeInsights(insights: Insight[]): void {
  const memory = getMemory();
  const now = new Date().toISOString();

  for (const insight of insights) {
    // Avoid duplicates (same type + similar content within 24h)
    const isDuplicate = memory.insights.some(
      (stored) =>
        stored.insight.type === insight.type &&
        stored.insight.title === insight.title &&
        new Date(stored.shownAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
    );

    if (!isDuplicate) {
      memory.insights.push({
        insight,
        shownAt: now,
        dismissed: false,
      });
    }
  }

  // Prune old insights
  if (memory.insights.length > MAX_INSIGHTS) {
    memory.insights = memory.insights.slice(-MAX_INSIGHTS);
  }

  memory.lastAnalysis = now;
  saveMemory(memory);
}

export function getLastAnalysisTime(): string | null {
  return getMemory().lastAnalysis;
}

export function incrementConversationCount(): number {
  const memory = getMemory();
  memory.conversationCount = Math.min(memory.conversationCount + 1, MAX_CONVERSATIONS);
  saveMemory(memory);
  return memory.conversationCount;
}

export function getRecentInsights(count: number = 5): Insight[] {
  const memory = getMemory();
  return memory.insights
    .filter((s) => !s.dismissed)
    .slice(-count)
    .map((s) => s.insight);
}
