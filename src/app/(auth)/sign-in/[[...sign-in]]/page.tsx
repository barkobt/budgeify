'use client';

/**
 * Sign In Page - Dark Theme Edition
 *
 * 🎓 MENTOR NOTU:
 * Auth sayfaları, uygulamanın "kapısı"dır.
 * İlk izlenim burada oluşur - premium olmalı.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { GlowButton, FloatingElement } from '@/components/ui/MotionElements';
import { Lock, ArrowLeft, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cosmic-900 via-cosmic-800 to-cosmic-700 px-4 py-12 overflow-hidden relative">
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-500/15 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Floating decorative elements */}
      <FloatingElement
        className="absolute top-20 right-20 opacity-20 hidden lg:block"
        duration={5}
        distance={15}
      >
        <div className="w-16 h-16 rounded-2xl ai-gradient" />
      </FloatingElement>
      <FloatingElement
        className="absolute bottom-20 left-20 opacity-15 hidden lg:block"
        duration={6}
        distance={12}
      >
        <div className="w-12 h-12 rounded-full bg-violet-500" />
      </FloatingElement>

      <div className="w-full max-w-md relative z-10">
        {/* Logo with animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <Logo size="md" showText={true} className="justify-center mb-4" />
          <p className="text-slate-400">Finansal özgürlüğüne hoş geldin</p>
        </motion.div>

        {/* Sign In Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {ClerkSignIn ? (
            <ClerkSignIn
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'glass-card rounded-2xl border-0 shadow-2xl shadow-black/30 !bg-white/[0.03]',
                  headerTitle: 'text-white text-xl font-semibold',
                  headerSubtitle: 'text-slate-400',
                  socialButtonsBlockButton:
                    'glass-subtle hover:!bg-white/10 text-white border-white/10 rounded-xl transition-all duration-300',
                  socialButtonsBlockButtonText: 'font-medium text-white',
                  dividerLine: 'bg-white/10',
                  dividerText: 'text-slate-500',
                  formFieldLabel: 'text-slate-300 font-medium',
                  formFieldInput:
                    '!bg-white/5 border-white/10 text-white rounded-xl focus:border-accent-500 focus:ring-accent-500/20 placeholder:text-slate-500',
                  formFieldInputShowPasswordButton: 'text-slate-400 hover:text-white',
                  formButtonPrimary:
                    'ai-gradient hover:opacity-90 rounded-xl font-semibold h-12 text-base shadow-lg shadow-accent-500/20',
                  footerActionLink: 'text-accent-400 hover:text-accent-300',
                  footer: 'hidden',
                  identityPreviewEditButton: 'text-accent-400 hover:text-accent-300',
                  formFieldAction: 'text-accent-400 hover:text-accent-300',
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
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient mx-auto mb-6"
              >
                <Lock size={32} className="text-white" />
              </motion.div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Authentication Kurulumu
              </h2>
              <p className="text-slate-400 mb-6 text-sm">
                Clerk credentials <code className="text-accent-400 bg-white/5 px-1.5 py-0.5 rounded">.env.local</code> dosyasına eklenmeli.
              </p>
              <Link href="/dashboard">
                <GlowButton
                  className="w-full py-3 ai-gradient text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                  glowColor="rgba(59, 130, 246, 0.5)"
                >
                  <Sparkles size={18} />
                  Demo Dashboard
                </GlowButton>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Back to home */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Ana sayfaya dön
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
