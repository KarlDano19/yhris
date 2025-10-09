import React from 'react';

import { Tooltip } from 'react-tooltip';

import PlaceholderPicture from '@/svg/PlaceholderPicture';

import { Employee } from '../types';

interface EmployeeNodeProps {
  employee: Employee;
  onClick?: () => void;
}

const EmployeeNode: React.FC<EmployeeNodeProps> = ({ 
  employee, 
  onClick
}) => {
  // Determine avatar type (male/female) - use gender field if available
  const getAvatarType = (employee: Employee) => {
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
    >
      {/* Employee Node */}
      <div 
        className="text-center cursor-pointer px-6 mb-2 flex flex-col items-center justify-center transition-all duration-200 hover:scale-105"
        onClick={onClick}
        data-tooltip-id={!onClick ? `employee-node-tooltip-${employee.id}` : undefined}
        data-tooltip-content={!onClick ? `${employee.firstname} ${employee.lastname}` : undefined}
        data-tooltip-place={!onClick ? 'bottom' : undefined}
      >
        {/* Avatar */}
        <div className="flex justify-center mb-2 relative">
          <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 overflow-hidden bg-gray-50 border-gray-300">
            {employee.photo ? (
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
              className={`w-full h-full flex items-center justify-center ${employee.photo ? 'hidden' : 'block'}`}
            >
              <PlaceholderPicture 
                gender={avatarType} 
                fillColor="#6B7280" 
                width={24} 
                height={24}
                style={{ opacity: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Employee Name */}
        <h3 className="font-bold text-xs text-gray-800 mb-1 max-w-20 truncate">
          {employee.firstname} {employee.lastname}
        </h3>
      </div>
      
      {/* Tooltip for this employee */}
      <Tooltip 
        id={`employee-node-tooltip-${employee.id}`} 
        style={{ zIndex: 9999 }} 
      />
    </div>
  );
};

export default EmployeeNode;
