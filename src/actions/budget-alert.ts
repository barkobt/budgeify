'use server';

/**
 * Budget Alert Server Actions (v8.0 — Sovereign Pattern)
 *
 * Pattern: Auth → Validate → Execute → Revalidate
 * Returns: ActionResult<T> discriminated union
 * Errors: Turkish user-facing, English server logs
 */

import { db } from '@/db';
import { budgetAlerts, type NewBudgetAlert, expenses, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// ========================================
// TYPES
// ========================================

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

interface BudgetAlertCheck {
  alertId: string;
  name: string;
  thresholdAmount: number;
  currentSpending: number;
  isTriggered: boolean;
  percentUsed: number;
}

// ========================================
// ZOD SCHEMAS
// ========================================

const CreateBudgetAlertSchema = z.object({
  name: z.string().min(1, 'Uyarı adı gerekli').max(100),
  thresholdAmount: z.number().positive('Eşik tutarı pozitif olmalı'),
  alertType: z.enum(['below_balance', 'above_spending']),
  period: z.enum(['daily', 'weekly', 'monthly']),
});

const UpdateBudgetAlertSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  thresholdAmount: z.number().positive().optional(),
  alertType: z.enum(['below_balance', 'above_spending']).optional(),
  period: z.enum(['daily', 'weekly', 'monthly']).optional(),
  isActive: z.boolean().optional(),
});

const AlertIdSchema = z.string().uuid('Geçersiz uyarı ID');

export type CreateBudgetAlertInput = z.infer<typeof CreateBudgetAlertSchema>;
export type UpdateBudgetAlertInput = z.infer<typeof UpdateBudgetAlertSchema>;

// ========================================
// AUTH HELPER
// ========================================

async function resolveUserId(): Promise<ActionResult<string>> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { success: false, error: 'Oturum açmanız gerekiyor' };

  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user[0]) return { success: false, error: 'Kullanıcı bulunamadı' };
  return { success: true, data: user[0].id };
}

function revalidateAlertPaths(): void {
  revalidatePath('/dashboard');
  revalidatePath('/calendar');
}

// ========================================
// READ ACTIONS
// ========================================

/**
 * Get All Budget Alerts
 */
export async function getBudgetAlerts(): Promise<ActionResult<(typeof budgetAlerts.$inferSelect)[]>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // EXECUTE
  try {
    const result = await db
      .select()
      .from(budgetAlerts)
      .where(eq(budgetAlerts.userId, userResult.data))
      .orderBy(desc(budgetAlerts.createdAt));

    return { success: true, data: result };
  } catch (error) {
    console.error('[getBudgetAlerts]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Bütçe uyarıları yüklenirken bir hata oluştu' };
  }
}

// ========================================
// WRITE ACTIONS
// ========================================

/**
 * Create Budget Alert
 */
export async function createBudgetAlert(input: CreateBudgetAlertInput): Promise<ActionResult<typeof budgetAlerts.$inferSelect>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const parsed = CreateBudgetAlertSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'Geçersiz veri' };

  // EXECUTE
  try {
    const newAlert: NewBudgetAlert = {
      userId: userResult.data,
      name: parsed.data.name,
      thresholdAmount: parsed.data.thresholdAmount.toString(),
      alertType: parsed.data.alertType,
      period: parsed.data.period,
      isActive: true,
    };

    const [created] = await db.insert(budgetAlerts).values(newAlert).returning();

    // REVALIDATE
    revalidateAlertPaths();
    return { success: true, data: created };
  } catch (error) {
    console.error('[createBudgetAlert]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Bütçe uyarısı eklenirken bir hata oluştu' };
  }
}

/**
 * Update Budget Alert
 */
