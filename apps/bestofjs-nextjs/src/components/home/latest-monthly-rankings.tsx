import NextLink from "next/link";
import { GoCalendar } from "react-icons/go";

import { formatMonthlyDate } from "@/app/rankings/monthly/monthly-rankings-utils";
import { StarDelta } from "@/components/core";
import { SectionHeading } from "@/components/core/section";
import { ProjectTable } from "@/components/project-list/project-table";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { api } from "@/server/api";

export async function LatestMonthlyRankings() {
  const { year, month, projects } = await api.rankings.getMonthlyRankings({
    limit: 5,
  });
  return (
    <Card>
      <CardHeader className="border-b">
        <SectionHeading
          icon={<GoCalendar fontSize={32} />}
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
            className={buttonVariants(
              { variant: "link" },
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
