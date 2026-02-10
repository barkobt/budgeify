import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="py-8 px-4 border-t border-white/5"
      style={{ background: 'rgba(5, 5, 5, 0.9)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 order-2 sm:order-1">
            © 2026 Budgeify. Tüm hakları saklıdır.
          </p>

          <div className="flex items-center gap-4 order-1 sm:order-2">
            <Link
              href="/privacy"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Gizlilik Politikası
            </Link>
            <span className="text-slate-700" aria-hidden="true">|</span>
            <Link
              href="/terms"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
