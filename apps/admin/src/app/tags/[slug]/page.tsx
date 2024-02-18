import { getTagBySlug } from "@/database/tags/get";

import { TagForm } from "./tag-form";

type PageProps = {
  params: {
    slug: string;
  };
};
export default async function TagDetailsPage({ params }: PageProps) {
  const tag = await getTagBySlug(params.slug);
  if (!tag) {
    return <div>Tag not found</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
        {tag.name}
      </h1>
      <TagForm tag={tag} />
    </div>
  );
}
