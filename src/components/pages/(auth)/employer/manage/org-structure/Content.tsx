'use client';

import React, { Fragment, useState, useEffect } from 'react';

import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';

import { ArrowLeftIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Menu, Transition } from '@headlessui/react';

import ManageOrgChart from './components/ManageOrgChart';
import ZoomControls from './components/ZoomControls';
import ExportOptionsModal from './modals/ExportOptionsModal';
import useGetOrgStructureManage from './hooks/useGetOrgStructureManage';

import { OrgStructure } from './types';

const Content = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'png'>('png');
  const [orgData, setOrgData] = useState<OrgStructure | null>(null);
  const [disableTooltips, setDisableTooltips] = useState(false);
  
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
      action: () => {
        // Store the selected format and show export options modal
        setSelectedFormat('pdf');
        setShowExportModal(true);
      },
      disabled: false
    },
    {
      name: 'as PNG',
      action: () => {
        // Store the selected format and show export options modal
        setSelectedFormat('png');
        setShowExportModal(true);
      },
      disabled: false
    }
  ];

  const handleExport = async (format: 'pdf' | 'png', employeeOption: 'primary' | 'all') => {
    setIsExporting(true);
    setShowExportModal(false);
    setDisableTooltips(true); // Disable tooltips during export
    
    try {
      // Store original state
      const originalFullscreen = isFullscreen;
      const originalExpandedPositions = new Set(expandedPositions);
      const originalZoom = zoomLevel;
      const originalDragOffset = { ...dragOffset };

      // If "all employees" is selected, we need to show all employees first
      if (employeeOption === 'all') {
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

        if (orgData) {
          // Get all position IDs with employees
          const positionIdsWithEmployees = collectPositionIds(orgData);
          
          // Show all employees
          setExpandedPositions(new Set(positionIdsWithEmployees));
          
          // Enter fullscreen mode
          setIsFullscreen(true);
          
          // Wait for fullscreen transition and employee animations to complete
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Additional wait to ensure all employee containers are fully rendered
          // This helps ensure html2canvas captures the complete visual state
          await new Promise(resolve => requestAnimationFrame(resolve));
          await new Promise(resolve => requestAnimationFrame(resolve));
        }
      }

      // Small delay to ensure any existing animations are complete
      if (employeeOption === 'primary') {
        await new Promise(resolve => setTimeout(resolve, 500));
        await new Promise(resolve => requestAnimationFrame(resolve));
      }

      // Dynamically import html2canvas and jsPDF
      const html2canvas = (await import('html2canvas')).default;
      
      // Find the org chart container
      const chartContainer = document.querySelector('.org-tree-container') as HTMLElement;
      
      if (!chartContainer) {
        throw new Error('Chart container not found');
      }

      // Get company name for filename
      const companyName = cachedProfile?.state?.data?.name || 'Company';
      const timestamp = new Date().toISOString().split('T')[0];
      const suffix = employeeOption === 'all' ? '_All_Employees' : '_Primary_Only';
      const filename = `${companyName}_Org_Structure${suffix}_${timestamp}`;

      // Capture the chart as canvas with high quality
      const canvas = await html2canvas(chartContainer, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      if (format === 'png') {
        // Export as PNG
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        // Export as PDF
        const { jsPDF } = await import('jspdf');
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Calculate PDF dimensions (A4 landscape or portrait based on chart dimensions)
        const pdfWidth = imgWidth > imgHeight ? 297 : 210; // A4 dimensions in mm
        const pdfHeight = imgWidth > imgHeight ? 210 : 297;
        const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
        
        // Create PDF
        const pdf = new jsPDF({
          orientation: orientation,
          unit: 'mm',
          format: 'a4'
        });
        
        // Calculate scaling to fit page
        const ratio = Math.min(
          (pdfWidth - 20) / (imgWidth / 3.78), // Convert px to mm (1mm = 3.78px)
          (pdfHeight - 20) / (imgHeight / 3.78)
        );
        
        const scaledWidth = (imgWidth / 3.78) * ratio;
        const scaledHeight = (imgHeight / 3.78) * ratio;
        
        // Center the image
        const x = (pdfWidth - scaledWidth) / 2;
        const y = (pdfHeight - scaledHeight) / 2;
        
        pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
        pdf.save(`${filename}.pdf`);
      }

      // Restore original state if we changed it
      if (employeeOption === 'all') {
        setIsFullscreen(originalFullscreen);
        setExpandedPositions(originalExpandedPositions);
        setZoomLevel(originalZoom);
        setDragOffset(originalDragOffset);
      }
      
      console.log(`Successfully exported as ${format.toUpperCase()} with ${employeeOption} employees`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      
      // Restore original state on error
      if (employeeOption === 'all') {
        setIsFullscreen(false);
        setExpandedPositions(new Set());
        setZoomLevel(1);
        setDragOffset({ x: 0, y: 0 });
      }
    } finally {
      setIsExporting(false);
      setDisableTooltips(false); // Re-enable tooltips after export
    }
  };

  const handleExportWithOptions = (option: 'primary' | 'all') => {
    handleExport(selectedFormat, option);
  };

  // Wrapper function for ManageOrgChart's onExport prop
  const handleExportFormat = (format: 'pdf' | 'png') => {
    setSelectedFormat(format);
    setShowExportModal(true);
  };

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col h-[calc(100vh-64px)]'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 border-b-2 flex-shrink-0'>
        <Link href='/manage' className='flex items-center gap-3 hover:bg-gray-200 rounded-lg p-2 -m-2'>
          <ArrowLeftIcon className='h-5 w-5 flex-shrink-0' />
          <h4 className='text-sm sm:text-base truncate'>Manage | Organizational Structure</h4>
        </Link>
        
        {/* Export Dropdown - Only show if org data exists */}
        {orgData && (
          <Menu as='div' className='relative self-end sm:self-auto'>
            <Menu.Button className='bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 text-sm sm:text-base' disabled={isExporting}>
              <span className='hidden sm:inline'>{isExporting ? 'Exporting...' : 'Export'}</span>
              <span className='sm:hidden'>{isExporting ? '...' : 'Export'}</span>
              <ChevronDownIcon className='h-4 w-4 flex-shrink-0' />
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
            <Menu.Items className='absolute right-0 z-10 mt-2 w-32 sm:w-full min-w-[120px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
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
            onExport={handleExportFormat}
            disableTooltips={disableTooltips}
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

      {/* Export Options Modal */}
      <ExportOptionsModal
        isVisible={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportWithOptions}
        isExporting={isExporting}
        hasEmployees={hasEmployees}
      />
    </div>
  );
};

export default Content;
