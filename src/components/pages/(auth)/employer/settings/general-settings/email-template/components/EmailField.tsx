import React from 'react';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';

interface EmailFieldProps {
  tags: string[];
  inputValue: string;
  showSuggestions: boolean;
  filteredEmployees: any[];
  selectedIndex: number;
  dropdownRef: React.RefObject<HTMLDivElement>;
  showTooltip?: boolean;
  tooltipId?: string;
  onInputChange: (value: string) => void;
  onInputFocus: () => void;
  onInputBlur?: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onEmployeeSelect: (employee: any) => void;
  onMouseEnter: (index: number) => void;
  onRemoveTag: (tag: string) => void;
}

export default function EmailField({
  tags,
  inputValue,
  showSuggestions,
  filteredEmployees,
  selectedIndex,
  dropdownRef,
  showTooltip = false,
  tooltipId,
  onInputChange,
  onInputFocus,
  onInputBlur,
  onKeyDown,
  onEmployeeSelect,
  onMouseEnter,
  onRemoveTag,
}: EmailFieldProps) {
  return (
    <div 
      className='relative border border-gray-300 pl-2 flex items-center gap-3 flex-wrap w-full min-w-0 rounded-l-md'
      data-tooltip-id={tooltipId}
      data-tooltip-place='bottom'
      style={{ width: '100%' }}
    >
      {tags.map((tag: string) => (
        <div
          key={tag}
          className='bg-[#ACB9CB] rounded-md flex items-center gap-2 py-0 px-4 text-left justify-start text-sm'
        >
          <button type='button' onClick={() => onRemoveTag(tag)}>
            <XMarkIcon className='w-4 h-4' />
          </button>
          <p>{tag}</p>
        </div>
      ))}
      <input
        type='text'
        value={inputValue}
        onKeyDown={onKeyDown}
        onChange={(e) => onInputChange(e.target.value)}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        className='focus:none outline-none px-2 py-1 flex-1 min-w-0'
        style={{ width: '100%' }}
      />
      {showTooltip && tooltipId && (
        <Tooltip 
          id={tooltipId} 
          opacity={1} 
          style={{ 
            fontSize: '13px', 
            borderRadius: '8px', 
            backgroundColor: '#222C3B', 
            maxWidth: '330px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            zIndex: 9999
          }}
        >
          <div className='px-2 py-1'>
            <div className='text-[13px] font-medium leading-relaxed'>
              Add multiple recipients by pressing Tab or Enter,<br />
              or search for employees and departments.
            </div>
          </div>
        </Tooltip>
      )}
      
      {/* Employee Suggestions Dropdown */}
      {showSuggestions && (
        <div 
          ref={dropdownRef}
          className='absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'
        >
          {filteredEmployees.map((employee: any, index: number) => (
            <div
              key={employee.id || employee.department}
              className={`px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex 
                  ? 'bg-blue-100' 
                  : 'hover:bg-gray-100'
              }`}
              onMouseEnter={() => onMouseEnter(index)}
              onClick={() => onEmployeeSelect(employee)}
            >
              {employee.is_department_option ? (
                <>
                  <div className='text-sm font-medium text-gray-900'>
                    {employee.label}
                  </div>
                  <div className='text-xs text-blue-600'>
                    • Select all employees from this department
                  </div>
                </>
              ) : (
                <div>
                  <div className='text-sm font-medium text-gray-900'>
                    {employee.firstname} {employee.lastname}
                  </div>
                  <div className='text-xs text-gray-500'>
                    {employee.email}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
