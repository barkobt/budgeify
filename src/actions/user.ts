'use server';

/**
 * User Server Actions
 *
 * 🎓 MENTOR NOTU - Server Actions:
 * --------------------------------
 * Server Actions, Next.js 14'ün en güçlü özelliklerinden biri.
 * Client'tan direkt server fonksiyonları çağırabilirsin.
 *
 * Avantajları:
 * 1. API route yazmaya gerek yok
 * 2. Type-safe (TypeScript full support)
 * 3. Otomatik revalidation
 * 4. Progressive enhancement (JS olmadan da çalışır)
 */

import { db } from '@/db';
import { users, NewUser } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * Get or Create User
 * Clerk'ten giriş yapan kullanıcıyı veritabanında bul veya oluştur
 */
export async function getOrCreateUser() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error('Unauthorized: No user session found');
  }

  // Önce mevcut kullanıcıyı ara
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (existingUser.length > 0) {
    return existingUser[0];
  }

  // Kullanıcı yoksa Clerk'ten bilgileri al ve oluştur
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error('Could not fetch user from Clerk');
  }

  const newUser: NewUser = {
    clerkId: clerkId,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
    name: clerkUser.firstName
      ? `${clerkUser.firstName} ${clerkUser.lastName ?? ''}`.trim()
      : null,
    imageUrl: clerkUser.imageUrl ?? null,
  };

  const [createdUser] = await db.insert(users).values(newUser).returning();

  return createdUser;
}

/**
 * Get Current User
 * Sadece mevcut kullanıcıyı getir (oluşturma)
 */
export async function getCurrentUser() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return null;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  return result[0] ?? null;
}

/**
 * Update User Profile
 */
export async function updateUserProfile(data: { name?: string }) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user[0]) {
    throw new Error('User not found');
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user[0].id))
    .returning();

  return updatedUser;
}
