import React, { Fragment, useState, useEffect, useRef, useMemo } from 'react';

import 'react-quill/dist/quill.snow.css';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon, StarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import useSetPrimaryEmployee from '../hooks/useSetPrimaryEmployee';
import useGetPositionEmployees from '../hooks/useGetPositionEmployees';
import useGetPositionEmployeesAutocomplete from '../hooks/useGetPositionEmployeesAutocomplete';

import PlaceholderPicture from '@/svg/PlaceholderPicture';

import { Employee, PositionDetailsModalProps } from '../types';

const PositionDetailsModal: React.FC<PositionDetailsModalProps> = ({ 
  data, 
  primaryEmployee, 
  isVisible,
  onClose,
  departmentFilter
}) => {
  const setPrimaryEmployeeMutation = useSetPrimaryEmployee();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Search state
  const [pendingSearch, setPendingSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  
  // Autocomplete state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [shouldShowAutocomplete, setShouldShowAutocomplete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [autocompleteLimit, setAutocompleteLimit] = useState(50);
  const autocompleteRef = useRef<HTMLUListElement>(null);

  // Debounce search input for autocomplete (2 seconds like employee list)
  useEffect(() => {
    // Set debouncing state when user is typing
    if (pendingSearch && pendingSearch.length >= 2) {
      setIsDebouncing(true);
    } else {
      setIsDebouncing(false);
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(pendingSearch);
      setIsDebouncing(false);
    }, 2000); // 2000ms delay (2 seconds)

    return () => {
      clearTimeout(timer);
    };
  }, [pendingSearch]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isVisible) {
      setPendingSearch('');
      setAppliedSearch('');
      setDebouncedSearch('');
      setCurrentPage(1);
      setShowAutocomplete(false);
      setShouldShowAutocomplete(false);
      setSelectedIndex(-1);
      setAutocompleteLimit(50);
    }
  }, [isVisible]);

  // Function to scroll selected item into view
  const scrollToSelectedItem = (index: number) => {
    if (autocompleteRef.current && index >= 0) {
      const selectedElement = autocompleteRef.current.children[index] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
        });
      }
    }
  };

  // Memoize autocomplete filters
  const autocompleteFilters = useMemo(() => {
    // Only return search params to load 500 employees when autocomplete is active
    // Only filter by search when shouldShowAutocomplete is true
    if (shouldShowAutocomplete && debouncedSearch && debouncedSearch.length >= 2) {
      return {
        search: debouncedSearch,
        current_page: 1,
        page_size: 500
      };
    }
    // Return empty search to load all 500 employees when autocomplete is shown
    return shouldShowAutocomplete ? {
      search: '',
      current_page: 1,
      page_size: 500
    } : null;
  }, [debouncedSearch, shouldShowAutocomplete]);

  // Fetch main paginated employees when modal is open
  const { 
    data: employeesData, 
    isLoading: isLoadingEmployees 
  } = useGetPositionEmployees({
    orgStructureId: data.id,
    page: currentPage,
    pageSize: pageSize,
    search: appliedSearch,
    enabled: isVisible,
  });

  // Fetch autocomplete results separately (for dropdown) - loads 500 employees
  const {
    data: autocompleteData,
    isLoading: isAutocompleteLoading
  } = useGetPositionEmployeesAutocomplete({
    orgStructureId: data.id,
    filters: autocompleteFilters,
  });

  // Use paginated employees if available, otherwise fallback to data.employees
  let employeesToDisplay = employeesData?.employees || data.employees || [];
  const pagination = employeesData?.pagination;
  let autocompleteResults = autocompleteData?.records || [];
  
  // Apply department filter to employees if specified
  if (departmentFilter && departmentFilter !== 'ALL') {
    employeesToDisplay = employeesToDisplay.filter((emp: Employee) => 
      emp.department?.toLowerCase() === departmentFilter.toLowerCase()
    );
    autocompleteResults = autocompleteResults.filter((emp: Employee) => 
      emp.department?.toLowerCase() === departmentFilter.toLowerCase()
    );
  }

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

  const handleSetPrimary = async (employeeId: number) => {
    const orgStructureId = typeof data.id === 'string' ? parseInt(data.id, 10) : data.id;
    
    try {
      await setPrimaryEmployeeMutation.mutateAsync({
        orgStructureId: orgStructureId,
        employeeId: employeeId
      });
      
      toast.custom(() => <CustomToast message='Employee will now be displayed in the org chart.' type='success' />, {
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error setting primary employee:', error);
      toast.custom(() => <CustomToast message={error.message || 'Failed to update chart display'} type='error' />, {
        duration: 5000,
      });
    }
  };

  // Pagination handlers
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // Search handler
  const handleSearch = () => {
    setAppliedSearch(pendingSearch);
    setCurrentPage(1);
  };

  const handleMagnifyingGlassClick = () => {
    handleSearch();
    setShowAutocomplete(false);
    setShouldShowAutocomplete(false);
    setSelectedIndex(-1);
  };

  return (
    <Transition.Root show={isVisible} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-full max-w-4xl">
                {/* Header */}
                <div className="flex bg-savoy-blue p-4 items-center rounded-t-lg">
                  <h3 className="flex-1 text-white ml-2 font-semibold text-lg">
                    {data.position_name}
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={onClose}
                  />
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Primary Employee Info - Only show if matches department filter */}
                  {primaryEmployee && (!departmentFilter || departmentFilter === 'ALL' || primaryEmployee.department?.toLowerCase() === departmentFilter.toLowerCase()) && (
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border-2 border-savoy-blue overflow-hidden flex-shrink-0">
                        {primaryEmployee.photo ? (
                          <img
                            src={primaryEmployee.photo}
                            alt={`${primaryEmployee.firstname} ${primaryEmployee.lastname}`}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const placeholder = target.nextElementSibling as HTMLElement;
                              if (placeholder) placeholder.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full flex items-center justify-center ${primaryEmployee.photo ? 'hidden' : 'block'}`}
                        >
                          <PlaceholderPicture 
                            gender={getAvatarType(primaryEmployee)} 
                            fillColor="#3B82F6" 
                            width={32} 
                            height={32}
                            style={{ opacity: 0.5 }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800">
                          {primaryEmployee.firstname} {primaryEmployee.lastname}
                        </h4>
                        {primaryEmployee.department && (
                          <p className="text-sm text-gray-700 font-medium">{primaryEmployee.department}</p>
                        )}
                        <p className="text-sm text-blue-700 font-medium">Displayed in Org Chart</p>
                        <p className="text-sm text-gray-500">{primaryEmployee.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {data.description && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Position Description</h4>
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        <div 
                          className="ql-editor"
                          dangerouslySetInnerHTML={{ __html: data.description }}
                        />
                      </div>
                    </div>
                  )}

                  {/* All Employees */}
                    <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {departmentFilter && departmentFilter !== 'ALL' 
                          ? `${departmentFilter} Employees (${employeesToDisplay.length})`
                          : pagination ? `All Employees (${pagination.totalRecords})` : 'Employees'
                        }
                      </h4>
                      
                      {/* Search Bar */}
                      <div className="flex items-center gap-2 flex-1 max-w-xs ml-4">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            name="employee-search"
                            placeholder="Search..."
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            value={pendingSearch}
                            onChange={(e) => {
                              setPendingSearch(e.target.value);
                              setShowAutocomplete(true);
                              setShouldShowAutocomplete(true);
                              setSelectedIndex(-1);
                            }}
                            onFocus={() => {
                              setShowAutocomplete(true);
                              setShouldShowAutocomplete(true);
                            }}
                            onBlur={() => {
                              setTimeout(() => {
                                setShowAutocomplete(false);
                                setShouldShowAutocomplete(false);
                                setSelectedIndex(-1);
                                setAutocompleteLimit(50);
                              }, 100);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                if (showAutocomplete && selectedIndex >= 0 && autocompleteResults) {
                                  // Handle autocomplete selection with Enter
                                  const displayItems = autocompleteResults.slice(0, autocompleteLimit);
                                  const totalAutocompleteRecords = autocompleteData?.total_records || autocompleteResults.length;
                                  const hasMoreResults = totalAutocompleteRecords > autocompleteLimit;
                                  
                                  if (selectedIndex === displayItems.length && hasMoreResults) {
                                    e.preventDefault();
                                    setAutocompleteLimit(prev => prev + 50);
                                    setSelectedIndex(displayItems.length + 50);
                                  } else if (displayItems[selectedIndex]) {
                                    const item = displayItems[selectedIndex];
                                    const newSearchTerm = `${item.firstname} ${item.lastname}`.trim();
                                    setPendingSearch(newSearchTerm);
                                    setAppliedSearch(newSearchTerm);
                                  }
                                  setShowAutocomplete(false);
                                  setShouldShowAutocomplete(false);
                                  setSelectedIndex(-1);
                                } else {
                                  // Perform main search
                                  handleSearch();
                                  setShowAutocomplete(false);
                                  setShouldShowAutocomplete(false);
                                }
                              } else if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                if (showAutocomplete && autocompleteResults) {
                                  const displayItems = autocompleteResults.slice(0, autocompleteLimit);
                                  const totalAutocompleteRecords = autocompleteData?.total_records || autocompleteResults.length;
                                  const hasMoreResults = totalAutocompleteRecords > autocompleteLimit;
                                  const maxIndex = displayItems.length + (hasMoreResults ? 1 : 0) - 1;
                                  const newIndex = selectedIndex < maxIndex ? selectedIndex + 1 : selectedIndex;
                                  setSelectedIndex(newIndex);
                                  scrollToSelectedItem(newIndex);
                                }
                              } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                if (showAutocomplete) {
                                  const newIndex = selectedIndex > 0 ? selectedIndex - 1 : -1;
                                  setSelectedIndex(newIndex);
                                  if (newIndex >= 0) {
                                    scrollToSelectedItem(newIndex);
                                  }
                                }
                              } else if (e.key === 'Escape') {
                                setShowAutocomplete(false);
                                setSelectedIndex(-1);
                              }
                            }}
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                          
                          {/* Autocomplete Dropdown */}
                          {showAutocomplete && shouldShowAutocomplete && (() => {
                            // Show loading state while debouncing or API loading
                            if (pendingSearch && pendingSearch.length >= 2 && (isDebouncing || isAutocompleteLoading)) {
                              return (
                                <ul 
                                  ref={autocompleteRef}
                                  className="absolute left-0 top-full mt-1 z-10 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-y-auto shadow-lg"
                                  onMouseDown={(e) => e.preventDefault()}
                                >
                                  <li className="px-3 py-4 text-center">
                                    <LoadingSpinner 
                                      size="sm" 
                                      color="yellow" 
                                      text="Searching employees..." 
                                      showText={true}
                                      className="py-2"
                                    />
                                  </li>
                                </ul>
                              );
                            }

                            // Show results if available
                            if (autocompleteResults && autocompleteResults.length > 0) {
                              const totalAutocompleteRecords = autocompleteData?.total_records || autocompleteResults.length;
                              const hasMoreResults = totalAutocompleteRecords > autocompleteLimit;
                              const displayItems = autocompleteResults.slice(0, autocompleteLimit);
                              
                              return (
                                <ul 
                                  ref={autocompleteRef}
                                  className="absolute left-0 top-full mt-1 z-10 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-y-auto shadow-lg"
                                  onMouseDown={(e) => e.preventDefault()}
                                >
                                  {displayItems.map((item: Employee, index: number) => (
                                    <li
                                      key={item.id}
                                      className={`px-3 py-2 cursor-pointer ${
                                        index === selectedIndex 
                                          ? 'bg-blue-100' 
                                          : 'hover:bg-blue-100'
                                      }`}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                      }}
                                      onMouseEnter={() => setSelectedIndex(index)}
                                      onClick={() => {
                                        const newSearchTerm = `${item.firstname} ${item.lastname}`.trim();
                                        setPendingSearch(newSearchTerm);
                                        setAppliedSearch(newSearchTerm);
                                        setShowAutocomplete(false);
                                        setSelectedIndex(-1);
                                      }}
                                    >
                                      <div className="flex flex-col">
                                        <span className="font-medium">{item.firstname} {item.lastname}</span>
                                        {item.department && (
                                          <span className="text-xs text-gray-600 font-medium">• {item.department}</span>
                                        )}
                                        <span className="text-xs text-gray-500">• {item.email}</span>
                                      </div>
                                    </li>
                                  ))}
                                  {hasMoreResults && (
                                    <li
                                      className={`px-3 py-2 cursor-pointer border-t border-gray-200 ${
                                        selectedIndex === displayItems.length 
                                          ? 'bg-blue-100' 
                                          : 'bg-gray-50 hover:bg-gray-100'
                                      }`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setAutocompleteLimit(prev => prev + 50);
                                        setSelectedIndex(displayItems.length + 50);
                                      }}
                                      onMouseEnter={() => setSelectedIndex(displayItems.length)}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                      }}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                          Show 50 more results
                                        </span>
                                        <span className="text-sm text-gray-600 font-medium">
                                          Click to load more
                                        </span>
                                      </div>
                                    </li>
                                  )}
                                </ul>
                              );
                            }

                            // Show no results state only when searching with 2+ characters
                            if (pendingSearch && pendingSearch.length >= 2 && autocompleteResults?.length === 0) {
                              return (
                                <ul 
                                  ref={autocompleteRef}
                                  className="absolute left-0 top-full mt-1 z-10 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-y-auto shadow-lg"
                                  onMouseDown={(e) => e.preventDefault()}
                                >
                                  <li className="px-3 py-4 text-center">
                                    <div className="flex flex-col items-center space-y-2">
                                      <div className="text-sm text-gray-600">
                                        <p className="font-medium">No employees found</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          Try searching with different keywords
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              );
                            }

                            return null;
                          })()}
                        </div>
                        <button
                          className="bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-100 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            handleMagnifyingGlassClick();
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {isLoadingEmployees ? (
                      <div className="text-center p-8">
                        <LoadingSpinner 
                          size="lg" 
                          color="yellow" 
                          text={appliedSearch ? 'Searching employees...' : 'Loading employees...'} 
                          showText={true}
                        />
                      </div>
                    ) : employeesToDisplay.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {employeesToDisplay.map((employee, index) => {
                          const avatarType = getAvatarType(employee);
                          const isPrimary = primaryEmployee?.id === employee.id;
                          return (
                            <div key={employee.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              {/* Employee Avatar */}
                              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-savoy-blue overflow-hidden flex-shrink-0">
                                {employee.photo ? (
                                  <img
                                    src={employee.photo}
                                    alt={`${employee.firstname} ${employee.lastname}`}
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => {
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
                                    fillColor="#3B82F6" 
                                    width={24} 
                                    height={24}
                                    style={{ opacity: 0.5 }}
                                  />
                                </div>
                              </div>
                              
                              {/* Employee Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-sm font-medium text-gray-800 truncate">
                                    {employee.firstname} {employee.lastname}
                                  </h5>
                                  {isPrimary && (
                                    <span className="text-blue-700 text-xs font-medium bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                                      <StarIcon className="w-3 h-3" />
                                      Chart Display
                                    </span>
                                  )}
                                </div>
                                {employee.department && (
                                  <p className="text-xs text-gray-600 font-medium truncate">
                                    {employee.department}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 truncate">{employee.email}</p>
                                <p className="text-xs text-gray-400 truncate">{employee.mobile}</p>
                              </div>

                              {/* Display in Chart Button */}
                              {!isPrimary && (
                                <button
                                  onClick={() => handleSetPrimary(employee.id)}
                                  disabled={setPrimaryEmployeeMutation.isLoading}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                  title="Display this employee in the organizational chart"
                                >
                                  <StarIcon className="w-3.5 h-3.5" />
                                  Display in Chart
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                        {/* Pagination - Always visible */}
                        {pagination && (
                          <Pagination
                            pagination={pagination}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            onPageSizeChange={handlePageSizeChange}
                            onPageChange={handlePageChange}
                          />
                        )}
                      </>
                    ) : (
                      <div className="text-center p-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">
                          {appliedSearch 
                            ? `No employees found matching "${appliedSearch}"`
                            : 'No employees assigned to this position'
                          }
                        </p>
                    </div>
                  )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PositionDetailsModal;
