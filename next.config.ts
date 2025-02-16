import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@/components'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Prevent flash during navigation
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
