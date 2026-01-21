import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { StatCard } from "./StatCard";
import { useRenderCount } from "../../hooks/useRenderCount";

export const QuickStatsWidget = () => {
  useRenderCount("QuickStatsWidget");
  const statIds = useValue(dashboard$.quickStatIds);

  return (
    <div className="widget quick-stats-widget">
      <h3 className="widget-title">Quick Stats</h3>
      <div className="quick-stats-grid">
        {statIds.map(id => (
          <StatCard key={id} statId={id} />
        ))}
      </div>
    </div>
  );
};
