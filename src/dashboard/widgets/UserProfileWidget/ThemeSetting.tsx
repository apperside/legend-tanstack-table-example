import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";

export const ThemeSetting = () => {
  useRenderCount("ThemeSetting");

  // Fine-grained subscription to deeply nested value
  const theme = useValue(dashboard$.userProfile.settings.theme);

  const setTheme = (newTheme: "light" | "dark" | "system") => {
    dashboard$.userProfile.settings.theme.set(newTheme);
  };

  return (
    <div className="setting-group">
      <label className="setting-label">Theme</label>
      <div className="setting-options">
        {(["light", "dark", "system"] as const).map(option => (
          <button
            key={option}
            className={`setting-option ${theme === option ? "active" : ""}`}
            onClick={() => setTheme(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};
