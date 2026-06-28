import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'lexflow.co.uk' }],
        destination: 'https://www.lexflow.co.uk/:path*',
        permanent: true,
      },
    ]
  },
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
