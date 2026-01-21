// Dashboard Types - Fine-Grained Reactivity Showcase

// System Metrics Widget Types
export interface MetricData {
  value: number;
  min: number;
  max: number;
  history: number[];
}

export interface SystemMetrics {
  cpu: MetricData;
  memory: MetricData;
  disk: MetricData;
  network: MetricData;
}

// Activity Feed Widget Types
export interface ActivityEvent {
  id: string;
  type: 'commit' | 'deploy' | 'alert' | 'user' | 'system';
  message: string;
  timestamp: number;
  isRead: boolean;
  user?: string;
  metadata?: Record<string, string>;
}

// User Profile Widget Types
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  digest: 'daily' | 'weekly' | 'never';
}

export interface PrivacySettings {
  profileVisible: boolean;
  showEmail: boolean;
  showActivity: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  settings: UserSettings;
}

// Task Board Widget Types (5-level deep nesting)
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assignee?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  subtasks: Record<string, SubTask>;
  subtaskIds: string[];
}

export interface Column {
  id: string;
  name: string;
  tasks: Record<string, Task>;
  taskIds: string[];
}

export interface Project {
  id: string;
  name: string;
  columns: Record<string, Column>;
  columnIds: string[];
}

// Weather Widget Types
export interface WeatherConditions {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  feelsLike: number;
}

export interface WeatherLocation {
  id: string;
  city: string;
  country: string;
  current: WeatherConditions;
  lastUpdated: number;
}

// Notifications Widget Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  isRead: boolean;
  actionUrl?: string;
}

// Quick Stats Widget Types
export interface QuickStat {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  color: string;
  updateIntervalMs: number;
}

// Debug Panel Types
export interface RenderCount {
  component: string;
  count: number;
  lastRender: number;
}

// Main Dashboard Store Type
export interface DashboardStore {
  systemMetrics: SystemMetrics;
  activityFeed: {
    events: Record<string, ActivityEvent>;
    eventIds: string[];
  };
  userProfile: UserProfile;
  projects: Record<string, Project>;
  projectIds: string[];
  weather: {
    locations: Record<string, WeatherLocation>;
    locationIds: string[];
    selectedLocationId: string;
  };
  notifications: {
    items: Record<string, Notification>;
    itemIds: string[];
  };
  quickStats: Record<string, QuickStat>;
  quickStatIds: string[];
  debug: {
    renderCounts: Record<string, RenderCount>;
    isDebugVisible: boolean;
    simulationsEnabled: {
      systemMetrics: boolean;
      activityFeed: boolean;
      weather: boolean;
      quickStats: boolean;
    };
  };
}
