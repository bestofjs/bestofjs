import { OneYearSnapshots, getProjectTrends } from "@repo/db/projects";

import { formatStars } from "@/lib/format-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  snapshots: OneYearSnapshots[];
};
export function ViewTrends({ snapshots }: Props) {
  const trends = getProjectTrends(snapshots);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <label>Today</label>
          <div>{trends.daily ? formatStars(trends.daily) : "-"}</div>
          <label>This week</label>
          <div>{trends.weekly ? formatStars(trends.weekly) : "-"}</div>
          <label>This month</label>
          <div>{trends.monthly ? formatStars(trends.monthly) : "-"}</div>
          <label>This year</label>
          <div>{trends.yearly ? formatStars(trends.yearly) : "-"}</div>
        </div>
      </CardContent>
    </Card>
  );
}
