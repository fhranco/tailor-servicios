import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin(
  './src/i18n.ts'
);
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['framer-motion', 'motion-dom', 'motion-utils'],
};
 
export default withNextIntl(nextConfig);
