import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/demo',
        destination: '/demo/index.html',
      },
      {
        source: '/demo/:path*',
        destination: '/demo/:path*',
      },
    ]
  },
}

export default nextConfig
