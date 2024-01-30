import { z } from "zod";

import { getDatabase } from "@/database/run-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { ProjectLogo } from "@/components/project-logo";
import {
  ProjectListOrderByKey,
  countProjects,
  findProjects,
} from "@/database/projects/find";
import { Badge } from "@/components/ui/badge";
import { ProjectListSortOptionPicker } from "./sort-option-picker";

type PageProps = {
  searchParams: {
    limit?: string;
    page?: string;
    sort?: string;
  };
};

const searchSchema = z.object({
  limit: z.coerce.number().default(50),
  offset: z.coerce.number().default(0),
  sort: z.string().default("-createdAt"),
});

export default async function ProjectsPage({ searchParams }: PageProps) {
  const db = getDatabase();

  const { limit, offset, sort } = searchSchema.parse(searchParams);

  const total = await countProjects(db);
  const projects = await findProjects({ db, limit, offset, sort });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl flex items-center gap-2">
        Projects
        <Badge className="text-sm">{total}</Badge>
      </h1>

      <div className="w-full flex justify-between">
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
                  {project.name}
                  <span className="text-muted-foreground">
                    {project.description}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {project.projectsToTags.map((projectToTag) => {
                      return (
                        <Badge variant="secondary" key={projectToTag.tagId}>
                          {projectToTag.tag.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </TableCell>
              <TableCell>{project.repo?.full_name}</TableCell>
              <TableCell className="text-right">
                {project.repo?.stars}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProjectTablePagination offset={offset} limit={limit} sort={sort} />
    </div>
  );
}

function ProjectTablePagination({
  offset,
  limit,
  total,
}: z.infer<typeof searchSchema> & { total: number }) {
  const urlSearchParams = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });
  const hasPreviousPage = offset > 0;
  const hasNextPage = offset + limit < total;

  function getPreviousPageURL() {
    urlSearchParams.set("offset", String(offset - limit));
    return "/projects?" + urlSearchParams.toString();
  }
  function getNextPageURL() {
    urlSearchParams.set("offset", String(offset + limit));
    return "/projects?" + urlSearchParams.toString();
  }
  return (
    <div className="flex">
      <PaginationPrevious href={getPreviousPageURL()} />
      <PaginationNext href={getNextPageURL()} />
    </div>
  );
  return (
    <Pagination>
      <PaginationContent>
        {hasPreviousPage && (
          <PaginationItem>
            <PaginationPrevious href={getPreviousPageURL()} />
          </PaginationItem>
        )}
        {hasNextPage && (
          <PaginationItem>
            <PaginationNext href={getNextPageURL()} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
