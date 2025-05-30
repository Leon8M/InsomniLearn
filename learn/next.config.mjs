 import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rules: {
    'react/no-unescaped-entities': 'off',
  },
};
if (process.env.NODE_ENV === 'development') {
   await setupDevPlatform();
 }

export default nextConfig