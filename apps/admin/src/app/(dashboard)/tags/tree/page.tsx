import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

import { getCachedTags } from "../get-tags";

type Tag = Awaited<ReturnType<typeof getCachedTags>>[number];

export default async function TagTreePage() {
  const tags = await getCachedTags();
  const childrenByParent = Map.groupBy(tags, (tag) => tag.parentTagId);
  const roots = childrenByParent.get(null) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-extrabold text-3xl tracking-tight lg:text-4xl">
          Tag hierarchy
        </h1>
        <Link href="/tags" className={buttonVariants({ variant: "outline" })}>
          Back to tags
        </Link>
      </div>
      <p className="max-w-3xl text-muted-foreground">
        Each nested tag inherits every ancestor above it. Unrelated tags remain
        separate roots.
      </p>
      <div className="rounded-md border p-4">
        <TagBranch tags={roots} childrenByParent={childrenByParent} />
      </div>
    </div>
  );
}

function TagBranch({
  tags,
  childrenByParent,
}: {
  tags: Tag[];
  childrenByParent: Map<string | null, Tag[]>;
}) {
  return (
    <ul className="space-y-2 border-muted border-l pl-4">
      {tags.map((tag) => {
        const children = childrenByParent.get(tag.id) ?? [];
        return (
          <li key={tag.id} className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                className="font-medium hover:underline"
                href={`/tags/${tag.code}`}
              >
                {tag.name}
              </Link>
              <code className="text-muted-foreground text-xs">{tag.code}</code>
              <Badge variant="secondary">{tag.facet ?? "no facet"}</Badge>
              <span className="text-muted-foreground text-xs">
                {tag.count} projects
              </span>
            </div>
            {children.length > 0 ? (
              <TagBranch tags={children} childrenByParent={childrenByParent} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
