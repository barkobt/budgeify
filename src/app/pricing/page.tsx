import type { Metadata } from 'next';
import PricingClient from '@/components/landing/PricingClient';

export const metadata: Metadata = {
  title: 'Fiyatlandırma | Budgeify',
  description:
    'Budgeify fiyatlandırma planları. AI destekli finansal yönetim için aylık ve yıllık planlar.',
  openGraph: {
    title: 'Fiyatlandırma | Budgeify',
    description: 'AI destekli finansal yönetim için uygun fiyatlı planlar.',
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
