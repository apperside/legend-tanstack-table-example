# Legend State + TanStack Table: Fine-Grained Reactivity POC

This proof of concept demonstrates **fine-grained reactivity** using Legend State with TanStack Table. It shows how to build a high-performance data table where individual cell updates don't cause unnecessary re-renders of the entire table or rows.

## The Problem

In traditional React state management (Redux, Zustand, React Context), when a single value in an array changes, it typically triggers re-renders of:
- The entire table component
- Every row component
- Every cell component

With 100+ rows and frequent updates (like real-time stock prices), this causes serious performance issues.

## The Solution

Legend State's fine-grained reactivity allows each cell to **subscribe to only its specific data path**. When `store$.stocks["stock-42"].price` changes:
- ✅ Only the price cell for stock-42 re-renders
- ❌ The table component does NOT re-render
- ❌ Other rows do NOT re-render
- ❌ Other cells (even in the same row) do NOT re-render

## Key Concepts

### 1. Observable Store Structure

```typescript
const store$ = observable({
  stocks: {} as Record<string, StockData>,
  stockIds: [] as string[],
});
```

Each stock is stored as a separate observable object, allowing granular subscriptions.

### 2. Fine-Grained Cell Components

```typescript
const PriceCell = ({ stockId }: { stockId: string }) => {
  // Subscribe to ONLY this stock's price field
  const price = useSelector(() => store$.stocks[stockId].price.get());

  return <td>${price?.toFixed(2)}</td>;
};
```

### 3. Surgical Updates

```typescript
// This only triggers re-renders for components watching this exact path
store$.stocks[stockId].price.set(newPrice);
```

### 4. TanStack Table Integration

```typescript
const columns = [
  {
    id: "price",
    header: "Price",
    // Each cell is an independent reactive component
    cell: ({ row }) => <PriceCell stockId={row.original.id} />,
  },
];
```

## Running the Demo

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## How to Test

1. Click "Load Data" to fetch 100 stocks
2. Click "Start Simulation" to begin random price updates
3. Watch the render badges on each cell (small numbers in corner)
4. Notice:
   - Table render count stays at 1-2
   - Only updated cells increment their render count
   - Cells flash blue briefly when they update

## Performance Benefits

| Scenario | Traditional Approach | Legend State |
|----------|---------------------|--------------|
| 100 stocks, 10 updates/sec | 1000+ re-renders/sec | 10 cell re-renders/sec |
| Row re-renders per update | Entire row | 0 |
| Table re-renders per update | 1 | 0 |

## Files Structure

```
src/
├── store.ts              # Observable store with stocks data
├── types.ts              # TypeScript interfaces
├── App.tsx               # Main app component
├── components/
│   ├── StockTable.tsx    # TanStack Table implementation
│   ├── ReactiveCell.tsx  # Fine-grained reactive cell components
│   └── Controls.tsx      # UI controls for demo
└── styles.css            # Styling
```

## Key Takeaways

1. **Structure data for granular access**: Store items in a Record/Map, not an array
2. **Pass IDs, not data**: Table rows receive IDs; cells fetch their own data reactively
3. **Use `useSelector` for subscriptions**: Each cell subscribes to its specific path
4. **Use `peek()` for non-reactive reads**: When you don't need reactivity (e.g., static fields)
5. **Separate structure from values**: stockIds array changes trigger table re-render; value changes don't

## Technologies Used

- [Legend State](https://legendapp.com/open-source/state/) - Fine-grained reactive state
- [TanStack Table](https://tanstack.com/table/) - Headless table library
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [TypeScript](https://www.typescriptlang.org/) - Type safety
