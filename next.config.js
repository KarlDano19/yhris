/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    hostName: 'http://139.59.118.36:8000',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '139.59.118.36',
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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["139.59.118.36"]
  },
}

module.exports = nextConfig
