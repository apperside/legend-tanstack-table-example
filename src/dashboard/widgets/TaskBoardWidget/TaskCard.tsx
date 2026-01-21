import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";
import { SubTaskItem } from "./SubTaskItem";

interface TaskCardProps {
  projectId: string;
  columnId: string;
  taskId: string;
}

export const TaskCard = ({ projectId, columnId, taskId }: TaskCardProps) => {
  useRenderCount(`TaskCard-${taskId}`);

  // Fine-grained subscription to this task
  const task = useValue(dashboard$.projects[projectId].columns[columnId].tasks[taskId]);

  if (!task) return null;

  const getPriorityClass = (priority: string): string => {
    switch (priority) {
      case "high": return "priority-high";
      case "medium": return "priority-medium";
      default: return "priority-low";
    }
  };

  const completedCount = task.subtaskIds.filter(
    id => task.subtasks[id]?.completed
  ).length;

  return (
    <div className="task-card">
      <div className="task-header">
        <span className={`task-priority ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      <div className="task-title">{task.title}</div>
      <div className="task-description">{task.description}</div>
      {task.subtaskIds.length > 0 && (
        <div className="subtask-section">
          <div className="subtask-header">
            <span>Subtasks</span>
            <span className="subtask-progress">{completedCount}/{task.subtaskIds.length}</span>
          </div>
          <div className="subtask-list">
            {task.subtaskIds.map(subtaskId => (
              <SubTaskItem
                key={subtaskId}
                projectId={projectId}
                columnId={columnId}
                taskId={taskId}
                subtaskId={subtaskId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
