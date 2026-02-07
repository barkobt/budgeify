'use client';

/**
 * Sign In Page - Dark Theme Edition
 *
 * Crash-proof: renders fallback if Clerk is not available.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { FloatingElement } from '@/components/ui/MotionElements';
import { ArrowLeft } from 'lucide-react';

const clerkAppearance = {
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
};

function ClerkSignInLoader() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [SignInComponent, setSignInComponent] = useState<React.ComponentType<any> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    import('@clerk/nextjs')
      .then((mod) => {
        setSignInComponent(() => mod.SignIn);
      })
      .catch(() => {
        setFailed(true);
      });
  }, []);

  if (failed) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="text-white font-semibold mb-2">Giris yapilamiyor</p>
        <p className="text-slate-400 text-sm mb-4">
          Kimlik dogrulama servisi su an kullanilabilir degil.
        </p>
        <Link
          href="/"
          className="text-accent-400 hover:text-accent-300 text-sm font-medium"
        >
          Ana sayfaya don
        </Link>
      </div>
    );
  }

  if (!SignInComponent) {
    return (
      <div className="glass-card rounded-2xl p-8 flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-400 border-t-transparent" />
      </div>
    );
  }

  return <SignInComponent appearance={clerkAppearance} />;
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden relative" style={{ background: 'linear-gradient(180deg, #050508 0%, #0a0a1a 40%, #0d0d1f 100%)' }}>
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-125 h-125 bg-accent-500/15 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute top-1/3 right-1/4 w-75 h-75 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none"
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
          <ClerkSignInLoader />
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
