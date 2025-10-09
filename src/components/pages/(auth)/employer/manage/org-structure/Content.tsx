'use client';

import React, { Fragment, useState, useEffect } from 'react';

import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';

import { ArrowLeftIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Menu, Transition } from '@headlessui/react';

import ManageOrgChart from './components/ManageOrgChart';
import ZoomControls from './components/ZoomControls';
import useGetOrgStructureManage from './hooks/useGetOrgStructureManage';
import { OrgStructure } from './types';

const Content = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [orgData, setOrgData] = useState<OrgStructure | null>(null);
  
  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Drag state for centering
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Track which positions are expanded to show employees
  const [expandedPositions, setExpandedPositions] = useState<Set<number | string>>(new Set());

  // API hooks
  const { data: orgStructureData, isLoading, error, refetch } = useGetOrgStructureManage();
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']) as { state: { data: any } | undefined };

  // Load data from API
  useEffect(() => {
    if (orgStructureData && Array.isArray(orgStructureData) && orgStructureData.length > 0) {
      setOrgData(orgStructureData[0]);
    } else {
      setOrgData(null);
    }
  }, [orgStructureData]);

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.2));
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(prev => !prev);
  };

  // Handle show all employees (toggle functionality)
  const handleShowAllEmployees = () => {
    if (!orgData) return;

    // Function to collect all position IDs that have employees
    const collectPositionIds = (node: OrgStructure): (number | string)[] => {
      const ids: (number | string)[] = [];
      
      // Add current node if it has employees
      if (node.employees && node.employees.length > 0) {
        ids.push(node.id);
      }
      
      // Recursively collect from children
      if (node.children) {
        node.children.forEach(child => {
          ids.push(...collectPositionIds(child));
        });
      }
      
      return ids;
    };

    // Get all position IDs with employees
    const positionIdsWithEmployees = collectPositionIds(orgData);
    
    // Check if all positions are currently expanded
    const allExpanded = positionIdsWithEmployees.every(id => expandedPositions.has(id));
    
    if (allExpanded) {
      // If all are expanded, hide all employees
      setExpandedPositions(new Set());
      // Exit fullscreen and reset zoom and center to normal level
      setIsFullscreen(false);
      setTimeout(() => {
        setZoomLevel(1); // Reset to normal zoom
        setDragOffset({ x: 0, y: 0 }); // Center the chart
      }, 300);
    } else {
      // If not all are expanded, show all employees
      setExpandedPositions(new Set(positionIdsWithEmployees));
      // Enable fullscreen mode
      setIsFullscreen(true);
      // After a delay, zoom out and position to show everything nicely
      setTimeout(() => {
        setZoomLevel(0.6); // Zoom out to a more readable level
        setDragOffset({ x: 0, y: -300 }); // Move chart up to show CEO at the top
      }, 500); // Wait for employee animations to complete
    }
  };

  // Check if any positions have employees
  const hasEmployees = orgData ? (() => {
    const checkForEmployees = (node: OrgStructure): boolean => {
      if (node.employees && node.employees.length > 0) return true;
      if (node.children) {
        return node.children.some(child => checkForEmployees(child));
      }
      return false;
    };
    return checkForEmployees(orgData);
  })() : false;

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
    setIsExporting(true);
    try {
      // TODO: Implement actual export functionality
      console.log(`Exporting organizational structure as ${format.toUpperCase()}`);
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert(`Organizational structure exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col h-[calc(100vh-64px)]'>
      {/* Header */}
      <div className='flex justify-between items-center p-4 border-b-2 flex-shrink-0'>
        <Link href='/manage' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Manage | Organizational Structure</h4>
        </Link>
        
        {/* Export Dropdown - Only show if org data exists */}
        {orgData && (
          <Menu as='div' className='relative'>
            <Menu.Button className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50' disabled={isExporting}>
              <span>{isExporting ? 'Exporting...' : 'Export'}</span>
              <ChevronDownIcon className='h-4 w-4' />
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
            <Menu.Items className='absolute right-0 z-10 mt-2 w-full min-w-[120px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='py-1'>
                {exportOptions.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <span
                        className={`block px-4 py-2 text-sm cursor-pointer text-left ${
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
        )}
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col relative'>
        <div className='bg-white shadow-sm flex-1 flex flex-col'>     
          {/* Organizational Chart */}
          <ManageOrgChart 
            orgData={orgData}
            profileData={cachedProfile?.state?.data}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
            onShowAllEmployees={handleShowAllEmployees}
            hasEmployees={hasEmployees}
            expandedPositions={expandedPositions}
            setExpandedPositions={setExpandedPositions}
            dragOffset={dragOffset}
            setDragOffset={setDragOffset}
            onExport={handleExport}
          />
        </div>

        {/* Zoom Controls - Positioned within the max-width container */}
        {orgData && (
          <ZoomControls 
            onZoomIn={handleZoomIn} 
            onZoomOut={handleZoomOut} 
            onFullscreenToggle={handleFullscreenToggle}
            onShowAllEmployees={handleShowAllEmployees}
            isFullscreen={isFullscreen}
            zoomLevel={zoomLevel}
            hasEmployees={hasEmployees}
          />
        )}
      </div>
    </div>
  );
};

export default Content;
