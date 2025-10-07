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
) => (e: React.MouseEvent) => {
  if (isDragging) {
    e.preventDefault();
    // Calculate raw offset first, then apply zoom
    const rawOffsetX = e.clientX - dragStart.x;
    const rawOffsetY = e.clientY - dragStart.y;
    
    setDragOffset({
      x: rawOffsetX,
      y: rawOffsetY
    });
  }
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
) => (e: React.TouchEvent) => {
  if (isDragging && e.touches.length === 1) {
    const touch = e.touches[0];
    setDragOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  }
};

export const createTouchEndHandler = (
  setIsDragging: (dragging: boolean) => void
) => () => {
  setIsDragging(false);
};

// Mouse wheel zoom handler
export const createWheelHandler = (
  setZoomLevel: (fn: (prev: number) => number) => void,
  calculateZoomIn: (currentZoom: number) => number,
  calculateZoomOut: (currentZoom: number) => number
) => (e: React.WheelEvent) => {
  const target = e.target as HTMLElement;
  
  // Don't zoom if we're inside specific interactive elements
  if (target.closest('[role="dialog"]') || 
      target.closest('.modal') || 
      target.closest('[data-headlessui-state]') ||
      target.closest('.ql-editor') ||
      target.closest('.ql-toolbar') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('select') ||
      target.closest('[data-radix-popper-content-wrapper]')) {
    return; // Let the modal handle the scroll
  }
  
  e.preventDefault();
  
  // Zoom in on wheel up, zoom out on wheel down
  if (e.deltaY < 0) {
    // Wheel up - zoom in
    setZoomLevel(prev => calculateZoomIn(prev));
  } else {
    // Wheel down - zoom out
    setZoomLevel(prev => calculateZoomOut(prev));
  }
};
