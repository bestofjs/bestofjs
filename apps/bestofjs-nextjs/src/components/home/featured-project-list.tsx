import NextLink from "next/link";

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

export const FeaturedProject = ({
  project,
  metrics,
}: {
  project: BestOfJS.Project;
  metrics: SortOptionKey;
}) => {
  const delta = getDeltaByDay(metrics)(project);
  return (
    <div className="flex gap-4 px-4 py-6">
      <ProjectAvatar project={project} size={80} />
      <div className="grow space-y-2 overflow-hidden text-center">
        <NextLink
          href={`/projects/${project.slug}`}
          className="block truncate font-mono text-primary"
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
          className="inline-flex truncate"
        />
      </div>
    </div>
  );
};
