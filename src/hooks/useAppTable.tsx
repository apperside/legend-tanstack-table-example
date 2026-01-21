// useAppTable.tsx
import { Observable } from "@legendapp/state";
import { observer, useValue } from "@legendapp/state/react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";
import { FC, memo, useMemo } from "react";
import {
    CellConfig,
    CellRenderer,
    UseAppTableOptions,
    UseAppTableReturn
} from "./types";

// Normalize cell resolver output to CellConfig
function normalizeCellConfig<TValue>(
  result: Observable<TValue> | CellConfig<TValue>
): CellConfig<TValue> {
  // Check if it's already a config object (has value$ property)
  if (result && typeof result === "object" && "value$" in result) {
    return result as CellConfig<TValue>;
  }
  // It's a raw observable
  return { value$: result as Observable<TValue> };
}

// Default cell renderer
const DefaultCell = observer(({ config }: { config: CellConfig }) => {
  const value = useValue(config.value$);
  return <>{formatValue(value, config.format)}</>;
});

// Simple format helper - extend as needed
function formatValue(value: unknown, format?: string): string {
  if (value == null) return "";

  switch (format) {
    case "currency":
      return typeof value === "number" ? `$${value.toFixed(2)}` : String(value);
    case "percent":
      return typeof value === "number"
        ? `${(value * 100).toFixed(2)}%`
        : String(value);
    case "number":
      return typeof value === "number" ? value.toLocaleString() : String(value);
    case "date":
      return value instanceof Date ? value.toLocaleDateString() : String(value);
    default:
      return String(value);
  }
}

// Cache for wrapped render functions
const renderCache = new WeakMap<
  CellRenderer<any>,
  FC<{ config: CellConfig; rowId: string }>
>();

function getOrCreateReactiveCell<TValue>(
  render: CellRenderer<TValue>
): FC<{ config: CellConfig<TValue>; rowId: string }> {
  if (!renderCache.has(render)) {
    const WrappedCell = memo(
      observer(
        ({ config, rowId }: { config: CellConfig<TValue>; rowId: string }) => (
          <>{render(config, rowId)}</>
        )
      )
    );
    WrappedCell.displayName = "ReactiveCell";
    renderCache.set(render, WrappedCell);
  }
  return renderCache.get(render)!;
}

// The reactive cell wrapper
const ReactiveCell = observer(
  <TValue,>({
    config,
    rowId,
    render,
    className,
  }: {
    config: CellConfig<TValue>;
    rowId: string;
    render?: CellRenderer<TValue>;
    className?: string;
  }) => {
    const cellClassName = [className, config.className]
      .filter(Boolean)
      .join(" ");

    if (render) {
      const Cell = getOrCreateReactiveCell(render);
      return (
        <td className={cellClassName || undefined}>
          <Cell config={config} rowId={rowId} />
        </td>
      );
    }

    return (
      <td className={cellClassName || undefined}>
        <DefaultCell config={config as CellConfig} />
      </td>
    );
  }
);

export function useAppTable<TData>({
  data$,
  rowIds$,
  columns,
  tableOptions = {},
}: UseAppTableOptions<TData>): UseAppTableReturn<TData> {
  const rowIds = useValue(rowIds$);

  const tableData = useMemo(() => rowIds.map((id) => ({ id })), [rowIds]);

  const tanstackColumns = useMemo(
    () =>
      columns.map((col) => ({
        id: col.id,
        header:
          typeof col.header === "function" ? col.header : () => col.header,
        size: typeof col.width === "number" ? col.width : undefined,
        cell: ({ row }: { row: { original: { id: string } } }) => {
          const rowId = row.original.id;
          const row$ = (data$ as any)[rowId] as Observable<TData>;
          const resolved = col.cell(row$);
          const config = normalizeCellConfig(resolved);

          return (
            <ReactiveCell
              config={config}
              rowId={rowId}
              render={col.render}
              className={col.className}
            />
          );
        },
      })),
    [columns, data$]
  );

  const table = useReactTable({
    data: tableData,
    columns: tanstackColumns,
    getCoreRowModel: getCoreRowModel(),
    ...tableOptions,
  });

  // Composable components
  const HeaderComponent: FC = memo(() => (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              style={{
                width: header.getSize() !== 150 ? header.getSize() : undefined,
              }}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  ));

  const RowComponent: FC<{ rowId: string }> = memo(({ rowId }) => {
    const row = table.getRowModel().rows.find((r) => r.original.id === rowId);
    if (!row) return null;

    return (
      <tr>
        {row
          .getVisibleCells()
          .map((cell) =>
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
      </tr>
    );
  });

  const BodyComponent: FC = memo(() => (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row
            .getVisibleCells()
            .map((cell) =>
              flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
        </tr>
      ))}
    </tbody>
  ));

  const TableComponent: FC<{ className?: string }> = memo(({ className }) => (
    <table className={className}>
      <HeaderComponent />
      <BodyComponent />
    </table>
  ));

  const getRow$ = (rowId: string) => (data$ as any)[rowId] as Observable<TData>;

  return {
    table,
    data$,
    getRow$,
    Table: TableComponent,
    Header: HeaderComponent,
    Body: BodyComponent,
    Row: RowComponent,
  };
}
