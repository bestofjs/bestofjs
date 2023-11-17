import Link from "next/link";

export function CompactTagList({ tags }: { tags: BestOfJS.Tag[] }) {
  return (
    <div className="divide-y">
      {tags.map((tag) => (
        <div
          key={tag.code}
          className="px-4 py-2 hover:bg-accent hover:text-accent-foreground"
        >
          <Link
            href={`/projects/?tags=${tag.code}`}
            className="flex justify-between"
          >
            <span>{tag.name}</span>
            <span className="text-muted-foreground">{tag.counter}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}
