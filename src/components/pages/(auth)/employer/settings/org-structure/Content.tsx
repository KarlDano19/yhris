'use client';

import React, { useState, useRef } from 'react';

import Link from 'next/link';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import SettingsOrgChart from './components/SettingsOrgChart';
import useGetOrgStructureSettings from './hooks/useGetOrgStructureSettings';

const Content = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const chartRef = useRef<any>(null);
  
  // Get org structure data to determine if we should show View/Edit button
  const { data: orgStructureData, isLoading, error, refetch } = useGetOrgStructureSettings();
  
  // Check if there's any org structure data
  const hasOrgData = orgStructureData && Array.isArray(orgStructureData) && orgStructureData.length > 0;

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
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col h-[calc(100vh-64px)]'>
      {/* Header */}
      <div className='flex justify-between items-center p-4 border-b-2 flex-shrink-0'>
        <div className='flex items-center gap-4'>
          <Link href='/settings' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Settings | Org Structure Settings</h4>
          </Link>
        </div>
        {/* Only show View/Edit button when there's org structure data */}
        {hasOrgData && !isLoading && (
          !isEditMode ? (
            <button
              onClick={handleEditMode}
              className="px-6 py-2 rounded-lg flex items-center gap-2 transition-colors bg-blue-600 hover:bg-blue-700 text-white"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="px-6 py-2 rounded-lg flex items-center gap-2 transition-colors bg-green-600 hover:bg-green-700 text-white"
            >
              View
            </button>
          )
        )}
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        <div className='bg-white shadow-sm flex-1 flex flex-col'>     
          {/* Organizational Chart */}
          <SettingsOrgChart 
            ref={chartRef}
            isEditMode={isEditMode}
            orgStructureData={orgStructureData}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            onEditMode={handleEditMode}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default Content;
