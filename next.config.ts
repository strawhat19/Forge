import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

type PageRoute = {
  page?: string;
  redirects: readonly string[];
};

// Add a public route key and its aliases here. The page folder defaults to the
// route key; set `page` only when the implementation folder has a different name.
const pageRoutes = {
  docs: { redirects: [] },
  plans: { redirects: [] },
  features: { redirects: [] },
  download: { redirects: [] },
  profile: { redirects: [] },
  dashboard: { redirects: [] },
  workflows: { redirects: [] },
  notifications: { redirects: [] },
  product: { redirects: ['overview'] },
  'sign-in': { page: 'signin', redirects: ['signin', 'login'] },
  'sign-up': { page: 'signup', redirects: ['signup', 'register'] },
} as const satisfies Record<string, PageRoute>;

const getPageFolder = (route: string, config: PageRoute) => config.page ?? route;

const nextConfig: NextConfig = {
  turbopack: {},
  devIndicators: false,
  reactStrictMode: true,
  rewrites: async () => [
    ...Object.entries(pageRoutes).map(([route, config]) => ({
      source: `/${route}`,
      destination: `/pages/${getPageFolder(route, config)}`,
    })),
  ],
  redirects: async () => [
    ...Object.entries(pageRoutes).flatMap(([route, config]) => {
      const page = getPageFolder(route, config);

      return [
        ...config.redirects.map(alias => ({
          source: `/${alias}`,
          destination: `/${route}`,
          permanent: true,
        })),
        {
          source: `/pages/${page}`,
          destination: `/${route}`,
          permanent: true,
        },
      ];
    }),
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
