import NextLink from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { ProjectAvatar, StarDelta, getDeltaByDay } from "@/components/core";
import { SortOptionKey } from "@/components/project-list/sort-order-options";
import { ProjectTag } from "@/components/tags/project-tag";

export function FeaturedProjectList({
  projects,
}: {
  projects: BestOfJS.Project[];
}) {
  return (
    <div className="divide-y">
      {projects.map((project) => (
        <FeaturedProject key={project.slug} project={project} metrics="daily" />
      ))}
    </div>
  );
}

function FeaturedProject({
  project,
  metrics,
}: {
  project: BestOfJS.Project;
  metrics: SortOptionKey;
}) {
  const delta = getDeltaByDay(metrics)(project);
  return (
    <div className="flex items-center gap-4 px-4 py-6">
      <NextLink
        href={`/projects/${project.slug}`}
        className="display-block w-[80px] overflow-hidden text-muted-foreground"
      >
        <ProjectAvatar project={project} size={80} />
      </NextLink>
      <div className="flex-1 space-y-2 overflow-hidden text-center">
        <NextLink
          href={`/projects/${project.slug}`}
          className="block truncate font-mono text-primary hover:underline"
        >
          {project.name}
        </NextLink>
        {delta !== undefined && (
          <div className="stars">
            <StarDelta value={delta} average={metrics !== "daily"} />
          </div>
        )}
        <ProjectTag
          tag={project.tags[0]}
          className="inline-block max-w-full truncate"
        />
      </div>
    </div>
  );
}

export function ProjectListSkeleton({
  numberOfItems,
}: {
  numberOfItems: number;
}) {
  return (
    <div className="divide-y">
      {[...Array(numberOfItems)].map((_, index) => (
        <div key={index} className="flex gap-4 px-4 py-6">
          <div className="grow space-y-2 overflow-hidden text-center">
            <Skeleton className="h-[80px] w-[80px]" />
          </div>
          <div className="flex grow flex-col items-center justify-center space-y-4 overflow-hidden">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[50px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
