/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential optimizations only
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Enable compression for production
  compress: true,
  
  // Minimal webpack config for faster dev builds
  webpack: (config, { dev, isServer }) => {
    // Only apply optimizations in development for faster builds
    if (dev) {
      config.watchOptions = {
        poll: false, // Disable polling for faster builds
        aggregateTimeout: 200,
      }
      
      // Reduce build time in development
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      }
    }
    
    // Essential Node.js fallbacks only
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    
    return config
  },
  
  // Optimizaciones de imágenes
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Headers de caché
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
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  
  // Compresión
  compress: true,
  
  // Optimizaciones de producción
  ...(process.env.NODE_ENV === 'production' && {
    swcMinify: true,
    compiler: {
      removeConsole: true,
    },
  }),
}

export default nextConfig
