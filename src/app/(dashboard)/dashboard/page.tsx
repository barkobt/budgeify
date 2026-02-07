/**
 * Dashboard Page — Sovereign v4.6 (Server Component Wrapper)
 *
 * Async server component with temporary 2s delay to ensure
 * cinematic pre-flight loading screen (loading.tsx) is visible.
 * Client logic extracted to DashboardClient.tsx.
 */

import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  // Temporary pre-flight delay — shows cinematic loading.tsx for 2s
  await new Promise((res) => setTimeout(res, 2000));

  return <DashboardClient />;
}
