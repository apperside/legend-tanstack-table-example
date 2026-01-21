import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";

// Individual toggle component for maximum fine-grained reactivity
const NotificationToggle = ({ field }: { field: "email" | "push" | "sms" }) => {
  useRenderCount(`NotificationToggle-${field}`);

  const value = useValue(dashboard$.userProfile.settings.notifications[field]);

  const toggle = () => {
    dashboard$.userProfile.settings.notifications[field].set(!value);
  };

  return (
    <label className="toggle-label">
      <input
        type="checkbox"
        checked={value}
        onChange={toggle}
        className="toggle-input"
      />
      <span className="toggle-switch" />
      <span className="toggle-text">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
    </label>
  );
};

const DigestSetting = () => {
  useRenderCount("DigestSetting");

  const digest = useValue(dashboard$.userProfile.settings.notifications.digest);

  const setDigest = (value: "daily" | "weekly" | "never") => {
    dashboard$.userProfile.settings.notifications.digest.set(value);
  };

  return (
    <div className="setting-row">
      <span className="setting-text">Email Digest</span>
      <select
        value={digest}
        onChange={(e) => setDigest(e.target.value as "daily" | "weekly" | "never")}
        className="setting-select"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="never">Never</option>
      </select>
    </div>
  );
};

export const NotificationSettings = () => {
  useRenderCount("NotificationSettings");

  return (
    <div className="setting-group">
      <label className="setting-label">Notifications</label>
      <div className="toggle-group">
        <NotificationToggle field="email" />
        <NotificationToggle field="push" />
        <NotificationToggle field="sms" />
      </div>
      <DigestSetting />
    </div>
  );
};
