import React from 'react';
import 'react-quill/dist/quill.snow.css';

// Types for employee data
interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  photo?: string;
  gender?: string;
}

// Types for organizational structure data
interface OrgStructure {
  id: number | string;
  description: string;
  position_name: string;
  position: number;
  parent?: number | null;
  parent_position_name?: string;
  order: number;
  is_active: boolean;
  children?: OrgStructure[];
  employees?: Employee[];
  primary_employee?: Employee;
}

interface PositionDetailsTooltipProps {
  data: OrgStructure;
  primaryEmployee?: Employee;
  isVisible: boolean;
}

const PositionDetailsTooltip: React.FC<PositionDetailsTooltipProps> = ({ 
  data, 
  primaryEmployee, 
  isVisible 
}) => {
  if (!isVisible || !data.description) {
    return null;
  }

  return (
    <div className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-xs min-w-64 transform -translate-x-1/2 left-1/2 -top-2 pointer-events-none">
      {/* Tooltip Arrow */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
      
      {/* Tooltip Content */}
      <div className="space-y-3">
        {/* Header */}
        <div className="text-left border-b border-gray-100 pb-2">
          <h3 className="font-bold text-sm text-gray-800">
            {primaryEmployee ? `${primaryEmployee.firstname} ${primaryEmployee.lastname}` : 'No Employee'}
            {data.employees && data.employees.length > 1 && (
              <span className="text-xs text-gray-500 ml-1">
                (+{data.employees.length - 1} more)
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-600 font-semibold">{data.position_name}</p>
        </div>

        {/* All Employees */}
        {data.employees && data.employees.length > 0 && (
          <div className="text-left">
            <h4 className="font-semibold text-xs text-gray-700 mb-2">
              {data.employees.length === 1 ? 'Employee' : 'Employees'}
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto pointer-events-auto">
              {data.employees.map((employee, index) => (
                <div key={employee.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    {employee.firstname} {employee.lastname}
                  </span>
                  {index === 0 && (
                    <span className="text-blue-600 text-xs font-medium">Primary</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="text-left">
          <div 
            className="text-xs text-gray-600 leading-relaxed ql-editor !p-0"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </div>
      </div>
    </div>
  );
};

export default PositionDetailsTooltip;
