/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  modularizeImports: {
    '@supabase/supabase-js': {
      transform: '@supabase/supabase-js',
    },
  },
}

module.exports = nextConfig
