import type { Metadata } from 'next';
import ForgeLanding from '@/app/components/landing/forge-landing';

export const metadata: Metadata = {
  title: 'Forge',
};

export default function HomePage() {
  return <ForgeLanding />;
}
     