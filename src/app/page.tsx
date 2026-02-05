/**
 * Landing Page - Public Homepage
 *
 * 🎓 MENTOR NOTU - Landing Page:
 * -----------------------------
 * Landing page, ürünün "vitrin"idir. İlk izlenim burada oluşur.
 *
 * Temel bölümler:
 * 1. Hero - Ana mesaj ve CTA
 * 2. Features - Özellikler
 * 3. Social Proof - Güven unsurları
 * 4. CTA - Son çağrı
 *
 * Apple kalitesinde tasarım prensipleri:
 * - Minimal ama güçlü
 * - Beyaz alan (white space) kullan
 * - Tek bir odak noktası
 * - Yumuşak geçişler ve animasyonlar
 */

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
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
    <div className="min-h-screen bg-gradient-to-b from-cosmic-900 via-cosmic-800 to-cosmic-700">
      {/* ========================================
          NAVIGATION
          ======================================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cosmic-900/80 backdrop-blur-xl border-b border-white/5">
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
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-semibold text-white ai-gradient rounded-lg
                         hover:opacity-90 transition-all shadow-lg shadow-accent-500/20"
              >
                Ücretsiz Başla
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ========================================
          HERO SECTION
          ======================================== */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-500/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fadeIn">
            <Sparkles size={16} className="text-accent-400" />
            <span className="text-sm font-medium text-slate-300">
              Yapay Zeka Destekli Finansal Asistan
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 animate-fadeIn">
            Finansal özgürlüğün
            <br />
            <span className="text-gradient">yeni çağı başlıyor</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-fadeIn">
            Budgeify ile gelir ve giderlerinizi takip edin, akıllı tasarruf önerileri alın
            ve finansal hedeflerinize yapay zeka desteğiyle ulaşın.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn">
            <Link
              href="/sign-up"
              className="group flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white ai-gradient rounded-xl
                       hover:opacity-90 transition-all shadow-xl shadow-accent-500/30"
            >
              Ücretsiz Başla
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-4 text-lg font-semibold text-white glass-card rounded-xl
                       hover:bg-white/10 transition-all"
            >
              Giriş Yap
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 mt-12 text-slate-500 text-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Ücretsiz</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Kredi kartı gerekmez</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Anında başla</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          FEATURES SECTION
          ======================================== */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Neden Budgeify?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Modern finansal yönetim için ihtiyacınız olan her şey, tek bir platformda.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass-card rounded-2xl p-6 hover-lift">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/20 mb-4">
                <Sparkles size={24} className="text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Oracle AI Asistan</h3>
              <p className="text-slate-400">
                Yapay zeka destekli asistanınız, harcama alışkanlıklarınızı analiz eder ve
                kişiselleştirilmiş öneriler sunar.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card rounded-2xl p-6 hover-lift">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 mb-4">
                <TrendingUp size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Akıllı Takip</h3>
              <p className="text-slate-400">
                Gelir ve giderlerinizi kategorilere göre takip edin, harcama trendlerinizi
                görselleştirin.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card rounded-2xl p-6 hover-lift">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/20 mb-4">
                <Target size={24} className="text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Hedef Belirleme</h3>
              <p className="text-slate-400">
                Tasarruf hedefleri belirleyin ve ilerlemenizi görsel olarak takip edin.
                Motivasyonunuzu yüksek tutun.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card rounded-2xl p-6 hover-lift">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 mb-4">
                <BarChart3 size={24} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Detaylı Analiz</h3>
              <p className="text-slate-400">
                Interaktif grafikler ve raporlarla finansal durumunuzu derinlemesine
                analiz edin.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card rounded-2xl p-6 hover-lift">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/20 mb-4">
                <Shield size={24} className="text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Güvenli Veri</h3>
              <p className="text-slate-400">
                Verileriniz şifreli olarak saklanır. Gizliliğiniz bizim önceliğimizdir.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card rounded-2xl p-6 hover-lift">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/20 mb-4">
                <Zap size={24} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Anlık Senkron</h3>
              <p className="text-slate-400">
                Tüm cihazlarınızda anlık senkronizasyon. Nerede olursanız olun,
                finanslarınız yanınızda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          CTA SECTION
          ======================================== */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-accent-500/30 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Finansal yolculuğunuza bugün başlayın
              </h2>
              <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                Binlerce kullanıcı Budgeify ile finansal hedeflerine ulaşıyor.
                Siz de aramıza katılın.
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white ai-gradient rounded-xl
                         hover:opacity-90 transition-all shadow-xl shadow-accent-500/30"
              >
                Hemen Başla
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          FOOTER
          ======================================== */}
      <footer className="py-12 px-4 border-t border-white/5">
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
      </footer>
    </div>
  );
}
