import { fetchMonthlyDownloads } from "@repo/api/npm";
import type { ProjectDetails } from "@repo/db/projects";

import { MonthlyTrendsChart } from "../project-details-github/monthly-trends-chart";

type Props = {
  project: ProjectDetails;
};

export async function MonthlyDownloadsChart({ project }: Props) {
  const packageName = project.packages?.[0]?.name;
  const data = await fetchMonthlyDownloads(packageName);
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
