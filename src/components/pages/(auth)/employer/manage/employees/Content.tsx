'use client';

import React, { useEffect, useState, Fragment, useRef, useMemo } from 'react';

import Link from 'next/link';

import { Menu, Transition } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import classNames from '@/helpers/classNames';
import ImportModal from './modals/ImportModal';
import ExportProgressModal from './modals/ExportProgressModal';
import DataExportAgreementModal from './modals/DataExportAgreementModal';
import useGetEmployeeItemsList from './hooks/useGetEmployeeItems';
import useGetEmployeePaginatedSelect from '@/components/hooks/useGetEmployeePaginatedSelect';
import useGetLocationItems from '@/components/hooks/useGetLocationItems';
import useGetDepartmentItems from '@/components/hooks/useGetDepartmentItems';
import useGetPositionItems from '@/components/hooks/useGetPositionItems';
import useUpdateEmployerAgreeExport from './hooks/useUpdateEmployerAgreeExport';
import DeleteEmployeeDetailModal from './modals/DeleteEmployeeDetail';
import EditEmployeeDetailsModal from './modals/EditEmployeeDetailsModal';
import AddEmployeeModal from './modals/AddEmpoyeeModal';
import ExportTemplateModal from './modals/ExportTemplateModal';
import useGetEmployeeStatusItems from '@/components/hooks/useGetEmployeeStatusItems';
import BulkDeleteModal from '@/components/BulkDeleteModal';
import useBulkDeleteEmployees from './hooks/useBulkDeleteEmployees';

