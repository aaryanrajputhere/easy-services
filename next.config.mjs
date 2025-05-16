/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['vercel-blob.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
    ],
  },
  // Add experimental options to help with middleware
  experimental: {
    // Increase middleware timeout
    serverComponentsExternalPackages: ['@vercel/blob'],
  },
  // Increase serverless function timeout
  serverRuntimeConfig: {
    maxDuration: 60, // 60 seconds
  },
  // Add this to ensure proper domain handling
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
    ]
  },
}

export default nextConfig
