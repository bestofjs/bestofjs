import { OneYearSnapshots } from "@/database/projects/get";
import { formatStars } from "@/lib/format-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  snapshots: OneYearSnapshots[];
};

export function ViewSnapshots({ snapshots }: Props) {
  return (
    <div className="rounded border p-4">
      <h3 className="pb-4 text-2xl">Snapshots</h3>
      <div className="flex flex-col gap-4">
        {snapshots.map((oneYearSnapshot) => (
          <ViewYear key={oneYearSnapshot.year} snapshots={oneYearSnapshot} />
        ))}
      </div>
    </div>
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
  const lastSnapshot = snapshots[snapshots.length - 1];

  return (
    <TableRow>
      <TableCell className="mr-2 w-24 font-bold">{months[month - 1]}</TableCell>
      <TableCell className="w-12">{snapshots.length}</TableCell>
      <TableCell className="w-12">{firstSnapshot.day}</TableCell>
      <TableCell className="w-24">{formatStars(firstSnapshot.stars)}</TableCell>
      <TableCell className="w-12">{lastSnapshot.day}</TableCell>
      <TableCell className="w-24">{formatStars(lastSnapshot.stars)}</TableCell>
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
