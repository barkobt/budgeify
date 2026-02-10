/**
 * Dashboard Page — Sovereign v4.6 (Server Component Wrapper)
 *
 * Sync server component. Cinematic entrance animation is handled
 * client-side in DashboardClient.tsx — no artificial delay here.
 * This prevents loading.tsx from blocking during sign-out navigation.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import DashboardClient from './DashboardClient';

export default function DashboardPage() {
  return <DashboardClient />;
}
