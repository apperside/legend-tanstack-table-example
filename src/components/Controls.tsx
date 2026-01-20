import { useState, useCallback } from "react";
import { useValue } from "@legendapp/state/react";
import { store$, fetchStocks, updateStockField, startPriceSimulation } from "../store";

export const Controls = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [stopSimulation, setStopSimulation] = useState<(() => void) | null>(null);
  const [updateSpeed, setUpdateSpeed] = useState(100);
  const [rowCount, setRowCount] = useState(100);

  const isLoading = useValue(store$.isLoading);
  const stockIds = useValue(store$.stockIds);

  const handleLoadData = useCallback(async () => {
    await fetchStocks(rowCount);
  }, [rowCount]);

  const handleToggleSimulation = useCallback(() => {
    if (isSimulating && stopSimulation) {
      stopSimulation();
      setStopSimulation(null);
      setIsSimulating(false);
    } else {
      const stop = startPriceSimulation(updateSpeed);
      setStopSimulation(() => stop);
      setIsSimulating(true);
    }
  }, [isSimulating, stopSimulation, updateSpeed]);

  const handleManualUpdate = useCallback(() => {
    if (stockIds.length === 0) return;

    const randomId = stockIds[Math.floor(Math.random() * stockIds.length)];
    const currentPrice = store$.stocks[randomId].price.peek();
    const newPrice = Math.round((currentPrice + (Math.random() - 0.5) * 5) * 100) / 100;

    updateStockField(randomId, "price", newPrice);
  }, [stockIds]);

  const handleUpdateSpecificStock = useCallback(() => {
    const firstId = stockIds[0];
    if (!firstId) return;

    const currentPrice = store$.stocks[firstId].price.peek();
    const newPrice = Math.round((currentPrice + 1) * 100) / 100;

    updateStockField(firstId, "price", newPrice);
  }, [stockIds]);

  return (
    <div className="controls">
      <div className="control-group">
        <label>
          Rows:
          <input
            type="number"
            value={rowCount}
            onChange={(e) => setRowCount(Number(e.target.value))}
            min={10}
            max={1000}
            step={10}
          />
        </label>
        <button onClick={handleLoadData} disabled={isLoading}>
          {isLoading ? "Loading..." : stockIds.length > 0 ? "Reload" : "Load Data"}
        </button>
      </div>

      <div className="control-group">
        <label>
          Interval (ms):
          <input
            type="number"
            value={updateSpeed}
            onChange={(e) => setUpdateSpeed(Number(e.target.value))}
            min={10}
            max={1000}
            step={10}
            disabled={isSimulating}
          />
        </label>
        <button
          onClick={handleToggleSimulation}
          disabled={stockIds.length === 0}
          className={isSimulating ? "active" : ""}
        >
          {isSimulating ? "Stop" : "Start"} Simulation
        </button>
      </div>

      <div className="control-group">
        <button onClick={handleManualUpdate} disabled={stockIds.length === 0}>
          Update Random
        </button>
        <button onClick={handleUpdateSpecificStock} disabled={stockIds.length === 0}>
          Update First (+$1)
        </button>
      </div>
    </div>
  );
};
