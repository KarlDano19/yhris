/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
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
};

module.exports = nextConfig;
