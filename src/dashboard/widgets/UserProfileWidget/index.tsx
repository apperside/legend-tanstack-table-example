import { useRenderCount } from "../../hooks/useRenderCount";
import { ProfileHeader } from "./ProfileHeader";
import { ThemeSetting } from "./ThemeSetting";
import { NotificationSettings } from "./NotificationSettings";
import { PrivacySettings } from "./PrivacySettings";

export const UserProfileWidget = () => {
  useRenderCount("UserProfileWidget");

  return (
    <div className="widget user-profile-widget">
      <h3 className="widget-title">User Profile</h3>
      <p className="widget-subtitle">Edit nested fields - only changed fields re-render</p>
      <ProfileHeader />
      <div className="profile-settings">
        <ThemeSetting />
        <NotificationSettings />
        <PrivacySettings />
      </div>
    </div>
  );
};
