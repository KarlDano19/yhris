import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';

import useGetEmployeePaginatedSelect from '@/components/hooks/useGetEmployeePaginatedSelect';

interface EmailFieldProps {
  tags: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onEmployeeSelect: (employee: any) => void;
  onRemoveTag: (tag: string) => void;
  showTooltip?: boolean;
  tooltipId?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function EmailField({
  tags,
  inputValue,
  onInputChange,
  onInputFocus,
  onInputBlur,
  onKeyDown,
  onEmployeeSelect,
  onRemoveTag,
  showTooltip = false,
  tooltipId,
  placeholder = "",
  disabled = false,
  className = "",
}: EmailFieldProps) {
  // Internal state for suggestions and employee data
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [justAddedEmail, setJustAddedEmail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [employeeLimit, setEmployeeLimit] = useState(50);
  const [hasUserFocused, setHasUserFocused] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debouncing effect for search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoize search parameters
  const searchParams = useMemo(() => ({
    search: debouncedSearch || '',
    current_page: 1
  }), [debouncedSearch]);

  // Fetch employee data
  const { data: employeeData } = useGetEmployeePaginatedSelect(searchParams);

  // Function to scroll selected item into view
  const scrollToSelectedItem = (index: number) => {
    if (dropdownRef.current && index >= 0) {
      const selectedElement = dropdownRef.current.children[index] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
        });
      }
    }
  };

  // Enhanced function to filter employees with show more functionality (but doesn't control visibility)
  const filterEmployees = useCallback((inputValue: string, selectedTags: string[], employeeData: any, employeeLimit: number) => {
    if (employeeData?.records) {
      if (inputValue.trim()) {
        const searchTerm = inputValue.toLowerCase();
        
        // Filter employees (exclude already selected ones)
        const filtered = employeeData.records.filter((employee: any) => {
          const fullName = `${employee.firstname} ${employee.lastname}`.toLowerCase();
          const email = employee.email?.toLowerCase() || '';
          const department = employee.department?.toLowerCase() || '';
          const position = employee.position?.toLowerCase() || '';
          
          const isAlreadySelected = selectedTags.includes(employee.email);
          const matchesSearch = (
            fullName.includes(searchTerm) || 
            email.includes(searchTerm) || 
            department.includes(searchTerm) || 
            position.includes(searchTerm)
          );
          
          return matchesSearch && !isAlreadySelected;
        });

        // Get all unique departments from filtered results
        const matchingDepartments = new Set();
        filtered.forEach((employee: any) => {
          if (employee.department) {
            matchingDepartments.add(employee.department);
          }
        });
        
        // Create department options (only show if not all employees from that department are selected)
        const departmentOptions = Array.from(matchingDepartments).map((deptName: any) => {
          // Check if all employees from this department are already selected
          const employeesInDepartment = employeeData.records.filter((emp: any) => 
            emp.department === deptName && emp.email
          );
          const selectedEmployeesInDepartment = employeesInDepartment.filter((emp: any) => 
            selectedTags.includes(emp.email)
          );
          const availableEmployeesInDepartment = employeesInDepartment.filter((emp: any) => 
            !selectedTags.includes(emp.email)
          );
          const allEmployeesSelected = employeesInDepartment.length > 0 && 
            selectedEmployeesInDepartment.length === employeesInDepartment.length;
          
          return {
            id: `dept:${deptName}`,
            firstname: null,
            lastname: null,
            email: null,
            department: deptName,
            position: null,
            is_department_option: true,
            label: `${deptName} (All Employees)`,
            allEmployeesSelected: allEmployeesSelected,
            employeeCount: availableEmployeesInDepartment.length
          };
        }).filter((deptOption: any) => !deptOption.allEmployeesSelected && deptOption.employeeCount > 0);
        
        // Apply employee limit to individual employees
        const limitedEmployees = filtered.slice(0, employeeLimit);
        
        // Combine department options with limited employees - departments first
        let combinedOptions = [...departmentOptions, ...limitedEmployees];
        
        // Add "show more" option if there are more employees to show
        if (filtered.length > employeeLimit) {
          combinedOptions.push({
            id: 'show_more',
            firstname: null,
            lastname: null,
            email: null,
            department: null,
            position: null,
            is_show_more_option: true,
            label: `Show ${Math.min(50, filtered.length - employeeLimit)} more employees`,
            remainingCount: filtered.length - employeeLimit
          });
        }
        
        setFilteredEmployees(combinedOptions);
        // Don't automatically show suggestions - let focus handler control this
        setSelectedIndex(-1); // Reset selection when filtering
      } else {
        // When no search input, prepare suggestions from all available employees (limited)
        if (employeeData.records.length > 0) {
          const availableEmployees = employeeData.records
            .filter((employee: any) => employee.email && !selectedTags.includes(employee.email));
          
          const limitedEmployees = availableEmployees.slice(0, employeeLimit);
          
          // Get all unique departments from available employees
          const allDepartments = new Set();
          availableEmployees.forEach((employee: any) => {
            if (employee.department) {
              allDepartments.add(employee.department);
            }
          });
          
          // Create department options
          const departmentOptions = Array.from(allDepartments).map((deptName: any) => {
            const employeesInDepartment = availableEmployees.filter((emp: any) => 
              emp.department === deptName
            );
            
            return {
              id: `dept:${deptName}`,
              firstname: null,
              lastname: null,
              email: null,
              department: deptName,
              position: null,
              is_department_option: true,
              label: `${deptName} (All Employees)`,
              employeeCount: employeesInDepartment.length
            };
          }).filter((deptOption: any) => deptOption.employeeCount > 0);
          
          // Combine department options with limited employees
          let combinedOptions = [...departmentOptions, ...limitedEmployees];
          
          // Add "show more" option if there are more employees to show
          if (availableEmployees.length > employeeLimit) {
            combinedOptions.push({
              id: 'show_more',
              firstname: null,
              lastname: null,
              email: null,
              department: null,
              position: null,
              is_show_more_option: true,
              label: `Show ${Math.min(50, availableEmployees.length - employeeLimit)} more employees`,
              remainingCount: availableEmployees.length - employeeLimit
            });
          }
          
          setFilteredEmployees(combinedOptions);
          // Don't automatically show suggestions - let focus handler control this
        } else {
          setFilteredEmployees([]);
          // Don't automatically hide suggestions - let focus handler control this
        }
        setSelectedIndex(-1);
      }
    } else {
      setFilteredEmployees([]);
      // Don't automatically hide suggestions - let focus handler control this
      setSelectedIndex(-1);
    }
  }, []);

  // Filter employees based on input and employee data
  useEffect(() => {
    filterEmployees(inputValue, tags, employeeData, employeeLimit);
    // Hide suggestions when data changes unless user has focused
    if (!hasUserFocused) {
      setShowSuggestions(false);
    }
  }, [inputValue, employeeData, tags, employeeLimit, filterEmployees, hasUserFocused]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
        setHasUserFocused(false); // Reset focus flag when clicking outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle employee selection
  const handleEmployeeSelect = (employee: any) => {
    // Handle "show more" option
    if (employee.is_show_more_option) {
      setEmployeeLimit(prev => prev + 50);
      setSelectedIndex(-1);
      return;
    }
    
    if (employee.is_department_option) {
      if (employee.is_remove_option) {
        // Handle department removal - remove all employees from that department
        const employeesInDepartment = employeeData?.records?.filter((emp: any) => 
          emp.department === employee.department && emp.email
        ) || [];
        
        const emailsToRemove = employeesInDepartment.map((emp: any) => emp.email);
        const remainingTags = tags.filter((tag: string) => !emailsToRemove.includes(tag));
        
        // Update tags by calling onEmployeeSelect with the updated tags
        onEmployeeSelect({ type: 'department_remove', emails: emailsToRemove, remainingTags });
      } else {
        // Handle department selection - add all employees from that department
        const employeesInDepartment = employeeData?.records?.filter((emp: any) => 
          emp.department === employee.department && emp.email
        ) || [];
        
        const newEmails = employeesInDepartment
          .map((emp: any) => emp.email)
          .filter((email: string) => !tags.includes(email));
        
        if (newEmails.length > 0) {
          onEmployeeSelect({ type: 'department_select', emails: newEmails });
        }
      }
    } else if (employee.email && !tags.includes(employee.email)) {
      // Handle individual employee selection
      onEmployeeSelect({ type: 'individual_select', email: employee.email });
    }
    
    // Clear the input field after selection
    onInputChange('');
    setSearchTerm('');
    setSelectedIndex(-1);
    
    // Ensure suggestions are prepared for next search by triggering a re-filter
    // This is important after manual email entry to ensure suggestions show on next focus
    setTimeout(() => {
      filterEmployees('', tags, employeeData, employeeLimit);
    }, 0);
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setSelectedIndex(-1);
    setEmployeeLimit(50); // Reset employee limit when searching
    // Don't automatically show suggestions when typing - only when already visible or on focus
    onInputChange(value);
  };

  // Handle input focus
  const handleInputFocus = () => {
    // Mark that user has focused and show suggestions if there are filtered employees
    setHasUserFocused(true);
    // Always try to show suggestions on focus if there are filtered employees
    // This ensures suggestions appear even after manual email entry
    if (filteredEmployees.length > 0) {
      setShowSuggestions(true);
    }
    if (onInputFocus) {
      onInputFocus();
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    setTimeout(() => {
      if (!justAddedEmail) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
        setHasUserFocused(false); // Reset focus flag when blurring
      } else {
        setJustAddedEmail(false);
        // Don't reset hasUserFocused when just added email - keep it true so suggestions show on next focus
      }
    }, 150);
    
    if (onInputBlur) {
      onInputBlur();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (showSuggestions && filteredEmployees.length > 0) {
        let newIndex = selectedIndex + 1;
        // Skip show more option in keyboard navigation
        while (newIndex < filteredEmployees.length && filteredEmployees[newIndex]?.is_show_more_option) {
          newIndex++;
        }
        if (newIndex >= filteredEmployees.length) {
          newIndex = selectedIndex; // Stay at current position if at end
        }
        setSelectedIndex(newIndex);
        scrollToSelectedItem(newIndex);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      let newIndex = selectedIndex > 0 ? selectedIndex - 1 : -1;
      // Skip show more option in keyboard navigation
      while (newIndex >= 0 && filteredEmployees[newIndex]?.is_show_more_option) {
        newIndex--;
      }
      setSelectedIndex(newIndex);
      if (newIndex >= 0) {
        scrollToSelectedItem(newIndex);
      }
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (selectedIndex >= 0 && filteredEmployees[selectedIndex]) {
        handleEmployeeSelect(filteredEmployees[selectedIndex]);
      } else {
        // Handle manual email entry
        if (onKeyDown) {
          onKeyDown(e);
        }
        setJustAddedEmail(true);
        
        // Clear the input field after manual email entry
        onInputChange('');
        setSearchTerm('');
        setSelectedIndex(-1);
        
        // Ensure suggestions are prepared for next search
        setTimeout(() => {
          filterEmployees('', tags, employeeData, employeeLimit);
        }, 100);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestions(false);
      setSelectedIndex(-1);
      setHasUserFocused(false); // Reset focus flag when escaping
    } else {
      // Let other keys pass through to the original handler
      if (onKeyDown) {
        onKeyDown(e);
      }
    }
  };

  return (
    <div 
      className={`relative border border-gray-300 pl-2 flex items-center gap-3 flex-wrap w-full min-w-0 rounded-l-md ${className}`}
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
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className='focus:none outline-none px-2 py-1 flex-1 min-w-0'
        style={{ width: '100%' }}
        placeholder={placeholder}
        disabled={disabled}
      />
      {showTooltip && tooltipId && (
        <Tooltip 
          id={tooltipId} 
          opacity={1} 
          style={{ 
            fontSize: '13px', 
            borderRadius: '8px', 
            backgroundColor: '#222C3B', 
            maxWidth: '350px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            zIndex: 9999
          }}
        >
          <div className='px-2 py-1'>
            <div className='text-[13px] font-medium leading-relaxed'>
              Add multiple recipients by pressing Tab or Enter,
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
              className={`${
                employee.is_show_more_option 
                  ? '' 
                  : `px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      index === selectedIndex 
                        ? 'bg-blue-100' 
                        : 'hover:bg-gray-100'
                    }`
              }`}
              onMouseEnter={() => !employee.is_show_more_option && setSelectedIndex(index)}
              onClick={() => handleEmployeeSelect(employee)}
            >
              {employee.is_show_more_option ? (
                <div 
                  className="flex items-center justify-between py-2 border-t border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer px-3"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEmployeeSelect(employee);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <span className='text-sm text-gray-600'>{employee.label}</span>
                  <span className='text-sm text-gray-600 font-medium'>Click to load more</span>
                </div>
              ) : employee.is_department_option ? (
                <div className='flex flex-col'>
                  <div className='text-sm font-medium text-gray-900'>
                    {employee.label}
                  </div>
                  <div className='text-xs text-blue-600'>
                    • Select all employees from this department
                  </div>
                </div>
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