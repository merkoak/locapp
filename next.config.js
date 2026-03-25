/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // www'suz → www'lu yönlendirme
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'locapp.ai' }],
        destination: 'https://www.locapp.ai/:path*',
        permanent: true,
      },
      // 404 olan alt sayfalar
      {
        source: '/use-cases/saas',
        destination: '/use-cases',
        permanent: true,
      },
      {
        source: '/use-cases/ecommerce',
        destination: '/use-cases',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;