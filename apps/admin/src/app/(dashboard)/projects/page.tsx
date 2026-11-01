import { Suspense } from "react";
import { connection } from "next/server";

import { db } from "@repo/core";
import { findProjects, getAllTags } from "@repo/core/services/projects";

import { ProjectTable } from "@/components/project-table";
import { Badge } from "@/components/ui/badge";
import {
  type PageSearchParams,
  searchParamsCache,
} from "@/lib/projects-search-params";

import { ActionBar } from "./action-bar";
import { ProjectLoadingState } from "./loading-state";

type PageProps = { searchParams: Promise<PageSearchParams> };

export default function ProjectsPage(props: PageProps) {
  return (
    <Suspense fallback={<ProjectLoadingState />}>
      <ProjectsPageContent {...props} />
    </Suspense>
  );
}

async function ProjectsPageContent(props: PageProps) {
  // Keep database connection setup and queries at request time.
  await connection();
  const searchParams = await props.searchParams;
  const allTags = await getAllTags();
  const searchOptions = searchParamsCache.parse(searchParams);
  const {
    archived,
    limit,
    page,
    sort,
    tags: tagCodes,
    name,
    status,
  } = searchOptions;

  const { projects, total } = await findProjects({
    db,
    archived,
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
        <ActionBar />
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
