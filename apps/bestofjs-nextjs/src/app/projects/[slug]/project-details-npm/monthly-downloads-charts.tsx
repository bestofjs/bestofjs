import { ProjectDetails } from "@repo/db/projects";
import { env } from "@/env.mjs";
import { MonthlyTrendsChart } from "../project-details-github/monthly-trends-chart";

type DataItem = {
  year: number;
  month: number;
  downloads: number;
};

export async function MonthlyDownloadsChart({
  project,
}: {
  project: ProjectDetails;
}) {
  const packageName = project.packages?.[0]?.name;
  const data = await fetchDownloadData(packageName);
  const results = data.map(({ year, month, downloads }) => ({
    year,
    month,
    value: downloads,
  }));

  return (
    <>
      <div className="mb-2">Monthly downloads on NPM</div>
      <MonthlyTrendsChart results={results} unit="downloads" />
    </>
  );
}

async function fetchDownloadData(packageName: string) {
  const url = `${env.PROJECT_DETAILS_API_ROOT_URL}/api/package-monthly-downloads?packageName=${packageName}`;
  const options = {
    next: {
      revalidate: 60 * 60 * 24, // Revalidate every day to avoid showing stale data
      tags: ["package-downloads", packageName], // to be able to revalidate via API calls, on-demand
    },
  };
  const data = await fetch(url, options).then((res) => res.json());
  return data as DataItem[];
}
