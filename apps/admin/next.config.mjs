/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
