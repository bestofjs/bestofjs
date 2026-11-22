import { NextResponse } from "next/server";

import { currentApp } from "@/config/apps";

import { getLatestMonthlyRankings } from "../page-data";
export async function GET(request: Request) {
  const { year, month } = await getLatestMonthlyRankings(currentApp, 0);
  const url = new URL(request.url);
  url.pathname = `/rankings/monthly/${year}/${month}.md`;
  return NextResponse.redirect(url, 307);
}
