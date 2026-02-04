import type { Metadata, Viewport } from 'next';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import './globals.css';

export const metadata: Metadata = {
  title: 'Budgeify - Kişisel Finans Yönetimi',
  description: 'Modern ve minimalist kişisel finans yönetimi uygulaması. Gelir ve giderlerinizi takip edin, harcama alışkanlıklarınızı analiz edin ve finansal hedeflerinize ulaşın.',
  keywords: ['bütçe', 'finans', 'tasarruf', 'harcama takibi', 'gelir gider', 'kişisel finans', 'para yönetimi'],
  authors: [{ name: 'Budgeify Team' }],
  creator: 'Budgeify',
  publisher: 'Budgeify',
  applicationName: 'Budgeify',
  category: 'finance',
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://budgeify.vercel.app',
    title: 'Budgeify - Kişisel Finans Yönetimi',
    description: 'Modern ve minimalist kişisel finans yönetimi uygulaması. Gelir ve giderlerinizi takip edin, tasarruf hedeflerinize ulaşın.',
    siteName: 'Budgeify',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Budgeify - Kişisel Finans Yönetimi',
    description: 'Modern ve minimalist kişisel finans yönetimi uygulaması.',
    creator: '@budgeify',
  },
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
