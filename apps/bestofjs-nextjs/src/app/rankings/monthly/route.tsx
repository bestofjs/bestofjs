import { redirect } from "next/navigation";

import { fetchMonthlyRankings } from "./monthly-rankings-data";

export async function GET(request: Request) {
  const { year, month } = await fetchMonthlyRankings({ limit: 0 });
  return redirect(`/rankings/monthly/${year}/${month}`);
}
