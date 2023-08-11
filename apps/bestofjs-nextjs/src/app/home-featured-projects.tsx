import NextLink from "next/link";
import { shuffle } from "@/helpers/shuffle";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CardHeader,
  ProjectAvatar,
  StarDelta,
  StarIcon,
  getDeltaByDay,
} from "@/components/core";
import { SectionHeading } from "@/components/core/section";
import { SortOptionKey } from "@/components/project-list/sort-order-options";
import { ProjectTag } from "@/components/tags/project-tag";

import { searchClient } from "./backend";
import { getFeaturedProjectsRequest } from "./backend-search-requests";

export async function FeaturedProjects() {
  const projects = await fetchFeaturedProjects();
  return (
    <Card>
      <CardHeader>
        <SectionHeading icon={<StarIcon fontSize={32} />} title="Featured" />
      </CardHeader>
      <div className="divide-y">
        {projects.map((project) => (
          <FeaturedProject
            key={project.slug}
            project={project}
            metrics="daily"
          />
        ))}
      </div>
      <div className="border-t p-4">
        <NextLink
          href={`/featured`}
          passHref
          className={cn(
            buttonVariants({ variant: "link" }),
            "text-md w-full text-secondary-foreground"
          )}
        >
          View more »
        </NextLink>
      </div>
    </Card>
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
      <div className="grow space-y-2 text-center">
        <NextLink
          href={`/projects/${project.slug}`}
          className="font-mono text-primary"
        >
          {project.name}
        </NextLink>
        {delta !== undefined && (
          <div className="stars">
            <StarDelta value={delta} average={metrics !== "daily"} />
          </div>
        )}
        <ProjectTag tag={project.tags[0]} />
      </div>
    </div>
  );
};

async function fetchFeaturedProjects() {
  const { projects } = await searchClient.findProjects({
    criteria: getFeaturedProjectsRequest().criteria,
    limit: -1,
  });
  return shuffle(projects).slice(0, 5);
}
