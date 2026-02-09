'use client';

/**
 * Landing Page — Stitch 3 Reference Implementation (v7.0-M0)
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
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return (
    <div className="min-h-screen overflow-hidden relative" style={{ background: '#050505' }}>
      <MouseFollowGradient />

      {/* Nebula background orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 nebula-gradient" />

      {/* ========================================
          NAVIGATION — Glass Pill
          ======================================== */}
      <motion.nav
        initial={isMounted ? { y: -60, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50"
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
      <section className="relative pt-20 sm:pt-28 pb-20 px-4 overflow-hidden">
        {/* Background glow orbs */}
        <motion.div
          initial={isMounted ? { opacity: 0, scale: 0.8 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(157, 0, 255, 0.15) 0%, transparent 70%)', filter: 'blur(100px)' }}
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left — Text */}
            <div>
              {/* Badge */}
              <HeroText delay={0.1}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="neon-input w-full pl-10 pr-4 py-3 rounded-lg text-sm"
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
      <footer className="py-10 px-4 border-t border-white/5" style={{ background: 'rgba(5, 5, 5, 0.8)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" showText={true} href="/" />

            <p className="text-xs text-slate-600">
              © 2026 Budgeify Inc. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-slate-600 hover:text-white transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
