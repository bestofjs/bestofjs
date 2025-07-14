import NextLink from "next/link";

import { FeaturedProjectList } from "@/components/home/featured-project-list";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/server/api";

import { FeaturedProjectsClient } from "./home-featured-projects.client";

type Props = {
  numberOfProjectPerPage?: number;
};
export async function FeaturedProjects({ numberOfProjectPerPage = 5 }: Props) {
  const { projects, total } = await fetchFeaturedProjects(
    numberOfProjectPerPage,
  );
  return (
    <Card>
      <FeaturedProjectsClient
        initialContent={<FeaturedProjectList projects={projects} />}
        totalNumberOfProjects={total}
        numberOfProjectPerPage={numberOfProjectPerPage}
      />
      <div className="border-t p-4">
        <NextLink
          href={`/featured`}
          passHref
          className={cn(
            buttonVariants({ variant: "link" }),
            "w-full text-md text-secondary-foreground",
          )}
        >
          View more »
        </NextLink>
      </div>
    </Card>
  );
}

async function fetchFeaturedProjects(numberOfProjectPerPage: number) {
  const { projects, total } = await api.projects.findRandomFeaturedProjects({
    skip: 0,
    limit: numberOfProjectPerPage,
  });
  return { projects, total };
}
