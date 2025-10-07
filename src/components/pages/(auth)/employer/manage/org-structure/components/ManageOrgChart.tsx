import React, { useState, useEffect } from 'react';

import { createPortal } from 'react-dom';
import { Tree, TreeNode } from 'react-organizational-chart';
import { Tooltip } from 'react-tooltip';

import LoadingSpinner from '@/components/LoadingSpinner';
import ZoomControls from './ZoomControls';
import PositionDetailsModal from '../modals/PositionDetailsModal';
import useGetEmployerProfile from '@/components/hooks/useGetEmployerProfile';
import useGetOrgStructureManage from '../hooks/useGetOrgStructureManage';

import PlaceholderPicture from '@/svg/PlaceholderPicture';

// Types for our organizational data with employee information
interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  photo?: string;
  gender?: string;
}

interface OrgStructure {
  id: number | string;
  description: string;
  position_name: string;
  position: number;
  parent?: number | null;
  parent_position_name?: string;
  order: number;
  is_active: boolean;
  children?: OrgStructure[];
  employees?: Employee[];
  primary_employee?: Employee;
}

interface OrgNodeProps {
  data: OrgStructure;
  clickedNodeId: number | string | null;
  setClickedNodeId: (id: number | string | null) => void;
}

// Custom Node Component for Manage Page
const ManageOrgNode: React.FC<OrgNodeProps> = ({ data, clickedNodeId, setClickedNodeId }) => {
  const isClicked = clickedNodeId === data.id;
  
  // Get the primary employee or first employee
  const primaryEmployee = data.primary_employee || (data.employees && data.employees[0]);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isClicked) {
        setClickedNodeId(null);
      }
    };

    if (isClicked) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isClicked, setClickedNodeId]);
  
  // Determine avatar type (male/female) - use gender field if available
  const getAvatarType = (employee: Employee | undefined) => {
    if (!employee) return 'male'; // Default
    // Use gender field if available, otherwise fallback to name-based logic
    if (employee.gender) {
      return employee.gender.toLowerCase() === 'female' ? 'female' : 'male';
    }
    // Simple logic based on name as fallback
    return employee.firstname.toLowerCase().includes('a') ? 'female' : 'male';
  };

  const avatarType = getAvatarType(primaryEmployee);

  return (
    <div 
      className="relative pointer-events-auto"
      onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking on node
    >
      {/* Main Position Node with Employee Info */}
      <div 
        className="text-center cursor-pointer px-10 mb-2 flex flex-col items-center justify-center"
        onClick={(e) => {
          e.stopPropagation(); // Prevent event bubbling
          setClickedNodeId(isClicked ? null : data.id); // Toggle tooltip on click
        }}
        data-tooltip-id={!clickedNodeId ? `org-node-tooltip-${data.id}` : undefined}
        data-tooltip-content={!clickedNodeId ? 'Click to view details' : undefined}
        data-tooltip-place={!clickedNodeId ? 'bottom' : undefined}
      >
        {/* Avatar */}
        <div className="flex justify-center mb-2">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center border-2 border-savoy-blue overflow-hidden">
            {primaryEmployee?.photo ? (
              <img
                src={primaryEmployee.photo}
                alt={`${primaryEmployee.firstname} ${primaryEmployee.lastname}`}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const placeholder = target.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'block';
                }}
              />
            ) : null}
            <div 
              className={`w-full h-full flex items-center justify-center ${primaryEmployee?.photo ? 'hidden' : 'block'}`}
            >
              <PlaceholderPicture 
                gender={avatarType} 
                fillColor="#3B82F6" 
                width={32} 
                height={32}
                style={{ opacity: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Employee Name */}
        {primaryEmployee && (
          <h3 className="font-bold text-sm text-gray-800 mb-1">
            {primaryEmployee.firstname} {primaryEmployee.lastname}
          </h3>
        )}

        {/* Position Title */}
        <h4 className="font-semibold text-xs text-gray-700">
          {data.position_name}
        </h4>
      </div>

      {/* Click Tooltip */}
      <PositionDetailsModal 
        data={data}
        primaryEmployee={primaryEmployee}
        isVisible={isClicked}
      />
      
      {/* Tooltip for this node */}
      <Tooltip 
        key={`${data.id}-${clickedNodeId}`}
        id={`org-node-tooltip-${data.id}`} 
        style={{ zIndex: 9999 }} 
      />
    </div>
  );
};

// Main Manage Org Chart Component
const ManageOrgChart: React.FC = () => {
  const [orgData, setOrgData] = useState<OrgStructure | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Track which node is currently clicked
  const [clickedNodeId, setClickedNodeId] = useState<number | string | null>(null);
  
  // API hooks
  const { data: orgStructureData, isLoading, error, refetch } = useGetOrgStructureManage();
  const { data: profileData } = useGetEmployerProfile();
  
  // Load data from API
  useEffect(() => {
    if (orgStructureData && Array.isArray(orgStructureData) && orgStructureData.length > 0) {
      setOrgData(orgStructureData[0]);
    } else {
      setOrgData(null);
    }
  }, [orgStructureData]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isFullscreen]);

  // Zoom functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2)); // Max zoom 2x
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5)); // Min zoom 0.5x
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(prev => !prev);
  };

  // Drag functions
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if clicking on the background, not on nodes or buttons
    const target = e.target as HTMLElement;
    if (e.target === e.currentTarget || 
        (target.closest('.org-tree-container') && !target.closest('.pointer-events-auto'))) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setDragOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setIsDragging(false);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    // Only stop dragging if leaving the container entirely
    if (isDragging && !e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - dragOffset.x, y: touch.clientY - dragOffset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      setDragOffset({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
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
      <div className="w-full bg-gray-50 p-8 rounded-lg overflow-auto flex-1 h-full">
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
      <div className="w-full bg-gray-50 p-8 rounded-lg overflow-auto flex-1 h-full">
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
      <div className="w-full bg-gray-50 p-8 rounded-lg overflow-auto flex-1 h-full">
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

  // Fullscreen chart component
  const FullscreenChart = () => (
    <div 
      className={`fixed inset-0 z-50 bg-white ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
        onZoomIn={handleZoomIn} 
        onZoomOut={handleZoomOut} 
        onFullscreenToggle={handleFullscreenToggle}
        isFullscreen={isFullscreen}
      />

      {/* Tooltips for chart area */}
      <Tooltip id="chart-area-tooltip" style={{ zIndex: 9999 }} />
    </div>
  );

  // Render fullscreen chart in portal if in fullscreen mode
  if (isFullscreen) {
    return createPortal(<FullscreenChart />, document.body);
  }

  return (
    <div 
      className={`w-full bg-gray-50 p-8 rounded-lg overflow-hidden relative flex-1 h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
    >
      {/* Floating Title Component */}
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

      {/* Zoom Controls */}
      <ZoomControls 
        onZoomIn={handleZoomIn} 
        onZoomOut={handleZoomOut} 
        onFullscreenToggle={handleFullscreenToggle}
        isFullscreen={isFullscreen}
      />

      {/* Tooltips for chart area */}
      <Tooltip id="chart-area-tooltip" style={{ zIndex: 9999 }} />

    </div>
  );
};

export default ManageOrgChart;

