import { useRef, useEffect } from "react";
import { incrementRenderCount } from "../dashboardStore";

/**
 * Debug hook that tracks render counts for a component.
 * Call this at the top of your component to track how many times it renders.
 * The count is stored in the dashboard store's debug.renderCounts.
 *
 * @param componentName - Unique identifier for this component instance
 */
export const useRenderCount = (componentName: string): number => {
  const renderCount = useRef(0);

  // Increment on every render
  renderCount.current += 1;

  // Update the store (batched to avoid triggering re-renders)
  useEffect(() => {
    incrementRenderCount(componentName);
  });

  return renderCount.current;
};
