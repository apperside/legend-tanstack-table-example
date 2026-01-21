import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";

interface ActivityItemProps {
  eventId: string;
}

export const ActivityItem = ({ eventId }: ActivityItemProps) => {
  useRenderCount(`ActivityItem-${eventId}`);

  // Fine-grained subscription to this specific event
  const event = useValue(dashboard$.activityFeed.events[eventId]);

  if (!event) return null;

  const toggleRead = () => {
    dashboard$.activityFeed.events[eventId].isRead.set(!event.isRead);
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case "commit": return "📝";
      case "deploy": return "🚀";
      case "alert": return "🔔";
      case "user": return "👤";
      case "system": return "⚙️";
      default: return "📌";
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
      className={`activity-item ${event.isRead ? "read" : "unread"}`}
      onClick={toggleRead}
    >
      <div className="activity-icon">{getTypeIcon(event.type)}</div>
      <div className="activity-content">
        <div className="activity-message">
          {event.user && <span className="activity-user">{event.user}</span>}
          {event.message}
        </div>
        <div className="activity-meta">
          <span className="activity-type">{event.type}</span>
          <span className="activity-time">{getTimeAgo(event.timestamp)}</span>
        </div>
      </div>
      {!event.isRead && <div className="unread-dot" />}
    </div>
  );
};
