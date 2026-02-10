'use client';

/**
 * LandingClient — P8 Performance Refactor
 *
 * Extracted from page.tsx to enable server component wrapper with
 * proper metadata exports (title, description, OpenGraph).
 * All interactive/animated content lives here.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import {
  FadeInSection,
  FadeInDiv,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  HeroText,
} from '@/components/ui/MotionElements';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Play,
  TrendingUp,
  Brain,
  ShieldCheck,
  Wifi,
  CreditCard,
  LayoutDashboard,
  Github,
  Twitter,
  Linkedin,
  Activity,
  Sparkles,
  Check,
  Users,
  Code2,
  Heart,
} from 'lucide-react';

/* ========================================
   AUTH-AWARE NAVIGATION
   ======================================== */

function LandingAuthNav() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [authHook, setAuthHook] = useState<(() => { isSignedIn?: boolean }) | null>(null);
  const [clerkFailed, setClerkFailed] = useState(false);

  useEffect(() => {
    import('@clerk/nextjs')
      .then((clerk) => setAuthHook(() => clerk.useAuth))
      .catch(() => setClerkFailed(true));
  }, []);

  if (clerkFailed || !authHook) return <GuestNavButtons />;
  return <AuthAwareButtons useAuth={authHook} />;
}

function AuthAwareButtons({ useAuth }: { useAuth: () => { isSignedIn?: boolean } }) {
  let isSignedIn: boolean | undefined;
  try {
    const auth = useAuth();
    isSignedIn = auth.isSignedIn;
  } catch {
    isSignedIn = undefined;
  }

  if (isSignedIn === true) {
    return (
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white btn-portal-gradient rounded-full uppercase tracking-wider"
      >
        <LayoutDashboard size={16} />
        Dashboard
      </Link>
    );
  }

  return <GuestNavButtons />;
}

function GuestNavButtons() {
  return (
    <>
      <Link
        href="/sign-in"
        className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
      >
        Log In
      </Link>
      <Link
        href="/sign-up"
        className="px-5 py-2.5 text-sm font-bold text-white btn-portal-gradient rounded-full uppercase tracking-wider btn-glow-purple"
      >
        Start Free
      </Link>
    </>
  );
}

/* ========================================
   MOUSE FOLLOW GRADIENT
   ======================================== */

function MouseFollowGradient() {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (ref.current) {
      ref.current.style.setProperty('--mouse-x', `${e.clientX}px`);
      ref.current.style.setProperty('--mouse-y', `${e.clientY}px`);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none z-0 opacity-30"
      style={{
        background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(157, 0, 255, 0.08), rgba(13, 166, 242, 0.04), transparent 60%)',
      }}
    />
  );
}

/* ========================================
   3D CREDIT CARD VISUAL
   ======================================== */

