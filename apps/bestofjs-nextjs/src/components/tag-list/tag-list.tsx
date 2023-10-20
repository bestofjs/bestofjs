import NextLink from "next/link";

import { cn } from "@/lib/utils";
import { ChevronRightIcon, ProjectAvatar } from "@/components/core";

import { buttonVariants } from "../ui/button";

type Props = {
  tags: BestOfJS.TagWithProjects[];
};
export const TagList = ({ tags }: Props) => {
  return (
    <div className="divide-y divide-dashed rounded-lg">
      {tags.map((tag) => (
        <div
          key={tag.code}
          className="flex w-full flex-col justify-between gap-4 p-4 hover:bg-muted/50 md:flex-row"
        >
          <div className="">
            <NextLink
              href={`/projects?tags=${tag.code}`}
              className="text-secondary-foreground hover:underline"
            >
              {tag.name}
            </NextLink>
            <span className="ml-2 text-muted-foreground">
              {tag.counter} projects
            </span>
          </div>
          <div className="flex items-center gap-4">
            {tag.projects.map((project) => (
              <NextLink
                key={project.slug}
                href={`/projects/${project.slug}`}
                prefetch={false}
              >
                <ProjectAvatar project={project} size={32} />
              </NextLink>
            ))}
            <NextLink
              href={`/projects?tags=${tag.code}`}
              className={cn(
                buttonVariants({ size: "icon", variant: "outline" }),
                "h-[32px] w-[32px]"
              )}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </NextLink>
          </div>
        </div>
      ))}
    </div>
  );
};
