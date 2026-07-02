/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force semua halaman sebagai client-side only
  experimental: {
    forceSwcTransforms: true,
  },
  // Disable static generation
  output: 'standalone',
  // Ignore TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;