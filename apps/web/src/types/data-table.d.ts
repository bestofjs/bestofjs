import type { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: type params required by ColumnMeta interface
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
  }
}
