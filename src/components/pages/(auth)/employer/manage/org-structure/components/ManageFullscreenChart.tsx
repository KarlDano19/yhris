import React, { Fragment, useState, useMemo } from 'react';

import { Tree } from 'react-organizational-chart';
import { Tooltip } from 'react-tooltip';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

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
  onShowAllEmployees: () => void;
  setClickedNodeId: (id: number | string | null) => void;
  expandedPositions: Set<number | string>;
  setExpandedPositions: (positions: Set<number | string>) => void;
  onSetPrimaryEmployee: (orgStructureId: number | string, employeeId: number) => void;
  isSettingPrimary: boolean;
  hasEmployees: boolean;
  renderTree: (node: OrgStructure) => React.ReactNode;
  setDragOffset: (offset: { x: number; y: number }) => void;
  onExport?: (format: 'pdf' | 'png') => void;
  isSelectionMode?: boolean;
  selectedPositions?: Set<number | string>;
  setSelectedPositions?: (positions: Set<number | string>) => void;
  usePlaceholderAvatars?: boolean;
  excludeAvatars?: boolean;
  departmentFilter?: string;
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
  onShowAllEmployees,
  setClickedNodeId,
  expandedPositions,
  setExpandedPositions,
  onSetPrimaryEmployee,
  isSettingPrimary,
  hasEmployees,
  renderTree,
  setDragOffset,
  onExport,
  isSelectionMode = false,
  selectedPositions = new Set(),
  setSelectedPositions,
  usePlaceholderAvatars = false,
  excludeAvatars = false,
  departmentFilter
}) => {
  const [isExporting, setIsExporting] = useState(false);

  // Calculate dynamic dimensions for floating title based on text length
  const floatingTitleDimensions = useMemo(() => {
    const companyName = profileData?.name || 'Company';
    const charWidth = 10; // Approximate character width for 18px bold font
    const padding = 32; // 16px on each side
    const maxCharsPerLine = 30; // Maximum characters per line before wrapping
    const lineHeight = 24; // Height for each line of text
    const topPadding = 12; // Top padding
    const bottomPadding = 12; // Bottom padding
    
    // Split company name into multiple lines if too long
    const companyNameLines: string[] = [];
    if (companyName.length > maxCharsPerLine) {
      const words = companyName.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length <= maxCharsPerLine) {
          currentLine = testLine;
        } else {
          if (currentLine) companyNameLines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) companyNameLines.push(currentLine);
    } else {
      companyNameLines.push(companyName);
    }
    
    // Add "'s" to the last line of company name
    if (companyNameLines.length > 0) {
      companyNameLines[companyNameLines.length - 1] += "'s";
    }
    
    // Add "Organizational Structure" line
    const allLines = [...companyNameLines, 'Organizational Structure'];
    
    // Calculate width based on longest line
    const maxLineLength = Math.max(...allLines.map(line => line.length));
    const calculatedWidth = maxLineLength * charWidth + padding;
    const width = Math.min(Math.max(calculatedWidth, 200), 400);
    
    // Calculate height based on number of lines
    const height = topPadding + (allLines.length * lineHeight) + bottomPadding;
    
    // Calculate dynamic top position - more negative for taller boxes
    // Base: 16px (top-4), then subtract extra height beyond baseline (2 lines = 70px)
    const baseHeight = 70;
    const extraHeight = height - baseHeight;
    const topPosition = 16 - (extraHeight > 0 ? extraHeight * 0.5 : 0); // Move up by half the extra height
    
    return { width, height, lines: allLines, topPosition };
  }, [profileData?.name]);

  // Export menu options
  const exportOptions = [
    {
      name: 'as PDF',
      action: () => handleExport('pdf'),
      disabled: false
    },
    {
      name: 'as PNG',
      action: () => handleExport('png'),
      disabled: false
    }
  ];

  const handleExport = async (format: 'pdf' | 'png') => {
    if (!onExport) return;
    
    setIsExporting(true);
    try {
      await onExport(format);
    } finally {
      setIsExporting(false);
    }
  };
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
        <div className="org-tree-container relative">
          {/* Floating Title - Included in exports */}
          <div 
            className="absolute left-4 z-10 pointer-events-none"
            style={{ top: `${floatingTitleDimensions.topPosition}px` }}
          >
            <svg
              width={floatingTitleDimensions.width}
              height={floatingTitleDimensions.height}
              viewBox={`0 0 ${floatingTitleDimensions.width} ${floatingTitleDimensions.height}`}
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' }}
            >
              {/* Background with border */}
              <rect
                width={floatingTitleDimensions.width}
                height={floatingTitleDimensions.height}
                rx="8"
                fill="white"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              
              {/* Dynamic text lines */}
              {floatingTitleDimensions.lines.map((line, index) => (
                <text
                  key={index}
                  x="16"
                  y={24 + (index * 24)}
                  fill="#1f2937"
                  fontSize="18"
                  fontWeight="700"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  dominantBaseline="middle"
                >
                  {line}
                </text>
              ))}
            </svg>
          </div>
          
          {excludeAvatars ? (
            <div className="pt-20">
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
                      onSetPrimaryEmployee={onSetPrimaryEmployee}
                      usePlaceholderAvatars={usePlaceholderAvatars}
                      excludeAvatars={excludeAvatars}
                      departmentFilter={departmentFilter}
                    />
                  </div>
                }
              >
                {orgData.children && orgData.children.map(renderTree)}
              </Tree>
            </div>
          ) : (
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
                    onSetPrimaryEmployee={onSetPrimaryEmployee}
                    usePlaceholderAvatars={usePlaceholderAvatars}
                    excludeAvatars={excludeAvatars}
                  />
                </div>
              }
            >
              {orgData.children && orgData.children.map(renderTree)}
            </Tree>
          )}
        </div>
      </div>

      {/* Export Button - Top Right - Mobile Responsive */}
      {onExport && (
        <div className="absolute top-2 sm:top-8 right-2 sm:right-10 z-10">
          <Menu as='div' className='relative'>
            <Menu.Button className='bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-6 py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors disabled:opacity-50 shadow-lg text-sm sm:text-base' disabled={isExporting}>
              <span className='hidden sm:inline'>{isExporting ? 'Exporting...' : 'Export'}</span>
              <span className='sm:hidden'>{isExporting ? '...' : 'Export'}</span>
              <ChevronDownIcon className='h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0' />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='absolute right-0 z-10 mt-2 w-28 sm:w-full min-w-[120px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div className='py-1'>
                  {exportOptions.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <span
                          className={`block px-3 sm:px-4 py-2 text-xs sm:text-sm cursor-pointer text-left ${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } ${item.disabled ? 'bg-gray-200 cursor-not-allowed opacity-50' : ''}`}
                          onClick={() => {
                            if (!item.disabled) {
                              item.action();
                            }
                          }}
                        >
                          {item.name}
                        </span>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      )}

      {/* Zoom Controls */}
      <ZoomControls 
        onZoomIn={onZoomIn} 
        onZoomOut={onZoomOut} 
        onFullscreenToggle={onFullscreenToggle}
        onShowAllEmployees={onShowAllEmployees}
        isFullscreen={isFullscreen}
        zoomLevel={zoomLevel}
        hasEmployees={hasEmployees}
      />

      {/* Tooltips for chart area */}
      <Tooltip id="chart-area-tooltip" style={{ zIndex: 9999 }} />
    </div>
  );
};

export default ManageFullscreenChart;

