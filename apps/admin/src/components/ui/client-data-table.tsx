"use client";

import { useEffect } from "react";
import { compareItems, type RankingInfo } from "@tanstack/match-sorter-utils";
import {
  type ColumnDef,
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  FlexRender,
  filterFn_includesString,
  metaHelper,
  type RowData,
  rowPaginationFeature,
  rowSortingFeature,
  type SortFn,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  type TableFeatures,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** The column the search box filters, and the default sort. */
const SEARCH_COLUMN_ID = "name";

/** Ranking info a fuzzy filter attaches to each row it keeps. */
export interface FuzzyFilterMeta {
  itemRank?: RankingInfo;
}

type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta };

/**
 * Sort by the rank the column's fuzzy filter stored: the earlier accessor (the
 * higher-priority field) first, then the better match (`compareItems` only
 * looks at the rank), then alphanumeric, which is also the order when the
 * column is not being filtered.
 */
const fuzzySort: SortFn<FuzzyFeatures, RowData> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  const rankA = rowA.columnFiltersMeta[columnId]?.itemRank;
  const rankB = rowB.columnFiltersMeta[columnId]?.itemRank;
  if (rankA && rankB) {
    dir =
      rankA.accessorIndex - rankB.accessorIndex || compareItems(rankA, rankB);
  }

  return dir === 0 ? sortFn_alphanumeric(rowA, rowB, columnId) : dir;
};

export const clientDataTableFeatures = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  // `basic`, `datetime` and `text` back the `'auto'` sort of number, date and
  // string columns, which only resolves registered functions.
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
    fuzzy: fuzzySort,
  },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
});

export type ClientDataTableFeatures = typeof clientDataTableFeatures;

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<ClientDataTableFeatures, TData>[];
  data: TData[];
  getRowId: (row: TData) => string;
}

export function ClientDataTable<TData extends RowData>({
  columns,
  getRowId,
  data,
}: DataTableProps<TData>) {
  const table = useTable<ClientDataTableFeatures, TData>({
    features: clientDataTableFeatures,
    data,
    getRowId,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 50,
      },
      sorting: [{ id: SEARCH_COLUMN_ID, desc: false }],
    },
  });

  // Rank-sort search results: a fuzzy `sortFn` only orders rows by match
  // quality while the table is sorted ascending by the column being searched
  // (descending would put the worst matches first).
  const isSearching = table.state.columnFilters.some(
    (filter) => filter.id === SEARCH_COLUMN_ID,
  );
  const primarySort = table.state.sorting[0];
  const isRankSorted =
    primarySort?.id === SEARCH_COLUMN_ID && !primarySort.desc;
  useEffect(() => {
    if (isSearching && !isRankSorted) {
      table.setSorting([{ id: SEARCH_COLUMN_ID, desc: false }]);
    }
  }, [isSearching, isRankSorted, table]);

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={
            (table.getColumn(SEARCH_COLUMN_ID)?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn(SEARCH_COLUMN_ID)
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <FlexRender header={header} />
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
                  <TableRow key={row.id}>
                    {row.getAllCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <FlexRender cell={cell} />
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

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
