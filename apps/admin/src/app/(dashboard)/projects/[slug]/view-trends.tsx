import { getProjectTrends, type OneYearSnapshots } from "@repo/db/projects";

import { formatStars } from "@/lib/format-helpers";

type Props = {
  snapshots: OneYearSnapshots[];
};
export function ViewTrends({ snapshots }: Props) {
  const trends = getProjectTrends(snapshots);

  return (
    <div>
      <div className="mb-4 font-bold text-lg">Trends</div>
      <div className="grid grid-cols-4 gap-2">
        <div>Today</div>
        <div>This week</div>
        <div>This month</div>
        <div>This year</div>
        <div>{trends.daily ? formatStars(trends.daily) : "-"}</div>
        <div>{trends.weekly ? formatStars(trends.weekly) : "-"}</div>
        <div>{trends.monthly ? formatStars(trends.monthly) : "-"}</div>
        <div>{trends.yearly ? formatStars(trends.yearly) : "-"}</div>
      </div>
    </div>
  );
}
