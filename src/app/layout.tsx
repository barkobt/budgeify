import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Budgeify - AI-Powered Kisisel Finans',
  description:
    'Yapay zeka destekli, modern ve minimalist kisisel finans yonetimi uygulamasi.',
  keywords: [
    'butce',
    'finans',
    'tasarruf',
    'harcama takibi',
    'kisisel finans',
    'para yonetimi',
  ],
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

const clerkEnabled =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const inner = (
    <html lang="tr" className={inter.variable}>
      <body className="min-h-screen antialiased font-sans noise-overlay">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );

  if (!clerkEnabled) {
    return inner;
  }

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#3B82F6',
          colorBackground: '#0A0A0F',
          colorText: '#E2E8F0',
          colorTextSecondary: '#94A3B8',
          borderRadius: '0.75rem',
        },
        elements: {
          userButtonPopoverCard: '!bg-zinc-900 border border-white/10',
          userButtonPopoverActionButton: 'text-slate-200 hover:!bg-white/10',
          userButtonPopoverActionButtonText: '!text-slate-200',
          userButtonPopoverActionButtonIcon: '!text-slate-400',
          userButtonPopoverFooter: 'hidden',
        },
      }}
    >
      {inner}
    </ClerkProvider>
  );
}