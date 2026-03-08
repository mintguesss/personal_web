/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/personal_web',
  images: { unoptimized: true },
  generateBuildId: async () => {
    return Date.now().toString()   // 每次 build 都是新的 ID
  },
}
module.exports = nextConfig