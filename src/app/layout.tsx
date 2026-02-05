import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import './globals.css';

/**
 * 🎓 MENTOR NOTU - ClerkProvider:
 * ------------------------------
 * ClerkProvider, Clerk authentication context'ini sağlar.
 * Tüm uygulama bu provider ile sarılmalı ki:
 * - useUser(), useAuth() hook'ları çalışsın
 * - <SignIn/>, <UserButton/> bileşenleri çalışsın
 * - Session yönetimi otomatik olsun
 */

// Inter Variable Font - Premium Typography
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Budgeify - AI-Powered Kişisel Finans',
  description: 'Yapay zeka destekli, modern ve minimalist kişisel finans yönetimi uygulaması. Gelir ve giderlerinizi takip edin, akıllı tasarruf önerileri alın.',
  keywords: ['bütçe', 'finans', 'tasarruf', 'harcama takibi', 'gelir gider', 'kişisel finans', 'para yönetimi', 'ai', 'yapay zeka'],
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
    title: 'Budgeify - AI-Powered Kişisel Finans',
    description: 'Yapay zeka destekli, modern kişisel finans yönetimi. Akıllı tasarruf önerileri ve harcama analizi.',
    siteName: 'Budgeify',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Budgeify - AI-Powered Kişisel Finans',
    description: 'Yapay zeka destekli kişisel finans uygulaması.',
    creator: '@budgeify',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#080B14',
};

/**
 * 🎓 MENTOR NOTU - Root Layout:
 * ----------------------------
 * ClerkProvider tüm uygulamayı sarmalıyor.
 * Bu sayede useAuth(), useUser() hook'ları her yerde çalışır.
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#3B82F6',
          colorBackground: '#0D1321',
          colorText: '#E2E8F0',
          colorTextSecondary: '#94A3B8',
          borderRadius: '0.75rem',
        },
      }}
    >
      <html lang="tr" className={inter.variable}>
        <body className="min-h-screen antialiased font-sans">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
