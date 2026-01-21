// types.ts
import { Observable } from "@legendapp/state";
import { Table, TableOptions } from "@tanstack/react-table";
import { ReactNode, FC } from "react";

// Cell config with reactive value + static options
export interface CellConfig<TValue = unknown> {
  value$: Observable<TValue>;
  format?: "currency" | "percent" | "number" | "date" | (string & {});
  className?: string;
  [key: string]: unknown;
}

// Render function receives resolved config + rowId
export type CellRenderer<TValue = unknown> = (
  config: CellConfig<TValue>,
  rowId: string
) => ReactNode;

// Column definition
export interface ObservableColumnDef<TData, TValue = unknown> {
  id: string;
  header: ReactNode | (() => ReactNode);
  cell: (row$: Observable<TData>) => Observable<TValue> | CellConfig<TValue>;
  render?: CellRenderer<TValue>;
  className?: string;
  width?: number | string;
}

// Hook options
export interface UseAppTableOptions<TData> {
  data$: Observable<Record<string, TData>>;
  rowIds$: Observable<string[]>;
  columns: ObservableColumnDef<TData, any>[];
  tableOptions?: Partial<
    Omit<TableOptions<{ id: string }>, "data" | "columns" | "getCoreRowModel">
  >;
}

// Hook return type
export interface UseAppTableReturn<TData> {
  table: Table<{ id: string }>;
  data$: Observable<Record<string, TData>>;
  getRow$: (rowId: string) => Observable<TData>;
  Table: FC<{ className?: string }>;
  Header: FC;
  Body: FC;
  Row: FC<{ rowId: string }>;
}
