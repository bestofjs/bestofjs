import { getTagBySlug } from "@repo/db/tags";
import { TagForm } from "./tag-form";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};
export default async function TagDetailsPage(props: PageProps) {
  const params = await props.params;
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
