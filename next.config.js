/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@internal/design-system'],
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
