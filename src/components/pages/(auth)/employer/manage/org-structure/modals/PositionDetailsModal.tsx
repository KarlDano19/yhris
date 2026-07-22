import React, { Fragment, useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useQueryClient } from '@tanstack/react-query';

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XCircleIcon, StarIcon, MagnifyingGlassIcon, UserPlusIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import ConfirmModal from '@/components/ConfirmModal';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import useGetEmployeePaginatedSelect from '@/components/hooks/useGetEmployeePaginatedSelect';
import useSetPrimaryEmployee from '../hooks/useSetPrimaryEmployee';
import useGetPositionEmployees from '../hooks/useGetPositionEmployees';
import useGetPositionEmployeesAutocomplete from '../hooks/useGetPositionEmployeesAutocomplete';
import { normalizeNbsp } from '@/helpers/linkify';
import useAssignEmployeeToNode from '../hooks/useAssignEmployeeToNode';
import useUnassignEmployeeFromNode from '../hooks/useUnassignEmployeeFromNode';

import PlaceholderPicture from '@/svg/PlaceholderPicture';

import { Employee, PositionDetailsModalProps } from '../types';

const PositionDetailsModal: React.FC<PositionDetailsModalProps> = ({
  data,
  primaryEmployee,
  isVisible,
  onClose,
  onBack,
  departmentFilter
}) => {
  const setPrimaryEmployeeMutation = useSetPrimaryEmployee();
  const assignEmployeeMutation = useAssignEmployeeToNode();
  const unassignEmployeeMutation = useUnassignEmployeeFromNode();

  const isManualAssignment = !!data.is_manual_assignment;

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

  // Assign-employee search state (manual mode only). Scoped to the nearest
  // Department ancestor's employees when this node sits under one; otherwise
  // searches company-wide.
  const [assignSearch, setAssignSearch] = useState('');
  const [showAssignResults, setShowAssignResults] = useState(false);
  const assignInputRef = useRef<HTMLInputElement>(null);
  const [assignDropdownPosition, setAssignDropdownPosition] = useState({ top: -9999, left: -9999, width: 0 });
  const { data: assignSearchData, isLoading: isAssignSearchLoading } = useGetEmployeePaginatedSelect(
    showAssignResults
      ? { search: assignSearch, page_size: 50, department_id: data.nearest_department_id || undefined }
      : null
  );
  const assignSearchResults = assignSearchData?.records || [];

  // Confirmation gate for assigning an employee who already holds a manual
  // assignment on a different occurrence of this same shared position.
  const [pendingAssignment, setPendingAssignment] = useState<{ id: number; name: string; fromLabel?: string } | null>(null);
  // Keeps showing the last assignment's details while the confirm modal is
  // animating closed, instead of going blank the instant pendingAssignment is cleared.
  const [displayedAssignment, setDisplayedAssignment] = useState<{ id: number; name: string; fromLabel?: string } | null>(null);
  useEffect(() => {
    if (pendingAssignment) setDisplayedAssignment(pendingAssignment);
  }, [pendingAssignment]);
  const queryClient = useQueryClient();

  // Looks for another org structure node (anywhere in the tree) that shares
  // this node's Position and already has the given employee manually
  // assigned to it - so we can warn before silently moving them here.
  const findExistingAssignmentNode = (employeeId: number): any => {
    const tree = queryClient.getQueryData<any[]>(['orgStructureManageCache']);
    if (!tree) return null;

    const search = (nodes: any[]): any => {
      for (const node of nodes) {
        if (
          node.id !== data.id &&
          node.is_manual_assignment &&
          node.position === data.position &&
          (node.primary_employee?.id === employeeId || node.employees?.some((emp: any) => emp.id === employeeId))
        ) {
          return node;
        }
        if (node.children?.length) {
          const found = search(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    return search(tree);
  };

  // Keep the assign-employee dropdown positioned against the input's viewport
  // rect (rendered via portal) so it isn't clipped by the modal's overflow.
  const updateAssignDropdownPosition = () => {
    if (assignInputRef.current) {
      const rect = assignInputRef.current.getBoundingClientRect();
      setAssignDropdownPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  };

  useEffect(() => {
    if (!showAssignResults) return;
    updateAssignDropdownPosition();

    window.addEventListener('scroll', updateAssignDropdownPosition, true);
    window.addEventListener('resize', updateAssignDropdownPosition);
    return () => {
      window.removeEventListener('scroll', updateAssignDropdownPosition, true);
      window.removeEventListener('resize', updateAssignDropdownPosition);
    };
  }, [showAssignResults]);

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
      setAssignSearch('');
      setShowAssignResults(false);
      setPendingAssignment(null);
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

  const handleAssignEmployee = async (employeeId: number) => {
    try {
      await assignEmployeeMutation.mutateAsync({ orgStructureId: data.id, employeeId });

      toast.custom(() => <CustomToast message='Employee assigned to this position.' type='success' />, {
        duration: 3000,
      });
      setAssignSearch('');
      setShowAssignResults(false);
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error.message || 'Failed to assign employee'} type='error' />, {
        duration: 5000,
      });
    }
  };

  const handleUnassignEmployee = async (employeeId: number) => {
    try {
      await unassignEmployeeMutation.mutateAsync({ orgStructureId: data.id, employeeId });

      toast.custom(() => <CustomToast message='Employee removed from this position.' type='success' />, {
        duration: 3000,
      });
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error.message || 'Failed to unassign employee'} type='error' />, {
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
    <>
    <Transition show={isVisible} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className={`relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-full ${isManualAssignment ? 'max-w-lg' : 'max-w-4xl'}`}>
                {/* Header */}
                <div className="flex bg-savoy-blue p-4 items-center rounded-t-lg">
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="mr-1 p-1 rounded-full hover:bg-white/10 transition-colors"
                      data-tooltip-id="back-to-actions-tooltip"
                      data-tooltip-content="Back"
                      data-tooltip-place="bottom"
                    >
                      <ArrowLeftIcon className="w-6 h-6 text-white" />
                    </button>
                  )}
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
                  {/* Description */}
                  {data.description && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Position Description</h4>
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        <div
                          className="ql-editor"
                          dangerouslySetInnerHTML={{ __html: normalizeNbsp(data.description || '') }}
                        />
                      </div>
                    </div>
                  )}

                  {isManualAssignment ? (
                    /* Manually-assigned (reused) position: a single labeled assign field
                       followed by a clearly separated "Currently assigned" section, instead
                       of duplicating the assigned employee in an "All Employees" list. */
                    <div>
                      <p className="text-xs text-gray-500 mb-4">
                        This position appears more than once in the org chart. Assign an employee to this box without changing their official position.
                        {data.nearest_department_name && (
                          <> Showing employees from <span className="font-medium">{data.nearest_department_name}</span>.</>
                        )}
                      </p>

                      <label htmlFor="assign-employee-input" className="block text-sm font-semibold text-gray-800 mb-2">
                        Assign an employee to this position
                      </label>
                      <div className="relative max-w-md">
                        <UserPlusIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                        <input
                          id="assign-employee-input"
                          ref={assignInputRef}
                          type="text"
                          placeholder="Search by name, position, or department..."
                          autoComplete="off"
                          value={assignSearch}
                          onChange={(e) => {
                            setAssignSearch(e.target.value);
                            setShowAssignResults(true);
                          }}
                          onFocus={() => setShowAssignResults(true)}
                          onBlur={() => setTimeout(() => setShowAssignResults(false), 150)}
                          className="block w-full rounded-md border border-blue-200 bg-blue-50/60 py-2 pl-10 pr-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:border-blue-600 sm:text-sm sm:leading-6"
                        />
                        {showAssignResults && typeof document !== 'undefined' && createPortal(
                          <ul
                            className="fixed z-[9999] bg-white border border-gray-300 rounded-md max-h-60 overflow-y-auto shadow-lg"
                            style={{
                              top: assignDropdownPosition.top,
                              left: assignDropdownPosition.left,
                              width: assignDropdownPosition.width,
                            }}
                          >
                            {isAssignSearchLoading ? (
                              <li className="px-3 py-4 text-center">
                                <LoadingSpinner size="sm" color="yellow" text="Searching employees..." showText className="py-2" />
                              </li>
                            ) : assignSearchResults.length > 0 ? (
                              assignSearchResults.map((item: any) => {
                                const existingNode = findExistingAssignmentNode(item.id);
                                // Where that other occurrence sits (nearest Department ancestor,
                                // falling back to its parent node's position) - the shared Position
                                // name itself (e.g. "CISO") is always the same as this node's, so it
                                // adds nothing on its own and would read as if it were a different position.
                                const existingLocation = existingNode
                                  ? existingNode.nearest_department_name || existingNode.parent_position_name
                                  : null;

                                return (
                                <li
                                  key={item.id}
                                  className="px-3 py-2 cursor-pointer hover:bg-blue-100 flex items-center justify-between"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    if (existingNode) {
                                      setPendingAssignment({
                                        id: item.id,
                                        name: `${item.firstname || item.label} ${item.lastname || ''}`.trim(),
                                        fromLabel: existingLocation || undefined,
                                      });
                                      setAssignSearch('');
                                      setShowAssignResults(false);
                                    } else {
                                      handleAssignEmployee(item.id);
                                    }
                                  }}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">{item.firstname || item.label} {item.lastname || ''}</span>
                                    {(item.position || item.department) && (
                                      <span className="text-xs text-gray-600">
                                        • {[item.position, item.department].filter(Boolean).join(' | ')}
                                      </span>
                                    )}
                                    {existingNode && (
                                      <span className="text-xs text-amber-600 font-medium">
                                        Currently assigned to {data.position_name}
                                        {existingLocation ? ` under ${existingLocation}` : ''}
                                      </span>
                                    )}
                                  </div>
                                  <UserPlusIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                </li>
                                );
                              })
                            ) : (
                              <li className="px-3 py-4 text-center text-sm text-gray-500">No employees found</li>
                            )}
                          </ul>,
                          document.body
                        )}
                      </div>

                      <div className="my-6 border-t border-gray-200" />

                      <h4 className="text-sm font-semibold text-gray-800 mb-3">Currently assigned</h4>
                      {primaryEmployee ? (
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
                          <button
                            onClick={() => handleUnassignEmployee(primaryEmployee.id)}
                            disabled={unassignEmployeeMutation.isLoading}
                            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
                            data-tooltip-id="unassign-employee-tooltip"
                            data-tooltip-content="Unassign this employee from this position"
                            data-tooltip-place="top"
                          >
                            <XMarkIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                          <p className="text-gray-500 text-sm">No employee is currently assigned to this position</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
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

                    {/* Assign Employee search - available for ANY position with nobody currently
                        assigned (assigning replaces the current one if there is one) */}
                    {!primaryEmployee && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">
                          Assign a specific employee to this position without changing their official position.
                          {data.nearest_department_name && (
                            <> Showing employees from <span className="font-medium">{data.nearest_department_name}</span>.</>
                          )}
                        </p>
                        <div className="relative max-w-md">
                          <input
                            ref={assignInputRef}
                            type="text"
                            placeholder="Search employees to assign..."
                            autoComplete="off"
                            value={assignSearch}
                            onChange={(e) => {
                              setAssignSearch(e.target.value);
                              setShowAssignResults(true);
                            }}
                            onFocus={() => setShowAssignResults(true)}
                            onBlur={() => setTimeout(() => setShowAssignResults(false), 150)}
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                          {showAssignResults && typeof document !== 'undefined' && createPortal(
                            <ul
                              className="fixed z-[9999] bg-white border border-gray-300 rounded-md max-h-60 overflow-y-auto shadow-lg"
                              style={{
                                top: assignDropdownPosition.top,
                                left: assignDropdownPosition.left,
                                width: assignDropdownPosition.width,
                              }}
                            >
                              {isAssignSearchLoading ? (
                                <li className="px-3 py-4 text-center">
                                  <LoadingSpinner size="sm" color="yellow" text="Searching employees..." showText className="py-2" />
                                </li>
                              ) : assignSearchResults.length > 0 ? (
                                assignSearchResults.map((item: any) => (
                                  <li
                                    key={item.id}
                                    className="px-3 py-2 cursor-pointer hover:bg-blue-100 flex items-center justify-between"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleAssignEmployee(item.id)}
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-medium">{item.firstname || item.label} {item.lastname || ''}</span>
                                      {(item.position || item.department) && (
                                        <span className="text-xs text-gray-600">
                                          • {[item.position, item.department].filter(Boolean).join(' | ')}
                                        </span>
                                      )}
                                    </div>
                                    <UserPlusIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                  </li>
                                ))
                              ) : (
                                <li className="px-3 py-4 text-center text-sm text-gray-500">No employees found</li>
                              )}
                            </ul>,
                            document.body
                          )}
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
                                  data-tooltip-id="display-in-chart-tooltip"
                                  data-tooltip-content="Display this employee in the organizational chart"
                                  data-tooltip-place="top"
                                >
                                  <StarIcon className="w-3.5 h-3.5" />
                                  Display in Chart
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                        {/* Pagination */}
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
                  </>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
      <Tooltip id="unassign-employee-tooltip" />
      <Tooltip id="display-in-chart-tooltip" />
      <Tooltip id="back-to-actions-tooltip" />
    </Transition>

    <ConfirmModal
      isOpen={!!pendingAssignment}
      setIsOpen={(open) => { if (!open) setPendingAssignment(null); }}
      isLoading={assignEmployeeMutation.isLoading}
      message={
        displayedAssignment ? (
          <>
            <span className="font-semibold text-savoy-blue">{displayedAssignment.name}</span> is already
            assigned to <span className="font-semibold text-savoy-blue">{data.position_name}</span>
            {displayedAssignment.fromLabel ? <> under {displayedAssignment.fromLabel}</> : null}.
            <br />
            Move them here instead?
          </>
        ) : ''
      }
      confirmAction={async () => {
        if (pendingAssignment) {
          await handleAssignEmployee(pendingAssignment.id);
        }
        setPendingAssignment(null);
      }}
      cancelAction={() => setPendingAssignment(null)}
    />
    </>
  );
};

export default PositionDetailsModal;
