import { useValue } from "@legendapp/state/react";
import { unreadNotificationCount$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";

export const NotificationBadge = () => {
  useRenderCount("NotificationBadge");

  // Subscribe to computed value - only re-renders when unread count changes
  const unreadCount = useValue(unreadNotificationCount$);

  if (unreadCount === 0) return null;

  return (
    <span className="notification-badge">{unreadCount}</span>
  );
};
