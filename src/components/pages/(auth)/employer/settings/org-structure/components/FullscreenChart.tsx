'use client';

import React, { useEffect } from 'react';

import { Tree } from 'react-organizational-chart';

import ZoomControls from './ZoomControls';
import OrgNode from './OrgNode';

interface FullscreenChartProps {
  isDragging: boolean;
  isModeChanging: boolean;
  zoomLevel: number;
  dragOffset: { x: number; y: number };
  chartKey: number;
  orgData: any;
  isEditMode: boolean;
  draggedNodeId: number | string | null;
  dragOverNodeId: number | string | null;
  isFullscreen: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onAddChild: (parentId: number) => void;
  onEdit: (nodeId: number | string) => void;
  onDelete: (nodeId: number | string) => void;
  onDragStart: (nodeId: number | string) => void;
  onDragEnd: () => void;
  onDragOver: (nodeId: number | string) => void;
  onDragLeave: () => void;
  onDrop: (draggedNode: any, targetNode: any) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullscreenToggle: () => void;
  renderTree: (node: any) => React.ReactNode;
  setDragOffset: (offset: { x: number; y: number }) => void;
  chartContainerRef: React.RefObject<HTMLDivElement>;
}

const FullscreenChart: React.FC<FullscreenChartProps> = ({
  isDragging,
  isModeChanging,
  zoomLevel,
  dragOffset,
  chartKey,
  orgData,
  isEditMode,
  draggedNodeId,
  dragOverNodeId,
  isFullscreen,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onAddChild,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onZoomIn,
  onZoomOut,
  onFullscreenToggle,
  renderTree,
  setDragOffset,
  chartContainerRef
}) => {
  // Handle browser zoom controls (Ctrl + Mouse Wheel, Ctrl + +/-)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Check if Ctrl key is pressed (or Cmd on Mac)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        
        // Zoom in if scrolling up (deltaY negative), zoom out if scrolling down
        if (e.deltaY < 0) {
          onZoomIn();
        } else if (e.deltaY > 0) {
          onZoomOut();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Ctrl key is pressed (or Cmd on Mac)
      if (e.ctrlKey || e.metaKey) {
        // Ctrl + Plus or Ctrl + Equals (for zoom in)
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          onZoomIn();
        }
        // Ctrl + Minus (for zoom out)
        else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          onZoomOut();
        }
        // Ctrl + 0 (reset zoom to 100%)
        else if (e.key === '0') {
          e.preventDefault();
          setDragOffset({ x: 0, y: 0 });
          // Reset zoom through parent - we need to calculate it
          const currentZoom = zoomLevel;
          const targetZoom = 1;
          const diff = targetZoom - currentZoom;
          
          // Call onZoomIn or onZoomOut multiple times to reach 1
          if (diff > 0) {
            // Need to zoom in
            const steps = Math.ceil(diff / 0.1);
            for (let i = 0; i < steps; i++) {
              setTimeout(() => onZoomIn(), i * 10);
            }
          } else if (diff < 0) {
            // Need to zoom out
            const steps = Math.ceil(Math.abs(diff) / 0.1);
            for (let i = 0; i < steps; i++) {
              setTimeout(() => onZoomOut(), i * 10);
            }
          }
        }
      }
    };

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onZoomIn, onZoomOut, zoomLevel, setDragOffset]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-white ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: 'none' }}
    >
      <div 
        ref={chartContainerRef}
        className={`min-w-max flex justify-center items-center ${
          isModeChanging ? 'pointer-events-none opacity-90' : ''
        }`}
        style={{ 
          transform: `scale(${zoomLevel}) translate(${dragOffset.x / zoomLevel}px, ${dragOffset.y / zoomLevel}px)`,
          transformOrigin: 'center center',
          minHeight: '100%',
          willChange: isDragging ? 'transform' : 'auto',
          transition: isDragging ? 'none' : 'transform 0.3s ease-in-out'
        }}
      >
        <div className="org-tree-container">
          <Tree
            key={chartKey}
            lineWidth="2px"
            lineColor="#3b82f6"
            lineBorderRadius="10px"
            lineStyle="dashed"
            label={
              <div className="flex justify-center w-full">
                <OrgNode
                  data={orgData}
                  onAddChild={onAddChild}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isEditMode={isEditMode}
                  isDragging={draggedNodeId === orgData.id}
                  isDragOver={dragOverNodeId === orgData.id}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  orgData={orgData}
                  onDrop={onDrop}
                />
              </div>
            }
          >
            {orgData.children && orgData.children.map(renderTree)}
          </Tree>
        </div>
      </div>
      

      {/* Zoom Controls */}
      <ZoomControls 
        onZoomIn={onZoomIn} 
        onZoomOut={onZoomOut} 
        onFullscreenToggle={onFullscreenToggle}
        isFullscreen={isFullscreen}
        zoomLevel={zoomLevel}
      />
    </div>
  );
};

export default FullscreenChart;
