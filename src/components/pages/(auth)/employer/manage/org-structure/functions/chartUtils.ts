// Zoom utilities
export const calculateZoomIn = (currentZoom: number): number => {
  return Math.min(currentZoom + 0.1, 2); // Max zoom 2x, smaller increments
};

export const calculateZoomOut = (currentZoom: number): number => {
  return Math.max(currentZoom - 0.1, 0.2); // Min zoom 0.2x, smaller increments
};

// Chart refresh utilities
export const createRefreshChart = (
  refetch?: () => void
) => () => {
  refetch?.();
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

