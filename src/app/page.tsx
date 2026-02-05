'use client';

/**
 * Landing Page - Public Homepage with Motion Design
 *
 * 🎓 MENTOR NOTU - Scroll Animations:
 * -----------------------------------
 * "Scroll-triggered" animasyonlar kullanıcı deneyimini zenginleştirir.
 *
 * Neden önemli?
 * 1. Dikkat çeker - Hareket eden şeyler fark edilir
 * 2. Hikaye anlatır - Scroll = Journey
 * 3. Premium his verir - Statik = Ucuz, Animasyonlu = Premium
 *
 * Golden Rule: "If it moves, it should have a purpose"
 */

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import {
  FadeInSection,
  FadeInDiv,
  StaggerContainer,
  StaggerItem,
  GlowButton,
  HoverCard,
  HeroText,
  FloatingElement,
} from '@/components/ui/MotionElements';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Target,
  Shield,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cosmic-900 via-cosmic-800 to-cosmic-700 overflow-hidden">
      {/* ========================================
          NAVIGATION
          ======================================== */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-cosmic-900/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="sm" showText={true} />

            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Giriş Yap
              </Link>
              <GlowButton
                className="px-4 py-2 text-sm font-semibold text-white ai-gradient rounded-lg
                         shadow-lg shadow-accent-500/20"
              >
                <Link href="/sign-up">Ücretsiz Başla</Link>
              </GlowButton>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ========================================
          HERO SECTION
          ======================================== */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated background glow effects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-500/20 rounded-full blur-[128px] pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none"
        />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <HeroText delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
              <Sparkles size={16} className="text-accent-400" />
              <span className="text-sm font-medium text-slate-300">
                Yapay Zeka Destekli Finansal Asistan
              </span>
            </div>
          </HeroText>

          {/* Main headline */}
          <HeroText delay={0.2}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Finansal özgürlüğün
              <br />
              <span className="text-gradient">yeni çağı başlıyor</span>
            </h1>
          </HeroText>

          {/* Subheadline */}
          <HeroText delay={0.3}>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Budgeify ile gelir ve giderlerinizi takip edin, akıllı tasarruf önerileri alın
              ve finansal hedeflerinize yapay zeka desteğiyle ulaşın.
            </p>
          </HeroText>

          {/* CTA Buttons */}
          <HeroText delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up">
                <GlowButton
                  className="group flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white ai-gradient rounded-xl
                           shadow-xl shadow-accent-500/30"
                  glowColor="rgba(59, 130, 246, 0.6)"
                >
                  Ücretsiz Başla
                  <motion.span
                    className="inline-block"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <ArrowRight size={20} />
                  </motion.span>
                </GlowButton>
              </Link>
              <Link href="/sign-in">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 text-lg font-semibold text-white glass-card rounded-xl"
                >
                  Giriş Yap
                </motion.button>
              </Link>
            </div>
          </HeroText>

          {/* Trust indicators */}
          <HeroText delay={0.5}>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-12 text-slate-500 text-sm">
              {[
                { icon: CheckCircle2, text: 'Ücretsiz' },
                { icon: CheckCircle2, text: 'Kredi kartı gerekmez' },
                { icon: CheckCircle2, text: 'Anında başla' },
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <item.icon size={16} className="text-emerald-500" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </HeroText>
        </div>

        {/* Floating decorative elements */}
        <FloatingElement
          className="absolute top-40 right-10 opacity-20 hidden lg:block"
          duration={5}
          distance={15}
        >
          <div className="w-20 h-20 rounded-2xl ai-gradient" />
        </FloatingElement>
        <FloatingElement
          className="absolute bottom-20 left-10 opacity-15 hidden lg:block"
          duration={6}
          distance={12}
        >
          <div className="w-16 h-16 rounded-full bg-violet-500" />
        </FloatingElement>
      </section>

      {/* ========================================
          FEATURES SECTION
          ======================================== */}
      <FadeInSection className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <FadeInDiv className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Neden Budgeify?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Modern finansal yönetim için ihtiyacınız olan her şey, tek bir platformda.
            </p>
          </FadeInDiv>

          {/* Feature grid with stagger animation */}
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <StaggerItem>
              <HoverCard className="glass-card rounded-2xl p-6 h-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/20 mb-4">
                  <Sparkles size={24} className="text-accent-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Oracle AI Asistan</h3>
                <p className="text-slate-400">
                  Yapay zeka destekli asistanınız, harcama alışkanlıklarınızı analiz eder ve
                  kişiselleştirilmiş öneriler sunar.
                </p>
              </HoverCard>
            </StaggerItem>

            {/* Feature 2 */}
            <StaggerItem>
              <HoverCard className="glass-card rounded-2xl p-6 h-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 mb-4">
                  <TrendingUp size={24} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Akıllı Takip</h3>
                <p className="text-slate-400">
                  Gelir ve giderlerinizi kategorilere göre takip edin, harcama trendlerinizi
                  görselleştirin.
                </p>
              </HoverCard>
            </StaggerItem>

            {/* Feature 3 */}
            <StaggerItem>
              <HoverCard className="glass-card rounded-2xl p-6 h-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/20 mb-4">
                  <Target size={24} className="text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Hedef Belirleme</h3>
                <p className="text-slate-400">
                  Tasarruf hedefleri belirleyin ve ilerlemenizi görsel olarak takip edin.
                  Motivasyonunuzu yüksek tutun.
                </p>
              </HoverCard>
            </StaggerItem>

            {/* Feature 4 */}
            <StaggerItem>
              <HoverCard className="glass-card rounded-2xl p-6 h-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 mb-4">
                  <BarChart3 size={24} className="text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Detaylı Analiz</h3>
                <p className="text-slate-400">
                  Interaktif grafikler ve raporlarla finansal durumunuzu derinlemesine
                  analiz edin.
                </p>
              </HoverCard>
            </StaggerItem>

            {/* Feature 5 */}
            <StaggerItem>
              <HoverCard className="glass-card rounded-2xl p-6 h-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/20 mb-4">
                  <Shield size={24} className="text-rose-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Güvenli Veri</h3>
                <p className="text-slate-400">
                  Verileriniz şifreli olarak saklanır. Gizliliğiniz bizim önceliğimizdir.
                </p>
              </HoverCard>
            </StaggerItem>

            {/* Feature 6 */}
            <StaggerItem>
              <HoverCard className="glass-card rounded-2xl p-6 h-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/20 mb-4">
                  <Zap size={24} className="text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Anlık Senkron</h3>
                <p className="text-slate-400">
                  Tüm cihazlarınızda anlık senkronizasyon. Nerede olursanız olun,
                  finanslarınız yanınızda.
                </p>
              </HoverCard>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </FadeInSection>

      {/* ========================================
          STATS SECTION
          ======================================== */}
      <FadeInSection className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '10K+', label: 'Aktif Kullanıcı' },
              { value: '₺50M+', label: 'Takip Edilen' },
              { value: '%99.9', label: 'Uptime' },
              { value: '4.9', label: 'App Store' },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <motion.p
                    className="text-3xl sm:text-4xl font-black text-gradient mb-1"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </FadeInSection>

      {/* ========================================
          CTA SECTION
          ======================================== */}
      <FadeInSection className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-card rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-accent-500/30 rounded-full blur-[80px] pointer-events-none"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <div className="relative">
              <FadeInDiv direction="up">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Finansal yolculuğunuza bugün başlayın
                </h2>
              </FadeInDiv>
              <FadeInDiv direction="up" delay={0.1}>
                <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                  Binlerce kullanıcı Budgeify ile finansal hedeflerine ulaşıyor.
                  Siz de aramıza katılın.
                </p>
              </FadeInDiv>
              <FadeInDiv direction="up" delay={0.2}>
                <Link href="/sign-up">
                  <GlowButton
                    className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white ai-gradient rounded-xl
                             shadow-xl shadow-accent-500/30"
                    glowColor="rgba(59, 130, 246, 0.6)"
                  >
                    Hemen Başla
                    <ArrowRight size={20} />
                  </GlowButton>
                </Link>
              </FadeInDiv>
            </div>
          </motion.div>
        </div>
      </FadeInSection>

      {/* ========================================
          FOOTER
          ======================================== */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-12 px-4 border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Logo size="sm" showText={true} />
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Gizlilik</a>
              <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
              <a href="#" className="hover:text-white transition-colors">İletişim</a>
            </div>

            <p className="text-sm text-slate-500">
              © 2026 Budgeify. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
