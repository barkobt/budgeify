/**
 * Dashboard Layout
 *
 * 🎓 MENTOR NOTU - Protected Layout:
 * ----------------------------------
 * Bu layout sadece authenticated kullanıcılar için.
 * Middleware zaten kontrol ediyor ama burada da Header ve
 * BottomNav'ı gösteriyoruz.
 *
 * Route Group Hierarchy:
 * / → Landing (public)
 * /sign-in → Auth pages (public)
 * /dashboard → This layout (protected)
 */

import Header from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-16 pb-24">
      <Header />
      {children}
      {/* BottomNav is rendered in page.tsx with tab state */}
    </div>
  );
}
