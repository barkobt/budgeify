/**
 * Environment Variable Validation Layer
 *
 * Safe access to env vars with fallbacks.
 * Build never crashes due to missing keys.
 */

export const env = {
  // Clerk
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '',
  clerkSecretKey: process.env.CLERK_SECRET_KEY ?? '',

  // Database
  databaseUrl: process.env.DATABASE_URL ?? '',

  // Clerk redirect URLs
  clerkSignInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/sign-in',
  clerkSignUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? '/sign-up',
  clerkAfterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL ?? '/dashboard',
  clerkAfterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL ?? '/dashboard',
  clerkSignInFallbackRedirectUrl:
    process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ??
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL ??
    '/dashboard',
  clerkSignUpFallbackRedirectUrl:
    process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL ??
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL ??
    '/dashboard',

  // Runtime checks
  get isClerkEnabled(): boolean {
    return !!(this.clerkPublishableKey && this.clerkSecretKey);
  },
  get isDatabaseEnabled(): boolean {
    return !!this.databaseUrl;
  },
  get isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  },
} as const;
