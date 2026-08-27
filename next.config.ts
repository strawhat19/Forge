import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

// Keep page implementations under (main)/pages so they inherit the same
// loader, header, footer, fonts, and global styles as the home page. Add a
// folder name here when a new clean top-level page is introduced.
const pageRoutes = {
  docs: 'docs',
  plans: 'plans',
  product: 'product',
  features: 'features',
  download: 'download',
  notifications: 'notifications',
  workflows: 'workflows',
  'sign-in': 'signin',
  'sign-up': 'signup',
} as const;

const nextConfig: NextConfig = {
  turbopack: {},
  devIndicators: false,
  reactStrictMode: true,
  rewrites: async () => [
    ...Object.entries(pageRoutes).map(([route, page]) => ({
      source: `/${route}`,
      destination: `/pages/${page}`,
    })),
  ],
  redirects: async () => [
    {
      source: '/signin',
      destination: '/sign-in',
      permanent: true,
    },
    {
      source: '/signup',
      destination: '/sign-up',
      permanent: true,
    },
    {
      source: '/login',
      destination: '/sign-in',
      permanent: true,
    },
    {
      source: '/register',
      destination: '/sign-up',
      permanent: true,
    },
    {
      source: '/overview',
      destination: '/product',
      permanent: true,
    },
    {
      source: '/pages/signin',
      destination: '/sign-in',
      permanent: true,
    },
    {
      source: '/pages/signup',
      destination: '/sign-up',
      permanent: true,
    },
    ...Object.entries(pageRoutes)
      .filter(([route, page]) => route === page)
      .map(([route, page]) => ({
        source: `/pages/${page}`,
        destination: `/${route}`,
        permanent: true,
      })),
  ],
  images: {
    remotePatterns: [
      {
        pathname: '/**',
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'raw.githubusercontent.com',
    '*.raw.githubusercontent.com',
  ],
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV !== 'production',
})(nextConfig as unknown as Parameters<typeof withPWA>[0]);
