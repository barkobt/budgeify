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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
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
        Gösterge Paneli
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
        className="text-sm font-medium text-slate-400 hover:text-white transition-colors whitespace-nowrap"
      >
        Giriş Yap
      </Link>
      <Link
        href="/sign-up"
        className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white btn-portal-gradient rounded-full uppercase tracking-wider btn-glow-purple whitespace-nowrap"
      >
        Kayıt Ol
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
   VISUAL DATA STRIP — Recharts Area Chart
   ======================================== */

const MOCK_CHART_DATA = [
  { month: 'Oca', gelir: 28500, gider: 19200, tasarruf: 9300 },
  { month: 'Şub', gelir: 31000, gider: 22100, tasarruf: 8900 },
  { month: 'Mar', gelir: 29800, gider: 18500, tasarruf: 11300 },
  { month: 'Nis', gelir: 33200, gider: 24800, tasarruf: 8400 },
  { month: 'May', gelir: 35100, gider: 21300, tasarruf: 13800 },
  { month: 'Haz', gelir: 32700, gider: 20100, tasarruf: 12600 },
  { month: 'Tem', gelir: 38400, gider: 23900, tasarruf: 14500 },
  { month: 'Ağu', gelir: 36200, gider: 25600, tasarruf: 10600 },
  { month: 'Eyl', gelir: 34800, gider: 22400, tasarruf: 12400 },
  { month: 'Eki', gelir: 37500, gider: 24200, tasarruf: 13300 },
  { month: 'Kas', gelir: 39100, gider: 26800, tasarruf: 12300 },
  { month: 'Ara', gelir: 42000, gider: 28500, tasarruf: 13500 },
];

