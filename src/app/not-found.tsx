/**
 * Custom 404 Not Found Page — P10
 *
 * Dark theme matching Depth Black design.
 * Provides clear navigation back to home or dashboard.
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
      style={{ background: '#050505' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* 404 Code */}
        <h1 className="text-8xl sm:text-9xl font-black text-white/10 font-display select-none mb-2">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-display">
          Sayfa Bulunamadı
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto mb-8">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 text-sm font-bold text-white btn-portal-gradient rounded-full uppercase tracking-wider"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 text-sm font-medium text-slate-300 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
