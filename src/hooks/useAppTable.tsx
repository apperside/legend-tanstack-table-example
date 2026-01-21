// useAppTable.tsx
import { Observable } from "@legendapp/state";
import { observer, useValue } from "@legendapp/state/react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { memo, useMemo, FC, Fragment } from "react";
import {
  CellConfig,
  CellRenderer,
  ObservableColumnDef,
  UseAppTableOptions,
  UseAppTableReturn,
} from "./types";
import { formatValue } from "./formatters";

// Normalize cell output to CellConfig
function normalizeCellConfig<TValue>(
  result: Observable<TValue> | CellConfig<TValue>
): CellConfig<TValue> {
  if (result && typeof result === "object" && "value$" in result) {
    return result as CellConfig<TValue>;
  }
  return { value$: result as Observable<TValue> };
}

// Default cell - just renders formatted value
const DefaultCell = observer(({ config }: { config: CellConfig }) => {
  const value = useValue(config.value$);
  return <>{formatValue(value, config.format)}</>;
});

// Cache for wrapped custom renderers
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
    renderCache.set(
      render,
      WrappedCell as FC<{ config: CellConfig; rowId: string }>
    );
  }
  return renderCache.get(render)!;
}

// Reactive cell wrapper
const ReactiveCell = <TValue,>({
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
  const cellClassName = [className, config.className].filter(Boolean).join(" ");

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
};

export function useAppTable<TData>({
  data$,
  rowIds$,
  columns,
  tableOptions = {},
}: UseAppTableOptions<TData>): UseAppTableReturn<TData> {
  // Only re-render table when row list changes
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

  const getRow$ = (rowId: string) => (data$ as any)[rowId] as Observable<TData>;

  // Composable sub-components
  const Header: FC = memo(() => (
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

  const Row: FC<{ rowId: string }> = memo(({ rowId }) => {
    const row = table.getRowModel().rows.find((r) => r.original.id === rowId);
    if (!row) return null;

    return (
      <tr>
        {row.getVisibleCells().map((cell) => (
          <Fragment key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Fragment>
        ))}
      </tr>
    );
  });

  const Body: FC = memo(() => (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <Fragment key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Fragment>
          ))}
        </tr>
      ))}
    </tbody>
  ));

  const TableComponent: FC<{ className?: string }> = memo(({ className }) => (
    <table className={className}>
      <Header />
      <Body />
    </table>
  ));

  return {
    table,
    data$,
    getRow$,
    Table: TableComponent,
    Header,
    Body,
    Row,
  };
}