function DataStrip() {
  return (
    <FadeInSection className="py-0">
      <div className="relative" style={{ background: '#020202' }}>
        {/* Gradient top edge */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9d00ff]/40 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Recharts Area Chart */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Canlı Portföy Performansı</span>
              </div>

              <div className="w-full h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_CHART_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradGelir" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9d00ff" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#9d00ff" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradGider" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradTasarruf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 9, fill: '#475569' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(10, 10, 15, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#e2e8f0',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      }}
                      formatter={(value: number, name: string) => {
                        const labels: Record<string, string> = { gelir: 'Gelir', gider: 'Gider', tasarruf: 'Tasarruf' };
                        return [`₺${value.toLocaleString('tr-TR')}`, labels[name] || name];
                      }}
                      labelStyle={{ color: '#94a3b8', fontWeight: 600 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="gelir"
                      stroke="#9d00ff"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#gradGelir)"
                    />
                    <Area
                      type="monotone"
                      dataKey="gider"
                      stroke="#f43f5e"
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill="url(#gradGider)"
                    />
                    <Area
                      type="monotone"
                      dataKey="tasarruf"
                      stroke="#10B981"
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill="url(#gradTasarruf)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-5 mt-4">
                {[
                  { label: 'Gelir', color: '#9d00ff' },
                  { label: 'Gider', color: '#f43f5e' },
                  { label: 'Tasarruf', color: '#10B981' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] text-slate-500 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-6">
              {[
                { label: 'Yönetilen Toplam Varlık', value: '$4.2B', badge: '↑ 12%', badgeColor: 'text-emerald-400' },
                { label: 'Tahmin Doğruluğu', value: '99.8%', badge: '< AI', badgeColor: 'text-[#0da6f2]' },
                { label: 'Güvenlik Çalışma Süresi', value: '100%', badge: 'Tüm Sistemler Aktif', badgeColor: 'text-slate-500' },
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
    <div className="min-h-screen overflow-x-hidden overflow-y-auto relative" style={{ background: '#050505' }}>
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
              {[{ label: 'Özellikler', href: '#features' }, { label: 'Fiyatlandırma', href: '#pricing' }, { label: 'Hakkımızda', href: '#about' }].map((item) => (
                <a key={item.href} href={item.href} className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">AI V2.0 Aktif</span>
                </div>
              </HeroText>

              {/* Main headline */}
              <HeroText delay={0.2}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] mb-6 font-display">
                  Sermayenizi{' '}
                  <span className="text-gradient-logo">Yapay Zekâ</span>{' '}
                  ile Yönetin
                </h1>
              </HeroText>

              {/* Subheadline */}
              <HeroText delay={0.3}>
                <p className="text-base sm:text-lg text-slate-400 max-w-lg mb-8 leading-relaxed">
                  Harcama alışkanlıklarınızla birlikte gelişen ilk finansal işletim sistemi. Yapay sinir ağları ile desteklenen öngörülü bütçe yönetimini deneyimleyin.
                </p>
              </HeroText>

              {/* CTA Buttons */}
              <HeroText delay={0.4}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3">
                  <Link
                    href="/sign-up"
                    className="group flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white btn-portal-gradient rounded-full uppercase tracking-wider btn-glow-purple whitespace-nowrap"
                  >
                    Ücretsiz Başla
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 text-sm font-medium text-slate-300 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all whitespace-nowrap">
                    <Play size={14} />
                    Demo İzle
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
                  <span className="text-xs text-slate-500"><strong className="text-slate-300">50.000+</strong> kullanıcının tercihi</span>
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
            <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Nasıl Çalışır</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 font-display">
              Dört Adımda{' '}
              <span className="text-gradient-logo">Finansal Özgürlük</span>
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
                title: 'Ekosisteminizi Bağlayın',
                desc: 'Tüm finansal verilerinizi tek bir noktada entegre edin. Gelir, gider ve hedefleriniz anında senkronize olur.',
              },
              {
                step: '02',
                icon: Brain,
                title: 'Yapay Zekâ Eğitimi',
                desc: 'AI modeli harcama alışkanlıklarınızı öğrenir. Kategori bazlı analiz ve trend tahminleri oluşturur.',
              },
              {
                step: '03',
                icon: Activity,
                title: 'Öngörü Simülasyonu',
                desc: 'Gelecek harcamalarınız simüle edilir. Bütçe aşım riski ve tasarruf fırsatları önceden belirlenir.',
              },
              {
                step: '04',
                icon: Sparkles,
                title: 'Otonom Yürütme',
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
              Kuantum Düzeyinde{' '}
              <span className="text-gradient-logo">Finansal Netlik</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
              Varlıklarınız için otomatik zekânın gücünü açığa çıkarın. Sistemimiz öğrenir, uyum sağlar ve servetinizi gerçek zamanlı büyütür.
            </p>
          </FadeInDiv>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Öngörülü Harcama',
                desc: 'Yapay zekâmız, geçmiş veriler ve piyasa trendlerini kullanarak harcamalarınızı gerçekleşmeden önce tahmin eder ve bütçenizi proaktif olarak ayarlamanız için sizi uyarır.',
              },
              {
                icon: Brain,
                title: 'Nöral Otomatik Tasarruf',
                desc: 'Akıllı algoritmalar günlük nakit akışınızı analiz eder ve fark etmeden mikro tutarları yüksek getirili çeşitlendirilmiş portföylere otomatik olarak ayırır.',
              },
              {
                icon: ShieldCheck,
                title: 'Holografik Güvenlik',
                desc: 'Biyometrik şifreleme, merkezi olmayan veri depolama ile buluşuyor. Finansal DNA\'nız askeri düzeyde, kuantum dayanıklı protokollerle korunmaktadır.',
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
          PRICING CTA — Links to /pricing
          ======================================== */}
      <FadeInSection id="pricing" className="py-20 sm:py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 text-center glass-panel border border-white/8">
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(157, 0, 255, 0.2) 0%, transparent 70%)', filter: 'blur(60px)' }}
              aria-hidden="true"
            />
            <div className="relative">
              <FadeInDiv>
                <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Fiyatlandırma</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 font-display">
                  Basit,{' '}
                  <span className="text-gradient-logo">Şeffaf</span>{' '}
                  Fiyatlandırma
                </h2>
                <p className="text-base text-slate-400 max-w-xl mx-auto mb-4">
                  Aylık <strong className="text-white">99 ₺</strong>&apos;den başlayan fiyatlarla AI destekli finansal yönetim.
                  Yıllık planda <span className="text-emerald-400 font-bold">%30 indirim</span>.
                </p>
              </FadeInDiv>
              <FadeInDiv delay={0.15}>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white btn-portal-gradient rounded-full uppercase tracking-wider btn-glow-purple"
                >
                  Planları İncele
                  <ArrowRight size={16} />
                </Link>
              </FadeInDiv>
            </div>
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
              <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Budgeify Hakkında</span>
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
                    { title: 'Next.js 14', desc: 'Sunucu öncelikli React framework' },
                    { title: 'Yapay Zekâ Motoru', desc: 'Harcama tahmin ve optimizasyon' },
                    { title: 'Gerçek Zamanlı Sync', desc: 'Tüm cihazlarda anlık senkronizasyon' },
                    { title: 'Banka Düzeyinde Güvenlik', desc: 'Clerk auth + şifreli veri katmanı' },
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
                  Yükseltmeye{' '}
                  <span className="text-gradient-logo">Hazır mısınız?</span>
                </h2>
              </FadeInDiv>
              <FadeInDiv direction="up" delay={0.1}>
                <p className="text-base text-slate-400 mb-8 max-w-xl mx-auto">
                  Yeni nesil finansal zekâ için bekleme listesine katılın. Erken kullanıcılar premium avantajlardan yararlanır.
                </p>
              </FadeInDiv>
              <FadeInDiv direction="up" delay={0.2}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto">
                  <div className="relative flex-1 w-full">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </span>
                    <label htmlFor="cta-email" className="sr-only">E-posta adresiniz</label>
                    <input
                      id="cta-email"
                      type="email"
                      placeholder="E-posta adresinizi girin"
                      className="neon-input w-full pl-10 pr-4 py-3 rounded-lg text-sm"
                      autoComplete="email"
                    />
                  </div>
                  <Link
                    href="/sign-up"
                    className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white btn-portal-gradient rounded-lg uppercase tracking-wider whitespace-nowrap text-center"
                  >
                    Beta&apos;ya Katıl
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

            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Gizlilik Politikası
              </Link>
              <span className="text-slate-700" aria-hidden="true">|</span>
              <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Kullanım Koşulları
              </Link>
            </div>

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

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-600">
              © 2026 Budgeify. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
