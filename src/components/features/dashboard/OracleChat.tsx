'use client';

import React from 'react';
import { DesktopAICard } from '@/components/features/dashboard/DesktopAICard';

/**
 * OracleChat wraps Oracle-powered desktop recommendations.
 * Keep this split so it can be dynamically imported only when Oracle is enabled.
 */
export const OracleChat: React.FC = () => {
  return <DesktopAICard />;
};

export default OracleChat;
