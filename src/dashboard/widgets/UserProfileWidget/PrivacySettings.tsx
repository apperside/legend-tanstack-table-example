import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";

// Individual toggle for maximum fine-grained reactivity
const PrivacyToggle = ({ field, label }: { field: "profileVisible" | "showEmail" | "showActivity"; label: string }) => {
  useRenderCount(`PrivacyToggle-${field}`);

  const value = useValue(dashboard$.userProfile.settings.privacy[field]);

  const toggle = () => {
    dashboard$.userProfile.settings.privacy[field].set(!value);
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
      <span className="toggle-text">{label}</span>
    </label>
  );
};

export const PrivacySettings = () => {
  useRenderCount("PrivacySettings");

  return (
    <div className="setting-group">
      <label className="setting-label">Privacy</label>
      <div className="toggle-group">
        <PrivacyToggle field="profileVisible" label="Public Profile" />
        <PrivacyToggle field="showEmail" label="Show Email" />
        <PrivacyToggle field="showActivity" label="Show Activity" />
      </div>
    </div>
  );
};
