"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowBigUpIcon,
  CircleCheckIcon,
  CircleXIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";

import type { FindProjectsOptions, findProjects } from "@repo/db/projects";

import { DataTable } from "@/components/data-table/data-table";
import { ProjectLogo } from "@/components/project-logo";
import { Badge } from "@/components/ui/badge";
import { useDataTable } from "@/hooks/use-data-table";
import { formatStars } from "@/lib/format-helpers";

import { DataTableColumnHeader } from "./data-table/data-table-column-header";

type Project = Awaited<ReturnType<typeof findProjects>>["projects"][number];

interface Props extends FindProjectsOptions {
  projects: Project[];
  total: number;
}

const columnHelper = createColumnHelper<Project>();

const columns = [
  columnHelper.accessor("logo", {
    header: () => null,
    cell: ({ row }) => <ProjectLogo project={row.original} size={50} />,
    enableSorting: false,
    size: 50,
    maxSize: 50,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: ({ row }) => (
      <Link href={`/projects/${row.original.slug}`}>{row.original.name}</Link>
    ),
  }),

  columnHelper.accessor("description", {
    header: "Description",
    cell: ({ row }) => (
      <div className="flex flex-col gap-2">
        {row.original.description}
        {row.original.repo?.archived && (
          <div>
            <Badge variant="destructive">Archived</Badge>
          </div>
        )}
      </div>
    ),
    minSize: 300,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => <StatusIcon status={row.original.status} />,
  }),
  columnHelper.accessor("stars", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stars" />
    ),
    cell: ({ getValue }) => formatStars(getValue()),
  }),
  columnHelper.accessor("repo.full_name", {
    header: "Owner",
    cell: ({ row }) => row.original.repo?.full_name.split("/").at(1),
  }),
  columnHelper.accessor("packages", {
    header: "Packages",
    cell: ({ row: { original: project } }) => {
      return project.packages.filter(Boolean).length > 0 ? (
        <div className="flex flex-col gap-4">
          {project.packages.map((pkg) => (
            <div key={pkg}>{pkg}</div>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground italic">No package</span>
      );
    },
  }),

  columnHelper.accessor("createdAt", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Added at" />
    ),
    cell: ({ getValue }) => format(getValue(), "yyyy-MM-dd"),
  }),
];

export function ProjectTable({ projects, total, limit, sort }: Props) {
  const { table } = useDataTable<Project>({
    columns,
    data: projects,
    pageCount: Math.ceil(total / (limit ?? 100)),
    initialState: {
      sorting: sort,
    },
  });
  return <DataTable table={table} />;
}

function StatusIcon({ status }: { status: Project["status"] }) {
  if (status === "active") {
    return <CircleCheckIcon />;
  }
  if (status === "featured") {
    return <StarIcon />;
  }
  if (status === "promoted") {
    return <ArrowBigUpIcon />;
  }
  if (status === "deprecated") {
    return <CircleXIcon />;
  }
  return null;
}
