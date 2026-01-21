import { useEffect } from "react";
import { useRenderCount } from "./hooks/useRenderCount";
import { startAllSimulations } from "./simulation";

// Widget imports
import { SystemMetricsWidget } from "./widgets/SystemMetricsWidget";
import { ActivityFeedWidget } from "./widgets/ActivityFeedWidget";
import { UserProfileWidget } from "./widgets/UserProfileWidget";
import { TaskBoardWidget } from "./widgets/TaskBoardWidget";
import { WeatherWidget } from "./widgets/WeatherWidget";
import { NotificationsWidget } from "./widgets/NotificationsWidget";
import { QuickStatsWidget } from "./widgets/QuickStatsWidget";
import { DebugPanel } from "./widgets/DebugPanel";

export const Dashboard = () => {
  useRenderCount("Dashboard");

  // Start all simulations on mount
  useEffect(() => {
    const cleanup = startAllSimulations();
    return cleanup;
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Fine-Grained Reactivity Dashboard</h2>
        <p className="dashboard-subtitle">
          Each widget demonstrates a different reactivity pattern. Watch the Debug Panel to see which components re-render.
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Row 1: Quick Stats spanning full width */}
        <div className="grid-item grid-full">
          <QuickStatsWidget />
        </div>

        {/* Row 2: System Metrics and Weather */}
        <div className="grid-item grid-half">
          <SystemMetricsWidget />
        </div>
        <div className="grid-item grid-half">
          <WeatherWidget />
        </div>

        {/* Row 3: Notifications and Activity Feed */}
        <div className="grid-item grid-half">
          <NotificationsWidget />
        </div>
        <div className="grid-item grid-half">
          <ActivityFeedWidget />
        </div>

        {/* Row 4: User Profile */}
        <div className="grid-item grid-full">
          <UserProfileWidget />
        </div>

        {/* Row 5: Task Board spanning full width */}
        <div className="grid-item grid-full">
          <TaskBoardWidget />
        </div>
      </div>

      <DebugPanel />
    </div>
  );
};
