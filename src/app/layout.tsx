import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '600', '700', '800'],
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
  icons: {
    icon: '/favicon-32.png',
    apple: '/apple-icon-180.png',
  },
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
  themeColor: '#000000',
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
    <html lang="tr" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen antialiased font-sans">
        {/* v4.0: Ambient Gradient Orbs — Depth Layer System */}
        <div className="ambient-layer" aria-hidden="true">
          <div className="ambient-orb-indigo" />
          <div className="ambient-orb-violet" />
        </div>
        <ErrorBoundary>{children}</ErrorBoundary>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e2e8f0',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
      </body>
    </html>
  );

  if (!clerkEnabled) {
    return inner;
  }

  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      appearance={{
        variables: {
          colorPrimary: '#4F46E5',
          colorBackground: '#000000',
          colorText: '#E2E8F0',
          colorTextSecondary: '#94A3B8',
          borderRadius: '0.75rem',
        },
        elements: {
          userButtonPopoverCard: '!bg-zinc-900 border border-white/10',
          userButtonPopoverActions: '!bg-transparent',
          userButtonPopoverActionButton: '!text-slate-200 hover:!bg-white/10',
          userButtonPopoverActionButtonText: '!text-slate-200',
          userButtonPopoverActionButtonIcon: '!text-slate-400',
          userPreviewMainIdentifier: '!text-white',
          userPreviewSecondaryIdentifier: '!text-slate-400',
          userButtonPopoverFooter: 'hidden',
        },
      }}
    >
      {inner}
    </ClerkProvider>
  );
}