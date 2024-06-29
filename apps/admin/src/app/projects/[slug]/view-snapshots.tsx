"use client";

import { OneYearSnapshots } from "@repo/db/projects/get";
import { getMonthlyTrends } from "@repo/db/snapshots/monthly-trends";

import { formatStars } from "@/lib/format-helpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { addSnapshotAction } from "./actions";
import { MonthlyTrendsChart } from "./monthly-trends-chart";

type Props = {
  snapshots: OneYearSnapshots[];
  slug: string;
  repoFullName: string;
  repoId: string;
};

export function ViewSnapshots({
  snapshots,
  repoFullName,
  repoId,
  slug,
}: Props) {
  return (
    <div className="rounded border p-4">
      <div className="flex items-center justify-between">
        <h3 className="pb-4 text-2xl">Snapshots</h3>
        <Button
          size="sm"
          onClick={() => addSnapshotAction(slug, repoId, repoFullName)}
        >
          Add snapshot
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <Chart snapshots={snapshots} />
        {snapshots.map((oneYearSnapshot) => (
          <ViewYear key={oneYearSnapshot.year} snapshots={oneYearSnapshot} />
        ))}
      </div>
    </div>
  );
}

function Chart({ snapshots }: { snapshots: Props["snapshots"] }) {
  const flattenedSnapshots = flattenSnapshots(snapshots);
  const monthlyTrends = getMonthlyTrends(flattenedSnapshots, new Date());

  const results = monthlyTrends.map(({ year, month, delta }) => ({
    year,
    month,
    value: delta,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <MonthlyTrendsChart results={results} unit="Stars" />
      </CardContent>
    </Card>
  );
}

function ViewYear({ snapshots }: { snapshots: Props["snapshots"][number] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{snapshots.year}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-auto">
          <TableHeader>
            <TableRow>
              <TableCell className="w-24">Month</TableCell>
              <TableCell className="w-12">Count</TableCell>
              <TableCell className="w-12">From</TableCell>
              <TableCell className="w-24"></TableCell>
              <TableCell className="w-12">To</TableCell>
              <TableCell className="w-24"></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {snapshots.months.map((item) => (
              <MonthSummary key={item.month} monthlySnapshots={item} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MonthSummary({
  monthlySnapshots,
}: {
  monthlySnapshots: OneYearSnapshots["months"][number];
}) {
  const { month, snapshots } = monthlySnapshots;
  const firstSnapshot = snapshots[0];
  const lastSnapshot = snapshots.length > 1 && snapshots.at(-1);

  return (
    <TableRow>
      <TableCell className="mr-2 w-24 font-bold">{months[month - 1]}</TableCell>
      <TableCell className="w-12">{snapshots.length}</TableCell>
      <TableCell className="w-12">{firstSnapshot.day}</TableCell>
      <TableCell className="w-24">{formatStars(firstSnapshot.stars)}</TableCell>
      <TableCell className="w-12">
        {lastSnapshot ? lastSnapshot.day : "-"}
      </TableCell>
      <TableCell className="w-24">
        {lastSnapshot ? formatStars(lastSnapshot.stars) : ""}
      </TableCell>
    </TableRow>
  );
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function flattenSnapshots(records: Props["snapshots"]) {
  return records
    .slice(0, 2) // we only need the records for the last two years
    .flatMap(({ year, months }) =>
      months.flatMap(({ month, snapshots }) =>
        snapshots.flatMap(({ day, stars }) => ({ year, month, day, stars }))
      )
    );
}
