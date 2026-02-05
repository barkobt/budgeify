/**
 * Auth Layout
 *
 * 🎓 MENTOR NOTU - Route Groups:
 * -----------------------------
 * (auth) parantezli klasör = "Route Group"
 * Bu, URL'e yansımaz ama layout paylaşımı sağlar.
 *
 * /sign-in → src/app/(auth)/sign-in/page.tsx
 * /sign-up → src/app/(auth)/sign-up/page.tsx
 *
 * Her ikisi de bu layout'u kullanır ama URL'de (auth) yok.
 *
 * Route groups kullanım alanları:
 * - Ortak layout paylaşımı
 * - Kod organizasyonu
 * - Loading/Error state gruplandırma
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth sayfaları için Header/BottomNav göstermiyoruz
  // Sadece temiz, odaklı bir authentication deneyimi
  return <>{children}</>;
}
