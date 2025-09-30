import { useEffect, useState, useMemo, useCallback, useRef } from 'react';

import { Controller, useWatch } from 'react-hook-form';
import Select, { components } from 'react-select';
import { useQueryClient } from '@tanstack/react-query';

import SelectChevronDown from '@/svg/SelectChevronDown';
import LoadingSpinner from '@/components/LoadingSpinner';
import useGetEmployeePaginatedSelect from '@/components/hooks/useGetEmployeePaginatedSelect';

{/* Custom option component */}
const CustomOption = (props: any) => {
  const { data, isSelected } = props;
  
  if (data.isLoading) {
    return (
      <div className="px-3 py-4 text-center">
        <LoadingSpinner 
          size="sm" 
          color="yellow" 
          text="Searching employees..." 
          showText={true}
          className="py-2"
        />
      </div>
    );
  }
  
  if (data.isShowMore) {
    return (
      <div 
        className="flex items-center justify-between py-2 border-t border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer px-3"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          document.dispatchEvent(new CustomEvent('showMoreEmployees'));
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <span className='text-sm text-gray-600'>Show 50 more employees</span>
        <span className='text-sm text-gray-600 font-medium'>Click to load more</span>
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
  disabled?: boolean;
  employeeSearch: string;
  setEmployeeSearch: (value: string) => void;
  setEmployeeSelected?: (value: boolean) => void;
  excludeValues?: any[];
  error?: any;
  className?: string;
  rules?: any;
  onChange?: (selectedOption: any) => void;
  employeeName?: string; // Optional employee name for display
  employeeNames?: string[]; // Optional array of employee names for multi-select display
}

export default function EmployeeSelect({
  control,
  name,
  label = "",
  required = false,
  placeholder = "Select employee...",
  isMulti = false,
  isClearable = true,
  disabled = false,
  employeeSearch,
  setEmployeeSearch,
  setEmployeeSelected,
  excludeValues = [],
  className = "",
  rules = {},
  onChange,
  employeeName,
  employeeNames,
}: EmployeeSelectProps) {
  const queryClient = useQueryClient();
  const [employeeLimit, setEmployeeLimit] = useState(50);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [cachedEmployeeItems, setCachedEmployeeItems] = useState<any[]>([]);
  const [persistentSelections, setPersistentSelections] = useState<any[]>([]);
  const [isDebouncing, setIsDebouncing] = useState(false);
  
  const formValue = useWatch({ control, name });

  {/* Debounce search */}
  useEffect(() => {
    // Set debouncing state when user is typing
    if (employeeSearch && employeeSearch.length >= 2) {
      setIsDebouncing(true);
    } else {
      setIsDebouncing(false);
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(employeeSearch);
      setIsDebouncing(false); // Clear debouncing state when delay is done
    }, 2000); // 2000ms delay (2 seconds)

    return () => {
      clearTimeout(timer);
      // Don't clear debouncing state immediately on cleanup
    };
  }, [employeeSearch]);

  {/* Fetch employees */}
  const { data: employeeData } = useGetEmployeePaginatedSelect(
    debouncedSearch && debouncedSearch.length >= 2 ? {
      search: debouncedSearch,
      current_page: 1
    } : null
  );

  {/* Cache employee data */}
  useEffect(() => {
    if (employeeData?.records?.length > 0) {
      setCachedEmployeeItems(employeeData.records);
    }
  }, [employeeData]);

  {/* Combine employee data */}
  const employeeItems = useMemo(() => {
    const currentData = (debouncedSearch && debouncedSearch.length >= 2) 
      ? (employeeData?.records || []) 
      : cachedEmployeeItems;
    
    const combinedItems = [...persistentSelections];
    currentData.forEach((emp: any) => {
      if (!persistentSelections.some((persistentEmp: any) => persistentEmp.id === emp.id)) {
        combinedItems.push(emp);
      }
    });
    return combinedItems;
  }, [debouncedSearch, employeeData?.records, cachedEmployeeItems, persistentSelections]);

  {/* Helper functions */}
  const createEmployeeFromName = (id: any, name: string) => {
    const nameParts = name.split(' ');
    return {
      id,
      firstname: nameParts[0] || '',
      lastname: nameParts.slice(1).join(' ') || '',
      department: '',
      position: '',
      address: '',
      gender: ''
    };
  };

  const getEmployeeFromCache = useCallback((id: any) => {
    const allCachedData = queryClient.getQueryCache().getAll();
    for (const query of allCachedData) {
      if (query.queryKey[0] === 'employeePaginatedSelectCache' && (query.state.data as any)?.records) {
        const employee = (query.state.data as any).records.find((emp: any) => emp.id === id);
        if (employee) return employee;
      }
    }
    return null;
  }, [queryClient]);

  const getEmployeesWithNames = useCallback((idsToFind: any[], currentEmployeeItems: any[] = []) => {
    return idsToFind.map((id: any, index: number) => {
      let nameToUse = `Employee ${id}`;
      
      if (isMulti && employeeNames?.[index]) {
        nameToUse = employeeNames[index];
      } else if (!isMulti && employeeName && idsToFind.length === 1 && idsToFind[0] === id) {
        nameToUse = employeeName;
      } else {
        // Try to find the employee in current employee items if employeeNames is not available or too short
        const employee = currentEmployeeItems.find((item: any) => item.id === id);
        if (employee) {
          nameToUse = `${employee.firstname} ${employee.lastname}`;
        }
      }
      
      return createEmployeeFromName(id, nameToUse);
    });
  }, [isMulti, employeeNames, employeeName]);

  {/* Load persistent selections */}
  useEffect(() => {
    if (!formValue || (isMulti && !Array.isArray(formValue)) || (!isMulti && !formValue)) {
      setPersistentSelections([]);
      return;
    }

    const idsToFind = isMulti ? formValue : [formValue];
    const hasNames = (isMulti && employeeNames && employeeNames.length > 0) || (!isMulti && employeeName);

    // Use consistent logic for both cases
    const currentData = (debouncedSearch && debouncedSearch.length >= 2) 
      ? (employeeData?.records || []) 
      : cachedEmployeeItems;
    
    const newSelections = idsToFind.map((id: any) => {
      // First try to find in existing persistent selections to maintain names
      const existingPersistent = persistentSelections.find((emp: any) => emp.id === id);
      if (existingPersistent) return existingPersistent;
      
      // Then try to find in current employee items
      const employee = currentData.find((item: any) => item.id === id);
      if (employee) return employee;
      
      // Try to find in cache
      const cachedEmployee = getEmployeeFromCache(id);
      if (cachedEmployee) return cachedEmployee;
      
      // If we have employeeNames, try to get the name
      if (hasNames) {
        if (isMulti) {
          const idIndex = idsToFind.findIndex((empId: any) => empId === id);
          if (idIndex >= 0 && employeeNames && employeeNames[idIndex]) {
            return createEmployeeFromName(id, employeeNames[idIndex]);
          }
        } else {
          // For single select, use employeeName directly
          if (employeeName) {
            return createEmployeeFromName(id, employeeName);
          }
        }
      }
      
      // Fallback to generic name
      return createEmployeeFromName(id, `Employee ${id}`);
    });
    
    setPersistentSelections(newSelections);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue, name, isMulti, queryClient, employeeName, employeeNames, getEmployeeFromCache, getEmployeesWithNames, debouncedSearch, employeeData?.records, cachedEmployeeItems]);

  {/* Update selections when new data fetched */}
  useEffect(() => {
    if (employeeData?.records && formValue) {
      const idsToFind = isMulti ? formValue : [formValue];
      const foundEmployees = employeeData.records.filter((emp: any) => idsToFind.includes(emp.id));
      
      if (foundEmployees.length > 0) {
        setPersistentSelections(prev => {
          const newSelections = [...prev];
          foundEmployees.forEach((emp: any) => {
            if (!newSelections.some((existing: any) => existing.id === emp.id)) {
              newSelections.push(emp);
            }
          });
          return newSelections;
        });
      }
    }
  }, [employeeData, formValue, isMulti]);

  {/* Create select options */}
  const selectOptions = useMemo(() => {
    // Show loading option when debouncing
    if (employeeSearch && employeeSearch.length >= 2 && isDebouncing) {
      return [{
        value: 'loading',
        label: 'Searching employees...',
        isLoading: true,
      } as any];
    }

    if (!employeeItems?.length) return [];

    const filtered = employeeItems.filter((item: any) => !excludeValues.includes(item.id));
    const limitedItems = filtered.slice(0, employeeLimit);
    
    const options = limitedItems.map((item: any) => ({
      value: item.id,
      label: `${item.firstname} ${item.lastname}`,
      department: item.department,
      position: item.position,
      address: item.address,
      gender: item.gender,
    }));

    if (filtered.length > employeeLimit) {
      options.push({
        value: 'show_more',
        label: `${filtered.length - employeeLimit} remaining`,
        isShowMore: true,
      } as any);
    }

    return options;
  }, [employeeItems, excludeValues, employeeLimit, employeeSearch, isDebouncing]);

  {/* Show more handler */}
  useEffect(() => {
    const handleShowMore = () => {
      setEmployeeLimit(prev => prev + 50);
      setTimeout(() => setIsMenuOpen(true), 100);
    };
    document.addEventListener('showMoreEmployees', handleShowMore);
    return () => document.removeEventListener('showMoreEmployees', handleShowMore);
  }, []);

  {/* Sync selections with form order */}
  useEffect(() => {
    if (!isMulti) {
      if (!formValue && persistentSelections.length > 0) {
        setPersistentSelections([]);
      }
      return;
    }

    if (formValue?.length > 0) {
      const persistentMap = new Map(persistentSelections.map((emp: any) => [emp.id, emp]));
      const reorderedSelections = formValue
        .map((id: any) => persistentMap.get(id))
        .filter(Boolean);
      
      if (JSON.stringify(reorderedSelections.map((emp: any) => emp.id)) !== 
          JSON.stringify(persistentSelections.map((emp: any) => emp.id))) {
        setPersistentSelections(reorderedSelections);
      }
    } else if (persistentSelections.length > 0) {
      setPersistentSelections([]);
    }
  }, [formValue, name, isMulti, persistentSelections]);


  {/* Helper functions for value handling */}
  const getMultiSelectValue = (fieldValue: any) => {
    if (!fieldValue || !Array.isArray(fieldValue)) return [];
    
    const selectedOptions = selectOptions.filter((option: any) => fieldValue.includes(option.value));
    const missingOptions = fieldValue
      .filter((id: any) => !selectOptions.some((option: any) => option.value === id))
      .map((id: any) => {
        const employee = employeeItems?.find((item: any) => item.id === id);
        return employee ? {
          value: employee.id,
          label: `${employee.firstname} ${employee.lastname}`,
          department: employee.department,
          position: employee.position,
          address: employee.address,
          gender: employee.gender,
        } : null;
      })
      .filter(Boolean);
    
    return [...selectedOptions, ...missingOptions];
  };

  const getSingleSelectValue = (fieldValue: any) => {
    const selectedOption = selectOptions.find((option: any) => option.value === fieldValue);
    if (selectedOption) return selectedOption;
    
    if (fieldValue && employeeItems) {
      const employee = employeeItems.find((item: any) => item.id === fieldValue);
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
  };

  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        rules={required ? { required: "Please select an employee" } : rules}
        render={({ field, fieldState: { error: fieldError } }) => {
          const getValue = () => isMulti ? getMultiSelectValue(field.value) : getSingleSelectValue(field.value);

          return (
            <Select
              className={isMulti ? "basic-multi-select" : "basic-single-select"}
              classNamePrefix="select"
              options={selectOptions}
              value={getValue()}
              menuIsOpen={isMenuOpen}
              onMenuOpen={() => setIsMenuOpen(true)}
              onMenuClose={() => setIsMenuOpen(false)}
              isDisabled={disabled}
              onInputChange={(inputValue) => {
                // Update search term when user types
                setEmployeeSearch(inputValue);
                // Reset limit when searching
                setEmployeeLimit(50);
              }}
              noOptionsMessage={({ inputValue }) => {
                // Show loading state while debouncing
                if (inputValue && inputValue.length >= 2 && isDebouncing) {
                  return (
                    <div className="px-3 py-4 text-center">
                      <LoadingSpinner 
                        size="sm" 
                        color="yellow" 
                        text="Searching employees..." 
                        showText={true}
                        className="py-2"
                      />
                    </div>
                  );
                }
                
                if (inputValue && inputValue.length >= 2) {
                  return (
                    <div className="px-3 py-4 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">No employees found for &quot;{inputValue}&quot;</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Try searching by <span className="font-medium">first name</span>, <span className="font-medium">last name</span>, <span className="font-medium">position</span>, or <span className="font-medium">department</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="px-3 py-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">Type to search employees</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Search by <span className="font-medium">first name</span>, <span className="font-medium">last name</span>, <span className="font-medium">position</span>, or <span className="font-medium">department</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }}
              onChange={(selectedOption: any) => {
                if (isMulti) {
                  if (selectedOption?.some((item: any) => item.value === 'show_more' || item.value === 'loading')) return;
                  
                  const isClearAction = !selectedOption || selectedOption.length === 0;
                  
                  if (isClearAction) {
                    setPersistentSelections([]);
                  } else {
                    const filteredOptions = selectedOption.filter((option: any) => option.value !== 'show_more');
                    const selectedIds = filteredOptions.map((option: any) => option.value);
                    
                    // Use the same logic as initial load - prioritize employeeNames if available
                    const hasNames = (isMulti && employeeNames && employeeNames.length > 0) || (!isMulti && employeeName);
                    
                    // Always use the same logic for both cases to ensure consistency
                    const newSelections = filteredOptions.map((option: any) => {
                      // First try to find in existing persistent selections to maintain names
                      const existingPersistent = persistentSelections.find((emp: any) => emp.id === option.value);
                      if (existingPersistent) return existingPersistent;
                      
                      // Then try to find in current employee items
                      const employee = employeeItems.find((item: any) => item.id === option.value);
                      if (employee) return employee;
                      
                      // If we have employeeNames and this is a new selection, try to get the name
                      if (hasNames) {
                        if (isMulti) {
                          const formValueArray = isMulti ? formValue : [formValue];
                          const idIndex = formValueArray.findIndex((id: any) => id === option.value);
                          if (idIndex >= 0 && employeeNames && employeeNames[idIndex]) {
                            return createEmployeeFromName(option.value, employeeNames[idIndex]);
                          }
                        } else {
                          // For single select, use employeeName directly
                          if (employeeName) {
                            return createEmployeeFromName(option.value, employeeName);
                          }
                        }
                      }
                      
                      // Fallback to generic name
                      return createEmployeeFromName(option.value, `Employee ${option.value}`);
                    });
                    setPersistentSelections(newSelections);
                  }
                  
                  const fieldOnChange = selectedOption ? selectedOption.map((item: any) => item.value) : [];
                  onChange?.(selectedOption);
                  field.onChange(fieldOnChange);
                } else {
                  if (selectedOption?.value === 'show_more' || selectedOption?.value === 'loading') return;
                  
                  if (selectedOption) {
                    const employee = employeeItems.find((item: any) => item.id === selectedOption.value);
                    if (employee) setPersistentSelections([employee]);
                  } else {
                    setPersistentSelections([]);
                  }
                  
                  const fieldOnChange = selectedOption ? selectedOption.value : '';
                  onChange?.(selectedOption);
                  field.onChange(fieldOnChange);
                  
                  if (selectedOption && !selectedOption.isShowMore) {
                    setEmployeeSearch(selectedOption.label);
                    setEmployeeSelected?.(true);
                    setIsMenuOpen(false);
                  } else {
                    setEmployeeSearch('');
                    setEmployeeSelected?.(false);
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
            />
          );
        }}
      />
    </div>
  );
}