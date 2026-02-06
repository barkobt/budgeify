import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Budgeify - AI-Powered Kisisel Finans',
  description: 'Yapay zeka destekli, modern ve minimalist kisisel finans yonetimi uygulamasi.',
  keywords: ['butce', 'finans', 'tasarruf', 'harcama takibi', 'kisisel finans', 'para yonetimi'],
  authors: [{ name: 'Budgeify Team' }],
  applicationName: 'Budgeify',
  category: 'finance',
  manifest: '/manifest.json',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://budgeify.vercel.app',
    title: 'Budgeify - AI-Powered Kisisel Finans',
    description: 'Yapay zeka destekli kisisel finans uygulamasi.',
    siteName: 'Budgeify',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#050505',
};

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const inner = (
    <html lang="tr" className={inter.variable}>
      <body className="min-h-screen antialiased font-sans noise-overlay">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );

  if (!clerkEnabled) {
    return inner;
  }

  // Dynamic import — Clerk only loaded when keys exist
  const { ClerkProvider } = await import('@clerk/nextjs');

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#3B82F6',
          colorBackground: '#050505',
          colorText: '#E2E8F0',
          colorTextSecondary: '#94A3B8',
          borderRadius: '0.75rem',
        },
      }}
    >
      {inner}
    </ClerkProvider>
  );
}
