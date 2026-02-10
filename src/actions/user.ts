'use server';

/**
 * User Server Actions (v7.0 — Sovereign Pattern)
 *
 * Pattern: Auth → Validate → Execute → Revalidate
 * Returns: ActionResult<T> discriminated union
 * Errors: Turkish user-facing, English server logs
 */

import { db } from '@/db';
import { users, type NewUser } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';
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

const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

// ========================================
// ACTIONS
// ========================================

/**
 * Get or Create User
 * Clerk'ten giriş yapan kullanıcıyı veritabanında bul veya oluştur
 */
export async function getOrCreateUser(): Promise<ActionResult<typeof users.$inferSelect>> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { success: false, error: 'Oturum açmanız gerekiyor' };

  try {
    // Önce mevcut kullanıcıyı ara
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: true, data: existingUser[0] };
    }

    // Kullanıcı yoksa Clerk'ten bilgileri al ve oluştur
    const clerkUser = await currentUser();
    if (!clerkUser) return { success: false, error: 'Clerk kullanıcı bilgisi alınamadı' };

    const newUser: NewUser = {
      clerkId: clerkId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      name: clerkUser.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName ?? ''}`.trim()
        : null,
      imageUrl: clerkUser.imageUrl ?? null,
    };

    const [createdUser] = await db.insert(users).values(newUser).returning();
    return { success: true, data: createdUser };
  } catch (error) {
    console.error('[getOrCreateUser]', { clerkId, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Kullanıcı oluşturulamadı' };
  }
}

/**
 * Get Current User
 * Sadece mevcut kullanıcıyı getir (oluşturma)
 */
export async function getCurrentUser(): Promise<ActionResult<typeof users.$inferSelect | null>> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { success: true, data: null };

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    return { success: true, data: result[0] ?? null };
  } catch (error) {
    console.error('[getCurrentUser]', { clerkId, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Kullanıcı bilgisi alınamadı' };
  }
}

/**
 * Update User Profile
 */
export async function updateUserProfile(data: { name?: string }): Promise<ActionResult<typeof users.$inferSelect>> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { success: false, error: 'Oturum açmanız gerekiyor' };

  // VALIDATE
  const parsed = UpdateProfileSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Geçersiz veri' };

  // EXECUTE
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (!user[0]) return { success: false, error: 'Kullanıcı bulunamadı' };

    const [updatedUser] = await db
      .update(users)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user[0].id))
      .returning();

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error('[updateUserProfile]', { clerkId, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Profil güncellenemedi' };
  }
}
