"use client";

import type * as React from "react";
import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableSortableHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof Button> {
  column: Column<TData, TValue>;
  children: React.ReactNode;
}

export function DataTableSortableHeader<TData, TValue>({
  column,
  children,
  className,
  ...props
}: DataTableSortableHeaderProps<TData, TValue>) {
  const sorted = column.getIsSorted();
  const columnLabel = column.columnDef.meta?.label ?? column.id;

  return (
    <Button
      variant="ghost"
      className={cn("-ml-2", className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      aria-label={`Sort by ${columnLabel} ${
        sorted === "asc"
          ? "descending"
          : sorted === "desc"
            ? "unsorted"
            : "ascending"
      }`}
      {...props}
    >
      {children}
      {sorted === "desc" ? (
        <ArrowDown className="ml-2 size-4" />
      ) : sorted === "asc" ? (
        <ArrowUp className="ml-2 size-4" />
      ) : (
        <ArrowUpDown className="ml-2 size-4" />
      )}
    </Button>
  );
}
