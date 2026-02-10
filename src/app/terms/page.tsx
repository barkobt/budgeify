import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları | Budgeify',
  description: 'Budgeify kullanım koşulları — hizmet şartları ve sorumluluklar.',
};

export default function TermsPage() {
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
          Kullanım Koşulları
        </h1>
        <p className="text-sm text-slate-500 mb-10">
          Son güncelleme: 10 Şubat 2026
        </p>

        <div className="space-y-8 text-sm text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Hizmet Tanımı</h2>
            <p>
              Budgeify, kişisel finans takibi ve bütçe yönetimi için tasarlanmış bir web uygulamasıdır.
              Uygulama &quot;olduğu gibi&quot; (as is) sunulmaktadır ve herhangi bir garanti verilmemektedir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Finansal Sorumluluk Reddi</h2>
            <p>
              Budgeify bir finansal danışmanlık hizmeti <strong className="text-slate-300">değildir</strong>.
              Uygulama içindeki AI destekli öneriler, analizler ve projeksiyonlar yalnızca bilgilendirme
              amaçlıdır. Yatırım, tasarruf veya harcama kararlarınız tamamen sizin sorumluluğunuzdadır.
              Profesyonel finansal danışmanlık için lisanslı bir uzmana başvurmanızı öneririz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Hesap Sorumluluğu</h2>
            <p>
              Hesabınızın güvenliğinden siz sorumlusunuz. Giriş bilgilerinizi başkalarıyla paylaşmamalısınız.
              Hesabınızda yetkisiz erişim tespit ederseniz derhal bizimle iletişime geçmelisiniz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Kabul Edilebilir Kullanım</h2>
            <p className="mb-2">Aşağıdaki davranışlar yasaktır:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Uygulamayı yasa dışı amaçlarla kullanmak</li>
              <li>Sisteme yetkisiz erişim sağlamaya çalışmak</li>
              <li>Diğer kullanıcıların verilerine erişmeye çalışmak</li>
              <li>Uygulamanın altyapısına zarar verecek eylemler gerçekleştirmek</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Sorumluluk Sınırlaması</h2>
            <p>
              Budgeify, uygulamanın kullanımından kaynaklanan doğrudan veya dolaylı zararlardan
              sorumlu tutulamaz. Veri kaybı, hizmet kesintisi veya finansal kayıplar dahil olmak üzere
              hiçbir durumda sorumluluk kabul edilmez.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Değişiklikler</h2>
            <p>
              Bu kullanım koşulları önceden bildirimde bulunmaksızın güncellenebilir.
              Güncellemeler bu sayfada yayınlandığı anda yürürlüğe girer.
              Uygulamayı kullanmaya devam etmeniz, güncellenmiş koşulları kabul ettiğiniz anlamına gelir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. İletişim</h2>
            <p>
              Kullanım koşulları hakkında sorularınız için{' '}
              <span className="text-cyan-400">support@budgeify.app</span> adresinden bize ulaşabilirsiniz.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
