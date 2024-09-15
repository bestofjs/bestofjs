import { getProjectTrends, OneYearSnapshots } from "@repo/db/projects";
import { formatStars } from "@/lib/format-helpers";

type Props = {
  snapshots: OneYearSnapshots[];
};
export function ViewTrends({ snapshots }: Props) {
  const trends = getProjectTrends(snapshots);

  return (
    <div>
      <div className="mb-4 text-lg font-bold">Trends</div>
      <div className="grid grid-cols-4 gap-2">
        <label>Today</label>
        <label>This week</label>
        <label>This month</label>
        <label>This year</label>
        <div>{trends.daily ? formatStars(trends.daily) : "-"}</div>
        <div>{trends.weekly ? formatStars(trends.weekly) : "-"}</div>
        <div>{trends.monthly ? formatStars(trends.monthly) : "-"}</div>
        <div>{trends.yearly ? formatStars(trends.yearly) : "-"}</div>
      </div>
    </div>
  );
}
