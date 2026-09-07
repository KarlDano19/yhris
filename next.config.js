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
      // Portless local dev (main checkout or worktree — see NEXT_REMOTE_PATTERNS_HOSTNAME in .env)
      ...(process.env.NEXT_REMOTE_PATTERNS_HOSTNAME
        ? [{
            protocol: 'https',
            hostname: process.env.NEXT_REMOTE_PATTERNS_HOSTNAME,
            pathname: '/**',
          }]
        : []),
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
  devIndicators: {
    position: 'top-left',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    const trailingSlashPages = [
      '/features',
      '/pricing',
      '/yahshua-payroll',
      '/payroll-integration',
      '/vs-sprout',
      '/how-we-compare',
      '/use-cases',
      '/use-cases/employee-onboarding',
      '/use-cases/performance-management',
      '/use-cases/employee-documentation',
      '/blog',
      '/blog/dole-compliance-requirements-philippines',
      '/faqs',
      '/docs',
      '/jobs',
      '/privacy-notice',
      '/privacy-policy',
      '/terms-of-service',
    ];

    return [
      // Canonical host redirect: www and non-www were both serving 200 with
      // no redirect, so Google indexed and ranked both separately (confirmed
      // via GSC: split traffic on the homepage, /yahshua-payroll, /pricing,
      // /faqs, /terms-of-service, plus 16 warnings on the www sitemap
      // submission). The canonical tag alone wasn't enough to stop this.
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.yahshuahris.com',
          },
        ],
        destination: 'https://yahshuahris.com/:path*',
        permanent: true,
      },
      {
        source: '/landing-page/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/landing-page',
        destination: '/',
        permanent: true,
      },
      {
        source: '/book-demo',
        destination: 'https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=hris_2026',
        permanent: true,
      },
      // Strip trailing slashes on all landing pages (skipTrailingSlashRedirect
      // is enabled for PostHog, so we handle this manually per-page)
      ...trailingSlashPages.map((path) => ({
        source: `${path}/`,
        destination: path,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
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