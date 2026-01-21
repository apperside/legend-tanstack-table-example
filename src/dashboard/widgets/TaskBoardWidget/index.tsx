import { useValue } from "@legendapp/state/react";
import { dashboard$ } from "../../dashboardStore";
import { useRenderCount } from "../../hooks/useRenderCount";
import { TaskColumn } from "./TaskColumn";

export const TaskBoardWidget = () => {
  useRenderCount("TaskBoardWidget");

  // For simplicity, we'll use the first project
  const projectIds = useValue(dashboard$.projectIds);
  const firstProjectId = projectIds[0];

  if (!firstProjectId) {
    return (
      <div className="widget task-board-widget">
        <h3 className="widget-title">Task Board</h3>
        <p>No projects available</p>
      </div>
    );
  }

  return <ProjectBoard projectId={firstProjectId} />;
};

interface ProjectBoardProps {
  projectId: string;
}

const ProjectBoard = ({ projectId }: ProjectBoardProps) => {
  useRenderCount(`ProjectBoard-${projectId}`);

  const project = useValue(dashboard$.projects[projectId]);

  if (!project) return null;

  return (
    <div className="widget task-board-widget">
      <h3 className="widget-title">Task Board: {project.name}</h3>
      <p className="widget-subtitle">5-level nesting: Project → Column → Task → Subtask → Field</p>
      <div className="kanban-board">
        {project.columnIds.map(columnId => (
          <TaskColumn key={columnId} projectId={projectId} columnId={columnId} />
        ))}
      </div>
    </div>
  );
};
