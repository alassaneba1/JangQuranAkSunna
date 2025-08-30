/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'minio',
      'cdn.jangquranaksunna.org',
      'storage.googleapis.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/jangquranaksunna/**',
      },
      {
        protocol: 'http',
        hostname: 'minio',
        port: '9000',
        pathname: '/jangquranaksunna/**',
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl && apiUrl.trim().length > 0) {
      return [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/:path*`,
        },
      ];
    }
    return [];
  },
  async headers() {
    const securityHeaders = [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
    ]

    // Add frame protection outside development to allow embedding in local preview
    if (process.env.NODE_ENV !== 'development') {
      securityHeaders.unshift({ key: 'X-Frame-Options', value: 'DENY' })
    }

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  eslint: {
    dirs: ['src'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
