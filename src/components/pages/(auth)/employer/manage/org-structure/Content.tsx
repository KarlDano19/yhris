'use client';

import React, { Fragment, useState, useEffect } from 'react';

import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';

import { ArrowLeftIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Menu, Transition } from '@headlessui/react';

import ManageOrgChart from './components/ManageOrgChart';
import ZoomControls from './components/ZoomControls';
import ExportOptionsModal from './modals/ExportOptionsModal';
import ProgressModal from '@/components/ProgressModal';
import useGetOrgStructureManage from './hooks/useGetOrgStructureManage';

import { OrgStructure } from './types';

const Content = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'png'>('png');
  const [selectedEmployeeOption, setSelectedEmployeeOption] = useState<'primary' | 'all'>('primary');
  const [orgData, setOrgData] = useState<OrgStructure | null>(null);
  const [disableTooltips, setDisableTooltips] = useState(false);
  
  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Drag state for centering
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Track which positions are expanded to show employees
  const [expandedPositions, setExpandedPositions] = useState<Set<number | string>>(new Set());
  
  // Position selection for export
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<Set<number | string>>(new Set());

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

  // Function to filter org structure to only include selected positions
  const filterOrgStructure = (node: OrgStructure): OrgStructure | null => {
    // If this node is not selected, skip it
    if (!selectedPositions.has(node.id)) {
      return null;
    }
    
    // Create a copy of the node
    const filteredNode: OrgStructure = { ...node };
    
    // Filter children recursively
    if (node.children) {
      const filteredChildren = node.children
        .map(child => filterOrgStructure(child))
        .filter((child): child is OrgStructure => child !== null);
      
      filteredNode.children = filteredChildren.length > 0 ? filteredChildren : undefined;
    }
    
    return filteredNode;
  };


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
    setDisableTooltips(true); // Disable tooltips during export
    
    // Wait for React to re-render with disableTooltips=true
    await new Promise(resolve => setTimeout(resolve, 100));
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    try {
      // Store original state
      const originalFullscreen = isFullscreen;
      const originalExpandedPositions = new Set(expandedPositions);
      const originalZoom = zoomLevel;
      const originalDragOffset = { ...dragOffset };
      
      // Get the current full org data from the API data (not state which might be filtered)
      const currentFullOrgData = orgStructureData && Array.isArray(orgStructureData) && orgStructureData.length > 0 
        ? orgStructureData[0] 
        : orgData;
      
      // If in selection mode and positions are selected, filter the org structure
      if (isSelectionMode && selectedPositions.size > 0 && currentFullOrgData) {
        const filteredData = filterOrgStructure(currentFullOrgData);
        if (filteredData) {
          setOrgData(filteredData);
          // Wait for the UI to update with filtered data
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

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

      // Add export mode class to hide hiring badges and shadow nodes
      chartContainer.classList.add('export-mode');
      
      // Wait for CSS to apply
      await new Promise(resolve => setTimeout(resolve, 100));
      await new Promise(resolve => requestAnimationFrame(resolve));

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

      // Remove export mode class
      chartContainer.classList.remove('export-mode');
      
      // Restore original state if we changed it
      if (employeeOption === 'all') {
        setIsFullscreen(originalFullscreen);
        setExpandedPositions(originalExpandedPositions);
        setZoomLevel(originalZoom);
        setDragOffset(originalDragOffset);
      }
      
      // Always restore original org data after export to ensure full chart is shown
      if (currentFullOrgData) {
        setOrgData(currentFullOrgData);
        // Small delay to ensure UI updates with restored data
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Turn off selection mode after successful export
      setIsSelectionMode(false);
      
      console.log(`Successfully exported as ${format.toUpperCase()} with ${employeeOption} employees`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      
      // Remove export mode class on error
      const chartContainer = document.querySelector('.org-tree-container') as HTMLElement;
      if (chartContainer) {
        chartContainer.classList.remove('export-mode');
      }
      
      // Restore original state on error
      if (employeeOption === 'all') {
        setIsFullscreen(false);
        setExpandedPositions(new Set());
        setZoomLevel(1);
        setDragOffset({ x: 0, y: 0 });
      }
      
      // Restore full org data on error
      const fullOrgData = orgStructureData && Array.isArray(orgStructureData) && orgStructureData.length > 0 
        ? orgStructureData[0] 
        : null;
      if (fullOrgData) {
        setOrgData(fullOrgData);
      }
      
      // Turn off selection mode on error too
      setIsSelectionMode(false);
    } finally {
      setIsExporting(false);
      setDisableTooltips(false); // Re-enable tooltips after export
    }
  };

  const handleExportWithOptions = (option: 'primary' | 'all') => {
    // Store the selected option
    setSelectedEmployeeOption(option);
    setShowExportModal(false);
    
    // Activate selection mode and select all positions by default
    setIsSelectionMode(true);
    if (selectedPositions.size === 0 && orgData) {
      const allPositionIds = new Set<number | string>();
      const collectIds = (node: OrgStructure) => {
        allPositionIds.add(node.id);
        node.children?.forEach(collectIds);
      };
      collectIds(orgData);
      setSelectedPositions(allPositionIds);
    }
  };

  // Handle proceed with export after position selection
  const handleProceedWithExport = () => {
    // Keep selection mode active so filtering works during export
    // It will be turned off after export completes
    setShowProgressModal(true);
  };

  // Handle cancel position selection
  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedPositions(new Set());
  };

  // Function to be called by ProgressModal
  const performExport = () => {
    handleExport(selectedFormat, selectedEmployeeOption);
  };

  // Wrapper function for ManageOrgChart's onExport prop
  const handleExportFormat = (format: 'pdf' | 'png') => {
    setSelectedFormat(format);
    setShowExportModal(true);
  };

  return (
    <>
      {/* CSS for hiding hiring badges and shadow nodes during export */}
      <style>{`
        .export-mode [data-export-exclude="true"] {
          display: none !important;
        }
      `}</style>
      
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col h-[calc(100vh-64px)]'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 border-b-2 flex-shrink-0'>
        <Link href='/manage' className='flex items-center gap-3 hover:bg-gray-200 rounded-lg p-2 -m-2'>
          <ArrowLeftIcon className='h-5 w-5 flex-shrink-0' />
          <h4 className='text-sm sm:text-base truncate'>Manage | Organizational Structure</h4>
        </Link>
        
        {/* Export Button - Hide when selection mode is active */}
        {orgData && !isSelectionMode && (
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

      {/* Selection Mode Action Bar - Show at top when active, hide during export */}
      {isSelectionMode && !isExporting && (
        <div className="bg-green-50 border-b-2 border-green-200 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Select Positions to Export</h5>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-green-700">{selectedPositions.size}</span> position{selectedPositions.size !== 1 ? 's' : ''} selected
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancelSelection}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedWithExport}
                  disabled={selectedPositions.size === 0}
                  className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export {selectedPositions.size} Position{selectedPositions.size !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
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
            isSelectionMode={isSelectionMode}
            selectedPositions={selectedPositions}
            setSelectedPositions={setSelectedPositions}
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

      {/* Progress Modal */}
      <ProgressModal
        isOpen={showProgressModal}
        setIsOpen={setShowProgressModal}
        onConfirm={performExport}
        title="Exporting Organizational Chart"
        subtitle={`Preparing your ${selectedFormat.toUpperCase()} export with ${selectedEmployeeOption === 'all' ? 'all employees' : 'primary employees only'}...`}
        isProcessing={isExporting}
        onSuccess={() => {
          // Reset selection after successful export
          setSelectedPositions(new Set());
          setIsSelectionMode(false);
        }}
      />
    </div>
    </>
  );
};

export default Content;
