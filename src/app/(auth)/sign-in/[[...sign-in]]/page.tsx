'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { env } from '@/lib/env';
import { PiggyBank, Loader2 } from 'lucide-react';

const clerkAppearance = {
  elements: {
    rootBox: 'w-full',
    card: '!bg-[#0e0e14]/80 !border !border-white/10 !rounded-2xl !shadow-2xl !shadow-black/40 !backdrop-blur-xl',
    headerTitle: '!text-white !text-xl !font-bold',
    headerSubtitle: '!text-slate-400 !text-sm',
    socialButtonsBlockButton:
      'btn-social !rounded-xl !transition-all !duration-200',
    socialButtonsBlockButtonText: '!font-medium !text-white/80',
    dividerLine: '!bg-white/10',
    dividerText: '!text-slate-500 !text-xs !uppercase !tracking-widest',
    formFieldLabel:
      '!text-[10px] !font-medium !uppercase !tracking-[0.2em] !text-slate-400',
    formFieldInput:
      'neon-input !rounded-xl !px-4 !py-3 !text-sm',
    formFieldInputShowPasswordButton: '!text-slate-400 hover:!text-white',
    formButtonPrimary:
      'btn-portal-gradient !rounded-xl !font-bold !h-12 !text-sm !uppercase !tracking-widest !w-full !border-0',
    footerActionLink: '!text-cyan-400 hover:!text-cyan-300',
    footer: '!hidden',
    identityPreviewEditButton: '!text-cyan-400 hover:!text-cyan-300',
    formFieldAction: '!text-cyan-400 hover:!text-cyan-300 !text-[10px] !uppercase !tracking-widest',
    formHeaderTitle: '!text-white !text-xl !font-bold',
    formHeaderSubtitle: '!text-slate-400',
    otpCodeFieldInput: 'neon-input !rounded-lg !text-white',
    alertText: '!text-slate-300 !text-sm',
  },
  variables: {
    colorPrimary: '#7C3AED',
    colorBackground: 'transparent',
    colorText: '#E2E8F0',
    colorTextSecondary: '#94A3B8',
    borderRadius: '0.75rem',
    colorInputBackground: 'rgba(255,255,255,0.03)',
    colorInputText: '#E2E8F0',
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
      <div className="rounded-2xl p-8 text-center bg-[#0e0e14]/80 border border-white/10">
        <p className="text-white font-semibold mb-2">Giriş yapılamıyor</p>
        <p className="text-slate-400 text-sm mb-4">
          Kimlik doğrulama servisi şu an kullanılabilir değil.
        </p>
        <Link
          href="/"
          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
        >
          Ana sayfaya dön
        </Link>
      </div>
    );
  }

  if (!SignInComponent) {
    return (
      <div className="rounded-2xl p-12 flex flex-col items-center justify-center gap-4 bg-[#0e0e14]/80 border border-white/10">
        <Loader2 size={32} className="text-purple-500 animate-spin" />
        <p className="text-xs text-slate-500">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <SignInComponent
      appearance={clerkAppearance}
      fallbackRedirectUrl={env.clerkSignInFallbackRedirectUrl}
    />
  );
}

export default function SignInPage() {
  return (
    <div className="w-full">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-3">
          <div className="relative">
            <PiggyBank size={64} className="text-primary-glow" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 12px rgba(157,0,255,0.4))' }} />
          </div>
        </div>
        <Logo size="md" showText={true} className="justify-center mb-2" href="/" />
        <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-purple-400">
          Güvenli Giriş
        </p>
      </div>

      <p className="text-center mb-3 text-[11px] text-slate-500">
        Sosyal giriş seçenekleri etkinse Google ve GitHub ile giriş yapabilirsiniz.
      </p>

      {/* Clerk Sign In */}
      <ClerkSignInLoader />

      {/* Auth helper text */}
      <p className="text-center mt-4 text-[11px] text-slate-600 leading-relaxed max-w-xs mx-auto">
        Kod sık geliyorsa, şifre ile giriş veya sosyal giriş seçeneklerini kullanabilirsiniz.
      </p>

      {/* Footer link */}
      <p className="text-center mt-4 text-sm text-slate-500">
        Hesabın yok mu?{' '}
        <Link
          href="/sign-up"
          className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
        >
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
}
