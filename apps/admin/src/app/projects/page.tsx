import Link from "next/link";
import { z } from "zod";

import { db } from "@repo/db";
import {
  countProjects,
  findProjects,
  ProjectListOrderByKey,
} from "@repo/db/projects";
import { AddProjectButton } from "@/components/add-project-button";
import { ProjectTable } from "@/components/project-table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ProjectTablePagination } from "./project-table-pagination";
import { SearchBox } from "./search-box";
import { searchSchema } from "./search-schema";
import { ProjectListSortOptionPicker } from "./sort-option-picker";

type PageProps = {
  searchParams: {
    limit?: string;
    page?: string;
    sort?: string;
  };
};

export default async function ProjectsPage({ searchParams }: PageProps) {
  const searchOptions = searchSchema.parse(searchParams);
  const { limit, offset, sort, tag, text } = searchOptions;

  const total = await countProjects({ db, tag, text });
  const projects = await findProjects({
    db,
    limit,
    offset,
    sort: sort as ProjectListOrderByKey,
    tag,
    text,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <h1 className="flex scroll-m-20 items-center gap-2 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Projects
          <Badge className="text-sm">{total}</Badge>
        </h1>
        <AddProjectButton />
      </div>

      <SearchBox text={text} />

      {projects.length > 0 ? (
        <PaginatedProjectTable
          projects={projects}
          searchOptions={searchOptions}
          total={total}
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

function PaginatedProjectTable({
  projects,
  searchOptions,
  total,
}: {
  projects: Awaited<ReturnType<typeof findProjects>>;
  searchOptions: z.infer<typeof searchSchema>;
  total: number;
}) {
  const { limit, offset, sort } = searchOptions;

  return (
    <>
      <div className="flex w-full justify-between">
        <ProjectListSortOptionPicker sort={sort as ProjectListOrderByKey} />
        <ProjectTablePagination
          offset={offset}
          limit={limit}
          sort={sort}
          total={total}
        />
      </div>

      <ProjectTable projects={projects} />

      <ProjectTablePagination
        offset={offset}
        limit={limit}
        sort={sort}
        total={total}
      />
    </>
  );
}
