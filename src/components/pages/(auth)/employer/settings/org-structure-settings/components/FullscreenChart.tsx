'use client';

import React from 'react';
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
  onWheel: (e: React.WheelEvent) => void;
  renderTree: (node: any) => React.ReactNode;
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
  onWheel,
  renderTree,
  chartContainerRef
}) => {
  return (
    <div 
      className={`fixed inset-0 z-50 bg-white ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
    >
      <div 
        ref={chartContainerRef}
        className={`min-w-max flex justify-center items-center transition-transform duration-300 ease-in-out ${
          isModeChanging ? 'pointer-events-none opacity-90' : ''
        }`}
        style={{ 
          transform: `scale(${zoomLevel}) translate(${dragOffset.x / zoomLevel}px, ${dragOffset.y / zoomLevel}px)`,
          transformOrigin: 'center center',
          minHeight: '100%'
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
