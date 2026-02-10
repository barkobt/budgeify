import type { Metadata } from 'next';
import PricingClient from '@/components/landing/PricingClient';

export const metadata: Metadata = {
  title: 'Fiyatlandırma | Budgeify',
  description:
    'Budgeify fiyatlandırma planları. Yapay zeka destekli finansal yönetim için aylık ve yıllık planlar.',
  openGraph: {
    title: 'Fiyatlandırma | Budgeify',
    description: 'Yapay zeka destekli finansal yönetim için uygun fiyatlı planlar.',
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