function CreditCardVisual() {
  return (
    <motion.div
      className="relative w-[320px] h-[200px] sm:w-[380px] sm:h-[240px]"
      initial={{ opacity: 0, rotateY: 30, scale: 0.9 }}
      animate={{ opacity: 1, rotateY: 12, scale: 1 }}
      whileHover={{ rotateY: 0, scale: 1.02 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      role="img"
      aria-label="Budgeify kredi kartı görseli"
    >
      {/* Glow behind card */}
      <div
        className="absolute -inset-8 rounded-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(157, 0, 255, 0.25) 0%, rgba(13, 166, 242, 0.1) 40%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Card body */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(157,0,255,0.15)',
        }}
      >
        {/* Shine sweep */}
        <div className="absolute inset-0 card-shine" />

        {/* Card content */}
        <div className="relative p-6 sm:p-8 h-full flex flex-col justify-between">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-[#9d00ff]" />
              <span className="text-xs font-bold text-white/90 uppercase tracking-widest">Budgeify</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi size={14} className="text-white/50 rotate-90" />
              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">+24.5%</span>
            </div>
          </div>

          {/* Balance */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Balance</p>
            <p className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">$1,249,920.00</p>
          </div>

          {/* Bottom row */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest">Card Number</p>
              <p className="text-xs text-white/60 font-mono tracking-wider">•••• •••• •••• 4598</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest">Exp</p>
              <p className="text-xs text-white/60 font-mono">EXP 12/28</p>
            </div>
          </div>
        </div>

        {/* Gold chip */}
        <div
          className="absolute top-14 sm:top-16 left-6 sm:left-8 w-10 h-7 rounded-md"
          style={{
            background: 'linear-gradient(135deg, #C9A961 0%, #F5D78E 50%, #C9A961 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 3px rgba(0,0,0,0.3)',
          }}
        >
          <div className="w-full h-full rounded-md" style={{
            backgroundImage: 'linear-gradient(90deg, transparent 40%, rgba(0,0,0,0.05) 41%, rgba(0,0,0,0.05) 60%, transparent 61%), linear-gradient(0deg, transparent 40%, rgba(0,0,0,0.05) 41%, rgba(0,0,0,0.05) 60%, transparent 61%)',
          }} />
        </div>
      </div>
    </motion.div>
  );
}

/* ========================================
   VISUAL DATA STRIP — Bar Chart
   ======================================== */

function DataStrip() {
  const barHeights = [35, 55, 45, 70, 60, 85, 75, 95, 80, 65, 90, 100];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <FadeInSection className="py-0">
      <div className="relative" style={{ background: '#020202' }}>
        {/* Gradient top edge */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9d00ff]/40 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Bar chart */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Portfolio Performance</span>
              </div>

              <div className="flex items-end gap-2 sm:gap-3 h-48">
                {barHeights.map((height, i) => (
                  <motion.div
                    key={months[i]}
                    className="flex-1 flex flex-col items-center gap-1"
                    initial={{ opacity: 0, scaleY: 0 }}
                    whileInView={{ opacity: 1, scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'bottom' }}
                  >
                    <div
                      className="w-full rounded-t-sm transition-all duration-300 hover:opacity-100 opacity-70 cursor-pointer"
                      style={{
                        height: `${height}%`,
                        background: height === 100
                          ? 'linear-gradient(180deg, #0da6f2, #7C3AED)'
                          : 'linear-gradient(180deg, rgba(13,166,242,0.6), rgba(124,58,237,0.4))',
                        boxShadow: height === 100 ? '0 0 12px rgba(13,166,242,0.3)' : 'none',
                      }}
                    />
                    <span className="text-[8px] text-slate-600 font-medium">{months[i]}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-6">
              {[
                { label: 'Total Assets Managed', value: '$4.2B', badge: '↑ 12%', badgeColor: 'text-emerald-400' },
                { label: 'Prediction Accuracy', value: '99.8%', badge: '< AI', badgeColor: 'text-[#0da6f2]' },
                { label: 'Security Uptime', value: '100%', badge: 'All Systems Nominal', badgeColor: 'text-slate-500' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-white font-display">{stat.value}</span>
                      <span className={`text-xs font-bold ${stat.badgeColor}`}>{stat.badge}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Gradient bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0da6f2]/30 to-transparent" />
      </div>
    </FadeInSection>
  );
}

/* ========================================
   MAIN LANDING PAGE
   ======================================== */

export default function LandingClient() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return (
    <div className="min-h-screen overflow-hidden relative" style={{ background: '#050505' }}>
      <MouseFollowGradient />

      {/* Nebula background orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 nebula-gradient" aria-hidden="true" />

      {/* ========================================
          NAVIGATION — Glass Pill
          ======================================== */}
      <motion.nav
        initial={isMounted ? { y: -60, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50"
        aria-label="Ana gezinme"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center justify-between h-14 px-6 rounded-full glass-panel border border-white/8">
            <Logo size="sm" showText={true} href="/" />

            <div className="hidden md:flex items-center gap-6">
              {['Features', 'Pricing', 'About'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <LandingAuthNav />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ========================================
          HERO SECTION
          ======================================== */}
      <main id="main-content">
      <section className="relative pt-20 sm:pt-28 pb-20 px-4 overflow-hidden">
        {/* Background glow orbs */}
        <motion.div
          initial={isMounted ? { opacity: 0, scale: 0.8 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(157, 0, 255, 0.15) 0%, transparent 70%)', filter: 'blur(100px)' }}
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left — Text */}
            <div>
              {/* Badge */}
              <HeroText delay={0.1}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">AI V2.0 Live</span>
                </div>
              </HeroText>

              {/* Main headline */}
              <HeroText delay={0.2}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] mb-6 font-display">
                  Command Your Capital with{' '}
                  <span className="text-gradient-logo">AI Intelligence</span>
                </h1>
              </HeroText>

              {/* Subheadline */}
              <HeroText delay={0.3}>
                <p className="text-base sm:text-lg text-slate-400 max-w-lg mb-8 leading-relaxed">
                  The first financial operating system that evolves with your spending habits. Experience predictive budgeting powered by neural networks in a seamless obsidian void.
                </p>
              </HeroText>

              {/* CTA Buttons */}
              <HeroText delay={0.4}>
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <Link
                    href="/sign-up"
                    className="group flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white btn-portal-gradient rounded-full uppercase tracking-wider btn-glow-purple"
                  >
                    Start Free
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="flex items-center gap-2 px-7 py-3.5 text-sm font-medium text-slate-300 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
                    <Play size={14} />
                    Watch Demo
                  </button>
                </div>
              </HeroText>

              {/* Trust avatars */}
              <HeroText delay={0.5}>
                <div className="flex items-center gap-3 mt-8">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-gradient-to-br from-slate-600 to-slate-800" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">Trusted by <strong className="text-slate-300">50,000+</strong> visionaries</span>
                </div>
              </HeroText>
            </div>

            {/* Right — 3D Credit Card */}
            <div className="flex justify-center lg:justify-end">
              <CreditCardVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          HOW IT WORKS — Timeline
          ======================================== */}
      <FadeInSection className="py-20 sm:py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeInDiv className="text-center mb-16">
            <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">How It Works</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 font-display">
              Four Steps to{' '}
              <span className="text-gradient-logo">Financial Autonomy</span>
            </h2>
            <p className="text-base text-slate-400 max-w-xl mx-auto">
              Yapay zekâ destekli finansal özgürlüğünüze dört adımda ulaşın.
            </p>
          </FadeInDiv>

          <div className="relative ml-4 sm:ml-8">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#9d00ff]/40 via-[#0da6f2]/20 to-transparent" />

            {[
              {
                step: '01',
                icon: Wifi,
                title: 'Sync Your Ecosystem',
                desc: 'Tüm finansal verilerinizi tek bir noktada entegre edin. Gelir, gider ve hedefleriniz anında senkronize olur.',
              },
              {
                step: '02',
                icon: Brain,
                title: 'Neural Training',
                desc: 'AI modeli harcama alışkanlıklarınızı öğrenir. Kategori bazlı analiz ve trend tahminleri oluşturur.',
              },
              {
                step: '03',
                icon: Activity,
                title: 'Predictive Simulation',
                desc: 'Gelecek harcamalarınız simüle edilir. Bütçe aşım riski ve tasarruf fırsatları önceden belirlenir.',
              },
              {
                step: '04',
                icon: Sparkles,
                title: 'Autonomous Execution',
                desc: 'Bütçe optimizasyonu otomatik çalışır. Hedeflerinize ulaşmanız için akıllı öneriler sunar.',
              },
            ].map((item, i) => (
              <FadeInDiv key={item.step} delay={i * 0.12} className="relative pl-12 pb-12 last:pb-0">
                {/* Step circle */}
                <div className="absolute left-0 top-0 w-9 h-9 rounded-full border border-white/10 bg-[#0a0a0f] flex items-center justify-center z-10">
                  <span className="text-[10px] font-black text-[#9d00ff]">{item.step}</span>
                </div>

                <div className="rounded-2xl p-5 sm:p-6 border border-white/5 hover:border-[#9d00ff]/20 transition-colors" style={{ background: 'var(--color-surface-dark)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#9d00ff]/10 flex items-center justify-center">
                      <item.icon size={20} className="text-[#0da6f2]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </FadeInDiv>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* ========================================
          FEATURES SECTION
          ======================================== */}
      <FadeInSection id="features" className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeInDiv className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 font-display">
              Quantum-Level{' '}
              <span className="text-gradient-logo">Financial Clarity</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
              Unlock the power of automated intelligence for your assets. Our system learns, adapts, and grows your wealth in real-time.
            </p>
          </FadeInDiv>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Predictive Spending',
                desc: 'Our AI anticipates your expenses before they happen using historical data and market trends, alerting you to adjust your budget proactively.',
              },
              {
                icon: Brain,
                title: 'Neural Auto-Save',
                desc: 'Smart algorithms analyze your daily cash flow and automatically set aside micro-amounts into high-yield diverse portfolios without you noticing.',
              },
              {
                icon: ShieldCheck,
                title: 'Holographic Security',
                desc: 'Biometric encryption meets decentralized data storage. Your financial DNA is protected by military-grade, quantum-resistant protocols.',
              },
            ].map((feature) => (
              <StaggerItem key={feature.title}>
                <HoverCard className="rounded-2xl p-6 h-full border border-white/5 hover:border-[#9d00ff]/30 transition-colors" style={{ background: 'var(--color-surface-dark)' }}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#9d00ff]/10 mb-5">
                    <feature.icon size={24} className="text-[#0da6f2]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </FadeInSection>

      {/* ========================================
          VISUAL DATA STRIP
          ======================================== */}
      <DataStrip />

      {/* ========================================
          PRICING SECTION
          ======================================== */}
      <FadeInSection id="pricing" className="py-20 sm:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeInDiv className="text-center mb-16">
            <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Pricing</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 font-display">
              Simple,{' '}
              <span className="text-gradient-logo">Transparent</span>{' '}
              Pricing
            </h2>
            <p className="text-base text-slate-400 max-w-xl mx-auto">
              Finansal özgürlüğünüz için yatırım yapın. İhtiyacınıza uygun planı seçin.
            </p>
          </FadeInDiv>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Aylık Plan */}
            <FadeInDiv delay={0.1}>
              <div className="rounded-2xl p-6 sm:p-8 border border-white/5 h-full flex flex-col" style={{ background: 'var(--color-surface-dark)' }}>
                <h3 className="text-lg font-bold text-white mb-1">Aylık Plan</h3>
                <p className="text-sm text-slate-500 mb-6">Esneklik isteyenler için</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white font-display">99 ₺</span>
                  <span className="text-sm text-slate-500 ml-1">/ay</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {['AI Finansal Analiz', 'Sınırsız İşlem', 'Gerçek Zamanlı Sync', 'Hedef Takibi', 'Kategori Yönetimi', 'Temel Raporlama'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check size={14} className="text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className="block text-center px-6 py-3 text-sm font-bold text-white rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all uppercase tracking-wider"
                >
                  Başla
                </Link>
              </div>
            </FadeInDiv>

            {/* Yıllık Plan — Highlighted */}
            <FadeInDiv delay={0.2}>
              <div className="relative rounded-2xl p-6 sm:p-8 border border-[#9d00ff]/30 h-full flex flex-col" style={{ background: 'var(--color-surface-dark)' }}>
                {/* Popular badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 text-[10px] font-black text-white uppercase tracking-widest btn-portal-gradient rounded-full">
                    En Popüler
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 mt-2">Yıllık Plan</h3>
                <p className="text-sm text-slate-500 mb-6">Maksimum tasarruf için</p>
                <div className="mb-2">
                  <span className="text-4xl font-black text-white font-display">70 ₺</span>
                  <span className="text-sm text-slate-500 ml-1">/ay</span>
                </div>
                <p className="text-xs text-slate-500 mb-6">840 ₺/yıl · <span className="text-emerald-400 font-bold">%30 İndirim</span></p>
                <ul className="space-y-3 mb-8 flex-1">
                  {['AI Finansal Analiz', 'Sınırsız İşlem', 'Gerçek Zamanlı Sync', 'Hedef Takibi', 'Kategori Yönetimi', 'Gelişmiş Raporlama', 'Öncelikli Destek', 'Erken Erişim Özellikleri'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check size={14} className="text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className="block text-center px-6 py-3 text-sm font-bold text-white btn-portal-gradient rounded-full uppercase tracking-wider btn-glow-purple"
                >
                  Yıllık Başla
                </Link>
              </div>
            </FadeInDiv>
          </div>
        </div>
      </FadeInSection>

      {/* ========================================
          ABOUT SECTION
          ======================================== */}
      <FadeInSection id="about" className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Text */}
            <FadeInDiv direction="left">
              <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">About Budgeify</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 font-display">
                Finansal Özgürlük{' '}
                <span className="text-gradient-logo">Herkesin Hakkı</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-6">
                Budgeify, yapay zekâ destekli kişisel finans yönetim platformudur. Amacımız, karmaşık finansal kararları basitleştirmek ve herkesin parasını daha akıllıca yönetmesini sağlamaktır.
              </p>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-8">
                Modern arayüzümüz ve güçlü analiz motorumuz ile harcama alışkanlıklarınızı anlar, tasarruf fırsatlarını belirler ve finansal hedeflerinize ulaşmanız için size rehberlik eder.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Users, label: '50K+', sub: 'Kullanıcı' },
                  { icon: Heart, label: '99.8%', sub: 'Memnuniyet' },
                  { icon: Code2, label: '24/7', sub: 'AI Aktif' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <stat.icon size={20} className="text-[#0da6f2] mx-auto mb-2" />
                    <p className="text-lg font-black text-white font-display">{stat.label}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </FadeInDiv>

            {/* Right — Visual element */}
            <FadeInDiv direction="right">
              <div className="relative rounded-2xl overflow-hidden border border-white/5 p-8 sm:p-10" style={{ background: 'var(--color-surface-dark)' }}>
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(157,0,255,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }}
                />
                <div className="relative space-y-5">
                  {[
                    { title: 'Next.js 14', desc: 'Server-first React framework' },
                    { title: 'Neural AI Engine', desc: 'Harcama tahmin ve optimizasyon' },
                    { title: 'Real-time Sync', desc: 'Cross-device anlık senkronizasyon' },
                    { title: 'Bank-Grade Security', desc: 'Clerk auth + encrypted data layer' },
                  ].map((item, i) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="mt-1 w-6 h-6 rounded-md bg-[#9d00ff]/10 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-black text-[#0da6f2]">{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInDiv>
          </div>
        </div>
      </FadeInSection>

      {/* ========================================
          CTA SECTION
          ======================================== */}
      <FadeInSection className="py-20 sm:py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 text-center glass-panel border border-white/8">
            {/* Nebula backdrop */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(157, 0, 255, 0.25) 0%, transparent 70%)', filter: 'blur(60px)' }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative">
              <FadeInDiv direction="up">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 font-display">
                  Ready to{' '}
                  <span className="text-gradient-logo">Upgrade?</span>
                </h2>
              </FadeInDiv>
              <FadeInDiv direction="up" delay={0.1}>
                <p className="text-base text-slate-400 mb-8 max-w-xl mx-auto">
                  Join the waiting list for the next generation of financial intelligence. Early adopters get premium perks.
                </p>
              </FadeInDiv>
              <FadeInDiv direction="up" delay={0.2}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                  <div className="relative flex-1 w-full">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </span>
                    <label htmlFor="cta-email" className="sr-only">E-posta adresiniz</label>
                    <input
                      id="cta-email"
                      type="email"
                      placeholder="Enter your email"
                      className="neon-input w-full pl-10 pr-4 py-3 rounded-lg text-sm"
                      autoComplete="email"
                    />
                  </div>
                  <Link
                    href="/sign-up"
                    className="px-6 py-3 text-sm font-bold text-white btn-portal-gradient rounded-lg uppercase tracking-wider whitespace-nowrap"
                  >
                    Join Beta
                  </Link>
                </div>
              </FadeInDiv>

              {/* Trust logos */}
              <FadeInDiv direction="up" delay={0.3}>
                <div className="flex items-center justify-center gap-8 mt-10 opacity-30 grayscale hover:opacity-50 hover:grayscale-0 transition-all duration-500">
                  {['STRIPE', 'COINBASE', 'PLAID'].map((name) => (
                    <span key={name} className="text-xs font-bold text-slate-400 uppercase tracking-widest">{name}</span>
                  ))}
                </div>
              </FadeInDiv>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* ========================================
          FOOTER
          ======================================== */}
      </main>
      <footer className="py-10 px-4 border-t border-white/5" style={{ background: 'rgba(5, 5, 5, 0.8)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" showText={true} href="/" />

            <p className="text-xs text-slate-600">
              © 2026 Budgeify Inc. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              {[
                { Icon: Github, label: 'GitHub' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Linkedin, label: 'LinkedIn' },
              ].map(({ Icon, label }) => (
                <a key={label} href="#" className="text-slate-600 hover:text-white transition-colors" aria-label={label}>
                  <Icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
