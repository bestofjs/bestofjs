import { CalendarIcon } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import NextLink from "next/link";

import { formatMonthlyDate } from "@/app/rankings/monthly/monthly-rankings-utils";
import { StarDelta } from "@/components/core";
import { SectionHeading } from "@/components/core/section";
import { ProjectTable } from "@/components/project-list/project-table";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { currentApp, type WebApp } from "@/config/apps";
import { cn } from "@/lib/utils";
import { api } from "@/server/api";

export async function LatestMonthlyRankings() {
  return renderLatestMonthlyRankings(currentApp);
}

// A component rendered as JSX can't take extra arguments, so the cached
// rendering is split into this inner function: `app` needs to be a real
// parameter (not a module-scope import) since Next's "use cache" excludes
// module-scope values from the cache key (github.com/vercel/next.js#74498).
async function renderLatestMonthlyRankings(app: WebApp) {
  "use cache";
  cacheLife("monthly"); // Revalidate every 30 days for latest rankings
  cacheTag("monthly", "latest", app);
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
              "w-full text-md text-secondary-foreground",
            )}
          >
            View monthly rankings »
          </NextLink>
        }
      />
    </Card>
  );
}
