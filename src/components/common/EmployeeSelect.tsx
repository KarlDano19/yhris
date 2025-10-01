import { useEffect, useState, useMemo } from 'react';

import { Controller } from 'react-hook-form';
import Select, { components } from 'react-select';

import SelectChevronDown from '@/svg/SelectChevronDown';
import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';

// Custom Option component to display department/position in dropdown
const CustomOption = (props: any) => {
  const { data, isSelected } = props;
  
  // Handle "Show more" option styling - make it non-selectable
  if (data.isShowMore) {
    return (
      <div 
        className="flex items-center justify-between py-2 border-t border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer px-3"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Trigger the show more action directly
          const event = new CustomEvent('showMoreEmployees');
          document.dispatchEvent(event);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <span className="text-sm text-gray-600 font-medium">{data.label}</span>
        <span className="text-xs text-gray-500">Click to load more</span>
      </div>
    );
  }
  
  return (
    <components.Option {...props}>
      <div>
        <div className="font-medium">{data.label}</div>
        {(data.department || data.position) && (
          <div className={`text-sm ${isSelected ? 'text-blue-100' : 'text-gray-600'}`}>
            • {data.department && data.position 
              ? `${data.department} | ${data.position}`
              : data.department || data.position
            }
          </div>
        )}
      </div>
    </components.Option>
  );
};

interface EmployeeSelectProps {
  control: any;
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  isMulti?: boolean;
  isClearable?: boolean;
  employeeSearch: string;
  setEmployeeSearch: (value: string) => void;
  setEmployeeSelected?: (value: boolean) => void;
  excludeValues?: any[];
  error?: any;
  className?: string;
  rules?: any;
  onChange?: (selectedOption: any) => void;
  disabled?: boolean;
}

