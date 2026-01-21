// types.ts
import { Observable } from "@legendapp/state";
import { TableOptions, RowData } from "@tanstack/react-table";
import { ReactNode } from "react";
import { Table as TanstackTable } from "@tanstack/react-table";

// Cell config that can include reactive value + static options
export interface CellConfig<TValue = unknown> {
  value$: Observable<TValue>;
  format?: string;
  className?: string;
  // Extend with any custom options
  [key: string]: unknown;
}

// Allow both simple observable or full config
export type CellResolver<TData, TValue = unknown> =
  | Observable<TValue>
  | CellConfig<TValue>
  | ((row$: Observable<TData>) => Observable<TValue> | CellConfig<TValue>);

// Render function receives resolved config
export type CellRenderer<TValue = unknown> = (
  config: CellConfig<TValue>,
  rowId: string
) => ReactNode;

export interface ObservableColumnDef<TData, TValue = unknown> {
  id: string;
  header: ReactNode | (() => ReactNode);
  // Flexible cell resolver
  cell: (row$: Observable<TData>) => Observable<TValue> | CellConfig<TValue>;
  // Custom renderer (auto-wrapped with observer)
  render?: CellRenderer<TValue>;
  // Static column options
  className?: string;
  width?: number | string;
}

export interface UseAppTableOptions<TData> {
  data$: Observable<Record<string, TData>>;
  rowIds$: Observable<string[]>;
  columns: ObservableColumnDef<TData, any>[];
  // Pass through tanstack options
  tableOptions?: Partial<
    Omit<TableOptions<{ id: string }>, "data" | "columns" | "getCoreRowModel">
  >;
}
export interface UseAppTableReturn<TData> {
  table: TanstackTable<{ id: string }>;
  data$: Observable<Record<string, TData>>; // Expose for external access
  Table: React.FC<{ className?: string }>;
  Header: React.FC;
  Body: React.FC;
  Row: React.FC<{ rowId: string; row$?: Observable<TData> }>;
  // Helper to get row observable
  getRow$: (rowId: string) => Observable<TData>;
}
