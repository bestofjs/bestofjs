import withBundleAnalyzer from "@next/bundle-analyzer";

import { env } from "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

function fetchLatestRankings() {
  const url = `${env.RANKINGS_ROOT_URL}/monthly/latest`;
  console.log("Fetching latest rankings from", url);
  const options = { next: { tags: ["monthly", "latest"] } };
  const data = fetch(url, options).then((res) => res.json());
  return data;
}

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(nextConfig);
