/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    hostName: 'http://127.0.0.1:8000',
  },
  experimental: {
    appDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
