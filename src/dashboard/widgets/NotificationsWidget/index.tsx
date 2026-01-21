import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";
import { NotificationBadge } from "./NotificationBadge";
import { NotificationItem } from "./NotificationItem";

export const NotificationsWidget = () => {
  useRenderCount("NotificationsWidget");
  const itemIds = useValue(dashboard$.notifications.itemIds);

  const markAllRead = () => {
    itemIds.forEach(id => {
      dashboard$.notifications.items[id].isRead.set(true);
    });
  };

  return (
    <div className="widget notifications-widget">
      <div className="widget-header">
        <h3 className="widget-title">
          Notifications <NotificationBadge />
        </h3>
        <button className="btn-small" onClick={markAllRead}>Mark all read</button>
      </div>
      <div className="notifications-list">
        {itemIds.map(id => (
          <NotificationItem key={id} notificationId={id} />
        ))}
      </div>
    </div>
  );
};
