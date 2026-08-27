import type { Metadata } from 'next';
import { siteConfig } from '@/shared/config/site';
import ForgeLanding from '@/app/components/landing/forge-landing';

export const metadata: Metadata = {
  title: { absolute: siteConfig.titleAlt },
};

export default function HomePage() {
  return <ForgeLanding />;
}
     
