/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    hostName: 'http://192.168.10.167:8000',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.10.167',
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
