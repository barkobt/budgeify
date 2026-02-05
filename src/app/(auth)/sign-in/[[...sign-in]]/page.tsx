/**
 * Sign In Page
 *
 * 🎓 MENTOR NOTU - Clerk Sign-In:
 * ------------------------------
 * Clerk, hazır authentication UI bileşenleri sağlar.
 * <SignIn /> component'i:
 * - Email/password login
 * - Social login (Google, GitHub, vb.)
 * - Magic link
 * - Şifre sıfırlama
 *
 * [[...sign-in]] → Catch-all route (Next.js)
 * Clerk'in internal route'ları için gerekli:
 * /sign-in
 * /sign-in/factor-one
 * /sign-in/sso-callback
 * vb.
 */

import Link from 'next/link';

// Check if Clerk is configured
const isClerkConfigured = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

// Dynamically import SignIn only if Clerk is configured
const ClerkSignIn = isClerkConfigured
  ? require('@clerk/nextjs').SignIn
  : null;

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cosmic-900 to-cosmic-800 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Budgeify</h1>
          <p className="text-slate-400">Finansal özgürlüğüne hoş geldin</p>
        </div>

        {/* Clerk Sign In Component or Setup Message */}
        {ClerkSignIn ? (
          <ClerkSignIn
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'glass-card rounded-2xl border-0 shadow-xl',
                headerTitle: 'text-white text-xl font-semibold',
                headerSubtitle: 'text-slate-400',
                socialButtonsBlockButton:
                  'glass-subtle hover:glass-elevated text-white border-white/10 rounded-xl transition-all',
                socialButtonsBlockButtonText: 'font-medium',
                dividerLine: 'bg-white/10',
                dividerText: 'text-slate-500',
                formFieldLabel: 'text-slate-300 font-medium',
                formFieldInput:
                  'glass-elevated border-white/10 text-white rounded-xl focus:border-accent-500 focus:ring-accent-500/20',
                formFieldInputShowPasswordButton: 'text-slate-400 hover:text-white',
                formButtonPrimary:
                  'ai-gradient hover:opacity-90 rounded-xl font-semibold h-12 text-base',
                footerActionLink: 'text-accent-400 hover:text-accent-300',
                footer: 'hidden',
              },
              variables: {
                colorPrimary: '#3B82F6',
                colorBackground: 'transparent',
                colorText: '#E2E8F0',
                colorTextSecondary: '#94A3B8',
                borderRadius: '1rem',
              },
            }}
          />
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Authentication Kurulumu Gerekli
            </h2>
            <p className="text-slate-400 mb-6">
              Clerk credentials henüz yapılandırılmamış.
              <br />
              <code className="text-accent-400">.env.local</code> dosyasına ekleyin.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 ai-gradient text-white font-semibold rounded-xl"
            >
              Demo Dashboard&apos;a Git →
            </Link>
          </div>
        )}

        {/* Back to home */}
        <p className="text-center mt-6 text-slate-500 text-sm">
          <Link href="/" className="hover:text-white transition-colors">
            ← Ana sayfaya dön
          </Link>
        </p>
      </div>
    </div>
  );
}
