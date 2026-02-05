'use server';

/**
 * Goal Server Actions
 *
 * 🎓 MENTOR NOTU - Business Logic:
 * --------------------------------
 * Hedefler için özel business logic var:
 * - currentAmount >= targetAmount olunca status = 'completed'
 * - Hedef iptal edilebilir (cancelled)
 * - Günlük tasarruf hesaplaması
 */

import { db } from '@/db';
import { goals, NewGoal, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

/**
 * Helper: Get user ID from Clerk session
 */
async function getUserId(): Promise<string> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user[0]) {
    throw new Error('User not found in database');
  }

  return user[0].id;
}

/**
 * Get All Goals
 */
export async function getGoals() {
  const userId = await getUserId();

  const result = await db
    .select()
    .from(goals)
    .where(eq(goals.userId, userId))
    .orderBy(desc(goals.createdAt));

  return result;
}

/**
 * Get Active Goals
 */
export async function getActiveGoals() {
  const userId = await getUserId();

  const result = await db
    .select()
    .from(goals)
    .where(and(eq(goals.userId, userId), eq(goals.status, 'active')))
    .orderBy(desc(goals.createdAt));

  return result;
}

/**
 * Get Goal by ID
 */
export async function getGoalById(id: string) {
  const userId = await getUserId();

  const result = await db
    .select()
    .from(goals)
    .where(and(eq(goals.id, id), eq(goals.userId, userId)))
    .limit(1);

  return result[0] ?? null;
}

/**
 * Create Goal
 */
export async function createGoal(data: {
  name: string;
  targetAmount: number;
  icon: string;
  targetDate?: Date;
}) {
  const userId = await getUserId();

  const newGoal: NewGoal = {
    userId,
    name: data.name,
    targetAmount: data.targetAmount.toString(),
    currentAmount: '0',
    icon: data.icon,
    targetDate: data.targetDate ?? null,
    status: 'active',
  };

  const [created] = await db.insert(goals).values(newGoal).returning();

  revalidatePath('/dashboard');
  revalidatePath('/goals');

  return created;
}

/**
 * Update Goal
 */
export async function updateGoal(
  id: string,
  data: {
    name?: string;
    targetAmount?: number;
    icon?: string;
    targetDate?: Date | null;
    status?: 'active' | 'completed' | 'cancelled';
  }
) {
  const userId = await getUserId();

  // Verify ownership
  const existing = await db
    .select()
    .from(goals)
    .where(and(eq(goals.id, id), eq(goals.userId, userId)))
    .limit(1);

  if (!existing[0]) {
    throw new Error('Goal not found or unauthorized');
  }

  const updateData: Partial<NewGoal> = {
    updatedAt: new Date(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.targetAmount !== undefined) updateData.targetAmount = data.targetAmount.toString();
  if (data.icon !== undefined) updateData.icon = data.icon;
  if (data.targetDate !== undefined) updateData.targetDate = data.targetDate;
  if (data.status !== undefined) updateData.status = data.status;

  const [updated] = await db
    .update(goals)
    .set(updateData)
    .where(eq(goals.id, id))
    .returning();

  revalidatePath('/dashboard');
  revalidatePath('/goals');

  return updated;
}

/**
 * Add Amount to Goal
 * Hedefe birikim ekle
 */
export async function addToGoal(id: string, amount: number) {
  const userId = await getUserId();

  // Get current goal
  const existing = await db
    .select()
    .from(goals)
    .where(and(eq(goals.id, id), eq(goals.userId, userId)))
    .limit(1);

  if (!existing[0]) {
    throw new Error('Goal not found or unauthorized');
  }

  const currentAmount = parseFloat(existing[0].currentAmount);
  const targetAmount = parseFloat(existing[0].targetAmount);
  const newAmount = currentAmount + amount;

  // Check if goal is completed
  const isCompleted = newAmount >= targetAmount;

  const [updated] = await db
    .update(goals)
    .set({
      currentAmount: newAmount.toString(),
      status: isCompleted ? 'completed' : 'active',
      updatedAt: new Date(),
    })
    .where(eq(goals.id, id))
    .returning();

  revalidatePath('/dashboard');
  revalidatePath('/goals');

  return updated;
}

/**
 * Delete Goal
 */
export async function deleteGoal(id: string) {
  const userId = await getUserId();

  // Verify ownership
  const existing = await db
    .select()
    .from(goals)
    .where(and(eq(goals.id, id), eq(goals.userId, userId)))
    .limit(1);

  if (!existing[0]) {
    throw new Error('Goal not found or unauthorized');
  }

  await db.delete(goals).where(eq(goals.id, id));

  revalidatePath('/dashboard');
  revalidatePath('/goals');

  return { success: true };
}

/**
 * Cancel Goal
 */
export async function cancelGoal(id: string) {
  return updateGoal(id, { status: 'cancelled' });
}

/**
 * Get Goal Progress Statistics
 * Tüm hedeflerin ilerleme istatistikleri
 */
export async function getGoalStatistics() {
  const userId = await getUserId();

  const allGoals = await db
    .select()
    .from(goals)
    .where(eq(goals.userId, userId));

  const activeGoals = allGoals.filter((g) => g.status === 'active');
  const completedGoals = allGoals.filter((g) => g.status === 'completed');

  const totalTarget = activeGoals.reduce(
    (sum, g) => sum + parseFloat(g.targetAmount),
    0
  );
  const totalCurrent = activeGoals.reduce(
    (sum, g) => sum + parseFloat(g.currentAmount),
    0
  );

  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return {
    totalGoals: allGoals.length,
    activeGoals: activeGoals.length,
    completedGoals: completedGoals.length,
    totalTarget,
    totalCurrent,
    overallProgress: Math.round(overallProgress * 100) / 100,
  };
}

/**
 * Calculate Daily Savings Needed
 * Hedefe ulaşmak için günlük ne kadar biriktirmeli
 */
export async function getDailySavingsNeeded(id: string) {
  const userId = await getUserId();

  const goal = await db
    .select()
    .from(goals)
    .where(and(eq(goals.id, id), eq(goals.userId, userId)))
    .limit(1);

  if (!goal[0] || !goal[0].targetDate) {
    return null;
  }

  const remaining = parseFloat(goal[0].targetAmount) - parseFloat(goal[0].currentAmount);
  const targetDate = new Date(goal[0].targetDate);
  const today = new Date();

  const daysRemaining = Math.ceil(
    (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysRemaining <= 0) {
    return null;
  }

  return Math.ceil(remaining / daysRemaining);
}
