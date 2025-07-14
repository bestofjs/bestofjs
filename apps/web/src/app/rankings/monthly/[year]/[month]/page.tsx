import { CalendarIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarDelta,
} from "@/components/core";
import { PageHeading } from "@/components/core/typography";
import { ProjectTable } from "@/components/project-list/project-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { APP_CANONICAL_URL, APP_DISPLAY_NAME } from "@/config/site";
import { cn } from "@/lib/utils";
import { api } from "@/server/api";
import type { MonthlyDate } from "@/server/api-rankings";

import { formatMonthlyDate } from "../../monthly-rankings-utils";

type PageProps = {
  params: Promise<{
    year: string;
    month: string;
  }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const date = parsePageParams(params);

  const { projects } = await api.rankings.getMonthlyRankings({
    date,
    limit: 10,
  });
  const projectNames = projects.map((project) => project.name).join(", ");

  const title = `Rankings ${formatMonthlyDate(date)}`;
  const description = `The most popular projects on Best of JS in ${formatMonthlyDate(
    date,
  )}: ${projectNames}...`;

  return {
    title,
    description,
    openGraph: {
      images: [`api/og/rankings/monthly/${params.year}/${params.month}`],
      url: `${APP_CANONICAL_URL}/rankings/monthly/${params.year}/${params.month}`,
      title: `${title} • ${APP_DISPLAY_NAME}`,
      description,
    },
  };
}

export default async function MonthlyRankingPage(props: PageProps) {
  const params = await props.params;
  const date = parsePageParams(params);
  const { isFirst, isLatest, projects } = await api.rankings.getMonthlyRankings(
    {
      date,
      limit: 50,
    },
  );

  return (
    <>
      <PageHeading
        title="Monthly Rankings"
        icon={<CalendarIcon className="size-8" />}
      />
      <Card>
        <CardHeader className="border-b">
          <MonthlyRankingsNavigator
            date={date}
            isFirst={isFirst}
            isLatest={isLatest}
          />
        </CardHeader>
        <ProjectTable
          projects={projects}
          metricsCell={(project) => (
            <StarDelta value={(project as BestOfJS.ProjectWithScore).score} />
          )}
        />
      </Card>
    </>
  );
}

export async function generateStaticParams() {
  const { year, month } = await api.rankings.getMonthlyRankings({ limit: 0 });
  return [{ year, month }, getPreviousMonth({ year, month })].map((date) => ({
    year: date.year.toString(),
    month: date.month.toString(), // search params must be string
  }));
}

const MonthlyRankingsNavigator = ({
  date,
  isFirst,
  isLatest,
}: {
  date: MonthlyDate;
  isFirst: boolean;
  isLatest: boolean;
}) => {
  const previousMonth = getPreviousMonth(date);
  const nextMonth = getNextMonth(date);
  return (
    <div className="flex w-full items-center justify-between">
      <NavigationButton
        isDisabled={isFirst}
        url={buildRankingsURL(previousMonth)}
        label="Previous month"
      >
        <ChevronLeftIcon size={28} />
        <span className="hidden sm:block">
          {formatMonthlyDate(previousMonth)}
        </span>
      </NavigationButton>
      <div className="text-lg">{formatMonthlyDate(date)}</div>
      <NavigationButton
        isDisabled={isLatest}
        url={buildRankingsURL(nextMonth)}
        label="Next month"
      >
        <span className="hidden sm:block">{formatMonthlyDate(nextMonth)}</span>
        <ChevronRightIcon size={28} />
      </NavigationButton>
    </div>
  );
};

function NavigationButton({
  label,
  url,
  isDisabled,
  children,
}: {
  label: string;
  url: string;
  isDisabled: boolean;
  children: React.ReactNode;
}) {
  if (isDisabled) {
    return (
      <Button
        disabled
        variant="outline"
        className="w-10 rounded-full p-0 sm:w-auto sm:rounded-sm sm:p-2"
      >
        {children}
      </Button>
    );
  }
  return (
    <Link
      href={url}
      aria-label={label}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "w-10 rounded-full p-0 sm:w-auto sm:rounded-sm sm:p-2",
      )}
    >
      {children}
    </Link>
  );
}

function buildRankingsURL(date: MonthlyDate) {
  return `/rankings/monthly/${date.year}/${date.month}`;
}

function getPreviousMonth(date: MonthlyDate): MonthlyDate {
  const { year, month } = date;
  return month === 1
    ? { year: year - 1, month: 12 }
    : { year, month: month - 1 };
}

function getNextMonth(date: MonthlyDate): MonthlyDate {
  const { year, month } = date;
  return month === 12
    ? { year: year + 1, month: 1 }
    : { year, month: month + 1 };
}

function parsePageParams(params: Awaited<PageProps["params"]>) {
  const { year, month } = params;
  return { year: parseInt(year), month: parseInt(month) };
}
