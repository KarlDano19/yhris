// Chart positioning utilities
export const calculateCenterOffset = (isEditMode: boolean): number => {
  if (isEditMode) {
    // In edit mode, we need to shift the chart to the LEFT to compensate
    // for the + buttons that extend to the right of each node
    // The buttons make the chart appear wider, so we shift left to re-center
    return -60; // Negative offset to shift left
  } else {
    // In view mode, ensure perfect center
    return 0;
  }
};

// Zoom utilities
export const calculateZoomIn = (currentZoom: number): number => {
  return Math.min(currentZoom + 0.1, 2); // Max zoom 2x, smaller increments
};

export const calculateZoomOut = (currentZoom: number): number => {
  return Math.max(currentZoom - 0.1, 0.2); // Min zoom 0.2x, smaller increments
};

// Chart refresh utilities
export const createRefreshChart = (
  refetch?: () => void,
  setChartKey?: (fn: (prev: number) => number) => void
) => () => {
  refetch?.();
  setChartKey?.(prev => prev + 1);
};

// Chart centering utilities
export const createCenterChart = (
  setIsModeChanging: (changing: boolean) => void,
  setDragOffset: (offset: { x: number; y: number }) => void,
  isEditMode: boolean
) => () => {
  setIsModeChanging(true);
  
  // Calculate offset to account for button space in edit mode
  const centerOffsetX = calculateCenterOffset(isEditMode);
  
  // Set the calculated offset
  setDragOffset({ x: centerOffsetX, y: 0 });
  
  // Add a delay to allow the DOM to update with new buttons and prevent spam clicking
  setTimeout(() => {
    setIsModeChanging(false);
  }, 500); // Increased delay to prevent spam clicking
};

// Fullscreen utilities
export const createFullscreenToggle = (
  setIsFullscreen: (fn: (prev: boolean) => boolean) => void
) => () => {
  setIsFullscreen(prev => !prev);
};

// Escape key handler for fullscreen
export const createEscapeKeyHandler = (
  isFullscreen: boolean,
  setIsFullscreen: (fullscreen: boolean) => void
) => (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isFullscreen) {
    setIsFullscreen(false);
  }
};