export async function updateBudgetAlert(id: string, input: UpdateBudgetAlertInput): Promise<ActionResult<typeof budgetAlerts.$inferSelect>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const idParsed = AlertIdSchema.safeParse(id);
  if (!idParsed.success) return { success: false, error: 'Geçersiz uyarı ID' };

  const parsed = UpdateBudgetAlertSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'Geçersiz veri' };

  // EXECUTE
  try {
    // Ownership check
    const existing = await db
      .select()
      .from(budgetAlerts)
      .where(and(eq(budgetAlerts.id, idParsed.data), eq(budgetAlerts.userId, userResult.data)))
      .limit(1);

    if (!existing[0]) return { success: false, error: 'Bütçe uyarısı bulunamadı' };

    const updateData: Partial<NewBudgetAlert> = {};
    if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
    if (parsed.data.thresholdAmount !== undefined) updateData.thresholdAmount = parsed.data.thresholdAmount.toString();
    if (parsed.data.alertType !== undefined) updateData.alertType = parsed.data.alertType;
    if (parsed.data.period !== undefined) updateData.period = parsed.data.period;
    if (parsed.data.isActive !== undefined) updateData.isActive = parsed.data.isActive;

    const [updated] = await db
      .update(budgetAlerts)
      .set(updateData)
      .where(eq(budgetAlerts.id, idParsed.data))
      .returning();

    // REVALIDATE
    revalidateAlertPaths();
    return { success: true, data: updated };
  } catch (error) {
    console.error('[updateBudgetAlert]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Bütçe uyarısı güncellenirken bir hata oluştu' };
  }
}

/**
 * Delete Budget Alert
 */
export async function deleteBudgetAlert(id: string): Promise<ActionResult<{ id: string }>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const idParsed = AlertIdSchema.safeParse(id);
  if (!idParsed.success) return { success: false, error: 'Geçersiz uyarı ID' };

  // EXECUTE
  try {
    // Ownership check
    const existing = await db
      .select()
      .from(budgetAlerts)
      .where(and(eq(budgetAlerts.id, idParsed.data), eq(budgetAlerts.userId, userResult.data)))
      .limit(1);

    if (!existing[0]) return { success: false, error: 'Bütçe uyarısı bulunamadı' };

    await db.delete(budgetAlerts).where(eq(budgetAlerts.id, idParsed.data));

    // REVALIDATE
    revalidateAlertPaths();
    return { success: true, data: { id: idParsed.data } };
  } catch (error) {
    console.error('[deleteBudgetAlert]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Bütçe uyarısı silinirken bir hata oluştu' };
  }
}

// ========================================
// ANALYTICS ACTIONS
// ========================================

/**
 * Check Budget Alerts — evaluate current spending vs thresholds
 */
export async function checkBudgetAlerts(): Promise<ActionResult<BudgetAlertCheck[]>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // EXECUTE
  try {
    const activeAlerts = await db
      .select()
      .from(budgetAlerts)
      .where(and(eq(budgetAlerts.userId, userResult.data), eq(budgetAlerts.isActive, true)));

    if (activeAlerts.length === 0) {
      return { success: true, data: [] };
    }

    const allExpenses = await db
      .select()
      .from(expenses)
      .where(eq(expenses.userId, userResult.data));

    const now = new Date();

    const checks: BudgetAlertCheck[] = activeAlerts.map((alert) => {
      const threshold = parseFloat(alert.thresholdAmount);

      // Filter expenses by period
      const periodExpenses = allExpenses.filter((exp) => {
        const expDate = new Date(exp.date);
        switch (alert.period) {
          case 'daily':
            return (
              expDate.getFullYear() === now.getFullYear() &&
              expDate.getMonth() === now.getMonth() &&
              expDate.getDate() === now.getDate()
            );
          case 'weekly': {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return expDate >= weekAgo && expDate <= now;
          }
          case 'monthly':
            return (
              expDate.getFullYear() === now.getFullYear() &&
              expDate.getMonth() === now.getMonth()
            );
          default:
            return false;
        }
      });

      const currentSpending = periodExpenses.reduce(
        (sum, exp) => sum + parseFloat(exp.amount),
        0
      );

      const isTriggered = alert.alertType === 'above_spending'
        ? currentSpending >= threshold
        : currentSpending <= threshold;

      const percentUsed = threshold > 0
        ? Math.round((currentSpending / threshold) * 100)
        : 0;

      return {
        alertId: alert.id,
        name: alert.name,
        thresholdAmount: threshold,
        currentSpending,
        isTriggered,
        percentUsed,
      };
    });

    return { success: true, data: checks };
  } catch (error) {
    console.error('[checkBudgetAlerts]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Bütçe uyarıları kontrol edilirken bir hata oluştu' };
  }
}
