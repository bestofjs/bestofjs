import Link from "next/link";

import { ProjectTagHoverCard } from "@/components/tags/project-tag-hover-card";

export function CompactTagList({ tags }: { tags: BestOfJS.Tag[] }) {
  return (
    <div className="divide-y">
      {tags.map((tag) => (
        <ProjectTagHoverCard key={tag.code} tag={tag}>
          <div className="px-4 py-2 hover:bg-accent hover:text-accent-foreground">
            <Link
              href={`/projects/?tags=${tag.code}`}
              className="flex justify-between"
            >
              <span>{tag.name}</span>
              <span className="text-muted-foreground">{tag.counter}</span>
            </Link>
          </div>
        </ProjectTagHoverCard>
      ))}
    </div>
  );
}
