import type { Metadata, Viewport } from 'next';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import './globals.css';

export const metadata: Metadata = {
  title: 'Budgeify - Kişisel Finans Yönetimi',
  description: 'Modern ve minimalist kişisel finans yönetimi uygulaması. Gelir ve giderlerinizi takip edin, tasarruf hedeflerinize ulaşın.',
  keywords: ['bütçe', 'finans', 'tasarruf', 'harcama takibi', 'gelir gider'],
  authors: [{ name: 'Budgeify Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1E40AF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-slate-50 antialiased pt-16 pb-24">
        <Header />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <BottomNav />
      </body>
    </html>
  );
}
