import { dashboard$ } from "./dashboardStore";
import type { ActivityEvent, WeatherConditions } from "./types";

// System Metrics Simulation - updates random metric every 100ms
export const startSystemMetricsSimulation = (): (() => void) => {
  const metrics = ["cpu", "memory", "disk", "network"] as const;

  const interval = setInterval(() => {
    if (!dashboard$.debug.simulationsEnabled.systemMetrics.peek()) return;

    const metric = metrics[Math.floor(Math.random() * metrics.length)];
    const currentValue = dashboard$.systemMetrics[metric].value.peek();

    // Random walk with bounds
    const change = (Math.random() - 0.5) * 10;
    const newValue = Math.max(0, Math.min(100, currentValue + change));

    // Update value
    dashboard$.systemMetrics[metric].value.set(Math.round(newValue * 10) / 10);

    // Update history
    const history = dashboard$.systemMetrics[metric].history.peek();
    const newHistory = [...history.slice(1), newValue];
    dashboard$.systemMetrics[metric].history.set(newHistory);
  }, 100);

  return () => clearInterval(interval);
};

// Activity Feed Simulation - adds new events every 2s
export const startActivityFeedSimulation = (): (() => void) => {
  const eventTypes: Array<ActivityEvent["type"]> = ["commit", "deploy", "alert", "user", "system"];
  const users = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
  const messages: Record<ActivityEvent["type"], string[]> = {
    commit: [
      "Fixed critical bug in auth module",
      "Added new feature: dark mode",
      "Refactored database queries",
      "Updated dependencies",
      "Improved error handling",
    ],
    deploy: [
      "Deployed v2.4.0 to production",
      "Rolled back v2.3.9",
      "Deployed hotfix to staging",
      "Blue-green deployment complete",
    ],
    alert: [
      "Memory usage exceeded 85%",
      "Response time above threshold",
      "Error rate increased",
      "SSL certificate expiring soon",
    ],
    user: [
      "New user registered",
      "User upgraded to Pro plan",
      "Password reset requested",
      "Account verification complete",
    ],
    system: [
      "Backup completed successfully",
      "Cache cleared",
      "Log rotation finished",
      "Health check passed",
    ],
  };

  let eventCounter = 100;

  const interval = setInterval(() => {
    if (!dashboard$.debug.simulationsEnabled.activityFeed.peek()) return;

    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const typeMessages = messages[type];
    const message = typeMessages[Math.floor(Math.random() * typeMessages.length)];
    const user = type === "commit" || type === "deploy"
      ? users[Math.floor(Math.random() * users.length)]
      : undefined;

    const newEvent: ActivityEvent = {
      id: `evt-sim-${eventCounter++}`,
      type,
      message,
      timestamp: Date.now(),
      isRead: false,
      user,
    };

    // Add to events Record
    dashboard$.activityFeed.events[newEvent.id].set(newEvent);

    // Prepend to eventIds array (newest first)
    const currentIds = dashboard$.activityFeed.eventIds.peek();
    dashboard$.activityFeed.eventIds.set([newEvent.id, ...currentIds.slice(0, 9)]);
  }, 2000);

  return () => clearInterval(interval);
};

// Weather Simulation - updates random location every 3s
export const startWeatherSimulation = (): (() => void) => {
  const conditions: Array<WeatherConditions["condition"]> = ["sunny", "cloudy", "rainy", "stormy", "snowy"];

  const interval = setInterval(() => {
    if (!dashboard$.debug.simulationsEnabled.weather.peek()) return;

    const locationIds = dashboard$.weather.locationIds.peek();
    const randomId = locationIds[Math.floor(Math.random() * locationIds.length)];

    if (!randomId) return;

    const currentWeather = dashboard$.weather.locations[randomId].current.peek();

    // Randomly update one or more fields
    const tempChange = (Math.random() - 0.5) * 6;
    const newTemp = Math.round(currentWeather.temperature + tempChange);

    const humidityChange = (Math.random() - 0.5) * 10;
    const newHumidity = Math.max(0, Math.min(100, Math.round(currentWeather.humidity + humidityChange)));

    const windChange = (Math.random() - 0.5) * 4;
    const newWind = Math.max(0, Math.round(currentWeather.windSpeed + windChange));

    // Small chance to change condition
    let newCondition = currentWeather.condition;
    if (Math.random() < 0.2) {
      newCondition = conditions[Math.floor(Math.random() * conditions.length)];
    }

    // Update the location
    dashboard$.weather.locations[randomId].current.set({
      temperature: newTemp,
      humidity: newHumidity,
      windSpeed: newWind,
      condition: newCondition,
      feelsLike: Math.round(newTemp + (Math.random() - 0.5) * 6),
    });
    dashboard$.weather.locations[randomId].lastUpdated.set(Date.now());
  }, 3000);

  return () => clearInterval(interval);
};

// Quick Stats Simulation - each stat has its own update interval
export const startQuickStatsSimulation = (): (() => void) => {
  const intervals: ReturnType<typeof setInterval>[] = [];

  const statIds = dashboard$.quickStatIds.peek();

  statIds.forEach(statId => {
    const stat = dashboard$.quickStats[statId].peek();
    if (!stat) return;

    const interval = setInterval(() => {
      if (!dashboard$.debug.simulationsEnabled.quickStats.peek()) return;

      const currentValue = dashboard$.quickStats[statId].value.peek();
      const currentChange = dashboard$.quickStats[statId].changePercent.peek();

      // Calculate new value based on stat type
      let newValue: number;

      switch (statId) {
        case "stat-1": // Active Users
          newValue = Math.max(0, currentValue + Math.round((Math.random() - 0.48) * 20));
          break;
        case "stat-2": // Revenue
          newValue = Math.max(0, currentValue + Math.round((Math.random() - 0.45) * 500));
          break;
        case "stat-3": // Requests/sec
          newValue = Math.max(0, currentValue + Math.round((Math.random() - 0.5) * 100));
          break;
        case "stat-4": // Error Rate
          newValue = Math.max(0, Math.round((currentValue + (Math.random() - 0.55) * 0.05) * 100) / 100);
          break;
        default:
          newValue = currentValue;
      }

      // Calculate new trend
      const newChangePercent = Math.round((newValue - currentValue) / Math.max(1, currentValue) * 10000) / 100;
      let newTrend: "up" | "down" | "stable" = "stable";
      if (newChangePercent > 0.5) newTrend = "up";
      else if (newChangePercent < -0.5) newTrend = "down";

      // Update the stat
      dashboard$.quickStats[statId].value.set(newValue);
      dashboard$.quickStats[statId].trend.set(newTrend);
      dashboard$.quickStats[statId].changePercent.set(
        Math.round((currentChange * 0.9 + newChangePercent * 0.1) * 10) / 10
      );
    }, stat.updateIntervalMs);

    intervals.push(interval);
  });

  return () => {
    intervals.forEach(i => clearInterval(i));
  };
};

// Start all simulations and return cleanup function
export const startAllSimulations = (): (() => void) => {
  const cleanups = [
    startSystemMetricsSimulation(),
    startActivityFeedSimulation(),
    startWeatherSimulation(),
    startQuickStatsSimulation(),
  ];

  return () => {
    cleanups.forEach(cleanup => cleanup());
  };
};
