import Link from "next/link";

import {
  getTagBySlug,
  isValidEdge,
  wouldCreateCycle,
} from "@repo/core/services/tags";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getCachedTags } from "../get-tags";
import { ParentPicker } from "./parent-picker";
import { TagForm } from "./tag-form";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};
export default async function TagDetailsPage(props: PageProps) {
  const params = await props.params;
  const [tag, tags] = await Promise.all([
    getTagBySlug(params.slug),
    getCachedTags(),
  ]);
  if (!tag) {
    return <div>Tag not found</div>;
  }
  const taxonomyTags = tags.map(({ id, facet, parentTagId }) => ({
    id,
    facet,
    parentTagId,
  }));
  const candidates = tags.filter(
    (candidate) =>
      candidate.id !== tag.id &&
      isValidEdge(tag.facet, candidate.facet) &&
      !wouldCreateCycle(taxonomyTags, tag.id, candidate.id),
  );
  const children = tags.filter((candidate) => candidate.parentTagId === tag.id);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-extrabold text-3xl tracking-tight lg:text-4xl">
        {tag.name}
      </h1>
      <TagForm tag={tag} />
      <Card>
        <CardHeader>
          <CardTitle>Hierarchy</CardTitle>
          <CardDescription>
            Parent relationships express strict subset inheritance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ParentPicker
            tagId={tag.id}
            parentTagId={tag.parentTagId}
            candidates={candidates}
          />
          <div className="space-y-2">
            <h2 className="font-medium text-sm">Children</h2>
            {children.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {children.map((child) => (
                  <li key={child.id}>
                    <Link
                      className="hover:underline"
                      href={`/tags/${child.code}`}
                    >
                      {child.name} ({child.code})
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No child tags.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
