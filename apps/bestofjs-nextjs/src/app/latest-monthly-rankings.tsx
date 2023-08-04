import NextLink from "next/link";
import { GoCalendar } from "react-icons/go";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StarDelta } from "@/components/core";
import { SectionHeading } from "@/components/core/section";
import { ProjectTable } from "@/components/project-list/project-table";

import { fetchMonthlyRankings } from "./rankings/monthly/monthly-rankings-data";

export async function LatestMonthlyRankings() {
  const { year, month, projects } = await fetchMonthlyRankings({ limit: 5 });
  return (
    <Card>
      <CardHeader className="border-b">
        <SectionHeading
          icon={<GoCalendar fontSize={32} />}
          title="Monthly Rankings"
          subtitle="By number of stars added"
        />
      </CardHeader>
      <ProjectTable
        projects={projects}
        showDetails
        metricsCell={(project) => (
          <StarDelta value={(project as BestOfJS.ProjectWithScore).score} />
        )}
        footer={
          <NextLink
            href={`/rankings/monthly/${year}/${month}`}
            passHref
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-md w-full text-secondary-foreground"
            )}
          >
            Full rankings »
          </NextLink>
        }
      />
    </Card>
  );
}
