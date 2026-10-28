'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';

import BackButton from '@/components/BackButton';
const SettingsOrgChart = dynamic(() => import('./components/SettingsOrgChart'), { ssr: false });
import ZoomControls from './components/ZoomControls';
import useGetOrgStructureSettings from './hooks/useGetOrgStructureSettings';

// Versioned so the guide hint can be re-triggered later if its content changes significantly.
const GUIDE_SEEN_KEY = 'org-structure-settings-guide-seen-v1';

const Content = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const chartRef = useRef<any>(null);
  
  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Drag state for centering
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Get org structure data to determine if we should show View/Edit button
  const { data: orgStructureData, isLoading, error, refetch } = useGetOrgStructureSettings();
  
  // Check if there's any org structure data
  const hasOrgData = orgStructureData && Array.isArray(orgStructureData) && orgStructureData.length > 0;

  // Auto-show the guide tooltip briefly on a user's first visit to this page,
  // then close it for good (regardless of cursor position) - after that it's
  // only shown via a genuine hover. Kept fully controlled (never `undefined`)
  // because react-tooltip doesn't reliably re-derive hover state once a
  // controlled `isOpen` prop reverts to uncontrolled - it can get stuck open.
  const [autoShowGuide, setAutoShowGuide] = useState(false);
  const [isHoveringGuide, setIsHoveringGuide] = useState(false);
  useEffect(() => {
    const alreadySeen = localStorage.getItem(GUIDE_SEEN_KEY) === 'true';
    if (alreadySeen) return;

    setAutoShowGuide(true);
    const timer = setTimeout(() => {
      setAutoShowGuide(false);
      localStorage.setItem(GUIDE_SEEN_KEY, 'true');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.2));
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(prev => !prev);
    // If entering fullscreen, exit edit mode to ensure view-only
    if (!isFullscreen) {
      setIsEditMode(false);
    }
  };

  const handleEditMode = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // Clear local changes in the chart component
    if (chartRef.current) {
      chartRef.current.clearLocalChanges();
      // Also force a refresh
      setTimeout(() => {
        if (chartRef.current) {
          chartRef.current.forceRefresh();
        }
      }, 100);
    }
  };

  return (
    <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 flex flex-col h-[calc(100vh-64px)]'>
      {/* Header */}
      <div className='flex p-4 flex-shrink-0'>
        <BackButton label='Settings' href='/settings' />
      </div>

      <div className='px-2 md:px-8 lg:px-4 pb-4 border-b-2 flex-shrink-0'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
          <div className='flex items-center gap-1.5'>
            <h2 className='text-xl font-bold text-indigo-dye'>Organizational Structure</h2>
            <InformationCircleIcon
              className='h-5 w-5 text-gray-400 cursor-help'
              data-tooltip-id='org-structure-settings-guide-tooltip'
              data-tooltip-content='Positions can now be grouped under a Department node (shown as a dashed box) to organize the chart - add one via Edit mode alongside regular positions.'
              data-tooltip-place='bottom'
              onMouseEnter={() => setIsHoveringGuide(true)}
              onMouseLeave={() => setIsHoveringGuide(false)}
            />
            <Tooltip
              id='org-structure-settings-guide-tooltip'
              className='max-w-xs z-50'
              isOpen={autoShowGuide || isHoveringGuide}
            />
          </div>

          {/* Only show View/Edit button when there's org structure data and not in fullscreen */}
          {hasOrgData && !isLoading && !isFullscreen && (
            <div className='self-end sm:self-auto'>
              {!isEditMode ? (
                <button
                  onClick={handleEditMode}
                  className="px-4 sm:px-6 py-2 rounded-lg flex items-center gap-2 transition-colors bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleCancel}
                  className="px-4 sm:px-6 py-2 rounded-lg flex items-center gap-2 transition-colors bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
                >
                  View
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col relative'>
        <div className='bg-white shadow-sm flex-1 flex flex-col'>     
          {/* Organizational Chart */}
          <SettingsOrgChart 
            ref={chartRef}
            isEditMode={isFullscreen ? false : isEditMode}
            orgStructureData={orgStructureData}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEditMode={handleEditMode}
            onCancel={handleCancel}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
            dragOffset={dragOffset}
            setDragOffset={setDragOffset}
          />
        </div>

        {/* Zoom Controls - Positioned within the max-width container */}
        {hasOrgData && (
          <ZoomControls 
            onZoomIn={handleZoomIn} 
            onZoomOut={handleZoomOut} 
            onFullscreenToggle={handleFullscreenToggle}
            isFullscreen={isFullscreen}
            zoomLevel={zoomLevel}
          />
        )}
      </div>
    </div>
  );
};

export default Content;
