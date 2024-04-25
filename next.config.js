/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_REMOTE_PATTERNS_PROTOCOL,
        hostname: process.env.NEXT_REMOTE_PATTERNS_HOSTNAME,
        port: process.env.NEXT_REMOTE_PATTERNS_PORT,
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: false,
  experimental: {},
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
