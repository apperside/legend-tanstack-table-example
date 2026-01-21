import { useValue } from "@legendapp/state/react";
import { dashboard$, resetRenderCounts } from "../../dashboardStore";
import { SimulationControls } from "./SimulationControls";

export const DebugPanel = () => {
  // Note: Intentionally not using useRenderCount here to avoid infinite loop
  // since this component subscribes to renderCounts

  const isVisible = useValue(dashboard$.debug.isDebugVisible);
  const renderCounts = useValue(dashboard$.debug.renderCounts);

  const toggleVisibility = () => {
    dashboard$.debug.isDebugVisible.set(!isVisible);
  };

  // Sort components by render count (descending)
  const sortedComponents = Object.values(renderCounts)
    .sort((a, b) => b.count - a.count);

  // Group by widget type
  const groupedCounts: Record<string, typeof sortedComponents> = {};
  sortedComponents.forEach(item => {
    const parts = item.component.split("-");
    const group = parts[0];
    if (!groupedCounts[group]) {
      groupedCounts[group] = [];
    }
    groupedCounts[group].push(item);
  });

  return (
    <>
      <button
        className="debug-toggle"
        onClick={toggleVisibility}
        title="Toggle Debug Panel"
      >
        {isVisible ? "Hide" : "Show"} Debug
      </button>

      {isVisible && (
        <div className="debug-panel">
          <div className="debug-header">
            <h3>Render Counts</h3>
            <button className="btn-small" onClick={resetRenderCounts}>Reset</button>
          </div>

          <SimulationControls />

          <div className="debug-content">
            <div className="debug-stats">
              <span>Total components: {sortedComponents.length}</span>
              <span>Total renders: {sortedComponents.reduce((sum, c) => sum + c.count, 0)}</span>
            </div>

            <div className="render-counts-list">
              {Object.entries(groupedCounts).map(([group, items]) => (
                <div key={group} className="render-group">
                  <div className="render-group-header">{group}</div>
                  {items.map(item => (
                    <div key={item.component} className="render-count-row">
                      <span className="component-name">{item.component}</span>
                      <span className="render-count">{item.count}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
