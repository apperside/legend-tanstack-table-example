import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";

interface SubTaskItemProps {
  projectId: string;
  columnId: string;
  taskId: string;
  subtaskId: string;
}

export const SubTaskItem = ({ projectId, columnId, taskId, subtaskId }: SubTaskItemProps) => {
  useRenderCount(`SubTaskItem-${subtaskId}`);

  // Deep fine-grained subscription: project > column > task > subtask
  const subtask = useValue(
    dashboard$.projects[projectId].columns[columnId].tasks[taskId].subtasks[subtaskId]
  );

  if (!subtask) return null;

  const toggleCompleted = () => {
    // Update only this specific subtask's completed field
    dashboard$.projects[projectId].columns[columnId].tasks[taskId].subtasks[subtaskId].completed.set(
      !subtask.completed
    );
  };

  return (
    <div className={`subtask-item ${subtask.completed ? "completed" : ""}`}>
      <label className="subtask-checkbox">
        <input
          type="checkbox"
          checked={subtask.completed}
          onChange={toggleCompleted}
        />
        <span className="checkmark" />
      </label>
      <span className="subtask-title">{subtask.title}</span>
      {subtask.assignee && (
        <span className="subtask-assignee">{subtask.assignee}</span>
      )}
    </div>
  );
};
