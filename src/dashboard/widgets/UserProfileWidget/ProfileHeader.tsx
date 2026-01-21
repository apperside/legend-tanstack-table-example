import { useValue } from "@legendapp/state/react";
import { useState } from "react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";

export const ProfileHeader = () => {
  useRenderCount("ProfileHeader");

  const name = useValue(dashboard$.userProfile.name);
  const email = useValue(dashboard$.userProfile.email);
  const role = useValue(dashboard$.userProfile.role);
  const avatar = useValue(dashboard$.userProfile.avatar);

  const [isEditing, setIsEditing] = useState<"name" | "email" | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (field: "name" | "email") => {
    setEditValue(field === "name" ? name : email);
    setIsEditing(field);
  };

  const saveEdit = () => {
    if (isEditing === "name") {
      dashboard$.userProfile.name.set(editValue);
    } else if (isEditing === "email") {
      dashboard$.userProfile.email.set(editValue);
    }
    setIsEditing(null);
  };

  const cancelEdit = () => {
    setIsEditing(null);
  };

  return (
    <div className="profile-header">
      <img src={avatar} alt={name} className="profile-avatar" />
      <div className="profile-info">
        {isEditing === "name" ? (
          <div className="edit-field">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              autoFocus
            />
            <button onClick={saveEdit} className="btn-icon">✓</button>
            <button onClick={cancelEdit} className="btn-icon">✕</button>
          </div>
        ) : (
          <div className="profile-name editable" onClick={() => startEdit("name")}>
            {name} <span className="edit-hint">✎</span>
          </div>
        )}
        {isEditing === "email" ? (
          <div className="edit-field">
            <input
              type="email"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              autoFocus
            />
            <button onClick={saveEdit} className="btn-icon">✓</button>
            <button onClick={cancelEdit} className="btn-icon">✕</button>
          </div>
        ) : (
          <div className="profile-email editable" onClick={() => startEdit("email")}>
            {email} <span className="edit-hint">✎</span>
          </div>
        )}
        <div className="profile-role">{role}</div>
      </div>
    </div>
  );
};
