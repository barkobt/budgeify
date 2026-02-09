/**
 * Dashboard Layout
 *
 * Route Group Hierarchy:
 * / → Landing (public)
 * /sign-in → Auth pages (public)
 * /dashboard → This layout (protected)
 *
 * Responsive Strategy:
 * - Mobile (< lg): PortalNavbar (top) + DockBar (bottom) — padding pt-14 pb-24
 * - Desktop (≥ lg): Sidebar (left) — padding pl-64 (expanded) via CSS, no top/bottom padding
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
      <div className="min-h-screen pt-14 pb-24 lg:pt-0 lg:pb-0">
        {children}
        {/* PortalNavbar + DockBar + Sidebar rendered in DashboardClient with activeTab state */}
      </div>
    </DataSyncProvider>
  );
}
