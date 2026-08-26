import '../globals.scss';

import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/shared/config/site';
import SiteHeader from '@/app/components/chrome/site-header';
import SiteFooter from '@/app/components/chrome/site-footer';
import ScrollToTop from '@/app/components/effects/scroll-to-top';
import { Barlow_Condensed, Geist, Geist_Mono } from 'next/font/google';
import ForgeLoader from '@/app/components/loaders/forge-loader/forge-loader';

const display = Barlow_Condensed({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800'],
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
    default: siteConfig.titleAlt,
    template: `%s / ${siteConfig.titleAlt}`,
  },
  description: siteConfig.description,
  icons: {
    icon: `/${siteConfig.logoAlt}`,
    apple: `/${siteConfig.logoAlt}`,
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: `/${siteConfig.logoAlt}`, width: 460, height: 518, alt: 'Forge' }],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`/${siteConfig.logoAlt}`],
  },
};

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{`.forgeLoader{display:none!important}.heroReveal{opacity:1!important;transform:none!important}.siteHeader{visibility:visible!important;opacity:1!important;pointer-events:auto!important;transform:translateX(-50%)!important}`}</style>
        </noscript>
        <ForgeLoader />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <ScrollToTop />
      </body>
    </html>
  );
}
