/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Force Vercel to rebuild and deploy Workshop Manager
  // Deployment timestamp: 2026-07-23T08:10:00Z
  modularizeImports: {
    '@supabase/supabase-js': {
      transform: '@supabase/supabase-js',
    },
  },
}

module.exports = nextConfig
