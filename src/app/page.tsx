/**
 * Landing Page — P8 Server Component Wrapper
 *
 * Server component enables proper metadata exports for SEO/Lighthouse.
 * Interactive content is delegated to LandingClient (client component).
 */

import type { Metadata } from 'next';
import LandingClient from '@/components/landing/LandingClient';

export const metadata: Metadata = {
  title: 'Budgeify - Bütçenizi Yapay Zeka ile Yönetin',
  description:
    'Yapay zekâ destekli kişisel finans yönetim platformu. Harcama takibi, bütçe optimizasyonu ve akıllı tasarruf önerileri ile finansal özgürlüğünüze ulaşın.',
  keywords: [
    'kişisel finans',
    'bütçe yönetimi',
    'harcama takibi',
    'tasarruf',
    'yapay zeka finans',
    'yapay zeka bütçe yönetimi',
    'finansal planlama',
  ],
  openGraph: {
    title: 'Budgeify - Bütçenizi Yapay Zeka ile Yönetin',
    description:
      'Yapay zekâ destekli kişisel finans yönetim platformu. Harcama takibi, bütçe optimizasyonu ve akıllı tasarruf önerileri.',
    type: 'website',
    locale: 'tr_TR',
    url: 'https://budgeify.vercel.app',
    siteName: 'Budgeify',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Budgeify - Yapay Zeka Destekli Kişisel Finans',
    description: 'Yapay zekâ destekli kişisel finans yönetim platformu.',
  },
  alternates: {
    canonical: 'https://budgeify.vercel.app',
  },
};

export default function LandingPage() {
  return <LandingClient />;
}
