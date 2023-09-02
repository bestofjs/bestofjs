import { Metadata } from "next";
import Link from "next/link";
import { GoCalendar } from "react-icons/go";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarDelta,
} from "@/components/core";
import { PageHeading } from "@/components/core/typography";
import { ProjectTable } from "@/components/project-list/project-table";

import { MonthlyDate, fetchMonthlyRankings } from "../../monthly-rankings-data";
import { formatMonthlyDate } from "../../monthly-rankings-utils";

type PageProps = {
  params: {
    year: string;
    month: string;
  };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const date = parsePageParams(params);

  return {
    title: "Rankings " + formatMonthlyDate(date),
  };
}

export default async function MonthlyRankingPage({ params }: PageProps) {
  const date = parsePageParams(params);
  const { isFirst, isLatest, projects } = await fetchMonthlyRankings({
    date,
    limit: 50,
  });

  return (
    <>
      <PageHeading
        title="Monthly Rankings"
        icon={<GoCalendar fontSize={32} />}
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
  const { year, month } = await fetchMonthlyRankings({ limit: 0 });
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
    <div className="flex items-center justify-between">
      <NavigationButton
        isDisabled={isFirst}
        url={buildRankingsURL(previousMonth)}
        label="Previous month"
      >
        <ChevronLeftIcon fontSize="28px" />
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
        <ChevronRightIcon fontSize="28px" />
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
        "w-10 rounded-full p-0 sm:w-auto sm:rounded-sm sm:p-2"
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

function parsePageParams(params: PageProps["params"]) {
  const { year, month } = params;
  return { year: parseInt(year), month: parseInt(month) };
}
