/**
 * Dashboard Page — Sovereign v4.6 (Server Component Wrapper)
 *
 * Sync server component. Cinematic entrance animation is handled
 * client-side in DashboardClient.tsx — no artificial delay here.
 * This prevents loading.tsx from blocking during sign-out navigation.
 */

import DashboardClient from './DashboardClient';

export default function DashboardPage() {
  return <DashboardClient />;
}
