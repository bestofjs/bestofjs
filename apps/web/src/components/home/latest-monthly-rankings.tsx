import NextLink from "next/link";
import { CalendarIcon } from "lucide-react";

import { formatMonthlyDate } from "@/app/rankings/monthly/monthly-rankings-utils";
import { StarDelta } from "@/components/core";
import { SectionHeading } from "@/components/core/section";
import { ProjectTable } from "@/components/project-list/project-table";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/server/api";

export async function LatestMonthlyRankings() {
  const { year, month, projects } = await api.rankings.getMonthlyRankings({
    limit: 5,
  });
  return (
    <Card>
      <CardHeader className="border-b">
        <SectionHeading
          icon={<CalendarIcon className="size-8" />}
          title={`Rankings ${formatMonthlyDate({ year, month })}`}
          subtitle="By number of stars added last month"
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
            View monthly rankings »
          </NextLink>
        }
      />
    </Card>
  );
}
