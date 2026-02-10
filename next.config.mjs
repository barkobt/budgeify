/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // P10: Deterministic build ID — prevents version mismatch across devices
  generateBuildId: async () => {
    const sha =
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.GIT_COMMIT_SHA ||
      'dev';

    return `build-${String(sha).slice(0, 12)}`;
  },

  // P8: Tree-shake heavy libraries — only import used exports
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'date-fns',
      'recharts',
      'zod',
    ],
  },

  // P8: Image optimization — sharp is installed as devDep
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // P8: Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // P8: Strict output for smaller bundles
  poweredByHeader: false,

  // Security headers + P8 cache-control + P10 CSP + anti-stale
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://*.clerk.accounts.dev https://*.clerk.accounts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://img.clerk.com https://*.clerk.com https://*.clerk.accounts.dev https://*.clerk.accounts.com https://*.gravatar.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://*.clerk.accounts.com https://*.neon.tech wss://*.neon.tech https://clerk-telemetry.com",
              "worker-src 'self' blob:",
              "frame-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://*.clerk.accounts.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // P10: Prevent stale HTML across devices — no browser cache for pages
      {
        source: '/:path((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|css|js)).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Surrogate-Control',
            value: 'no-store',
          },
        ],
      },
      // P8: Immutable cache for hashed static assets
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // P8: Long cache for public assets (icons, manifest)
      {
        source: '/:path(.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
