import '../globals.scss';

import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/shared/config/site';
import SiteHeader from '@/app/components/chrome/site-header';
import SiteFooter from '@/app/components/chrome/site-footer';
import { Barlow_Condensed, Geist, Geist_Mono } from 'next/font/google';
import ForgeLoader from '@/app/components/loaders/forge-loader/forge-loader';

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
});

const sans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#050608',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s / ${siteConfig.title}`,
  },
  description: siteConfig.description,
  icons: {
    icon: `/${siteConfig.logo}`,
    apple: `/${siteConfig.logo}`,
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: `/${siteConfig.logo}`, width: 460, height: 518, alt: 'Forge' }],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`/${siteConfig.logo}`],
  },
};

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{`.forgeLoader{display:none!important}.heroReveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <ForgeLoader />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
