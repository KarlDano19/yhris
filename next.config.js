/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_API_URL: process.env.NEXT_API_URL
  },
  images: {
    remotePatterns: [
      // Localhost
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/**',
      },
      // Staging
      {
        protocol: 'https',
        hostname: 's1-api.yahshuahris.com',
        port: '',
        pathname: '/**',
      },
      // Production
      {
        protocol: 'https',
        hostname: 'yahshua-hris-bucket.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: false,
  experimental: {},
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/landing-page',
        destination: '/',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: '/ingest/static/:path*',
          destination: 'https://us-assets.i.posthog.com/static/:path*',
        },
        {
          source: '/ingest/:path*',
          destination: 'https://us.i.posthog.com/:path*',
        },
        {
          source: '/ingest/decide',
          destination: 'https://us.i.posthog.com/decide',
        },
      ],
      fallback: [],
    };
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;