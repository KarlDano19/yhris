import React from 'react';

import { Tree } from 'react-organizational-chart';
import { Tooltip } from 'react-tooltip';

import ZoomControls from './ZoomControls';
import ManageOrgNode from './ManageOrgNode';

import { OrgStructure } from '../types';

interface ManageFullscreenChartProps {
  isDragging: boolean;
  zoomLevel: number;
  dragOffset: { x: number; y: number };
  orgData: OrgStructure;
  profileData: any;
  clickedNodeId: number | string | null;
  isFullscreen: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullscreenToggle: () => void;
  onWheel: (e: React.WheelEvent) => void;
  setClickedNodeId: (id: number | string | null) => void;
  renderTree: (node: OrgStructure) => React.ReactNode;
}

const ManageFullscreenChart: React.FC<ManageFullscreenChartProps> = ({
  isDragging,
  zoomLevel,
  dragOffset,
  orgData,
  profileData,
  clickedNodeId,
  isFullscreen,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onZoomIn,
  onZoomOut,
  onFullscreenToggle,
  onWheel,
  setClickedNodeId,
  renderTree
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
      data-tooltip-id="chart-area-tooltip"
      data-tooltip-content="Click and drag to move the chart around"
      data-tooltip-place="top"
    >
      <div 
        className="min-w-max flex justify-center items-center transition-transform duration-300 ease-in-out"
        style={{ 
          transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          transformOrigin: 'center center',
          minHeight: '100%'
        }}
      >
        <div className="org-tree-container">
          <Tree
            lineWidth="2px"
            lineColor="#3b82f6"
            lineBorderRadius="10px"
            label={
              <div className="flex justify-center w-full">
                <ManageOrgNode 
                  data={orgData} 
                  clickedNodeId={clickedNodeId}
                  setClickedNodeId={setClickedNodeId}
                />
              </div>
            }
          >
            {orgData.children && orgData.children.map(renderTree)}
          </Tree>
        </div>
      </div>

      {/* Floating Title */}
      <div className="absolute top-4 left-4 z-10 bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3 pointer-events-none">
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800 leading-tight">
            {profileData?.name || 'Company'}'s
          </h2>
          <h3 className="text-lg font-bold text-gray-800 leading-tight">
            Organizational Structure
          </h3>
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

      {/* Tooltips for chart area */}
      <Tooltip id="chart-area-tooltip" style={{ zIndex: 9999 }} />
    </div>
  );
};

export default ManageFullscreenChart;

