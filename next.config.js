/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   images: {
      domains: [
         'imgs.search.brave.com',
         'course-api.com',
         'gateway.pinata.cloud',
      ],
   },
};

module.exports = nextConfig;
