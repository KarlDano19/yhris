'use client';

import React, { useState, useRef } from 'react';

import BackButton from '@/components/BackButton';
import SettingsOrgChart from './components/SettingsOrgChart';
import ZoomControls from './components/ZoomControls';
import useGetOrgStructureSettings from './hooks/useGetOrgStructureSettings';

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
        <BackButton label='Settings' />
      </div>

      <div className='px-2 md:px-8 lg:px-4 pb-4 border-b-2 flex-shrink-0'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
          <h2 className='text-xl font-bold text-indigo-dye'>Organizational Structure</h2>

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
