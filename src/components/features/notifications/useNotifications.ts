'use client';

/**
 * useNotifications — v7.1 Client-side Notification Engine
 *
 * Reads from useBudgetStore and generates computed notifications:
 * - BudgetOverspend: monthly expenses > 80% of monthly income
 * - GoalBehind: goal pace < 50% of expected
 * - GoalCompleted: completed goals
 * - LowBalance: net balance < 0
 *
 * No server persistence — purely client-side computed.
 */

import { useMemo } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';

export interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
}

export function useNotifications(): { notifications: Notification[]; unreadCount: number } {
  const incomes = useBudgetStore((s) => s.incomes);
  const expenses = useBudgetStore((s) => s.expenses);
  const goals = useBudgetStore((s) => s.goals);

  const notifications = useMemo(() => {
    const items: Notification[] = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Monthly totals
    const monthlyIncome = incomes
      .filter((i) => {
        const d = new Date(i.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, i) => sum + i.amount, 0);

    const monthlyExpense = expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    // BudgetOverspend: expenses > 80% of income
    if (monthlyIncome > 0 && monthlyExpense > monthlyIncome * 0.8) {
      const pct = Math.round((monthlyExpense / monthlyIncome) * 100);
      items.push({
        id: 'budget-overspend',
        type: 'warning',
        title: 'Bütçe Uyarısı',
        message: `Bu ay gelirin %${pct}'ini harcadınız. Dikkatli olun!`,
        timestamp: now.toISOString(),
      });
    }

    // LowBalance: net < 0
    const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
    if (totalIncome > 0 && totalExpense > totalIncome) {
      items.push({
        id: 'low-balance',
        type: 'warning',
        title: 'Negatif Bakiye',
        message: 'Toplam harcamalarınız gelirlerinizi aştı.',
        timestamp: now.toISOString(),
      });
    }

    // Goal analysis
    goals.forEach((goal) => {
      // GoalCompleted
      if (goal.status === 'completed' || goal.currentAmount >= goal.targetAmount) {
        items.push({
          id: `goal-completed-${goal.id}`,
          type: 'success',
          title: 'Hedef Tamamlandı!',
          message: `"${goal.name}" hedefinize ulaştınız. Tebrikler!`,
          timestamp: now.toISOString(),
        });
        return;
      }

      // GoalBehind: pace < 50% of expected
      if (goal.targetDate && goal.status === 'active') {
        const created = new Date(goal.createdAt);
        const target = new Date(goal.targetDate);
        const totalDays = Math.max((target.getTime() - created.getTime()) / (1000 * 60 * 60 * 24), 1);
        const elapsedDays = Math.max((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24), 0);
        const expectedProgress = Math.min(elapsedDays / totalDays, 1);
        const actualProgress = goal.currentAmount / goal.targetAmount;

        if (expectedProgress > 0.2 && actualProgress < expectedProgress * 0.5) {
          items.push({
            id: `goal-behind-${goal.id}`,
            type: 'warning',
            title: 'Hedef Geride',
            message: `"${goal.name}" hedefinde beklenen temponun gerisinde kalıyorsunuz.`,
            timestamp: now.toISOString(),
          });
        }
      }
    });

    // Info: if no notifications, add a positive one
    if (items.length === 0 && (incomes.length > 0 || expenses.length > 0)) {
      items.push({
        id: 'all-good',
        type: 'info',
        title: 'Her Şey Yolunda',
        message: 'Finansal durumunuz sağlıklı görünüyor.',
        timestamp: now.toISOString(),
      });
    }

    return items;
  }, [incomes, expenses, goals]);

  const unreadCount = notifications.filter((n) => n.type === 'warning').length;

  return { notifications, unreadCount };
}
