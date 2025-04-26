import NextLink from "next/link";
import { FlameIcon } from "lucide-react";

import { SectionHeading } from "@/components/core/section";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProjectScore, ProjectTable } from "../project-list/project-table";
import {
  getSortOptionByKey,
  SortOptionKey,
} from "../project-list/sort-order-options";
import { TimeRangePicker } from "./time-range-picker";

export function HotProjectList({
  projects,
  sortOptionKey,
}: {
  projects: BestOfJS.Project[];
  sortOptionKey: SortOptionKey;
}) {
  const sortOption = getSortOptionByKey(sortOptionKey);
  return (
    <Card>
      <CardHeader>
        <div className="flex w-full items-center justify-between">
          <SectionHeading
            icon={<FlameIcon className="size-8" />}
            title="Hot Projects"
            subtitle={sortOption.label}
          />
          <TimeRangePicker value={sortOptionKey} />
        </div>
      </CardHeader>
      <ProjectTable
        projects={projects}
        showDetails={false}
        metricsCell={(project) => (
          <ProjectScore project={project} sort={sortOptionKey} />
        )}
        footer={
          <NextLink
            href={`/projects?sort=${sortOptionKey}`}
            passHref
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-md w-full text-secondary-foreground"
            )}
          >
            View full rankings »
          </NextLink>
        }
      />
    </Card>
  );
}
