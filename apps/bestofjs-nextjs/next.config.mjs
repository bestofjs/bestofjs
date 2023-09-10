/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
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
    // TODO: how to re-use in this `.mjs` file the code from the app/ranking/monthly pages?
    const monthlyRankingsRedirect = await getMonthlyRankingsRedirect();
    return [
      {
        source: "/tags/:tag",
        destination: "/projects?tags=:tag",
        permanent: false,
      },
      monthlyRankingsRedirect,
    ];
  },
};

async function getMonthlyRankingsRedirect() {
  const { year, month } = await fetchLatestRankings();
  return {
    source: "/rankings/monthly",
    destination: `/rankings/monthly/${year}/${month}`,
    permanent: false,
  };
}

function fetchLatestRankings() {
  const url = "https://bestofjs-rankings.vercel.app/monthly/latest"; //TODO URL should be setup in one single place
  const data = fetch(url).then((res) => res.json());
  return data;
}

export default nextConfig;

// {
//   source: "/tags/:tag",
//   destination: "/projects?tags=:tag",
//   permanent: false,
// },