export default function EmployeeSelect({
  control,
  name,
  label = "",
  required = false,
  placeholder = "Select employee...",
  isMulti = false,
  isClearable = true,
  employeeSearch,
  setEmployeeSearch,
  setEmployeeSelected,
  excludeValues = [],
  className = "",
  rules = {},
  onChange,
  disabled = false,
}: EmployeeSelectProps) {
  const [employeeLimit, setEmployeeLimit] = useState(10);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Get employee items from the hook
  const { data: employeeItems } = useGetEmployeeItems();

  // Intelligent filtering function
  const filterEmployees = (items: any[], searchTerm: string, excludeValues: any[] = []) => {
    if (!searchTerm || searchTerm.length < 2) {
      // No search term, return all items excluding already selected ones
      return items.filter((item: any) => !excludeValues.includes(item.id));
    }

    const searchParts = searchTerm.toLowerCase().trim().split(' ').filter((part: string) => part.length > 0);
    
    const filteredItems = items.filter((item: any) => {
      // Skip if already selected in the other dropdown
      if (excludeValues.includes(item.id)) {
        return false;
      }

      const firstName = item.firstname?.toLowerCase() || '';
      const lastName = item.lastname?.toLowerCase() || '';
      const position = item.position?.toLowerCase() || '';
      const department = item.department?.toLowerCase() || '';
      
      // If search term is a single word, search across all fields
      if (searchParts.length === 1) {
        const singleTerm = searchParts[0];
        return firstName.includes(singleTerm) ||
               lastName.includes(singleTerm) ||
               position.includes(singleTerm) ||
               department.includes(singleTerm);
      }
      
      // For multi-word searches, try different combinations
      if (searchParts.length >= 2) {
        // Try exact phrase matching first for names
        const fullName = `${firstName} ${lastName}`.replace(/\s+/g, ' ').trim();
        const reverseName = `${lastName} ${firstName}`.replace(/\s+/g, ' ').trim();
        
        if (fullName.includes(searchTerm.toLowerCase()) || reverseName.includes(searchTerm.toLowerCase())) {
          return true;
        }
        
        // Try individual word matching across name fields
        const allNameParts = [firstName, lastName].filter((part: string) => part.length > 0);
        const matchedNameParts = searchParts.filter((searchPart: string) => 
          allNameParts.some((namePart: string) => namePart.includes(searchPart))
        );
        
        // Try position and department matching
        const matchedPositionDepartment = searchParts.some((searchPart: string) =>
          position.includes(searchPart) || department.includes(searchPart)
        );
        
        // If most name parts match OR if position/department matches, include the result
        return matchedNameParts.length >= Math.min(searchParts.length, 2) || matchedPositionDepartment;
      }
      
      return false;
    });

    return filteredItems;
  };

  // Memoize the filtered options with intelligent filtering
  const selectOptions = useMemo(() => {
    if (employeeItems && employeeItems.length > 0) {
      const filtered = filterEmployees(employeeItems, employeeSearch, excludeValues);
      
      // Apply limit and add show more option
      const limitedItems = filtered.slice(0, employeeLimit);
      const options = limitedItems.map((item: any) => ({
        value: item.id,
        label: `${item.firstname} ${item.lastname}`,
        department: item.department,
        position: item.position,
        address: item.address,
        gender: item.gender,
      }));

      // Add "Show more" option if there are more filtered results
      if (filtered.length > employeeLimit) {
        options.push({
          value: 'show_more',
          label: `Show 10 more employees (${filtered.length - employeeLimit} remaining)`,
          isShowMore: true,
        } as any);
      }

      return options;
    }
    return [];
  }, [employeeItems, employeeSearch, excludeValues, employeeLimit]);

  // Listen for custom show more event
  useEffect(() => {
    const handleShowMore = () => {
      setEmployeeLimit(prev => prev + 10);
      // Keep menu open after loading more data
      setTimeout(() => setIsMenuOpen(true), 100);
    };

    document.addEventListener('showMoreEmployees', handleShowMore);
    return () => document.removeEventListener('showMoreEmployees', handleShowMore);
  }, []);

  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        rules={required ? { required: "Please select an employee" } : rules}
        render={({ field, fieldState: { error: fieldError } }) => {
          // Handle the value display for both single and multi-select
          const getValue = () => {
            if (isMulti) {
              // For multi-select, field.value is an array of IDs
              if (!field.value || !Array.isArray(field.value)) {
                return [];
              }
              
              // Find the selected options from the current options
              const selectedOptions = selectOptions.filter((option: any) => 
                field.value.includes(option.value)
              );
              
              // If some selected values are not in the current options (due to filtering),
              // we need to add them from the full employeeItems list
              const missingSelectedOptions = field.value
                .filter((id: any) => !selectOptions.some((option: any) => option.value === id))
                .map((id: any) => {
                  const employee = employeeItems?.find((item: any) => item.id === id);
                  if (employee) {
                    return {
                      value: employee.id,
                      label: `${employee.firstname} ${employee.lastname}`,
                      department: employee.department,
                      position: employee.position,
                      address: employee.address,
                      gender: employee.gender,
                    };
                  }
                  return null;
                })
                .filter(Boolean);
              
              return [...selectedOptions, ...missingSelectedOptions];
            } else {
              // For single-select, field.value is a single ID
              const selectedOption = selectOptions.find((option: any) => option.value === field.value);
              if (selectedOption) {
                return selectedOption;
              }
              
              // If the selected value is not in current options, find it in employeeItems
              if (field.value && employeeItems) {
                const employee = employeeItems.find((item: any) => item.id === field.value);
                if (employee) {
                  return {
                    value: employee.id,
                    label: `${employee.firstname} ${employee.lastname}`,
                    department: employee.department,
                    position: employee.position,
                    address: employee.address,
                    gender: employee.gender,
                  };
                }
              }
              
              return null;
            }
          };

          return (
            <Select
              className={isMulti ? "basic-multi-select" : "basic-single-select"}
              classNamePrefix="select"
              options={selectOptions}
              value={getValue()}
              menuIsOpen={isMenuOpen}
              onMenuOpen={() => setIsMenuOpen(true)}
              onMenuClose={() => setIsMenuOpen(false)}
              onInputChange={(inputValue) => {
                // Update search term when user types
                setEmployeeSearch(inputValue);
                // Reset limit when searching
                setEmployeeLimit(10);
              }}
              onChange={(selectedOption: any) => {
                if (isMulti) {
                  // Multi-select logic
                  if (selectedOption && Array.isArray(selectedOption) && selectedOption.some((item: any) => item.value === 'show_more')) {
                    return; // Don't change the selected value, don't close dropdown
                  }
                  const fieldOnChange = selectedOption ? selectedOption.map((item: any) => item.value) : [];
                  onChange?.(selectedOption);
                  field.onChange(fieldOnChange);
                } else {
                  // Single-select logic
                  if (selectedOption && selectedOption.value === 'show_more') {
                    return; // Don't change the selected value, don't close dropdown
                  }
                  
                  const fieldOnChange = selectedOption ? selectedOption.value : '';
                  onChange?.(selectedOption);
                  field.onChange(fieldOnChange);
                  
                  if (selectedOption && !selectedOption.isShowMore) {
                    setEmployeeSearch(selectedOption.label);
                    if (setEmployeeSelected) setEmployeeSelected(true);
                    setIsMenuOpen(false); // Close menu for regular selection
                  } else {
                    setEmployeeSearch('');
                    if (setEmployeeSelected) setEmployeeSelected(false);
                  }
                }
              }}
              filterOption={() => true} // Disable React Select's built-in filtering since we handle it ourselves
              components={{
                Option: CustomOption,
                DropdownIndicator: () => (
                  <div className="pointer-events-none px-2">
                    <SelectChevronDown />
                  </div>
                ),
                IndicatorSeparator: () => null,
              }}
              isClearable={isClearable}
              placeholder={placeholder}
              isSearchable={true}
              isMulti={isMulti}
              isDisabled={disabled}
            />
          );
        }}
      />
    </div>
  );
}