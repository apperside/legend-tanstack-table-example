import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";

interface StatCardProps {
  statId: string;
}

export const StatCard = ({ statId }: StatCardProps) => {
  useRenderCount(`StatCard-${statId}`);

  // Fine-grained subscription - only re-renders when THIS stat changes
  const stat = useValue(dashboard$.quickStats[statId]);

  if (!stat) return null;

  const formatValue = (value: number, unit: string): string => {
    if (unit === "$") {
      return `$${value.toLocaleString()}`;
    }
    if (unit === "%") {
      return `${value.toFixed(2)}%`;
    }
    return value.toLocaleString();
  };

  const getTrendIcon = (trend: "up" | "down" | "stable"): string => {
    switch (trend) {
      case "up": return "↑";
      case "down": return "↓";
      default: return "→";
    }
  };

  const getTrendClass = (trend: "up" | "down" | "stable"): string => {
    switch (trend) {
      case "up": return "trend-up";
      case "down": return "trend-down";
      default: return "trend-stable";
    }
  };

  return (
    <div className="stat-card" style={{ borderTopColor: stat.color }}>
      <div className="stat-label">{stat.label}</div>
      <div className="stat-value">{formatValue(stat.value, stat.unit)}</div>
      <div className={`stat-trend ${getTrendClass(stat.trend)}`}>
        <span className="trend-icon">{getTrendIcon(stat.trend)}</span>
        <span className="trend-percent">{Math.abs(stat.changePercent).toFixed(1)}%</span>
      </div>
    </div>
  );
};
