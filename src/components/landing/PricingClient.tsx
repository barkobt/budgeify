'use client';

/**
 * PricingClient — Dedicated Pricing Page
 *
 * Extracted from LandingClient pricing section into its own route (/pricing).
 * Includes plan cards, feature comparison, and FAQ section.
 */

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { FadeInSection, FadeInDiv } from '@/components/ui/MotionElements';
import { motion } from 'framer-motion';
import {
  Check,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Brain,
  Target,
  Clock,
} from 'lucide-react';

const PLAN_FEATURES_MONTHLY = [
  'Yapay Zeka Finansal Analiz',
  'Sınırsız İşlem',
  'Gerçek Zamanlı Senkronizasyon',
  'Hedef Takibi',
  'Kategori Yönetimi',
  'Temel Raporlama',
];

const PLAN_FEATURES_YEARLY = [
  'Yapay Zeka Finansal Analiz',
  'Sınırsız İşlem',
  'Gerçek Zamanlı Senkronizasyon',
  'Hedef Takibi',
  'Kategori Yönetimi',
  'Gelişmiş Raporlama',
  'Öncelikli Destek',
  'Erken Erişim Özellikleri',
];

const FAQ_ITEMS = [
  {
    q: 'Ücretsiz deneme var mı?',
    a: 'Evet, tüm planlar 14 günlük ücretsiz deneme ile başlar. Kredi kartı gerekmez.',
  },
  {
    q: 'Planımı istediğim zaman değiştirebilir miyim?',
    a: 'Evet, dilediğiniz zaman aylık plandan yıllık plana geçebilir veya planınızı iptal edebilirsiniz.',
  },
  {
    q: 'Verilerim güvende mi?',
    a: 'Tüm verileriniz banka seviyesinde şifreleme ile korunur. Clerk kimlik doğrulaması ve şifreli veri katmanı kullanıyoruz.',
  },
  {
    q: 'Birden fazla cihazda kullanabilir miyim?',
    a: 'Evet, tüm planlar sınırsız cihaz desteği sunar. Gerçek zamanlı senkronizasyon tüm cihazlarınızda çalışır.',
  },
];

const COMPARISON_FEATURES = [
  { name: 'Yapay Zeka Finansal Analiz', icon: Brain, monthly: true, yearly: true },
  { name: 'Sınırsız İşlem', icon: Zap, monthly: true, yearly: true },
  { name: 'Gerçek Zamanlı Senkronizasyon', icon: Clock, monthly: true, yearly: true },
  { name: 'Hedef Takibi', icon: Target, monthly: true, yearly: true },
  { name: 'Gelişmiş Raporlama', icon: BarChart3, monthly: false, yearly: true },
  { name: 'Öncelikli Destek', icon: Shield, monthly: false, yearly: true },
  { name: 'Erken Erişim', icon: Zap, monthly: false, yearly: true },
];

