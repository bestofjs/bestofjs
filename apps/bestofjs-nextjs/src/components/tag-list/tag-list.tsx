import NextLink from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { linkVariants } from "@/components/ui/link";
import { ChevronRightIcon, ProjectAvatar } from "@/components/core";

type Props = {
  tags: BestOfJS.TagWithProjects[];
};
export const TagList = ({ tags }: Props) => {
  return (
    <div className="divide-y divide-dashed rounded-lg">
      {tags.map((tag) => (
        <div
          key={tag.code}
          className="flex w-full flex-col justify-between gap-4 p-4 md:flex-row"
        >
          <div className="flex flex-col gap-2">
            <NextLink
              href={`/projects?tags=${tag.code}`}
              className={linkVariants({ variant: "project" })}
            >
              {tag.name}
              <Badge className="ml-2" variant="outline">
                {tag.counter}
              </Badge>
            </NextLink>
            <div className="text-muted-foreground">{tag.description}</div>
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
              className={buttonVariants(
                { size: "icon", variant: "outline" },
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
