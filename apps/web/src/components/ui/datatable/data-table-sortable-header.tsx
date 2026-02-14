"use client";

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

  return (
    <Button
      variant="ghost"
      className={cn("-ml-2", className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
