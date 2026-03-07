/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/personal_web',        // ← 加這行
  images: { unoptimized: true },
}
module.exports = nextConfig