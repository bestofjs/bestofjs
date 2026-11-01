import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
