import { useRenderCount } from "../../hooks/useRenderCount";
import { MetricGauge } from "./MetricGauge";

const metrics = [
  { key: "cpu" as const, label: "CPU", color: "#1d9bf0" },
  { key: "memory" as const, label: "Memory", color: "#00c853" },
  { key: "disk" as const, label: "Disk", color: "#ff9800" },
  { key: "network" as const, label: "Network", color: "#e91e63" },
];

export const SystemMetricsWidget = () => {
  useRenderCount("SystemMetricsWidget");

  return (
    <div className="widget system-metrics-widget">
      <h3 className="widget-title">System Metrics</h3>
      <p className="widget-subtitle">Updates every 100ms - watch individual gauges update</p>
      <div className="metrics-grid">
        {metrics.map(({ key, label, color }) => (
          <MetricGauge key={key} metricKey={key} label={label} color={color} />
        ))}
      </div>
    </div>
  );
};
