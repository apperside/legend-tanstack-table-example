import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";

type MetricKey = "cpu" | "memory" | "disk" | "network";

interface SparklineProps {
  metricKey: MetricKey;
  color: string;
}

export const Sparkline = ({ metricKey, color }: SparklineProps) => {
  useRenderCount(`Sparkline-${metricKey}`);

  // Subscribe only to history array
  const history = useValue(dashboard$.systemMetrics[metricKey].history);

  const width = 100;
  const height = 24;
  const padding = 2;

  const points = history.map((value, index) => {
    const x = padding + (index / (history.length - 1)) * (width - padding * 2);
    const y = height - padding - (value / 100) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg className="sparkline" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
};
