import { useValue } from "@legendapp/state/react";
import { StockTable } from "./components/StockTable";
import { Controls } from "./components/Controls";
import { store$ } from "./store";

const App = () => {
  const stockIds = useValue(store$.stockIds);

  return (
    <div className="app">
      <header>
        <h1>Legend State v3 + TanStack Table</h1>
        <p className="subtitle">Fine-Grained Reactivity POC</p>
      </header>

      <main>
        <Controls />
        {stockIds.length > 0 ? (
          <StockTable />
        ) : (
          <div className="empty-state">
            <p>Click "Load Data" to start</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
