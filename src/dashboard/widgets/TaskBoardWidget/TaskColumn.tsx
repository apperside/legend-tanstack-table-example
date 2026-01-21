import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  projectId: string;
  columnId: string;
}

export const TaskColumn = ({ projectId, columnId }: TaskColumnProps) => {
  useRenderCount(`TaskColumn-${columnId}`);

  // Fine-grained subscription to this column
  const column = useValue(dashboard$.projects[projectId].columns[columnId]);

  if (!column) return null;

  return (
    <div className="kanban-column">
      <div className="column-header">
        <h4 className="column-title">{column.name}</h4>
        <span className="column-count">{column.taskIds.length}</span>
      </div>
      <div className="column-tasks">
        {column.taskIds.map(taskId => (
          <TaskCard key={taskId} projectId={projectId} columnId={columnId} taskId={taskId} />
        ))}
      </div>
    </div>
  );
};
