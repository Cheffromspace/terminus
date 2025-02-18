import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // Optimize imports for faster module loading
    optimizePackageImports: ['@/components'],
    // Enable CSS optimization
    optimizeCss: true,
    // Enable build worker for faster builds
    webpackBuildWorker: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Prevent flash during navigation
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Webpack configuration focused on text content optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 10000,
          maxSize: 30000,
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },

  // Headers optimized for text content
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
