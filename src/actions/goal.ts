'use server';

/**
 * Goal Server Actions (v4.0 — Sovereign Pattern)
 *
 * Pattern: Auth → Validate → Execute → Revalidate
 * Returns: ActionResult<T> discriminated union
 * Errors: Turkish user-facing, English server logs
 */

import { db } from '@/db';
import { goals, type NewGoal, users } from '@/db/schema';
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

// ========================================
// ZOD SCHEMAS
// ========================================

const CreateGoalSchema = z.object({
  name: z.string().min(1, 'Hedef adı gerekli').max(100),
  targetAmount: z.number().positive('Hedef tutarı pozitif olmalı'),
  icon: z.string().min(1),
  targetDate: z.coerce.date().optional(),
});

const UpdateGoalSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  targetAmount: z.number().positive().optional(),
  icon: z.string().min(1).optional(),
  targetDate: z.coerce.date().nullable().optional(),
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
});

const AddToGoalSchema = z.object({
  amount: z.number().positive('Birikim tutarı pozitif olmalı'),
});

const GoalIdSchema = z.string().uuid('Geçersiz hedef ID');

export type CreateGoalInput = z.infer<typeof CreateGoalSchema>;
export type UpdateGoalInput = z.infer<typeof UpdateGoalSchema>;

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

function revalidateGoalPaths(): void {
  revalidatePath('/dashboard');
  revalidatePath('/goals');
}

// ========================================
// READ ACTIONS
// ========================================

/**
 * Get All Goals
 */
export async function getGoals(): Promise<ActionResult<typeof goals.$inferSelect[]>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // EXECUTE
  try {
    const result = await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userResult.data))
      .orderBy(desc(goals.createdAt));

    return { success: true, data: result };
  } catch (error) {
    console.error('[getGoals]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Hedefler yüklenirken bir hata oluştu' };
  }
}

/**
 * Get Active Goals
 */
export async function getActiveGoals(): Promise<ActionResult<typeof goals.$inferSelect[]>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // EXECUTE
  try {
    const result = await db
      .select()
      .from(goals)
      .where(and(eq(goals.userId, userResult.data), eq(goals.status, 'active')))
      .orderBy(desc(goals.createdAt));

    return { success: true, data: result };
  } catch (error) {
    console.error('[getActiveGoals]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Aktif hedefler yüklenemedi' };
  }
}

/**
 * Get Goal by ID
 */
export async function getGoalById(id: string): Promise<ActionResult<typeof goals.$inferSelect | null>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const parsed = GoalIdSchema.safeParse(id);
  if (!parsed.success) return { success: false, error: 'Geçersiz hedef ID' };

  // EXECUTE
  try {
    const result = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, parsed.data), eq(goals.userId, userResult.data)))
      .limit(1);

    return { success: true, data: result[0] ?? null };
  } catch (error) {
    console.error('[getGoalById]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Hedef yüklenemedi' };
  }
}

// ========================================
// WRITE ACTIONS
// ========================================

/**
 * Create Goal
 */
export async function createGoal(input: CreateGoalInput): Promise<ActionResult<typeof goals.$inferSelect>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const parsed = CreateGoalSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'Geçersiz veri' };

  // EXECUTE
  try {
    const newGoal: NewGoal = {
      userId: userResult.data,
      name: parsed.data.name,
      targetAmount: parsed.data.targetAmount.toString(),
      currentAmount: '0',
      icon: parsed.data.icon,
      targetDate: parsed.data.targetDate ?? null,
      status: 'active',
    };

    const [created] = await db.insert(goals).values(newGoal).returning();

    // REVALIDATE
    revalidateGoalPaths();
    return { success: true, data: created };
  } catch (error) {
    console.error('[createGoal]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Hedef eklenirken bir hata oluştu' };
  }
}

/**
 * Update Goal
 */
export async function updateGoal(id: string, input: UpdateGoalInput): Promise<ActionResult<typeof goals.$inferSelect>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const idParsed = GoalIdSchema.safeParse(id);
  if (!idParsed.success) return { success: false, error: 'Geçersiz hedef ID' };

  const parsed = UpdateGoalSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'Geçersiz veri' };

  // EXECUTE
  try {
    // Ownership check
    const existing = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, idParsed.data), eq(goals.userId, userResult.data)))
      .limit(1);

    if (!existing[0]) return { success: false, error: 'Hedef bulunamadı' };

    const updateData: Partial<NewGoal> = { updatedAt: new Date() };
    if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
    if (parsed.data.targetAmount !== undefined) updateData.targetAmount = parsed.data.targetAmount.toString();
    if (parsed.data.icon !== undefined) updateData.icon = parsed.data.icon;
    if (parsed.data.targetDate !== undefined) updateData.targetDate = parsed.data.targetDate;
    if (parsed.data.status !== undefined) updateData.status = parsed.data.status;

    const [updated] = await db
      .update(goals)
      .set(updateData)
      .where(eq(goals.id, idParsed.data))
      .returning();

    // REVALIDATE
    revalidateGoalPaths();
    return { success: true, data: updated };
  } catch (error) {
    console.error('[updateGoal]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Hedef güncellenirken bir hata oluştu' };
  }
}

