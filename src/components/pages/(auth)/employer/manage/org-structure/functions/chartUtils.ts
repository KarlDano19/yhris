// Chart positioning utilities
export const calculateCenterOffset = (): number => {
  // For manage page, we always want perfect center
  return 0;
};

// Zoom utilities
export const calculateZoomIn = (currentZoom: number): number => {
  return Math.min(currentZoom + 0.25, 2); // Max zoom 2x
};

export const calculateZoomOut = (currentZoom: number): number => {
  return Math.max(currentZoom - 0.25, 0.5); // Min zoom 0.5x
};

// Chart refresh utilities
export const createRefreshChart = (
  refetch?: () => void
) => () => {
  refetch?.();
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

