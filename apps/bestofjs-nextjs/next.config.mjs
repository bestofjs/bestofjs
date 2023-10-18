/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  redirects: () => [
    {
      source: "/tags/:tag",
      destination: "/projects?tags=:tag",
      permanent: false,
    },
  ],
};

export default nextConfig;
