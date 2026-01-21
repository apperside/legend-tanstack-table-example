import { useState } from "react";
import { useValue } from "@legendapp/state/react";
import { StockTable } from "./components/StockTable";
import { Controls } from "./components/Controls";
import { store$ } from "./store";
import { Dashboard } from "./dashboard/Dashboard";

type View = "table" | "dashboard";

const App = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const stockIds = useValue(store$.stockIds);

  return (
    <div className="app">
      <header>
        <h1>Legend State v3 Fine-Grained Reactivity</h1>
        <p className="subtitle">Proof of Concept</p>
      </header>

      <div className="view-toggle">
        <button
          className={currentView === "dashboard" ? "active" : ""}
          onClick={() => setCurrentView("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={currentView === "table" ? "active" : ""}
          onClick={() => setCurrentView("table")}
        >
          Stock Table
        </button>
      </div>

      <main>
        {currentView === "dashboard" ? (
          <Dashboard />
        ) : (
          <>
            <Controls />
            {stockIds.length > 0 ? (
              <StockTable />
            ) : (
              <div className="empty-state">
                <p>Click "Load Data" to start</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
