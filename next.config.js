/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_API_URL: process.env.NEXT_API_URL
  },
  images: {
    remotePatterns: [
      //Localhost
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
      //Staging
      {
        protocol: 'https',
        hostname: 'https://s1-api.yahshuahris.com',
        port: '',
        pathname: '/**',
      },
      //Production
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