import { ArrowLeftIcon, MagnifyingGlassIcon, ChevronDownIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import { useLegacyPermissions } from '@/hooks/useLegacyPermissions';
import { useSmartMenuOptions } from '@/components/SmartPermissions/useSmartMenuOptions';


type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

const columnDefinitions = [
  { key: 'date_hired', label: 'Date Hired' },
  { key: 'system_id', label: 'System ID' },
  { key: 'employee_id', label: 'Employee ID' },
  { key: 'firstname', label: 'First Name' },
  { key: 'middlename', label: 'Middle Name' },
  { key: 'lastname', label: 'Last Name' },
  { key: 'location', label: 'Location' },
  { key: 'position', label: 'Position' },
  { key: 'department', label: 'Department' },
  { key: 'employment_status', label: 'Employment Status' },
  { key: 'email', label: 'Email' },
  { key: 'mobile', label: 'Contact No.' },
  { key: 'gender', label: 'Gender' },
  { key: 'address', label: 'Address' },
];

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isExportProgressModalOpen, setIsExportProgressModalOpen] = useState<boolean>(false);
  const [isAgreementAccepted, setIsAgreementAccepted] = useState<boolean>(false);
  const [isExportTemplateModalOpen, setIsExportTemplateModalOpen] = useState<boolean>(false);
  const [isEmployeesDeleteModalOpen, setIsEmployeesDeleteModalOpen] = useState<T_ModalData | null>(null);
  const [isEmployeesEditModalOpen, setIsEmployeesEditModalOpen] = useState<T_ModalData | null>(null);
  const cachedRights = useLegacyPermissions();

  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [isDataAgreementModalOpen, setIsDataAgreementModalOpen] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    date_hired: false,
    system_id: false,
    employee_id: false,
    firstname: true,
    middlename: true,
    lastname: true,
    location: true,
    position: true,
    department: true,
    employment_status: true,
    email: true,
    mobile: false,
    gender: false,
    address: false,
  });
  const [pendingFilter, setPendingFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const [appliedFilter, setAppliedFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [autocompleteLimit, setAutocompleteLimit] = useState(50);
  const [shouldShowAutocomplete, setShouldShowAutocomplete] = useState(false);
  const autocompleteRef = useRef<HTMLUListElement>(null);

  const {
    data: employeeListData,
    isLoading: isEmployeeListLoading,
    refetch: employeeListRefetch,
  } = useGetEmployeeItemsList({ ...appliedFilter, pageSize: pageSize, currentPage: currentPage });
  
  // Memoize the search parameters to prevent unnecessary re-renders
  const searchParams = useMemo(() => {
    // Always return search params to load 500 employees on initial render
    // Only filter by search when shouldShowAutocomplete is true
    if (shouldShowAutocomplete && debouncedSearch && debouncedSearch.length >= 2) {
      return {
        search: debouncedSearch,
        current_page: 1
      };
    }
    // Return empty search to load all 500 employees
    return {
      search: '',
      current_page: 1
    };
  }, [debouncedSearch, shouldShowAutocomplete]);

  const { data: autocompleteResults, refetch: autocompleteRefetch, isLoading: isAutocompleteLoading } = useGetEmployeePaginatedSelect(searchParams);
  const { data: locationItems } = useGetLocationItems();
  const { data: departmentItems } = useGetDepartmentItems();
  const { data: positionItems } = useGetPositionItems();
  const { data: employeeStatusItems } = useGetEmployeeStatusItems();

  const { mutate: updateEmployerAgreeExport } = useUpdateEmployerAgreeExport();
  const bulkDeleteMutation = useBulkDeleteEmployees();

  // Combined refetch function to refresh both main list and autocomplete data
  const refetchAllEmployeeData = async () => {
    await Promise.all([
      employeeListRefetch(),
      autocompleteRefetch()
    ]);
  };

  const cachedData: any = cachedProfile?.state?.data;
  const hasAgreed = cachedData?.is_export_agreed;

  const [selectedEmployees, setSelectedEmployees] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

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

  useEffect(() => {
    if (!hasAgreed) {
      setIsAgreementAccepted(true);
    }
  }, [hasAgreed]);

  // Debounce search input to prevent multiple API calls
  useEffect(() => {
    // Set debouncing state when user is typing
    if (pendingFilter.search && pendingFilter.search.length >= 2) {
      setIsDebouncing(true);
    } else {
      setIsDebouncing(false);
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(pendingFilter.search);
      setIsDebouncing(false); // Clear debouncing state when delay is done
    }, 2000); // 2000ms delay (2 seconds)

    return () => {
      clearTimeout(timer);
      // Don't clear debouncing state immediately on cleanup
    };
  }, [pendingFilter.search]);

  const menuOptions = [
    {
      id: 'download-template-btn',
      name: 'Download Template',
      action: () => {
        setIsExportTemplateModalOpen(true);
      },
    },
    {
      id: 'import-employee-btn',
      name: 'Import',
      action: () => {
        setIsImportModalOpen(true);
      },
    },
    {
      id: 'export-employee-btn',
      name: 'Export',
      action: () => {
        if (!hasAgreed) {
          setIsDataAgreementModalOpen(true);
        } else if (employeeListData && employeeListData.records.length > 0) {
          setIsExportProgressModalOpen(true);
        } else {
          toast.custom(() => <CustomToast message='No employee data available for export.' type='error' />, {
            duration: 5000,
          });
        }
      },
    },
  ];

  const smartMenuOptions = useSmartMenuOptions(menuOptions);

  useEffect(() => {
    // Add proper null/undefined checks
    if (employeeListData && employeeListData.records && Array.isArray(employeeListData.records)) {
      // Create a new array instead of mutating the original
      const formattedEmployees = employeeListData.records.map((employee: any) => ({
        ...employee,
        date_hired: Intl.DateTimeFormat('en-US').format(new Date(employee.date_hired))
      }));
      
      setEmployeeItems(formattedEmployees);
      setPagination({
        totalPages: employeeListData.total_pages || 1,
        totalRecords: employeeListData.total_records || 0,
      });
    } else {
      // Reset to empty state when data is invalid/undefined
      setEmployeeItems([]);
      setPagination({
        totalPages: 1,
        totalRecords: 0,
      });
    }
  }, [employeeListData]);

  useEffect(() => {
    employeeListRefetch();
  }, [appliedFilter, pageSize, currentPage, employeeListRefetch]);

  const handleSearch = () => {
    const dateFrom = Date.parse(pendingFilter.from);
    const dateTo = Date.parse(pendingFilter.to);
    if (dateFrom && !dateTo) {
      return toast.custom(() => <CustomToast message='Invalid date to.' type='error' />, { duration: 5000 });
    }
    if (!dateFrom && dateTo) {
      return toast.custom(() => <CustomToast message='Invalid date from.' type='error' />, { duration: 5000 });
    }
    if (dateFrom && dateTo && dateFrom > dateTo) {
      return toast.custom(
        () => <CustomToast message='You have entered an invalid date range. Please select again.' type='error' />,
        { duration: 5000 }
      );
    }
    setIsSearching(true);
    setAppliedFilter({ ...pendingFilter });
  };

  const handleMagnifyingGlassClick = () => {
    // Search button now just performs the main search
    handleSearch();
    setShowAutocomplete(false);
    setShouldShowAutocomplete(false);
    setSelectedIndex(-1);
  };

  useEffect(() => {
    if (!isEmployeeListLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isEmployeeListLoading, isSearching]);

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };
  const handleColumnToggle = (columnKey: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const handleColumnReset = () => {
    const defaultColumns: Record<string, boolean> = {
      date_hired: false,
      system_id: false,
      employee_id: false,
      firstname: true,
      middlename: true,
      lastname: true,
      location: true,
      position: true,
      department: true,
      employment_status: true,
      email: true,
      mobile: false,
      gender: false,
      address: false,
    };
    setVisibleColumns(defaultColumns);
  };

  const handleShowAll = () => {
    const allColumns: Record<string, boolean> = {
      date_hired: true,
      system_id: true,
      employee_id: true,
      firstname: true,
      middlename: true,
      lastname: true,
      location: true,
      position: true,
      department: true,
      employment_status: true,
      email: true,
      mobile: true,
      gender: true,
      address: true,
    };
    setVisibleColumns(allColumns);
  };

  // Handle individual employee selection
  const handleEmployeeSelect = (employeeId: number) => {
    setSelectedEmployees(prev => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!employeeItems) return;
    
    if (selectAll) {
      setSelectedEmployees(new Set());
    } else {
      const allIds = employeeItems.map((e: any) => e.id);
      setSelectedEmployees(new Set(allIds));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedEmployees.size === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const employeeIds = Array.from(selectedEmployees);
      await bulkDeleteMutation.mutateAsync(employeeIds);
      
      toast.custom(() => <CustomToast message={`${selectedEmployees.size} employee(s) deleted successfully.`} type="success" />, { duration: 3000 });
      setSelectedEmployees(new Set());
      setSelectAll(false);
      setIsBulkDeleteModalOpen(false);
      refetchAllEmployeeData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete employees';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
    }
  };

  // Update select all state when employees change
  useEffect(() => {
    if (employeeItems) {
      const allEmployeeIds = new Set(employeeItems.map((e: any) => e.id));
      const allSelected = allEmployeeIds.size > 0 && 
        Array.from(allEmployeeIds).every((id: any) => selectedEmployees.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedEmployees, employeeItems]);

  const renderRows = () => {
    if (isSearching || isEmployeeListLoading) {
      return (
        <tr>
          <td colSpan={100}>
            <div className='py-5'>
              <LoadingSpinner size="lg" color="yellow" />
            </div>
          </td>
        </tr>
      );
    }
    if (employeeItems && employeeItems.length > 0) {
      return employeeItems.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <input
              type="checkbox"
              checked={selectedEmployees.has(item.id)}
              onChange={() => handleEmployeeSelect(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
            />
          </td>
          {visibleColumns.date_hired && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date_hired}</td>
          )}
          {visibleColumns.system_id && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.system_id}</td>
          )}
          {visibleColumns.employee_id && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.employee_id}</td>
          )}
          {visibleColumns.firstname && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.firstname}</td>
          )}
          {visibleColumns.middlename && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.middlename}</td>
          )}
          {visibleColumns.lastname && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.lastname}</td>
          )}
          {visibleColumns.location && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.location}</td>
          )}
          {visibleColumns.position && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.position || 'N/A'}</td>
          )}
          {visibleColumns.department && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.department || 'N/A'}</td>
          )}
          {visibleColumns.employment_status && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.employment_status || 'N/A'}</td>
          )}
          {visibleColumns.email && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.email}</td>
          )}
          {visibleColumns.mobile && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.mobile}</td>
          )}
          {visibleColumns.gender && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.gender}</td>
          )}
          {visibleColumns.address && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 overflow-hidden text-ellipsis max-w-xs'>
              {item.address}
            </td>
          )}
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            <div className='flex space-x-2'>
              <SmartButton
                id="edit-employee-btn"
                onClick={() => setIsEmployeesEditModalOpen({ id: item.id, open: true })}
              >
                <EditIcon />
              </SmartButton>
              <SmartButton
                id="delete-employee-btn"
                onClick={() => setIsEmployeesDeleteModalOpen({ id: item.id, open: true })}
              >
                <DeleteIcon />
              </SmartButton>
            </div>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={7}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add employee.</h4>
          </td>
        </tr>
      );
    }
  };
  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24'>
        <div className='flex p-4'>
          <Link href='/manage' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Manage</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Employee List</h2>
          <div className={classNames('mt-6 flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex-none flex flex-col lg:flex-row items-left md:items-center gap-2'>
              <div className='relative'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={pendingFilter.from}
                  pickerOnChange={(date: any) => {
                    setPendingFilter({ ...pendingFilter, from: date });
                  }}
                  inputOnChange={(value: any) => {
                    setPendingFilter({ ...pendingFilter, from: value });
                  }}
                />
              </div>
              <p>to</p>
              <div className='relative'>
                <CustomDatePicker
                  id='to-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={pendingFilter.to}
                  pickerOnChange={(date: any) => {
                    setPendingFilter({ ...pendingFilter, to: date });
                  }}
                  inputOnChange={(value: any) => {
                    setPendingFilter({ ...pendingFilter, to: value });
                  }}
                  minDate={pendingFilter.from}
                />
              </div>
            </div>
            <div className='flex gap-2 lg:w-1/3'>
              <div className='flex flex-row w-full items-center gap-2'>
                <div className='relative flex items-center flex-1'>
                  <input
                    type='text'
                    name='search'
                    id='search'
                    className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                    autoComplete='off'
                    autoCorrect='off'
                    autoCapitalize='off'
                    spellCheck='false'
                    data-lpignore='true'
                    data-form-type='other'
                    value={pendingFilter.search}
                    onChange={(e) => {
                      setPendingFilter({ ...pendingFilter, search: e.target.value });
                      // Always show autocomplete since we have 500 employees loaded
                      setShowAutocomplete(true);
                      setShouldShowAutocomplete(true);
                      setSelectedIndex(-1);
                    }}
                    onFocus={() => {
                      // Always show autocomplete when focused since we have 500 employees loaded
                      setShowAutocomplete(true);
                      setShouldShowAutocomplete(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setShowAutocomplete(false);
                        setShouldShowAutocomplete(false);
                        setSelectedIndex(-1);
                        setAutocompleteLimit(50); // Reset limit when dropdown closes
                      }, 100);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (showAutocomplete && selectedIndex >= 0 && autocompleteResults?.records) {
                          // Handle autocomplete selection with Enter
                          const displayItems = autocompleteResults.records.slice(0, autocompleteLimit);
                          const hasMoreResults = autocompleteResults.total_records > autocompleteLimit;
                          
                          // Check if "Show more" option is selected (last item when there are more results)
                          if (selectedIndex === displayItems.length && hasMoreResults) {
                            e.preventDefault();
                            // Show 50 more results in the dropdown
                            setAutocompleteLimit(prev => prev + 50);
                            // Keep the selection on the "Show more" option
                            setSelectedIndex(displayItems.length + 50);
                          } else if (displayItems[selectedIndex]) {
                            const item = displayItems[selectedIndex];
                            const newSearchTerm = `${item.firstname} ${item.lastname}`.trim();
                            setPendingFilter({ ...pendingFilter, search: newSearchTerm });
                            setAppliedFilter({ ...pendingFilter, search: newSearchTerm });
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
                        if (showAutocomplete && autocompleteResults?.records) {
                          const displayItems = autocompleteResults.records.slice(0, autocompleteLimit);
                          const hasMoreResults = autocompleteResults.total_records > autocompleteLimit;
                          const maxIndex = displayItems.length + (hasMoreResults ? 1 : 0) - 1; // Include "Show more" option
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
                    placeholder='Search ...'
                  />
                  {showAutocomplete && shouldShowAutocomplete && (() => {
                    // Show loading state while debouncing or API loading
                    if (pendingFilter.search && pendingFilter.search.length >= 2 && (isDebouncing || isAutocompleteLoading)) {
                      return (
                        <ul 
                          ref={autocompleteRef}
                          className='absolute left-0 top-full mt-1 z-10 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-y-auto'
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <li className='px-3 py-4 text-center'>
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
                    if (autocompleteResults?.records && autocompleteResults.records.length > 0) {
                      const hasMoreResults = autocompleteResults.total_records > autocompleteLimit;
                      const displayItems = autocompleteResults.records.slice(0, autocompleteLimit);
                      
                      return (
                        <ul 
                          ref={autocompleteRef}
                          className='absolute left-0 top-full mt-1 z-10 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-y-auto'
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {displayItems.map((item: any, index: number) => (
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
                                setPendingFilter({ ...pendingFilter, search: newSearchTerm });
                                setAppliedFilter({ ...pendingFilter, search: newSearchTerm });
                                setShowAutocomplete(false);
                                setSelectedIndex(-1);
                                document.getElementById('search')?.blur();
                              }}
                            >
                              <div className='flex flex-col'>
                                <span className='font-medium'>{item.firstname} {item.lastname}</span>
                                {(item.department || item.position) && (
                                  <span className='text-xs text-gray-500'>
                                    • {item.department && item.position 
                                      ? `${item.department} | ${item.position}`
                                      : item.department || item.position
                                    }
                                  </span>
                                )}
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
                                // Show 50 more results in the dropdown
                                setAutocompleteLimit(prev => prev + 50);
                                // Keep the selection on the "Show more" option after expansion
                                setSelectedIndex(displayItems.length + 50);
                              }}
                              onMouseEnter={() => setSelectedIndex(displayItems.length)}
                              onMouseDown={(e) => {
                                e.preventDefault();
                              }}
                            >
                              <div className='flex items-center justify-between'>
                                <span className='text-sm text-gray-600'>
                                  Show 50 more results
                                </span>
                                <span className='text-sm text-gray-600 font-medium'>
                                  Click to load more
                                </span>
                              </div>
                            </li>
                          )}
                        </ul>
                      );
                    }

                    // Show no results state only when searching with 2+ characters
                    if (pendingFilter.search && pendingFilter.search.length >= 2 && autocompleteResults?.records?.length === 0) {
                      return (
                        <ul 
                          ref={autocompleteRef}
                          className='absolute left-0 top-full mt-1 z-10 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-y-auto'
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <li className='px-3 py-4 text-center'>
                            <div className='flex flex-col items-center space-y-2'>
                              <div className='text-sm text-gray-600'>
                                <p className='font-medium'>No employees found</p>
                                <p className='text-xs text-gray-500 mt-1'>
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
                  className='bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-100'
                  onClick={(e) => {
                    e.preventDefault();
                    handleMagnifyingGlassClick();
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                >
                  <MagnifyingGlassIcon className='h-5 w-5' />
                </button>
              </div>
            </div>
            <div className='flex-1 flex justify-start lg:justify-end'>
              <div className='flex'>
                <SmartButton
                  id="create-employee-btn"
                  onClick={() => setIsAddEmployeeModalOpen(true)}
                  className='bg-green-500 rounded-l-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                >
                  CREATE
                </SmartButton>
                <Menu as='div' className='relative'>
                  <Menu.Button className='bg-green-500 py-2.5 px-3 rounded-r-md text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'>
                    <span className='sr-only'>Open options</span>
                    <div className='flex gap-4'>
                      <ChevronDownIcon className='flex-none h-5 w-5' aria-hidden='true' />
                    </div>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                  >
                    <Menu.Items className='absolute right-0 z-10 mt-2 w-[8.6rem] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                      <div className='py-1'>
                        {smartMenuOptions.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <span
                                id={item.id}
                                onClick={() => {
                                  item.action();
                                }}
                                className={classNames(
                                  'block px-4 py-2 text-sm cursor-pointer text-center',
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  item.disabled ? 'bg-gray-200 cursor-not-allowed opacity-50' : ''
                                )}
                              >
                                {item.name}
                              </span>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <Menu as='div' className='relative ml-2'>
                <Menu.Button className='bg-savoy-blue rounded-lg py-2.5 px-3 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50 flex items-center gap-2'>
                  <Cog6ToothIcon className='h-5 w-5' />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <div className='p-4'>
                      <div className='mb-4'>
                        <h3 className='text-sm font-semibold text-gray-900 mb-2'>
                          Filter Columns ({Object.values(visibleColumns).filter(Boolean).length} of {columnDefinitions.length})
                        </h3>
                        <p className='text-xs text-gray-600'>
                          Select which columns to display in the table.
                        </p>
                      </div>
                      <div className='max-h-64 overflow-y-auto mb-4'>
                        <div className='grid grid-cols-1 gap-2'>
                          {columnDefinitions.map((column) => (
                            <label key={column.key} className='flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-50'>
                              <input
                                type='checkbox'
                                checked={visibleColumns[column.key] || false}
                                onChange={() => handleColumnToggle(column.key)}
                                className='h-4 w-4 text-savoy-blue focus:ring-savoy-blue border-gray-300 rounded'
                              />
                              <span className='text-sm text-gray-700'>{column.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <button
                          onClick={handleColumnReset}
                          className='flex-1 bg-gray-500 text-white text-xs font-semibold py-2 px-3 rounded-md hover:bg-gray-600'
                        >
                          Reset
                        </button>
                        <button
                          onClick={handleShowAll}
                          className='flex-1 bg-savoy-blue text-white text-xs font-semibold py-2 px-3 rounded-md hover:bg-blue-700'
                        >
                          Show All
                        </button>
                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          {/* Bulk Actions - Below Search/Filter Row */}
          {selectedEmployees.size > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkDeleteMutation.isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Delete Selected'
                  )}
                </button>
                <button
                  onClick={() => setSelectedEmployees(new Set())}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear Selected
                </button>
                <span className="text-sm text-gray-700 font-medium">
                  {selectedEmployees.size} selected
                </span>
              </div>
            </div>
          )}

          <div className={classNames('mt-8 flow-root', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div
              className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#2d3e58 #f1f1f1'
              }}
            >
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300 text-center'>
                    <thead>
                      <tr>
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            disabled={!employeeItems || employeeItems.length === 0}
                            className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                          />
                        </th>
                        {visibleColumns.date_hired && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Date Hired
                          </th>
                        )}
                        {visibleColumns.system_id && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            System ID
                          </th>
                        )}
                        {visibleColumns.employee_id && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Employee ID
                          </th>
                        )}
                        {visibleColumns.firstname && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            First Name
                          </th>
                        )}
                        {visibleColumns.middlename && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Middle Name
                          </th>
                        )}
                        {visibleColumns.lastname && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Last Name
                          </th>
                        )}
                        {visibleColumns.location && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Location
                          </th>
                        )}
                        {visibleColumns.position && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Position
                          </th>
                        )}
                        {visibleColumns.department && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Department
                          </th>
                        )}
                        {visibleColumns.employment_status && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Employment Status
                          </th>
                        )}
                        {visibleColumns.email && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Email
                          </th>
                        )}
                        {visibleColumns.mobile && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Contact No.
                          </th>
                        )}
                        {visibleColumns.gender && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Gender
                          </th>
                        )}
                        {visibleColumns.address && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Address
                          </th>
                        )}
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                  </table>
                  <hr />
                </div>
            </div>
            <Pagination
              pagination={pagination}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageSizeChange={pageSizeChange}
              onPageChange={paginationChange}
            />
          </div>
        </div>
      </div>
      {isDataAgreementModalOpen && (
        <DataExportAgreementModal
          isOpen={isDataAgreementModalOpen}
          setIsOpen={setIsDataAgreementModalOpen}
          setIsAgreementAccepted={(isAgree) => {
            setIsDataAgreementModalOpen(false);
            updateEmployerAgreeExport({ is_export_agree: isAgree });
            setIsExportProgressModalOpen(true);
          }}
        />
      )}
      {isExportProgressModalOpen && (
        <ExportProgressModal
          isOpen={isExportProgressModalOpen}
          setIsOpen={setIsExportProgressModalOpen}
          itemsFilter={appliedFilter}
        />
      )}
      {isImportModalOpen && (
        <ImportModal refetch={refetchAllEmployeeData} isOpen={isImportModalOpen} setIsOpen={setIsImportModalOpen} />
      )}
      {isExportTemplateModalOpen && (
        <ExportTemplateModal
          isOpen={isExportTemplateModalOpen}
          setIsOpen={setIsExportTemplateModalOpen}
          itemsFilter={appliedFilter}
        />
      )}
      {isEmployeesDeleteModalOpen && (
        <DeleteEmployeeDetailModal
          refetch={refetchAllEmployeeData}
          isOpen={isEmployeesDeleteModalOpen}
          setIsOpen={setIsEmployeesDeleteModalOpen}
        />
      )}
      {isEmployeesEditModalOpen && (
        <EditEmployeeDetailsModal
          isOpen={isEmployeesEditModalOpen}
          setIsOpen={setIsEmployeesEditModalOpen}
          refetch={refetchAllEmployeeData}
          locationItems={locationItems}
          departmentItems={departmentItems}
          positionItems={positionItems}
          employeeStatusItems={employeeStatusItems}
        />
      )}

      {isAddEmployeeModalOpen && (
        <AddEmployeeModal
          refetch={refetchAllEmployeeData}
          isOpen={isAddEmployeeModalOpen}
          setIsOpen={setIsAddEmployeeModalOpen}
          locationItems={locationItems}
          departmentItems={departmentItems}
          positionItems={positionItems}
          employeeStatusItems={employeeStatusItems}
        />
      )}

      {selectedEmployees.size > 0 && (
        <BulkDeleteModal
          isOpen={isBulkDeleteModalOpen}
          selectedCount={selectedEmployees.size}
          moduleName="employees"
          onConfirm={confirmBulkDelete}
          onClose={() => setIsBulkDeleteModalOpen(false)}
          isLoading={bulkDeleteMutation.isLoading}
        />
      )}

    </>
  );
};

export default Content;
