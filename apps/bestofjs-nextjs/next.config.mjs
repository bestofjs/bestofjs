import { env } from "./src/env.mjs";

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
  const data = fetch(url).then((res) => res.json());
  return data;
}

export default nextConfig;
