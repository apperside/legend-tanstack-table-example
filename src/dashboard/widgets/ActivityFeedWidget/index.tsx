import { useValue } from "@legendapp/state/react";
import { dashboard$, unreadActivityCount$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";
import { ActivityItem } from "./ActivityItem";

export const ActivityFeedWidget = () => {
  useRenderCount("ActivityFeedWidget");
  const eventIds = useValue(dashboard$.activityFeed.eventIds);
  const unreadCount = useValue(unreadActivityCount$);

  const markAllRead = () => {
    eventIds.forEach(id => {
      dashboard$.activityFeed.events[id].isRead.set(true);
    });
  };

  return (
    <div className="widget activity-feed-widget">
      <div className="widget-header">
        <h3 className="widget-title">
          Activity Feed
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </h3>
        <button className="btn-small" onClick={markAllRead}>Mark all read</button>
      </div>
      <p className="widget-subtitle">New events added every 2s - existing items don't re-render</p>
      <div className="activity-list">
        {eventIds.map(id => (
          <ActivityItem key={id} eventId={id} />
        ))}
      </div>
    </div>
  );
};
