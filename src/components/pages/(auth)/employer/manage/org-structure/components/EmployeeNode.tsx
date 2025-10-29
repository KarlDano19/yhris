import React from 'react';

import { Tooltip } from 'react-tooltip';

import PlaceholderPicture from '@/svg/PlaceholderPicture';

import { Employee } from '../types';

interface EmployeeNodeProps {
  employee?: Employee;
  onClick?: () => void;
  disableTooltips?: boolean;
  isHiring?: boolean;
  isShadow?: boolean;
}

const EmployeeNode: React.FC<EmployeeNodeProps> = ({ 
  employee, 
  onClick,
  disableTooltips = false,
  isHiring = false,
  isShadow = false
}) => {
  // Determine avatar type (male/female) - use gender field if available
  const getAvatarType = (employee?: Employee) => {
    if (!employee) return 'male'; // Default
    // Use gender field if available, otherwise fallback to name-based logic
    if (employee.gender) {
      return employee.gender.toLowerCase() === 'female' ? 'female' : 'male';
    }
    // Simple logic based on name as fallback
    return employee.firstname.toLowerCase().includes('a') ? 'female' : 'male';
  };

  const avatarType = getAvatarType(employee);

  return (
    <div 
      className="relative pointer-events-auto"
      onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking on node
      data-export-exclude={isShadow ? 'true' : undefined}
    >
      {/* Employee Node */}
      <div 
        className={`text-center px-6 mb-2 flex flex-col items-center justify-center transition-all duration-200 ${
          isShadow ? 'opacity-40' : 'cursor-pointer hover:scale-105'
        }`}
        onClick={!isShadow ? onClick : undefined}
        data-tooltip-id={!onClick && !disableTooltips && employee ? `employee-node-tooltip-${employee.id}` : undefined}
        data-tooltip-content={!onClick && !disableTooltips && employee ? `${employee.firstname} ${employee.lastname}` : undefined}
        data-tooltip-place={!onClick && !disableTooltips ? 'bottom' : undefined}
      >
        {/* Avatar */}
        <div className="flex justify-center mb-2 relative">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 overflow-hidden ${
            isShadow 
              ? 'bg-gray-100 border-dashed border-gray-400' 
              : 'bg-gray-50 border-gray-300'
          }`}>
            {!isShadow && employee?.photo ? (
              <img
                src={employee.photo}
                alt={`${employee.firstname} ${employee.lastname}`}
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
              className={`w-full h-full flex items-center justify-center ${!isShadow && employee?.photo ? 'hidden' : 'block'}`}
            >
              <PlaceholderPicture 
                gender={avatarType} 
                fillColor={isShadow ? "#D1D5DB" : "#6B7280"} 
                width={24} 
                height={24}
                style={{ opacity: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Employee Name or Placeholder */}
        {!isShadow && employee ? (
          <h3 className="font-bold text-xs text-gray-800 mb-2 max-w-20 leading-tight text-center">
            {employee.firstname} {employee.lastname}
          </h3>
        ) : (
          <h3 className="font-bold text-xs text-gray-400 mb-2 max-w-20 leading-tight text-center">
            Open Position
          </h3>
        )}
      </div>
      
      {/* Tooltip for this employee */}
      {!isShadow && employee && (
        <Tooltip 
          id={`employee-node-tooltip-${employee.id}`} 
          style={{ zIndex: 9999 }} 
        />
      )}
    </div>
  );
};

export default EmployeeNode;
