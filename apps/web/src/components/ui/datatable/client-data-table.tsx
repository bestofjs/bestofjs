"use client";

import { type SetStateAction, useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { XIcon } from "lucide-react";

import { computePaginationState } from "@/components/core/pagination/pagination-state";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  getRowId: (row: TData) => string;
  /** When provided, filters rows (return true to include). */
  globalFilterFn?: (row: TData, query: string) => boolean;
  /**
   * When both are provided, the table is in "controlled filter" mode:
   * the search input is controlled by the parent and no filtering is applied
   * (parent is responsible for passing pre-filtered/sorted data).
   */
  globalFilterValue?: string;
  onGlobalFilterChange?: (value: string) => void;
  searchPlaceholder?: string;
  initialSorting?: SortingState;
  /**
   * When both are provided, sorting is controlled by the parent (e.g. to preserve rank order when searching).
   */
  sorting?: SortingState;
  onSortingChange?: (updater: SetStateAction<SortingState>) => void;
  pageSize?: number;
  /** Page size options for the pagination dropdown. When omitted, the dropdown is hidden. */
  pageSizeOptions?: number[];
}

export function ClientDataTable<TData>({
  columns,
  getRowId,
  data,
  globalFilterFn,
  globalFilterValue,
  onGlobalFilterChange,
  searchPlaceholder = "Search...",
  initialSorting = [],
  sorting: controlledSorting,
  onSortingChange,
  pageSize = 50,
  pageSizeOptions,
}: DataTableProps<TData>) {
  const [internalSorting, setInternalSorting] =
    useState<SortingState>(initialSorting);
  const isControlledSorting =
    controlledSorting !== undefined && onSortingChange !== undefined;
  const sorting = isControlledSorting ? controlledSorting : internalSorting;
  const setSorting = isControlledSorting ? onSortingChange : setInternalSorting;
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
  const isControlledFilter =
    globalFilterValue !== undefined && onGlobalFilterChange !== undefined;
  const globalFilter = isControlledFilter
    ? (globalFilterValue ?? "")
    : internalGlobalFilter;
  const setGlobalFilter = isControlledFilter
    ? onGlobalFilterChange
    : setInternalGlobalFilter;

  const table = useReactTable({
    data,
    getRowId,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(isControlledFilter
      ? {}
      : { getFilteredRowModel: getFilteredRowModel() }),
    manualFiltering: isControlledFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn:
      globalFilterFn && !isControlledFilter
        ? (row, _columnId, filterValue) =>
            globalFilterFn(row.original, filterValue)
        : undefined,
    state: {
      columnFilters,
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const { pageIndex, pageSize: currentPageSize } = table.getState().pagination;
  const totalRows = isControlledFilter
    ? table.getPreFilteredRowModel().rows.length
    : table.getFilteredRowModel().rows.length;
  const paginationState = computePaginationState({
    total: totalRows,
    page: pageIndex + 1,
    limit: currentPageSize,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <InputGroup className="max-w-sm">
          <InputGroupInput
            aria-label="Search"
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            // Suppress base Input's ring-offset so the group's focus ring is continuous (no gap between input and clear button).
            className="focus-visible:ring-offset-0"
          />
          {globalFilter.length > 0 && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                size="icon-xs"
                aria-label="Clear search"
                onClick={() => setGlobalFilter("")}
              >
                <XIcon className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        paginationState={paginationState}
        onPrevious={() => table.previousPage()}
        onNext={() => table.nextPage()}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        onPageSizeChange={
          pageSizeOptions ? (size) => table.setPageSize(size) : undefined
        }
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}
