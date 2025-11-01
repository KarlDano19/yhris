'use client';

import React, { useEffect, useRef } from 'react';

import { Tree } from 'react-organizational-chart';

import ZoomControls from './ZoomControls';
import OrgNode from './OrgNode';
import {
  createKeyboardZoomHandler,
  createWheelZoomHandler,
  createPinchZoomHandler
} from '../functions/browserZoomUtils';

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
  setZoomLevel: (level: number) => void;
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
  chartContainerRef,
  setZoomLevel
}) => {
  // Ref for pinch zoom distance
  const pinchDistanceRef = useRef<number | null>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);

  // Browser zoom integration - keyboard shortcuts (Ctrl/Cmd + Plus/Minus/0)
  useEffect(() => {
    const handleKeyboardZoom = createKeyboardZoomHandler(
      zoomLevel,
      setZoomLevel,
      onZoomIn,
      onZoomOut
    );

    document.addEventListener('keydown', handleKeyboardZoom);
    return () => document.removeEventListener('keydown', handleKeyboardZoom);
  }, [zoomLevel, onZoomIn, onZoomOut, setZoomLevel]);

  // Browser zoom integration - wheel/pinch zoom (Ctrl + scroll, trackpad pinch)
  useEffect(() => {
    const handleWheelZoom = createWheelZoomHandler(zoomLevel, setZoomLevel);
    
    const chartElement = fullscreenContainerRef.current;
    if (chartElement) {
      chartElement.addEventListener('wheel', handleWheelZoom, { passive: false });
      return () => chartElement.removeEventListener('wheel', handleWheelZoom);
    }
  }, [zoomLevel, setZoomLevel]);

  // Browser zoom integration - touch pinch zoom for mobile
  useEffect(() => {
    const { handleTouchStart, handleTouchMove, handleTouchEnd } = createPinchZoomHandler(
      zoomLevel,
      setZoomLevel,
      pinchDistanceRef
    );

    const chartElement = fullscreenContainerRef.current;
    if (chartElement) {
      chartElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      chartElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      chartElement.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        chartElement.removeEventListener('touchstart', handleTouchStart);
        chartElement.removeEventListener('touchmove', handleTouchMove);
        chartElement.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [zoomLevel, setZoomLevel]);

  return (
    <div 
      ref={fullscreenContainerRef}
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
