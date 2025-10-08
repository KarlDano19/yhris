import React, { useEffect } from 'react';

import { Tooltip } from 'react-tooltip';

import PositionDetailsModal from '../modals/PositionDetailsModal';
import { Employee, OrgNodeProps } from '../types';

import PlaceholderPicture from '@/svg/PlaceholderPicture';

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

      {/* Click Modal */}
      <PositionDetailsModal 
        data={data}
        primaryEmployee={primaryEmployee}
        isVisible={isClicked}
        onClose={() => setClickedNodeId(null)}
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

