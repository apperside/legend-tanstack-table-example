import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";

interface NotificationItemProps {
  notificationId: string;
}

export const NotificationItem = ({ notificationId }: NotificationItemProps) => {
  useRenderCount(`NotificationItem-${notificationId}`);

  // Fine-grained subscription to this specific notification
  const notification = useValue(dashboard$.notifications.items[notificationId]);

  if (!notification) return null;

  const toggleRead = () => {
    dashboard$.notifications.items[notificationId].isRead.set(!notification.isRead);
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case "success": return "✓";
      case "warning": return "⚠";
      case "error": return "✕";
      default: return "ℹ";
    }
  };

  const getTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div
      className={`notification-item notification-${notification.type} ${notification.isRead ? "read" : "unread"}`}
      onClick={toggleRead}
    >
      <div className={`notification-icon type-${notification.type}`}>
        {getTypeIcon(notification.type)}
      </div>
      <div className="notification-content">
        <div className="notification-title">{notification.title}</div>
        <div className="notification-message">{notification.message}</div>
        <div className="notification-time">{getTimeAgo(notification.timestamp)}</div>
      </div>
      {!notification.isRead && <div className="unread-dot" />}
    </div>
  );
};
