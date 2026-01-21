import { observable, computed } from "@legendapp/state";
import type { DashboardStore, RenderCount } from "./types";

// Helper to generate initial metric history
const generateHistory = (baseValue: number, variance: number): number[] => {
  return Array.from({ length: 20 }, () =>
    Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * variance))
  );
};

// Initial mock data
const initialData: DashboardStore = {
  systemMetrics: {
    cpu: { value: 45, min: 0, max: 100, history: generateHistory(45, 30) },
    memory: { value: 62, min: 0, max: 100, history: generateHistory(62, 20) },
    disk: { value: 78, min: 0, max: 100, history: generateHistory(78, 5) },
    network: { value: 23, min: 0, max: 100, history: generateHistory(23, 40) },
  },
  activityFeed: {
    events: {
      "evt-1": { id: "evt-1", type: "commit", message: "Fixed authentication bug", timestamp: Date.now() - 60000, isRead: false, user: "Alice" },
      "evt-2": { id: "evt-2", type: "deploy", message: "Deployed v2.3.1 to production", timestamp: Date.now() - 120000, isRead: true, user: "Bob" },
      "evt-3": { id: "evt-3", type: "alert", message: "CPU usage exceeded 90%", timestamp: Date.now() - 180000, isRead: false },
      "evt-4": { id: "evt-4", type: "user", message: "New user registered: charlie@example.com", timestamp: Date.now() - 240000, isRead: true },
      "evt-5": { id: "evt-5", type: "system", message: "Database backup completed", timestamp: Date.now() - 300000, isRead: true },
    },
    eventIds: ["evt-1", "evt-2", "evt-3", "evt-4", "evt-5"],
  },
  userProfile: {
    id: "user-1",
    name: "Jane Developer",
    email: "jane@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    role: "Senior Engineer",
    department: "Engineering",
    settings: {
      theme: "dark",
      language: "en",
      timezone: "America/New_York",
      notifications: {
        email: true,
        push: true,
        sms: false,
        digest: "daily",
      },
      privacy: {
        profileVisible: true,
        showEmail: false,
        showActivity: true,
      },
    },
  },
  projects: {
    "proj-1": {
      id: "proj-1",
      name: "Dashboard Redesign",
      columns: {
        "col-1": {
          id: "col-1",
          name: "To Do",
          tasks: {
            "task-1": {
              id: "task-1",
              title: "Design mockups",
              description: "Create initial design mockups",
              priority: "high",
              subtasks: {
                "sub-1": { id: "sub-1", title: "Wireframes", completed: true, assignee: "Alice" },
                "sub-2": { id: "sub-2", title: "Color scheme", completed: false, assignee: "Bob" },
                "sub-3": { id: "sub-3", title: "Component library", completed: false },
              },
              subtaskIds: ["sub-1", "sub-2", "sub-3"],
            },
            "task-2": {
              id: "task-2",
              title: "API integration",
              description: "Connect to backend APIs",
              priority: "medium",
              subtasks: {
                "sub-4": { id: "sub-4", title: "Auth endpoints", completed: false },
                "sub-5": { id: "sub-5", title: "Data fetching", completed: false },
              },
              subtaskIds: ["sub-4", "sub-5"],
            },
          },
          taskIds: ["task-1", "task-2"],
        },
        "col-2": {
          id: "col-2",
          name: "In Progress",
          tasks: {
            "task-3": {
              id: "task-3",
              title: "Setup project",
              description: "Initialize project structure",
              priority: "low",
              subtasks: {
                "sub-6": { id: "sub-6", title: "Install dependencies", completed: true },
                "sub-7": { id: "sub-7", title: "Configure build", completed: true },
              },
              subtaskIds: ["sub-6", "sub-7"],
            },
          },
          taskIds: ["task-3"],
        },
        "col-3": {
          id: "col-3",
          name: "Done",
          tasks: {},
          taskIds: [],
        },
      },
      columnIds: ["col-1", "col-2", "col-3"],
    },
  },
  projectIds: ["proj-1"],
  weather: {
    locations: {
      "loc-1": {
        id: "loc-1",
        city: "New York",
        country: "USA",
        current: { temperature: 72, humidity: 65, windSpeed: 12, condition: "sunny", feelsLike: 75 },
        lastUpdated: Date.now(),
      },
      "loc-2": {
        id: "loc-2",
        city: "London",
        country: "UK",
        current: { temperature: 58, humidity: 80, windSpeed: 8, condition: "cloudy", feelsLike: 55 },
        lastUpdated: Date.now(),
      },
      "loc-3": {
        id: "loc-3",
        city: "Tokyo",
        country: "Japan",
        current: { temperature: 68, humidity: 70, windSpeed: 5, condition: "rainy", feelsLike: 66 },
        lastUpdated: Date.now(),
      },
    },
    locationIds: ["loc-1", "loc-2", "loc-3"],
    selectedLocationId: "loc-1",
  },
  notifications: {
    items: {
      "notif-1": { id: "notif-1", title: "Build Complete", message: "Your build finished successfully", type: "success", timestamp: Date.now() - 30000, isRead: false },
      "notif-2": { id: "notif-2", title: "New Comment", message: "Alice commented on your PR", type: "info", timestamp: Date.now() - 60000, isRead: false },
      "notif-3": { id: "notif-3", title: "Warning", message: "Disk space running low", type: "warning", timestamp: Date.now() - 90000, isRead: true },
      "notif-4": { id: "notif-4", title: "Error", message: "Pipeline failed on main branch", type: "error", timestamp: Date.now() - 120000, isRead: false },
    },
    itemIds: ["notif-1", "notif-2", "notif-3", "notif-4"],
  },
  quickStats: {
    "stat-1": { id: "stat-1", label: "Active Users", value: 1247, unit: "", trend: "up", changePercent: 12.5, color: "#1d9bf0", updateIntervalMs: 1000 },
    "stat-2": { id: "stat-2", label: "Revenue", value: 54320, unit: "$", trend: "up", changePercent: 8.3, color: "#00c853", updateIntervalMs: 2000 },
    "stat-3": { id: "stat-3", label: "Requests/sec", value: 892, unit: "", trend: "stable", changePercent: 0.2, color: "#ff9800", updateIntervalMs: 500 },
    "stat-4": { id: "stat-4", label: "Error Rate", value: 0.12, unit: "%", trend: "down", changePercent: -15.2, color: "#ff5252", updateIntervalMs: 1500 },
  },
  quickStatIds: ["stat-1", "stat-2", "stat-3", "stat-4"],
  debug: {
    renderCounts: {},
    isDebugVisible: true,
    simulationsEnabled: {
      systemMetrics: false,
      activityFeed: false,
      weather: false,
      quickStats: false,
    },
  },
};

// Main observable store
export const dashboard$ = observable<DashboardStore>(initialData);

// Computed value for unread notification count
export const unreadNotificationCount$ = computed(() => {
  const items = dashboard$.notifications.items.get();
  const itemIds = dashboard$.notifications.itemIds.get();
  return itemIds.filter(id => !items[id]?.isRead).length;
});

// Computed value for unread activity count
export const unreadActivityCount$ = computed(() => {
  const events = dashboard$.activityFeed.events.get();
  const eventIds = dashboard$.activityFeed.eventIds.get();
  return eventIds.filter(id => !events[id]?.isRead).length;
});

// Helper to increment render count for debug panel
export const incrementRenderCount = (componentName: string): void => {
  const existing = dashboard$.debug.renderCounts[componentName].peek();
  if (existing) {
    dashboard$.debug.renderCounts[componentName].count.set(existing.count + 1);
    dashboard$.debug.renderCounts[componentName].lastRender.set(Date.now());
  } else {
    dashboard$.debug.renderCounts[componentName].set({
      component: componentName,
      count: 1,
      lastRender: Date.now(),
    } as RenderCount);
  }
};

// Reset all render counts
export const resetRenderCounts = (): void => {
  dashboard$.debug.renderCounts.set({});
};
