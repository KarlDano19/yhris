// Drag and drop utilities
export const createDragStartHandler = (
  setDraggedNodeId: (id: number | string) => void
) => (nodeId: number | string) => {
  setDraggedNodeId(nodeId);
};

export const createDragEndHandler = (
  setDraggedNodeId: (id: number | string | null) => void,
  setDragOverNodeId: (id: number | string | null) => void,
  dragOverTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
) => () => {
  // Clear any pending timeout
  if (dragOverTimeoutRef.current) {
    clearTimeout(dragOverTimeoutRef.current);
    dragOverTimeoutRef.current = null;
  }
  setDraggedNodeId(null);
  setDragOverNodeId(null);
};

export const createDragOverHandler = (
  setDragOverNodeId: (id: number | string | null) => void,
  dragOverTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  currentDragOverNodeId: number | string | null
) => (nodeId: number | string) => {
  // Clear any existing timeout
  if (dragOverTimeoutRef.current) {
    clearTimeout(dragOverTimeoutRef.current);
    dragOverTimeoutRef.current = null;
  }
  
  // Only update if the node is different to prevent flickering
  if (currentDragOverNodeId !== nodeId) {
    setDragOverNodeId(nodeId);
  }
};

export const createDragLeaveHandler = (
  setDragOverNodeId: (id: number | string | null) => void,
  dragOverTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
) => () => {
  // Clear any existing timeout
  if (dragOverTimeoutRef.current) {
    clearTimeout(dragOverTimeoutRef.current);
  }
  
  // Add a small delay to prevent flickering when moving between nodes
  dragOverTimeoutRef.current = setTimeout(() => {
    setDragOverNodeId(null);
    dragOverTimeoutRef.current = null;
  }, 100);
};

