import Link from "next/link";

import { db } from "@repo/db";
import { findProjects } from "@repo/db/projects";

import { AddProjectButton } from "@/components/add-project-button";
import { ProjectTable } from "@/components/project-table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { searchParamsCache } from "@/lib/search-params";

type PageProps = {
  searchParams: Promise<{
    limit?: string;
    page?: string;
    sort?: string;
  }>;
};

export default async function ProjectsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const searchOptions = searchParamsCache.parse(searchParams);
  const { limit, page, sort /*tag, text*/ } = searchOptions;

  const { projects, total } = await findProjects({
    db,
    limit,
    page,
    sort,
    /*tag,
    text,*/
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

      {/* <SearchBox text={text} /> */}

      {projects.length > 0 ? (
        <ProjectTable
          projects={projects}
          total={total}
          limit={limit}
          page={page}
          sort={sort}
        />
      ) : (
        <div className="flex h-40 flex-col items-center justify-center gap-6 border">
          No projects found
          <Link
            href="/projects"
            className={buttonVariants({ variant: "secondary" })}
          >
            Reset
          </Link>
        </div>
      )}
    </div>
  );
}
