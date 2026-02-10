import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | Budgeify',
  description: 'Budgeify gizlilik politikası — verilerinizi nasıl toplar, kullanır ve koruruz.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#050505' }}>
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <Link
          href="/"
          className="text-xs text-slate-600 hover:text-slate-400 transition-colors mb-8 inline-block"
        >
          ← Ana sayfaya dön
        </Link>

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 font-display">
          Gizlilik Politikası
        </h1>
        <p className="text-sm text-slate-500 mb-10">
          Son güncelleme: 10 Şubat 2026
        </p>

        <div className="space-y-8 text-sm text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Toplanan Veriler</h2>
            <p className="mb-2">Budgeify, hizmetlerini sunmak için aşağıdaki verileri toplar:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong className="text-slate-300">Hesap bilgileri:</strong> E-posta adresi ve profil bilgileri (Clerk kimlik doğrulama servisi aracılığıyla).</li>
              <li><strong className="text-slate-300">Uygulama verileri:</strong> Gelir, gider, bütçe hedefleri, kategoriler ve hatırlatıcılar (Neon PostgreSQL veritabanında saklanır).</li>
              <li><strong className="text-slate-300">Yerel depolama:</strong> Kullanıcı tercihleri (para birimi, tema vb.) tarayıcınızın localStorage&apos;ında Zustand ile saklanır.</li>
              <li><strong className="text-slate-300">Çerezler:</strong> Oturum yönetimi ve kimlik doğrulama için Clerk tarafından kullanılır.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Verilerin Kullanımı</h2>
            <p>Toplanan veriler yalnızca aşağıdaki amaçlarla kullanılır:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Hesap oluşturma ve kimlik doğrulama</li>
              <li>Finansal takip ve analiz hizmetlerinin sunulması</li>
              <li>AI destekli önerilerin oluşturulması (tüm hesaplamalar istemci tarafında yapılır)</li>
              <li>Uygulama performansının iyileştirilmesi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Veri Paylaşımı</h2>
            <p>
              Kişisel verileriniz üçüncü taraflarla satılmaz veya paylaşılmaz. Yalnızca hizmet sağlayıcılarımız
              (Clerk — kimlik doğrulama, Neon — veritabanı, Vercel — barındırma) teknik altyapı kapsamında
              verilere erişebilir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Veri Güvenliği</h2>
            <p>
              Verileriniz HTTPS ile şifrelenerek iletilir. Veritabanı erişimi yetkilendirme katmanıyla korunur.
              Oturum yönetimi Clerk altyapısı tarafından güvenli şekilde sağlanır.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Veri Saklama ve Silme</h2>
            <p>
              Verileriniz hesabınız aktif olduğu sürece saklanır. Hesabınızı silmek istediğinizde
              tüm ilişkili veriler kalıcı olarak kaldırılır. Silme talebi için bizimle iletişime geçebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. İletişim</h2>
            <p>
              Gizlilik politikamız hakkında sorularınız için{' '}
              <span className="text-cyan-400">support@budgeify.app</span> adresinden bize ulaşabilirsiniz.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
