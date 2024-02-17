import Link from "next/link";
import { z } from "zod";

import { getDatabase } from "@/database";
import {
  ProjectListOrderByKey,
  countProjects,
  findProjects,
} from "@/database/projects/find";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectLogo } from "@/components/project-logo";

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
  const db = getDatabase();

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
      <h1 className="flex scroll-m-20 items-center gap-2 text-3xl font-extrabold tracking-tight lg:text-4xl">
        Projects
        <Badge className="text-sm">{total}</Badge>
      </h1>

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>GitHub</TableHead>
            <TableHead className="text-right">Stars</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.slug}>
              <TableCell>
                <ProjectLogo project={project} size={50} />
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-4">
                  <Link href={`/projects/${project.slug}`}>{project.name}</Link>
                  <span className="text-muted-foreground">
                    {project.description}
                  </span>
                  {project.comments && <div>{project.comments}</div>}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <a
                        href={`/projects/?tag=${tag}`}
                        className={badgeVariants({ variant: "secondary" })}
                        key={tag}
                      >
                        {tag}
                      </a>
                    ))}
                    {/* {project.projectsToTags.map((projectToTag) => {
                  return (
                    <Badge variant="secondary" key={projectToTag.tagId}>
                      {projectToTag.tag.name}
                    </Badge>
                  );
                })} */}
                  </div>
                </div>
              </TableCell>
              <TableCell>{project.repo!.full_name}</TableCell>
              <TableCell className="text-right">{project.stars}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProjectTablePagination
        offset={offset}
        limit={limit}
        sort={sort}
        total={total}
      />
    </>
  );
}
