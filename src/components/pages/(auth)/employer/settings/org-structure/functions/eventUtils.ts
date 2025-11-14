// Mouse and touch event utilities
export const createMouseDownHandler = (
  setIsDragging: (dragging: boolean) => void,
  setDragStart: (start: { x: number; y: number }) => void,
  dragOffset: { x: number; y: number },
  draggedNodeId: number | string | null,
  zoomLevel: number = 1
) => (e: React.MouseEvent) => {
  const target = e.target as HTMLElement;
  
  // Don't interfere with modals or other overlays
  if (target.closest('[role="dialog"]') || 
      target.closest('.modal') || 
      target.closest('[data-headlessui-state]') ||
      target.closest('.ql-editor') ||
      target.closest('.ql-toolbar') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('select')) {
    return;
  }
  
  // Check if we're clicking on interactive elements (nodes, buttons, etc.)
  const isClickingOnInteractiveElement = target.closest('.pointer-events-auto') || 
    target.closest('button') ||
    target.closest('[role="button"]') ||
    target.closest('.bg-white') && target.closest('.border-2') || // Org node container
    target.closest('.bg-gray-300') || // Shadow add button
    target.closest('.bg-blue-600'); // Add button
  
  // Only start dragging if NOT clicking on interactive elements and not in middle of drag operation
  if (!isClickingOnInteractiveElement && !draggedNodeId) {
    setIsDragging(true);
    // Store raw mouse position for smoother dragging
    setDragStart({ 
      x: e.clientX - dragOffset.x, 
      y: e.clientY - dragOffset.y 
    });
    e.preventDefault();
  }
};

export const createMouseMoveHandler = (
  isDragging: boolean,
  setDragOffset: (offset: { x: number; y: number }) => void,
  dragStart: { x: number; y: number },
  zoomLevel: number = 1
) => {
  let rafId: number | null = null;
  
  return (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      
      // Cancel any pending animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      
      // Use requestAnimationFrame for smooth updates
      rafId = requestAnimationFrame(() => {
        // Calculate raw offset first, then apply zoom
        const rawOffsetX = e.clientX - dragStart.x;
        const rawOffsetY = e.clientY - dragStart.y;
        
        setDragOffset({
          x: rawOffsetX,
          y: rawOffsetY
        });
        rafId = null;
      });
    }
  };
};

export const createMouseUpHandler = (
  isDragging: boolean,
  setIsDragging: (dragging: boolean) => void
) => (e: React.MouseEvent) => {
  if (isDragging) {
    e.preventDefault();
    setIsDragging(false);
  }
};

export const createMouseLeaveHandler = (
  isDragging: boolean,
  setIsDragging: (dragging: boolean) => void
) => (e: React.MouseEvent) => {
  // Only stop dragging if leaving the container entirely
  if (isDragging && !e.currentTarget.contains(e.relatedTarget as Node)) {
    setIsDragging(false);
  }
};

// Touch event utilities
export const createTouchStartHandler = (
  setIsDragging: (dragging: boolean) => void,
  setDragStart: (start: { x: number; y: number }) => void,
  dragOffset: { x: number; y: number },
  zoomLevel: number = 1
) => (e: React.TouchEvent) => {
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ 
      x: touch.clientX - dragOffset.x, 
      y: touch.clientY - dragOffset.y 
    });
  }
};

export const createTouchMoveHandler = (
  isDragging: boolean,
  setDragOffset: (offset: { x: number; y: number }) => void,
  dragStart: { x: number; y: number },
  zoomLevel: number = 1
) => {
  let rafId: number | null = null;
  
  return (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      
      const touch = e.touches[0];
      
      // Cancel any pending animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      
      // Use requestAnimationFrame for smooth updates
      rafId = requestAnimationFrame(() => {
        setDragOffset({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y
        });
        rafId = null;
      });
    }
  };
};

export const createTouchEndHandler = (
  setIsDragging: (dragging: boolean) => void
) => () => {
  setIsDragging(false);
};

