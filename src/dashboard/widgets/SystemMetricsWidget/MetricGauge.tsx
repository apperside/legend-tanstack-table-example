import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";
import { Sparkline } from "./Sparkline";

type MetricKey = "cpu" | "memory" | "disk" | "network";

interface MetricGaugeProps {
  metricKey: MetricKey;
  label: string;
  color: string;
}

export const MetricGauge = ({ metricKey, label, color }: MetricGaugeProps) => {
  useRenderCount(`MetricGauge-${metricKey}`);

  // Fine-grained subscription - only subscribes to this specific metric's value
  const value = useValue(dashboard$.systemMetrics[metricKey].value);

  return (
    <div className="metric-gauge">
      <div className="gauge-header">
        <span className="gauge-label">{label}</span>
        <span className="gauge-value" style={{ color }}>{value.toFixed(1)}%</span>
      </div>
      <div className="gauge-bar">
        <div
          className="gauge-fill"
          style={{
            width: `${value}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <Sparkline metricKey={metricKey} color={color} />
    </div>
  );
};
