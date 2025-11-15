import React, { useEffect, useState } from 'react';

import { Transition } from '@headlessui/react';
import { Tooltip } from 'react-tooltip';
import { EyeIcon } from '@heroicons/react/24/solid';

import PositionActionModal from '../modals/PositionActionModal';
import PositionDetailsModal from '../modals/PositionDetailsModal';
import EmployeeNode from './EmployeeNode';
import { Employee, OrgNodeProps } from '../types';

import PlaceholderPicture from '@/svg/PlaceholderPicture';
import PlaceholderAvatar from '@/components/common/PlaceholderAvatar';

// Maximum number of employees to show in the chart before requiring "View All"
const MAX_EMPLOYEES_IN_CHART = 10;

// Custom Node Component for Manage Page
const ManageOrgNode: React.FC<OrgNodeProps> = ({ 
  data, 
  clickedNodeId, 
  setClickedNodeId,
  expandedPositions = new Set(),
  setExpandedPositions,
  onSetPrimaryEmployee,
  disableTooltips = false,
  isSelectionMode = false,
  selectedPositions = new Set(),
  setSelectedPositions,
  usePlaceholderAvatars = false,
  excludeAvatars = false,
  departmentFilter
}) => {
  const isClicked = clickedNodeId === data.id;
  const isExpanded = expandedPositions.has(data.id);
  const isSelected = selectedPositions.has(data.id);
  
  // Modal state
  const [showActionModal, setShowActionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
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
  
  // Determine avatar type (male/female/empty) - use gender field if available
  const getAvatarType = (employee: Employee | undefined): 'male' | 'female' | 'empty' => {
    if (!employee) return 'empty'; // No employee assigned
    // Use gender field if available, otherwise fallback to name-based logic
    if (employee.gender) {
      return employee.gender.toLowerCase() === 'female' ? 'female' : 'male';
    }
    // Simple logic based on name as fallback
    return employee.firstname.toLowerCase().includes('a') ? 'female' : 'male';
  };

  const avatarType = getAvatarType(primaryEmployee);

  // Handle position click to show action modal
  const handlePositionClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowActionModal(true);
    setClickedNodeId(isClicked ? null : data.id); // Toggle action modal on click
  };

  // Handle view details action
  const handleViewDetails = () => {
    setShowActionModal(false);
    setShowDetailsModal(true);
  };

  // Handle show employees action
  const handleShowEmployees = () => {
    setShowActionModal(false);
    if (setExpandedPositions) {
      const newExpandedPositions = new Set(expandedPositions);
      if (isExpanded) {
        // If already expanded, collapse it
        newExpandedPositions.delete(data.id);
      } else {
        // If not expanded, expand it
        newExpandedPositions.add(data.id);
      }
      setExpandedPositions(newExpandedPositions);
    }
  };

  // Handle closing action modal
  const handleCloseActionModal = () => {
    setShowActionModal(false);
    setClickedNodeId(null);
  };

  // Handle closing details modal
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setClickedNodeId(null);
  };

  // Handle set primary employee
  const handleSetPrimaryEmployee = (employeeId: number) => {
    if (onSetPrimaryEmployee) {
      onSetPrimaryEmployee(data.id, employeeId);
    }
  };

  // Handle checkbox toggle
  const handleCheckboxToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (setSelectedPositions) {
      const newSelectedPositions = new Set(selectedPositions);
      if (isSelected) {
        newSelectedPositions.delete(data.id);
      } else {
        newSelectedPositions.add(data.id);
      }
      setSelectedPositions(newSelectedPositions);
    }
  };

  // Get other employees (excluding primary)
  const otherEmployees = data.employees?.filter((employee) => employee.id !== primaryEmployee?.id) || [];
  const totalOtherEmployees = otherEmployees.length;
  
  // Check if this position is actively hiring
  const isHiring = data.hiring_info?.is_hiring && (data.hiring_info?.total_remaining_slots ?? 0) > 0;
  const shadowCount = data.hiring_info?.total_remaining_slots ?? 0;
  
  // Create shadow employee placeholders (but NOT during export)
  const shadowEmployees = !disableTooltips ? Array.from({ length: shadowCount }, (_, index) => ({ id: `shadow-${index}` })) : [];
  
  // Combine real employees with shadow employees
  const allEmployeesToDisplay = [...otherEmployees, ...shadowEmployees];
  const totalToDisplay = allEmployeesToDisplay.length;
  const hasMoreThanMax = totalToDisplay > MAX_EMPLOYEES_IN_CHART;
  const employeesToShow = hasMoreThanMax ? allEmployeesToDisplay.slice(0, MAX_EMPLOYEES_IN_CHART) : allEmployeesToDisplay;
  const remainingCount = totalToDisplay - MAX_EMPLOYEES_IN_CHART;

  return (
    <div 
      className="relative pointer-events-auto"
      onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking on node
    >
      {/* Checkbox for Selection Mode - Hide during export */}
      {isSelectionMode && !disableTooltips && (
        <div className="absolute -top-2 -right-2 z-20">
          <button
            onClick={handleCheckboxToggle}
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shadow-md ${
              isSelected
                ? 'bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700'
                : 'bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
            title={isSelected ? "Deselect position" : "Select position"}
          >
            {isSelected ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
            )}
          </button>
        </div>
      )}

      {/* Main Position Node with Employee Info */}
      <div 
        className={`text-center cursor-pointer px-10 mb-2 flex flex-col items-center justify-center transition-all ${
          isSelectionMode && isSelected && !disableTooltips ? 'ring-4 ring-green-400 rounded-lg' : ''
        }`}
        onClick={handlePositionClick}
        data-tooltip-id={!clickedNodeId && !disableTooltips ? `org-node-tooltip-${data.id}` : undefined}
        data-tooltip-content={!clickedNodeId && !disableTooltips ? 'Click to view options' : undefined}
        data-tooltip-place={!clickedNodeId && !disableTooltips ? 'bottom' : undefined}
      >
        {/* Avatar */}
        {!excludeAvatars && (
        <div className="flex justify-center mb-2 relative">
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
              {usePlaceholderAvatars && primaryEmployee ? (
                <PlaceholderAvatar 
                  firstName={primaryEmployee.firstname} 
                  lastName={primaryEmployee.lastname}
                  width={56} 
                  height={56}
                  className="rounded-full"
                />
              ) : (
                <PlaceholderPicture 
                  gender={avatarType} 
                  fillColor="#3B82F6" 
                  width={32} 
                  height={32}
                  style={{ opacity: 0.5 }}
                />
              )}
            </div>
          </div>
          
          {/* Hiring indicator badge with count - Hidden during export */}
          {isHiring && data.hiring_info && (
            <div 
              className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-green-500 rounded-full border-2 border-white shadow-md flex items-center justify-center"
              data-export-exclude="true"
              style={{ display: disableTooltips ? 'none' : 'flex' }}
            >
              <span className="text-white text-xs font-bold leading-none">
                +{data.hiring_info.total_remaining_slots}
              </span>
            </div>
          )}
        </div>
        )}

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

      {/* Employee Nodes Display */}
      <Transition
        show={isExpanded && totalToDisplay > 0}
        enter="transition-all ease-out duration-300 transform"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all ease-in duration-200 transform"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-2"
        className="mt-4 flex flex-col items-center"
      >
        {/* Dashed line connecting to position */}
        <div className="w-0.5 h-4 border-l-2 border-dashed border-gray-400 mb-2"></div>
        
        {/* Employee nodes container */}
        <div className="flex flex-col items-center gap-3">
          {/* Employee grid */}
          <div className="flex flex-wrap justify-center gap-4 max-w-xs border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
            {employeesToShow.map((item, index) => {
              const isShadow = typeof item.id === 'string' && item.id.startsWith('shadow-');
              const employee = !isShadow ? item : undefined;
              
              return (
                <Transition
                  key={typeof item.id === 'string' ? item.id : `employee-${item.id}`}
                  appear={true}
                  show={isExpanded}
                  enter="transition-all ease-out duration-300 transform"
                  enterFrom="opacity-0 translate-y-2 scale-95"
                  enterTo="opacity-100 translate-y-0 scale-100"
                  className="inline-block"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <EmployeeNode
                    employee={employee as Employee | undefined}
                    disableTooltips={disableTooltips}
                    isShadow={isShadow}
                    usePlaceholderAvatars={usePlaceholderAvatars}
                    excludeAvatars={excludeAvatars}
                  />
                </Transition>
              );
            })}
          </div>

          {/* View All Button - shown when there are more employees than the limit (hidden during export) */}
          {hasMoreThanMax && !disableTooltips && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <EyeIcon className="w-4 h-4" />
              View All {totalToDisplay} Position{totalToDisplay !== 1 ? 's' : ''}
              {shadowCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-green-500 rounded-full text-xs">
                  +{shadowCount} open
                </span>
              )}
            </button>
          )}
        </div>
      </Transition>

      {/* Action Modal */}
      <PositionActionModal 
        data={data}
        primaryEmployee={primaryEmployee}
        isVisible={showActionModal}
        onClose={handleCloseActionModal}
        onViewDetails={handleViewDetails}
        onShowEmployees={handleShowEmployees}
        isExpanded={isExpanded}
      />

      {/* Details Modal */}
      <PositionDetailsModal 
        data={data}
        primaryEmployee={primaryEmployee}
        isVisible={showDetailsModal}
        onClose={handleCloseDetailsModal}
        departmentFilter={departmentFilter}
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

export default ManageOrgNode;