/**
 * Add Amount to Goal (birikim ekle)
 */
export async function addToGoal(id: string, amount: number): Promise<ActionResult<typeof goals.$inferSelect>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const idParsed = GoalIdSchema.safeParse(id);
  if (!idParsed.success) return { success: false, error: 'Geçersiz hedef ID' };

  const amountParsed = AddToGoalSchema.safeParse({ amount });
  if (!amountParsed.success) return { success: false, error: 'Geçersiz tutar' };

  // EXECUTE
  try {
    // Ownership check
    const existing = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, idParsed.data), eq(goals.userId, userResult.data)))
      .limit(1);

    if (!existing[0]) return { success: false, error: 'Hedef bulunamadı' };

    const currentAmount = parseFloat(existing[0].currentAmount);
    const targetAmount = parseFloat(existing[0].targetAmount);
    const newAmount = currentAmount + amountParsed.data.amount;
    const isCompleted = newAmount >= targetAmount;

    const [updated] = await db
      .update(goals)
      .set({
        currentAmount: newAmount.toString(),
        status: isCompleted ? 'completed' : 'active',
        updatedAt: new Date(),
      })
      .where(eq(goals.id, idParsed.data))
      .returning();

    // REVALIDATE
    revalidateGoalPaths();
    return { success: true, data: updated };
  } catch (error) {
    console.error('[addToGoal]', { userId: userResult.data, id, amount, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Birikim eklenirken bir hata oluştu' };
  }
}

/**
 * Delete Goal
 */
export async function deleteGoal(id: string): Promise<ActionResult<{ id: string }>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const idParsed = GoalIdSchema.safeParse(id);
  if (!idParsed.success) return { success: false, error: 'Geçersiz hedef ID' };

  // EXECUTE
  try {
    // Ownership check
    const existing = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, idParsed.data), eq(goals.userId, userResult.data)))
      .limit(1);

    if (!existing[0]) return { success: false, error: 'Hedef bulunamadı' };

    await db.delete(goals).where(eq(goals.id, idParsed.data));

    // REVALIDATE
    revalidateGoalPaths();
    return { success: true, data: { id: idParsed.data } };
  } catch (error) {
    console.error('[deleteGoal]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Hedef silinirken bir hata oluştu' };
  }
}

/**
 * Cancel Goal
 */
export async function cancelGoal(id: string): Promise<ActionResult<typeof goals.$inferSelect>> {
  return updateGoal(id, { status: 'cancelled' });
}

// ========================================
// ANALYTICS ACTIONS
// ========================================

interface GoalStatistics {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalTarget: number;
  totalCurrent: number;
  overallProgress: number;
}

/**
 * Get Goal Progress Statistics
 */
export async function getGoalStatistics(): Promise<ActionResult<GoalStatistics>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // EXECUTE
  try {
    const allGoals = await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userResult.data));

    const active = allGoals.filter((g) => g.status === 'active');
    const completed = allGoals.filter((g) => g.status === 'completed');

    const totalTarget = active.reduce((sum, g) => sum + parseFloat(g.targetAmount), 0);
    const totalCurrent = active.reduce((sum, g) => sum + parseFloat(g.currentAmount), 0);
    const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

    return {
      success: true,
      data: {
        totalGoals: allGoals.length,
        activeGoals: active.length,
        completedGoals: completed.length,
        totalTarget,
        totalCurrent,
        overallProgress: Math.round(overallProgress * 100) / 100,
      },
    };
  } catch (error) {
    console.error('[getGoalStatistics]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'İstatistikler yüklenemedi' };
  }
}

/**
 * Calculate Daily Savings Needed
 */
export async function getDailySavingsNeeded(id: string): Promise<ActionResult<number | null>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const idParsed = GoalIdSchema.safeParse(id);
  if (!idParsed.success) return { success: false, error: 'Geçersiz hedef ID' };

  // EXECUTE
  try {
    const goal = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, idParsed.data), eq(goals.userId, userResult.data)))
      .limit(1);

    if (!goal[0] || !goal[0].targetDate) {
      return { success: true, data: null };
    }

    const remaining = parseFloat(goal[0].targetAmount) - parseFloat(goal[0].currentAmount);
    const targetDate = new Date(goal[0].targetDate);
    const today = new Date();
    const daysRemaining = Math.ceil(
      (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining <= 0) return { success: true, data: null };

    return { success: true, data: Math.ceil(remaining / daysRemaining) };
  } catch (error) {
    console.error('[getDailySavingsNeeded]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Hesaplama yapılamadı' };
  }
}
