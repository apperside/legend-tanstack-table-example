// StockTable.tsx
import { ObservableColumnDef } from "../hooks/types";
import { useAppTable } from "../hooks/useAppTable";
import { store$ } from "../store";
import { StockData } from "../types";

// interface Stock {
//   id: string;
//   symbol: string;
//   name: string;
//   price: number;
//   change: number;
//   volume: number;
//   isActive: boolean;
// }

const columns: ObservableColumnDef<StockData, any>[] = [
  // Simple: just return observable, uses default renderer
  {
    id: "symbol",
    header: "Symbol",
    cell: (row$) => row$.symbol,
    className: "font-bold",
  },

  // Simple with format
  {
    id: "name",
    header: "Name",
    cell: (row$) => row$.name,
  },

  // Config object with format
  {
    id: "price",
    header: "Price",
    cell: (row$) => ({
      value$: row$.price,
      format: "currency",
      className: "text-right",
    }),
  },

  // Custom render with fine-grained reactivity
  {
    id: "change",
    header: "Change %",
    cell: (row$) => ({ value$: row$.change }),
    render: ({ value$ }) => {
      // Only this cell re-renders when change updates
      const change = value$.get();
      const isPositive = change >= 0;

      return (
        <span className={isPositive ? "text-green-500" : "text-red-500"}>
          {isPositive ? "▲" : "▼"} {Math.abs(change * 100).toFixed(2)}%
        </span>
      );
    },
  },

  // Custom render accessing multiple observables via rowId
  {
    id: "volume",
    header: "Volume",
    cell: (row$) => ({ value$: row$.volume, format: "number" }),
    render: ({ value$ }, rowId) => {
      const volume = value$.get();
      // Access other fields from the same row
      const isActive = store$.stocks[rowId].isActive.get();

      return (
        <span className={isActive ? "opacity-100" : "opacity-0"}>
          {volume.toLocaleString()}{""+isActive}
        </span>
      );
    },
  },

  // Action buttons
  {
    id: "actions",
    header: "Actions",
    cell: (row$) => ({ value$: row$.id }),
    render: (_, rowId) => {
      const handleToggle = () => {
        store$.stocks[rowId].isActive.toggle();
      };

      const handleDelete = () => {
        store$.stocks[rowId].delete();
        store$.stockIds.set((ids) => ids.filter((id) => id !== rowId));
      };

      return (
        <div className="flex gap-2">
          <button onClick={handleToggle} className="btn-sm">
            Toggle
          </button>
          <button onClick={handleDelete} className="btn-sm btn-danger">
            Delete
          </button>
        </div>
      );
    },
  },
];

export const StockTable = () => {
  const { Table, table } = useAppTable({
    data$: store$.stocks,
    rowIds$: store$.stockIds,
    columns,
  });

  return (
    <div className="stock-table-container">
      <div className="toolbar">
        Showing {table.getRowModel().rows.length} stocks
      </div>
      <Table className="stock-table" />
    </div>
  );
};

// Or compose manually:
export const StockTableComposed = () => {
  const { Header, Body, table } = useAppTable({
    data$: store$.stocks,
    rowIds$: store$.stockIds,
    columns,
  });

  return (
    <div className="stock-table-container">
      <table className="stock-table">
        <Header />
        <Body />
      </table>
      <div className="footer">
        Total: {table.getRowModel().rows.length}
      </div>
    </div>
  );
};