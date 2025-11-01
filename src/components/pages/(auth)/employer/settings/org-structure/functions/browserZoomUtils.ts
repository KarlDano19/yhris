// Browser zoom integration utilities

// Keyboard zoom handler (Ctrl/Cmd + Plus/Minus/0)
export const createKeyboardZoomHandler = (
  zoomLevel: number,
  setZoomLevel: (level: number) => void,
  onZoomIn: () => void,
  onZoomOut: () => void
) => (e: KeyboardEvent) => {
  // Check if Ctrl (Windows/Linux) or Cmd (Mac) is pressed
  const isCtrlOrCmd = e.ctrlKey || e.metaKey;
  
  if (!isCtrlOrCmd) return;
  
  // Prevent default browser zoom
  if (e.key === '+' || e.key === '=' || e.key === '-' || e.key === '0') {
    e.preventDefault();
  }
  
  // Handle zoom in (Ctrl/Cmd + Plus or Equals)
  if (e.key === '+' || e.key === '=') {
    onZoomIn();
  }
  // Handle zoom out (Ctrl/Cmd + Minus)
  else if (e.key === '-') {
    onZoomOut();
  }
  // Handle reset zoom (Ctrl/Cmd + 0)
  else if (e.key === '0') {
    setZoomLevel(1);
  }
};

// Wheel/pinch zoom handler (trackpad pinch, Ctrl + scroll)
export const createWheelZoomHandler = (
  zoomLevel: number,
  setZoomLevel: (level: number) => void
) => (e: WheelEvent) => {
  // Check if Ctrl (Windows/Linux) or Cmd (Mac) is pressed, or if it's a pinch gesture
  const isCtrlOrCmd = e.ctrlKey || e.metaKey;
  
  // Detect pinch gesture (deltaY with ctrlKey is typical for trackpad pinch)
  if (isCtrlOrCmd) {
    e.preventDefault();
    
    // Determine zoom direction based on wheel delta
    // Positive deltaY = zoom out, Negative deltaY = zoom in
    const delta = -Math.sign(e.deltaY);
    const zoomChange = delta * 0.05; // Smaller increments for smoother zooming
    
    // Calculate new zoom level
    const newZoom = Math.min(Math.max(zoomLevel + zoomChange, 0.2), 2);
    setZoomLevel(newZoom);
  }
};

// Touch pinch zoom handler for mobile devices
export const createPinchZoomHandler = (
  zoomLevel: number,
  setZoomLevel: (level: number) => void,
  initialDistance: React.MutableRefObject<number | null>
) => {
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      // Calculate initial distance between two fingers
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      initialDistance.current = distance;
    }
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && initialDistance.current) {
      e.preventDefault();
      
      // Calculate current distance between two fingers
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // Calculate scale factor based on distance change
      const scale = distance / initialDistance.current;
      const newZoom = Math.min(Math.max(zoomLevel * scale, 0.2), 2);
      
      setZoomLevel(newZoom);
      initialDistance.current = distance;
    }
  };
  
  const handleTouchEnd = () => {
    initialDistance.current = null;
  };
  
  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};

