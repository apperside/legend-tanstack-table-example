import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";

export const SimulationControls = () => {
  // Note: Intentionally not using useRenderCount here since this component
  // is a child of DebugPanel which subscribes to renderCounts

  const simulationsEnabled = useValue(dashboard$.debug.simulationsEnabled);

  const toggleSimulation = (key: keyof typeof simulationsEnabled) => {
    dashboard$.debug.simulationsEnabled[key].set(!simulationsEnabled[key]);
  };

  const toggleAll = () => {
    const allEnabled = Object.values(simulationsEnabled).every(v => v);
    const newValue = !allEnabled;
    dashboard$.debug.simulationsEnabled.systemMetrics.set(newValue);
    dashboard$.debug.simulationsEnabled.activityFeed.set(newValue);
    dashboard$.debug.simulationsEnabled.weather.set(newValue);
    dashboard$.debug.simulationsEnabled.quickStats.set(newValue);
  };

  const allEnabled = Object.values(simulationsEnabled).every(v => v);

  // const stat = useValue(dashboard$.quickStats[statId]);
  const changeIt = () => {
    dashboard$.quickStats["stat-1"].label.set("Active Users (TEST)");
  };
  return (
    <div className="simulation-controls">
      <div className="simulation-header">
        <span>Simulations</span>
        <button
          className={`btn-small `}
          onClick={changeIt}
        >
          TEST
        </button>
        <button
          className={`btn-small ${allEnabled ? "active" : ""}`}
          onClick={toggleAll}
        >
          {allEnabled ? "Stop All" : "Start All"}
        </button>
      </div>
      <div className="simulation-toggles">
        <label className="sim-toggle">
          <input
            type="checkbox"
            checked={simulationsEnabled.systemMetrics}
            onChange={() => toggleSimulation("systemMetrics")}
          />
          <span>System Metrics (100ms)</span>
        </label>
        <label className="sim-toggle">
          <input
            type="checkbox"
            checked={simulationsEnabled.activityFeed}
            onChange={() => toggleSimulation("activityFeed")}
          />
          <span>Activity Feed (2s)</span>
        </label>
        <label className="sim-toggle">
          <input
            type="checkbox"
            checked={simulationsEnabled.weather}
            onChange={() => toggleSimulation("weather")}
          />
          <span>Weather (3s)</span>
        </label>
        <label className="sim-toggle">
          <input
            type="checkbox"
            checked={simulationsEnabled.quickStats}
            onChange={() => toggleSimulation("quickStats")}
          />
          <span>Quick Stats (varied)</span>
        </label>
      </div>
    </div>
  );
};
