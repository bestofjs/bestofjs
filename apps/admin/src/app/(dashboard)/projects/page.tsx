import { db } from "@repo/db";
import { findProjects, getAllTags } from "@repo/db/projects";

import { AddProjectButton } from "@/components/add-project-button";
import { ProjectTable } from "@/components/project-table";
import { Badge } from "@/components/ui/badge";
import {
  type PageSearchParams,
  searchParamsCache,
} from "@/lib/projects-search-params";

type PageProps = { searchParams: Promise<PageSearchParams> };

export default async function ProjectsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const allTags = await getAllTags();
  const searchOptions = searchParamsCache.parse(searchParams);
  const { limit, page, sort, tags: tagCodes, name, status } = searchOptions;

  const { projects, total } = await findProjects({
    db,
    limit,
    name,
    page,
    sort,
    tagCodes,
    status,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <h1 className="flex scroll-m-20 items-center gap-2 font-extrabold text-3xl tracking-tight lg:text-4xl">
          Projects
          <Badge className="text-sm">{total}</Badge>
        </h1>
        <AddProjectButton />
      </div>

      <ProjectTable
        allTags={allTags}
        projects={projects}
        total={total}
        limit={limit}
        page={page}
        sort={sort}
      />
    </div>
  );
}

// function SearchFilters({ tags }: { tags: string[] }) {
//   return (
//     <div>
//       {tags.map((tag) => (
//         <Badge key={tag}>{tag}</Badge>
//       ))}
//     </div>
//   );
// }
