/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    hostName: 'https://5bd3-103-62-152-147.ngrok-free.app',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '5bd3-103-62-152-147.ngrok-free.app',
        port: '',
        pathname: '**',
      },
    ],
  },
  experimental: {
    appDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
