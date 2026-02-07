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
 *
 * DataSyncProvider:
 * Zustand store ile Neon database arasında senkronizasyon sağlar.
 */

import { DataSyncProvider } from '@/providers/DataSyncProvider';
import { SkipNav } from '@/components/ui/SkipNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataSyncProvider>
      <SkipNav />
      <div className="min-h-screen pt-14 pb-24">
        {children}
        {/* PortalNavbar + DockBar rendered in page.tsx with activeTab state */}
      </div>
    </DataSyncProvider>
  );
}
