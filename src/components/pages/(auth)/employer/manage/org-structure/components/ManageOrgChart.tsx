import React, { useState, useEffect } from 'react';

import { createPortal } from 'react-dom';
import { Tree, TreeNode } from 'react-organizational-chart';
import { Tooltip } from 'react-tooltip';

import LoadingSpinner from '@/components/LoadingSpinner';
import ManageOrgNode from './ManageOrgNode';
import ManageFullscreenChart from './ManageFullscreenChart';
import { OrgStructure } from '../types';
import useSetPrimaryEmployee from '../hooks/useSetPrimaryEmployee';
import { 
  calculateZoomIn, 
  calculateZoomOut, 
  createRefreshChart, 
  createEscapeKeyHandler 
} from '../functions/chartUtils';
import { 
  createMouseDownHandler, 
  createMouseMoveHandler, 
  createMouseUpHandler, 
  createMouseLeaveHandler, 
  createTouchStartHandler, 
  createTouchMoveHandler, 
  createTouchEndHandler
} from '../functions/eventUtils';

// Props interface for ManageOrgChart
interface ManageOrgChartProps {
  orgData: OrgStructure | null;
  profileData: any;
  isLoading: boolean;
  error: any;
  refetch: () => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  onShowAllEmployees: () => void;
  hasEmployees: boolean;
  expandedPositions: Set<number | string>;
  setExpandedPositions: (positions: Set<number | string>) => void;
  dragOffset: { x: number; y: number };
  setDragOffset: (offset: { x: number; y: number }) => void;
  onExport?: (format: 'pdf' | 'png') => void;
}

// Main Manage Org Chart Component
const ManageOrgChart: React.FC<ManageOrgChartProps> = ({ 
  orgData, 
  profileData, 
  isLoading, 
  error, 
  refetch,
  zoomLevel,
  setZoomLevel,
  isFullscreen,
  setIsFullscreen,
  onShowAllEmployees,
  hasEmployees,
  expandedPositions,
  setExpandedPositions,
  dragOffset,
  setDragOffset,
  onExport
}) => {
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Track which node is currently clicked
  const [clickedNodeId, setClickedNodeId] = useState<number | string | null>(null);
  
  // Primary employee mutation
  const setPrimaryEmployeeMutation = useSetPrimaryEmployee();

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscapeKey = createEscapeKeyHandler(isFullscreen, setIsFullscreen);

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isFullscreen]);

  // Function to refresh the chart
  const refreshChart = createRefreshChart(refetch);

  // Drag functions
  const handleMouseDown = createMouseDownHandler(setIsDragging, setDragStart, dragOffset);
  const handleMouseMove = createMouseMoveHandler(isDragging, setDragOffset, dragStart);
  const handleMouseUp = createMouseUpHandler(isDragging, setIsDragging);
  const handleMouseLeave = createMouseLeaveHandler(isDragging, setIsDragging);

  // Handle touch events for mobile
  const handleTouchStart = createTouchStartHandler(setIsDragging, setDragStart, dragOffset);
  const handleTouchMove = createTouchMoveHandler(isDragging, setDragOffset, dragStart);
  const handleTouchEnd = createTouchEndHandler(setIsDragging);


  // Handle set primary employee
  const handleSetPrimaryEmployee = async (orgStructureId: number | string, employeeId: number) => {
    try {
      const id = typeof orgStructureId === 'string' ? parseInt(orgStructureId, 10) : orgStructureId;
      await setPrimaryEmployeeMutation.mutateAsync({
        orgStructureId: id,
        employeeId: employeeId
      });
      
      // Refresh the chart to show updated data
      refetch();
    } catch (error) {
      console.error('Error setting primary employee:', error);
    }
  };


  // Render tree recursively
  const renderTree = (node: OrgStructure): React.ReactNode => {
    return (
      <TreeNode
        label={
          <div className="flex justify-center w-full">
            <ManageOrgNode 
              data={node} 
              clickedNodeId={clickedNodeId}
              setClickedNodeId={setClickedNodeId}
              expandedPositions={expandedPositions}
              setExpandedPositions={setExpandedPositions}
              onSetPrimaryEmployee={handleSetPrimaryEmployee}
              isSettingPrimary={setPrimaryEmployeeMutation.isLoading}
            />
          </div>
        }
        key={node.id}
      >
        {node.children && node.children.map(renderTree)}
      </TreeNode>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full bg-gray-50 overflow-auto flex-1 h-full">
        <LoadingSpinner 
          size="lg" 
          color="yellow" 
          text="Loading organizational structure..." 
          showText={true}
          className="h-full"
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full bg-gray-50 overflow-auto flex-1 h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-600 text-center">Error loading organizational structure</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Initial empty state
  if (!orgData) {
    return (
      <div className="w-full bg-gray-50 overflow-auto flex-1 h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Organizational Structure Found
            </h3>
            <p className="text-gray-600 text-center text-sm max-w-md mb-6">
              Set up your organizational structure to visualize your company hierarchy and manage employee positions.
            </p>
            <a
              href="/settings/org-structure-settings"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Set Up Organizational Structure
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Render fullscreen chart in portal if in fullscreen mode
  if (isFullscreen) {
    return createPortal(
      <ManageFullscreenChart
        isDragging={isDragging}
        zoomLevel={zoomLevel}
        dragOffset={dragOffset}
        orgData={orgData}
        profileData={profileData}
        clickedNodeId={clickedNodeId}
        isFullscreen={isFullscreen}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onZoomIn={() => setZoomLevel(calculateZoomIn(zoomLevel))}
        onZoomOut={() => setZoomLevel(calculateZoomOut(zoomLevel))}
        onFullscreenToggle={() => setIsFullscreen(!isFullscreen)}
        onShowAllEmployees={onShowAllEmployees}
        setClickedNodeId={setClickedNodeId}
        expandedPositions={expandedPositions}
        setExpandedPositions={setExpandedPositions}
        onSetPrimaryEmployee={handleSetPrimaryEmployee}
        isSettingPrimary={setPrimaryEmployeeMutation.isLoading}
        hasEmployees={hasEmployees}
        renderTree={renderTree}
        setDragOffset={setDragOffset}
        onExport={onExport}
      />, 
      document.body
    );
  }

  return (
    <div 
      className={`w-full bg-gray-50 overflow-hidden relative flex-1 h-full ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-tooltip-id="chart-area-tooltip"
      data-tooltip-content="Click and drag to move the chart around"
      data-tooltip-place="top"
      style={{ touchAction: 'none' }}
    >
      <div 
        className="min-w-max flex justify-center items-center"
        style={{ 
          transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          transformOrigin: 'center center',
          minHeight: '100%',
          willChange: isDragging ? 'transform' : 'auto',
          transition: isDragging ? 'none' : 'transform 0.3s ease-in-out'
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
                  expandedPositions={expandedPositions}
                  setExpandedPositions={setExpandedPositions}
                  onSetPrimaryEmployee={handleSetPrimaryEmployee}
                  isSettingPrimary={setPrimaryEmployeeMutation.isLoading}
                />
              </div>
            }
          >
            {orgData.children && orgData.children.map(renderTree)}
          </Tree>
        </div>
      </div>


      {/* Tooltips for chart area */}
      <Tooltip id="chart-area-tooltip" style={{ zIndex: 9999 }} />

    </div>
  );
};

export default ManageOrgChart;

