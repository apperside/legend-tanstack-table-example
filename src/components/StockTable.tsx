import { useMemo } from 'react';
import { useValue } from '@legendapp/state/react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from '@tanstack/react-table';
import { store$ } from '../store';
import {
  PriceCell,
  ChangeCell,
  ChangePercentCell,
  VolumeCell,
  MarketCapCell,
  StaticCell,
} from './ReactiveCell';

const columnHelper = createColumnHelper<{ id: string }>();

const columns: ColumnDef<{ id: string }, string>[] = [
  columnHelper.accessor('id', {
    header: 'Symbol',
    cell: ({ row }) => {
      const symbol = store$.stocks[row.original.id].symbol.peek();
      return <StaticCell>{symbol}</StaticCell>;
    },
  }),
  columnHelper.display({
    id: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = store$.stocks[row.original.id].name.peek();
      return <StaticCell>{name}</StaticCell>;
    },
  }),
  columnHelper.display({
    id: 'price',
    header: 'Price',
    cell: ({ row }) => <PriceCell stockId={row.original.id} />,
  }),
  columnHelper.display({
    id: 'change',
    header: 'Change',
    cell: ({ row }) => <ChangeCell stockId={row.original.id} />,
  }),
  columnHelper.display({
    id: 'changePercent',
    header: 'Change %',
    cell: ({ row }) => <ChangePercentCell stockId={row.original.id} />,
  }),
  columnHelper.display({
    id: 'volume',
    header: 'Volume',
    cell: ({ row }) => <VolumeCell stockId={row.original.id} />,
  }),
  columnHelper.display({
    id: 'marketCap',
    header: 'Market Cap',
    cell: ({ row }) => <MarketCapCell stockId={row.original.id} />,
  }),
];

export const StockTable = () => {
  // useValue() subscribes to stockIds - table only re-renders when list changes
  const stockIds = useValue(store$.stockIds);
  const data = useMemo(
    () => stockIds.map((id: string) => ({ id })),
    [stockIds]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='table-container'>
      <div className='table-scroll'>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
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
        </table>
      </div>
    </div>
  );
};
