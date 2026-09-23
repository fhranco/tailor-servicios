import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin(
  './src/i18n.ts'
);
 
/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';

const nextConfig = {
  poweredByHeader: false,
  transpilePackages: ['framer-motion', 'motion-dom', 'motion-utils'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/es',
        destination: '/',
        permanent: true,
      },
      {
        source: '/es/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com"
      : "script-src 'self' 'unsafe-inline' https://maps.googleapis.com";

    const connectSrc = isDev
      ? "connect-src 'self' ws: wss: http://localhost:* https://*.supabase.co wss://*.supabase.co"
      : "connect-src 'self' https://*.supabase.co wss://*.supabase.co";

    const cspDirectives = [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://maps.gstatic.com https://*.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "frame-src 'self' https://maps.google.com https://www.google.com",
      connectSrc,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ];

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: cspDirectives.join('; ') },
        ],
      },
      {
        source: '/admin',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: '/en/admin',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: '/en/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
    ];
  },
};
 
export default withNextIntl(nextConfig);
