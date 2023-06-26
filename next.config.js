/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: 'http://127.0.0.1:8000',
    IMG_URL: 'http://django-app:8000',
    GOOGLE_KEY: 'ADD_YOUR_KEY_HERE'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'django-app',
        port: '8000',
        pathname: '**',
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    appDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
