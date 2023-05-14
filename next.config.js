/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    hostName: 'http://127.0.0.1:8000',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
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
