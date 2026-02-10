/**
 * Vercel Cron — Reminder Notifications (v8.0)
 *
 * Runs daily at 08:00 UTC via Vercel Cron.
 * 1. Queries all active reminders due today or overdue
 * 2. Updates lastTriggered timestamp
 * 3. For recurring reminders, calculates and sets next dueDate
 * 4. Checks budget alerts against current spending
 * 5. Returns JSON summary of triggered notifications
 *
 * Secured with CRON_SECRET env var check.
 */

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { reminders, budgetAlerts, expenses } from '@/db/schema';
import { eq, and, lte, sql } from 'drizzle-orm';

// ========================================
// TYPES
// ========================================

interface TriggeredReminder {
  id: string;
  userId: string;
  title: string;
  type: string;
  amount: string | null;
  dueDate: Date;
  frequency: string;
  action: 'triggered' | 'recurring_advanced';
  nextDueDate?: Date;
}

interface TriggeredBudgetAlert {
  id: string;
  userId: string;
  name: string;
  alertType: string;
  period: string;
  thresholdAmount: number;
  currentSpending: number;
  percentUsed: number;
}

interface CronResult {
  timestamp: string;
  reminders: {
    processed: number;
    triggered: TriggeredReminder[];
  };
  budgetAlerts: {
    processed: number;
    triggered: TriggeredBudgetAlert[];
  };
}

// ========================================
// HELPERS
// ========================================

/**
 * Calculate next due date based on frequency
 */
function calculateNextDueDate(currentDueDate: Date, frequency: string): Date | null {
  const next = new Date(currentDueDate);

  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      return next;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      return next;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      return next;
    default:
      return null;
  }
}

/**
 * Get period start date for budget alert evaluation
 */
function getPeriodStartDate(period: string): Date {
  const now = new Date();

  switch (period) {
    case 'daily':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case 'weekly': {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return weekAgo;
    }
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    default:
      return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}

// ========================================
// CRON HANDLER
// ========================================

export async function GET(request: Request) {
  // AUTH: Verify CRON_SECRET
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const now = new Date();
  const result: CronResult = {
    timestamp: now.toISOString(),
    reminders: { processed: 0, triggered: [] },
    budgetAlerts: { processed: 0, triggered: [] },
  };

  try {
    // ========================================
    // STEP 1: Process Due Reminders
    // ========================================

    // Query all active reminders due today or overdue
    // (dueDate <= now AND isActive = true AND (lastTriggered IS NULL OR lastTriggered < dueDate))
    const dueReminders = await db
      .select()
      .from(reminders)
      .where(
        and(
          eq(reminders.isActive, true),
          lte(reminders.dueDate, now),
          sql`(${reminders.lastTriggered} IS NULL OR ${reminders.lastTriggered} < ${reminders.dueDate})`
        )
      );

    result.reminders.processed = dueReminders.length;

    for (const reminder of dueReminders) {
      const triggered: TriggeredReminder = {
        id: reminder.id,
        userId: reminder.userId,
        title: reminder.title,
        type: reminder.type,
        amount: reminder.amount,
        dueDate: reminder.dueDate,
        frequency: reminder.frequency,
        action: 'triggered',
      };

      if (reminder.frequency === 'once') {
        // One-time reminder: mark as triggered, deactivate
        await db
          .update(reminders)
          .set({
            lastTriggered: now,
            isActive: false,
            updatedAt: now,
          })
          .where(eq(reminders.id, reminder.id));
      } else {
        // Recurring reminder: update lastTriggered and advance dueDate
        const nextDueDate = calculateNextDueDate(reminder.dueDate, reminder.frequency);

        if (nextDueDate) {
          await db
            .update(reminders)
            .set({
              lastTriggered: now,
              dueDate: nextDueDate,
              updatedAt: now,
            })
            .where(eq(reminders.id, reminder.id));

          triggered.action = 'recurring_advanced';
          triggered.nextDueDate = nextDueDate;
        } else {
          // Unknown frequency — just mark triggered
          await db
            .update(reminders)
            .set({
              lastTriggered: now,
              updatedAt: now,
            })
            .where(eq(reminders.id, reminder.id));
        }
      }

      result.reminders.triggered.push(triggered);
    }

    // ========================================
    // STEP 2: Check Budget Alerts
    // ========================================

    const activeAlerts = await db
      .select()
      .from(budgetAlerts)
      .where(eq(budgetAlerts.isActive, true));

    result.budgetAlerts.processed = activeAlerts.length;

    if (activeAlerts.length > 0) {
      // Get unique user IDs from active alerts
      const userIds = [...new Set(activeAlerts.map((a) => a.userId))];

      // For each user, fetch their expenses and evaluate alerts
      for (const userId of userIds) {
        const userAlerts = activeAlerts.filter((a) => a.userId === userId);

        const userExpenses = await db
          .select()
          .from(expenses)
          .where(eq(expenses.userId, userId));

        for (const alert of userAlerts) {
          const periodStart = getPeriodStartDate(alert.period);
          const threshold = parseFloat(alert.thresholdAmount);

          // Filter expenses within the alert's period
          const periodExpenses = userExpenses.filter((exp) => {
            const expDate = new Date(exp.date);
            return expDate >= periodStart && expDate <= now;
          });

          const currentSpending = periodExpenses.reduce(
            (sum, exp) => sum + parseFloat(exp.amount),
            0
          );

          const isTriggered =
            alert.alertType === 'above_spending'
              ? currentSpending >= threshold
              : currentSpending <= threshold;

          if (isTriggered) {
            const percentUsed =
              threshold > 0 ? Math.round((currentSpending / threshold) * 100) : 0;

            // Update lastTriggered
            await db
              .update(budgetAlerts)
              .set({ lastTriggered: now })
              .where(eq(budgetAlerts.id, alert.id));

            result.budgetAlerts.triggered.push({
              id: alert.id,
              userId: alert.userId,
              name: alert.name,
              alertType: alert.alertType,
              period: alert.period,
              thresholdAmount: threshold,
              currentSpending,
              percentUsed,
            });
          }
        }
      }
    }

    // ========================================
    // RESPONSE
    // ========================================

    // eslint-disable-next-line no-console
    console.log(
      `[cron/reminders] Processed ${result.reminders.processed} reminders (${result.reminders.triggered.length} triggered), ` +
      `${result.budgetAlerts.processed} budget alerts (${result.budgetAlerts.triggered.length} triggered)`
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[cron/reminders] Fatal error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal server error', timestamp: now.toISOString() },
      { status: 500 }
    );
  }
}
