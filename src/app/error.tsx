'use client';

/**
 * Custom Error Page — P10
 *
 * Next.js error boundary for runtime errors.
 * Dark theme matching Depth Black design.
 * Provides reset and navigation options.
 */

import { useEffect } from 'react';
import { reportError } from '@/lib/error-reporting';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, {
      context: 'ErrorPage',
      extra: { digest: error.digest },
      level: 'error',
    });
  }, [error]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
      style={{ background: '#050505' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(239,68,68,0.10) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F87171"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-display">
          Bir Hata Oluştu
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto mb-8">
          Üzgünüz, beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 text-sm font-bold text-white btn-portal-gradient rounded-full uppercase tracking-wider cursor-pointer"
          >
            Tekrar Dene
          </button>
          <a
            href="/"
            className="px-6 py-3 text-sm font-medium text-slate-300 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
          >
            Ana Sayfa
          </a>
        </div>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="mt-6 text-xs text-slate-600 font-mono">
            Hata Kodu: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
