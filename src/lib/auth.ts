/**
 * Budgeify v2.0 - Authentication Utilities
 *
 * 🎓 MENTOR NOTU - Auth Abstraction Layer:
 * ----------------------------------------
 * Bu dosya, Clerk auth işlemlerini soyutlar (abstract).
 *
 * Neden soyutlama?
 * 1. Tek noktadan yönetim: Tüm auth işlemleri burada
 * 2. Değiştirilebilirlik: Clerk yerine başka sistem kullanılabilir
 * 3. Test edilebilirlik: Mock auth için tek nokta
 * 4. Type safety: Clerk tiplerini uygulama tiplemesine dönüştürür
 */

import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * Get current user ID (server-side)
 *
 * 🎓 MENTOR NOTU:
 * Bu fonksiyon sadece Server Components ve Server Actions'da kullanılır.
 * Client components'ta useUser() hook'u kullanılır.
 */
export async function getAuthUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * Get current user details (server-side)
 */
export async function getAuthUser() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? null,
    name: user.firstName
      ? `${user.firstName} ${user.lastName ?? ''}`.trim()
      : null,
    imageUrl: user.imageUrl,
  };
}

/**
 * Require authentication (server-side)
 * Throws error if not authenticated
 *
 * 🎓 MENTOR NOTU:
 * Bu pattern'e "Guard" denir. Server action veya API route'un
 * başında çağrılarak unauthorized erişim engellenir.
 *
 * Kullanım:
 * ```
 * export async function createExpense(data) {
 *   const userId = await requireAuth(); // Hata fırlatır veya userId döner
 *   // ... devam
 * }
 * ```
 */
export async function requireAuth(): Promise<string> {
  const userId = await getAuthUserId();

  if (!userId) {
    throw new Error('Unauthorized: Please sign in to continue');
  }

  return userId;
}

/**
 * Check if Clerk is configured
 *
 * 🎓 MENTOR NOTU:
 * Development ortamında Clerk credentials olmayabilir.
 * Bu fonksiyon, uygulamanın credentials olmadan da çalışmasını sağlar.
 */
export function isClerkConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY
  );
}
