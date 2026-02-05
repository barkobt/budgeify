'use client';

import React from 'react';
import { LucideIcon, Inbox, ChartNoAxesCombined, TrendingUp, Target, Wallet } from 'lucide-react';

type EmptyStateVariant = 'default' | 'chart' | 'trend' | 'goal' | 'transaction';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  variant?: EmptyStateVariant;
}

const variantIcons: Record<EmptyStateVariant, LucideIcon> = {
  default: Inbox,
  chart: ChartNoAxesCombined,
  trend: TrendingUp,
  goal: Target,
  transaction: Wallet,
};

/**
 * EmptyState - Elegant empty state component with minimalist illustration
 *
 * Features glass card styling with cosmic dark theme
 * Uses Lucide icons for professional Linear-style appearance
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  variant = 'default',
}) => {
  const IconComponent = icon || variantIcons[variant];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fadeIn">
      {/* Icon Container with Glass Effect */}
      <div className="relative mb-6">
        {/* Ambient glow */}
        <div className="absolute inset-0 rounded-full bg-accent-500/20 blur-xl scale-150" />

        {/* Icon circle */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full glass-card">
          <IconComponent
            className="h-10 w-10 text-accent-400"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-200 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
        {description}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-accent-600 hover:bg-accent-500
                     text-white text-sm font-medium
                     transition-all duration-200
                     hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]
                     press-scale focus-ring"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
