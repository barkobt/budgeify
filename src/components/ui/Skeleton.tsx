'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines,
}: SkeletonProps) {
  const baseClass = 'animate-pulse bg-white/[0.06] shimmer';

  const style: React.CSSProperties = {
    width: width ?? undefined,
    height: height ?? undefined,
  };

  if (variant === 'circular') {
    return (
      <div
        className={`${baseClass} rounded-full ${className}`}
        style={style}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'text' && lines) {
    return (
      <div className={`space-y-2 ${className}`} aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClass} rounded h-3`}
            style={{ width: i === lines - 1 ? '75%' : '100%' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClass} rounded-xl ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`glass-card rounded-2xl p-5 space-y-4 ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="space-y-2 flex-1">
          <Skeleton height={14} width="60%" />
          <Skeleton height={10} width="40%" />
        </div>
      </div>
      <Skeleton height={32} width="50%" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton height={60} className="rounded-xl" />
        <Skeleton height={60} className="rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonList({
  count = 3,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-subtle rounded-xl p-4 flex items-center gap-3">
          <Skeleton variant="circular" width={36} height={36} />
          <div className="flex-1 space-y-2">
            <Skeleton height={12} width="70%" />
            <Skeleton height={10} width="40%" />
          </div>
          <Skeleton height={16} width={60} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ className = '' }: { className?: string }) {
  return (
    <div
      className={`glass-card rounded-2xl p-5 space-y-4 ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <Skeleton height={16} width={120} />
        <Skeleton height={24} width={80} className="rounded-lg" />
      </div>
      <Skeleton height={180} className="rounded-xl" />
    </div>
  );
}
