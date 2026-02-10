import Link from 'next/link';
import { Shield, Wifi } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: '#050505' }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      {/* Nebula glow orbs */}
      <div
        className="absolute top-1/4 left-1/3 w-125 h-125 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(157,0,255,0.12) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-100 h-100 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(13,166,242,0.10) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />

      {/* Main content */}
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {children}
      </div>

      {/* Trust badges footer */}
      <div className="relative z-10 mt-12 flex items-center gap-8">
        <div className="flex items-center gap-2 opacity-30 hover:opacity-50 transition-opacity">
          <Shield size={14} className="text-slate-500" />
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-slate-500">
            Quantum Secured
          </span>
        </div>
        <div className="flex items-center gap-2 opacity-30 hover:opacity-50 transition-opacity">
          <Wifi size={14} className="text-slate-500" />
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-slate-500">
            Neural Link Active
          </span>
        </div>
      </div>

      {/* Back to home */}
      <div className="relative z-10 mt-6">
        <Link
          href="/"
          className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
        >
          ← Ana sayfaya dön
        </Link>
      </div>
      </div>
      <Footer />
    </div>
  );
}
