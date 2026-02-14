"use client";

import type { ColumnDef } from "@tanstack/react-table";
import NextLink from "next/link";

import type { TagWithProjectsItem } from "@repo/db/tags";

import { ChevronRightIcon, ProjectLogo } from "@/components/core";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { DataTableSortableHeader } from "@/components/ui/datatable";
import { linkVariants } from "@/components/ui/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<TagWithProjectsItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableSortableHeader column={column}>Tag</DataTableSortableHeader>
    ),
    cell: ({ row }) => {
      const tag = row.original;
      return (
        <div className="flex flex-col gap-1">
          <NextLink
            href={`/projects?tags=${tag.code}`}
            className={cn(linkVariants({ variant: "tag" }), "text-base")}
          >
            {tag.name}
          </NextLink>
          {tag.description && (
            <div className="text-muted-foreground text-sm">
              {tag.description}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "count",
    header: ({ column }) => (
      <DataTableSortableHeader column={column}>
        Projects
      </DataTableSortableHeader>
    ),
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="whitespace-nowrap">
          {row.original.count}
        </Badge>
      );
    },
  },
  {
    id: "popularProjects",
    header: "Popular Projects",
    cell: ({ row }) => {
      const tag = row.original;
      if (tag.projects.length === 0) return null;
      return (
        <div className="flex items-center gap-3">
          {tag.projects.map((project) => (
            <NextLink
              key={project.slug}
              href={`/projects/${project.slug}`}
              prefetch={false}
            >
              <Tooltip>
                <TooltipTrigger>
                  <ProjectLogo project={project} size={32} />
                </TooltipTrigger>
                <TooltipContent>{project.name}</TooltipContent>
              </Tooltip>
            </NextLink>
          ))}
          <NextLink
            href={`/projects?tags=${tag.code}`}
            className={cn(
              buttonVariants({ size: "icon", variant: "outline" }),
              "size-[32px]",
            )}
          >
            <Tooltip>
              <TooltipTrigger>
                <ChevronRightIcon className="size-6" />
              </TooltipTrigger>
              <TooltipContent>View all projects ({tag.count})</TooltipContent>
            </Tooltip>
          </NextLink>
        </div>
      );
    },
  },
];
