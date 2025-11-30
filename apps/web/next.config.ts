import type { NextConfig } from "next";

import { env } from "./src/env.mjs";

const ONE_DAY = 60 * 60 * 24;

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    daily: {
      stale: ONE_DAY,
      revalidate: ONE_DAY,
      expire: ONE_DAY * 7,
    },
    monthly: {
      stale: ONE_DAY * 30,
      revalidate: ONE_DAY * 30,
      expire: ONE_DAY * 30 * 12,
    },
    forever: {
      // For historical data that never changes (like past monthly rankings)
      stale: ONE_DAY * 365 * 10, // 10 years
      revalidate: ONE_DAY * 365 * 10,
      expire: ONE_DAY * 365 * 10,
    },
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
    // We want GitHub avatars only in 2 sizes:
    // - 48px (in tables)
    // - 75px (in details page)
    // and we need the retina version.
    deviceSizes: [],
    imageSizes: [48, 75, 96, 150],
  },
  redirects: async () => {
    const { year, month } = await fetchLatestRankings();
    return [
      {
        source: "/tags/:tag",
        destination: "/projects?tags=:tag",
        permanent: false,
      },
      {
        source: "/rankings/monthly",
        destination: `/rankings/monthly/${year}/${month}`,
        permanent: false,
      },
    ];
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

function fetchLatestRankings() {
  const url = `${env.RANKINGS_ROOT_URL}/monthly/latest`;
  console.log("Fetching latest rankings from", url);
  const options = { next: { tags: ["monthly", "latest"] } };
  const data = fetch(url, options).then((res) => res.json());
  return data;
}

export default nextConfig;