export default function PricingClient() {
  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-auto relative" style={{ background: '#050505' }}>
      {/* ── NAVIGATION ── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50"
        aria-label="Ana gezinme"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center justify-between h-14 px-6 rounded-full glass-panel border border-white/8">
            <Logo size="sm" showText={true} href="/" />
            <div className="hidden md:flex items-center gap-6">
              <Link href="/#features" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                Özellikler
              </Link>
              <Link href="/pricing" className="text-sm text-white font-medium">
                Fiyatlandırma
              </Link>
              <Link href="/#about" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                Hakkımızda
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm text-slate-300 hover:text-white transition-colors font-medium"
              >
                Giriş Yap
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-xs font-bold text-white btn-portal-gradient rounded-full uppercase tracking-wider"
              >
                Başla
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <main id="main-content">
        {/* ── HERO ── */}
        <section className="relative pt-20 sm:pt-28 pb-12 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(157, 0, 255, 0.12) 0%, transparent 70%)', filter: 'blur(100px)' }}
            aria-hidden="true"
          />

          <div className="relative max-w-4xl mx-auto">
            <FadeInDiv>
              <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Fiyatlandırma</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 font-display">
                Basit,{' '}
                <span className="text-gradient-logo">Şeffaf</span>{' '}
                Fiyatlandırma
              </h1>
              <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto">
                Finansal özgürlüğünüz için yatırım yapın. İhtiyacınıza uygun planı seçin.
              </p>
            </FadeInDiv>
          </div>
        </section>

        {/* ── PLAN CARDS ── */}
        <FadeInSection className="pb-20 px-4">
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
                  {PLAN_FEATURES_MONTHLY.map((f) => (
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
                  {PLAN_FEATURES_YEARLY.map((f) => (
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
        </FadeInSection>

        {/* ── FEATURE COMPARISON TABLE ── */}
        <FadeInSection className="pb-20 px-4">
          <div className="max-w-3xl mx-auto">
            <FadeInDiv className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 font-display">
                Plan Karşılaştırması
              </h2>
              <p className="text-sm text-slate-400">Hangi özellikler hangi planda dahil?</p>
            </FadeInDiv>

            <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: 'var(--color-surface-dark)' }}>
              {/* Table Header */}
              <div className="grid grid-cols-[minmax(0,1fr)_72px_72px] sm:grid-cols-[1fr_100px_100px] gap-0 border-b border-white/8 px-4 sm:px-5 py-3.5">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider min-w-0">Özellik</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">Aylık</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">Yıllık</span>
              </div>

              {/* Rows */}
              {COMPARISON_FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.name}
                    className={`grid grid-cols-[minmax(0,1fr)_72px_72px] sm:grid-cols-[1fr_100px_100px] gap-0 px-4 sm:px-5 py-3 ${
                      i < COMPARISON_FEATURES.length - 1 ? 'border-b border-white/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon size={14} className="text-slate-500 shrink-0" />
                      <span className="text-sm text-slate-300 break-words">{feature.name}</span>
                    </div>
                    <div className="flex justify-center">
                      {feature.monthly ? (
                        <Check size={16} className="text-emerald-400" />
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      {feature.yearly ? (
                        <Check size={16} className="text-emerald-400" />
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeInSection>

        {/* ── FAQ ── */}
        <FadeInSection className="pb-20 sm:pb-28 px-4">
          <div className="max-w-3xl mx-auto">
            <FadeInDiv className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 font-display">
                Sıkça Sorulan Sorular
              </h2>
            </FadeInDiv>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, i) => (
                <FadeInDiv key={item.q} delay={i * 0.08}>
                  <div className="rounded-2xl p-5 sm:p-6 border border-white/5" style={{ background: 'var(--color-surface-dark)' }}>
                    <h3 className="text-sm font-bold text-white mb-2">{item.q}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
                  </div>
                </FadeInDiv>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* ── CTA ── */}
        <FadeInSection className="pb-20 sm:pb-28 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 text-center glass-panel border border-white/8">
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(157, 0, 255, 0.25) 0%, transparent 70%)', filter: 'blur(60px)' }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative">
                <FadeInDiv direction="up">
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 font-display">
                    Hemen{' '}
                    <span className="text-gradient-logo">Başlayın</span>
                  </h2>
                </FadeInDiv>
                <FadeInDiv direction="up" delay={0.1}>
                  <p className="text-base text-slate-400 mb-8 max-w-xl mx-auto">
                    14 günlük ücretsiz deneme ile yapay zeka destekli finansal yönetimi deneyimleyin.
                  </p>
                </FadeInDiv>
                <FadeInDiv direction="up" delay={0.2}>
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white btn-portal-gradient rounded-full uppercase tracking-wider btn-glow-purple"
                  >
                    Ücretsiz Başla
                    <ArrowRight size={16} />
                  </Link>
                </FadeInDiv>
              </div>
            </div>
          </div>
        </FadeInSection>
      </main>

      {/* ── FOOTER ── */}
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
