import NextLink from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FeaturedProjectList } from "@/components/home/featured-project-list";

import { searchClient } from "./backend";
import { FeaturedProjectsClient } from "./home-featured-projects.client";

export async function FeaturedProjects() {
  const projects = await fetchFeaturedProjects();
  return (
    <Card>
      <FeaturedProjectsClient
        initialContent={<FeaturedProjectList projects={projects} />}
      />
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

async function fetchFeaturedProjects() {
  const { projects } = await searchClient.findRandomFeaturedProjects(0, 5);
  return projects;
}
