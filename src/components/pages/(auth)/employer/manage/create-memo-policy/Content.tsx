'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmModal from '@/components/ConfirmModal';
import useGetDirectivesItems from './hooks/useGetDirectivesItems';
import useDeleteDirectivesItem from './hooks/useDeleteDirectivesItem';
import useBulkDeleteDirectives from './hooks/useBulkDeleteDirectives';
import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';
import useGetEmployeePaginatedSelect from '@/components/hooks/useGetEmployeePaginatedSelect';
import CreateMemoModal from './modals/CreateMemoModal';
import CreatePolicyModal from './modals/CreatePolicyModal';
import EmployeeResponsesModal from './modals/ResponsesModal';
import BulkDeleteModal from '@/components/BulkDeleteModal';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import ClipIcon from '@/svg/ClipIcon';
import DeleteMemoLogo from '@/svg/DeleteMemoLogo';

import classNames from '@/helpers/classNames';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const { mutate, isLoading } = useDeleteDirectivesItem();
  const bulkDeleteMutation = useBulkDeleteDirectives();
  const [itemsFilter, setItemsFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [createMemoPolicyItems, setCreateMemoPolicyItems] = useState<any>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCreateMemoModalOpen, setIsCreateMemoModalOpen] = useState(false);
  const [isCreatePolicyModalOpen, setIsCreatePolicyModalOpen] = useState(false);
  const [isEmployeeResponsesModalOpen, setIsEmployeeResponsesModalOpen] = useState(false);
  const [selectedMemoTitle, setSelectedMemoTitle] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [isSearching, setIsSearching] = useState(false);
  
  // Bulk delete states
  const [selectedDirectives, setSelectedDirectives] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  
  const { data: dataDirectives, isLoading: isGetDirectivesLoading, refetch } = useGetDirectivesItems({
    ...itemsFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });
  
  // Employee search state for modals
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [debouncedEmployeeSearch, setDebouncedEmployeeSearch] = useState('');
  
  // Debouncing effect for employee search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedEmployeeSearch(employeeSearchTerm), 500);
    return () => clearTimeout(timer);
  }, [employeeSearchTerm]);

  // Get paginated employee data for modals
  const { data: employeeData } = useGetEmployeePaginatedSelect(
    debouncedEmployeeSearch && debouncedEmployeeSearch.length >= 2 ? {
      search: debouncedEmployeeSearch,
      current_page: 1,
      page_size: 500
    } : null
  );
  
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    refetch();
  }, [currentPage, pageSize, refetch]);

  useEffect(() => {
    if (dataDirectives) {
      let items = [];
      let totalPages = 1;
      let totalRecords = 0;

      // Handle paginated response structure
      if (dataDirectives.records) {
        items = dataDirectives.records.map((directive: any) => {
          return {
            ...directive,
            date: Intl.DateTimeFormat('en-US').format(new Date(directive.date))
          };
        });
        totalPages = dataDirectives.total_pages || 1;
        totalRecords = dataDirectives.total_records || items.length;
      } 
      // Handle array response structure (no pagination from backend)
      else if (Array.isArray(dataDirectives)) {
        items = dataDirectives.map((directive: any) => {
          return {
            ...directive,
            date: Intl.DateTimeFormat('en-US').format(new Date(directive.date))
          };
        });
        
        // Calculate pagination locally if backend doesn't support it
        totalRecords = items.length;
        totalPages = Math.ceil(totalRecords / pageSize);
        
        // Manual pagination on client side if needed
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        items = items.slice(startIndex, endIndex);
      }

      setCreateMemoPolicyItems(items);
      setPagination({
        totalPages,
        totalRecords
      });
    }
  }, [dataDirectives, pageSize, currentPage]);

  // Update select all state when directives change
  useEffect(() => {
    if (createMemoPolicyItems) {
      const allDirectiveIds = new Set(createMemoPolicyItems.map((d: any) => d.id));
      const allSelected = allDirectiveIds.size > 0 && 
        Array.from(allDirectiveIds).every((id: any) => selectedDirectives.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedDirectives, createMemoPolicyItems]);

  const deleteMemo = () => {
    if (idToDelete) {
      const updatedItems = createMemoPolicyItems.map((item: any) => {
        return item.id !== idToDelete
          ? item
          : {
              ...item,
              isDeleted: true,
            };
      });
      const callbackReq = {
        onSuccess: (data: any) => {
          toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
          setIsConfirmModalOpen(false);
          setCreateMemoPolicyItems([...updatedItems]);
          
          // Refresh data after deletion to maintain pagination consistency
          // If we're on a page with only one item and we delete it, go back to previous page
          if (updatedItems.filter((item: any) => !item.isDeleted).length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            refetch();
          }
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, {
            duration: 5000,
          });
        },
      };
      mutate(idToDelete, callbackReq);
    }
  };

  // Handle individual directive selection
  const handleDirectiveSelect = (directiveId: number) => {
    setSelectedDirectives(prev => {
      const newSet = new Set(prev);
      if (newSet.has(directiveId)) {
        newSet.delete(directiveId);
      } else {
        newSet.add(directiveId);
      }
      return newSet;
    });
  };

  // Handle select all functionality
  const handleSelectAll = () => {
    if (!createMemoPolicyItems) return;
    
    if (selectAll) {
      setSelectedDirectives(new Set());
    } else {
      const allIds = createMemoPolicyItems.map((item: any) => item.id);
      setSelectedDirectives(new Set(allIds));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedDirectives.size === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const directiveIds = Array.from(selectedDirectives);
      await bulkDeleteMutation.mutateAsync(directiveIds);
      
      toast.custom(() => <CustomToast message={`${selectedDirectives.size} directive(s) deleted successfully.`} type="success" />, { duration: 3000 });
      setSelectedDirectives(new Set());
      setSelectAll(false);
      setIsBulkDeleteModalOpen(false);
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete directives';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
    }
  };

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleSearch = () => {
    const dateFrom = Date.parse(itemsFilter.from);
    const dateTo = Date.parse(itemsFilter.to);
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
    setItemsFilter({ ...itemsFilter }); // This line is just to keep the pattern, but you may want to trigger a refetch or set a filter state
    refetch();
  };

  useEffect(() => {
    if (!isGetDirectivesLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isGetDirectivesLoading, isSearching]);

  const renderRows = () => {
    if (isSearching || isGetDirectivesLoading) {
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
    const deletedCount = createMemoPolicyItems.filter((item: any) => item.isDeleted).length;
    if (createMemoPolicyItems && createMemoPolicyItems.length > 0 && createMemoPolicyItems.length !== deletedCount) {
      return createMemoPolicyItems
        .map((item: any) => {
          return (
            !item.isDeleted && (
              <tr key={item.id}>
                <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                  <input
                    type="checkbox"
                    checked={selectedDirectives.has(item.id)}
                    onChange={() => handleDirectiveSelect(item.id)}
                    className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
                  />
                </td>
                <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date}</td>
                <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                  <div className='flex gap-2 justify-center'>
                    <span>{item.title}</span> <ClipIcon />
                  </div>
                </td>
                <td className='whitespace-nowrap px-3 py-5 text-sm text-savoy-blue'>
                  <p
                    className='font-bold hover:underline cursor-pointer'
                    onClick={() => {
                      setSelectedMemoTitle(item);
                      setIsEmployeeResponsesModalOpen(true);
                    }}
                  >
                    View Responses
                  </p>
                </td>
                <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                  <button
                    onClick={() => {
                      setIdToDelete(item.id);
                      setIsConfirmModalOpen(true);
                    }}
                    // disabled={!cachedProfile?.state?.data?.edit_memo}
                  >
                    <DeleteMemoLogo />
                  </button>
                </td>
              </tr>
            )
          );
        })
        .filter((item: any) => item);
    } else {
      return (
        <tr>
          <td colSpan={7}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add memo/policy.</h4>
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
          <h2 className='text-xl font-bold text-indigo-dye'>Create Memo/Policy</h2>
          <div className={classNames('mt-6 flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex-none flex flex-col lg:flex-row items-left md:items-center gap-2'>
              <div className='relative'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={itemsFilter.from}
                  pickerOnChange={(date: any) => {
                    if (itemsFilter) setItemsFilter({ ...itemsFilter, from: date });
                  }}
                  inputOnChange={(value: any) => {
                    setItemsFilter({
                      ...itemsFilter,
                      from: value,
                    });
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
                  selected={itemsFilter.to}
                  pickerOnChange={(date: any) => {
                    if (itemsFilter) setItemsFilter({ ...itemsFilter, to: date });
                    if (!itemsFilter) setItemsFilter(date);
                  }}
                  inputOnChange={(value: any) => {
                    setItemsFilter({
                      ...itemsFilter,
                      to: value,
                    });
                  }}
                  minDate={itemsFilter.from}
                />
              </div>
            </div>
            <div className='flex gap-2 lg:w-1/3'>
              <div className='flex flex-row w-full items-center gap-2'>
                <input
                  type='text'
                  name='search'
                  id='search'
                  data-tooltip-id='search-tooltip'
                  data-tooltip-content='Search for Memo: Title'
                  data-tooltip-place='bottom'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) => setItemsFilter({ ...itemsFilter, search: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  placeholder='Search ...'
                />
                <button
                  className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
                  onClick={handleSearch}
                >
                  <MagnifyingGlassIcon className='h-5 w-5' />
                </button>
              </div>
            </div>
            <div className='flex-1 flex justify-start lg:justify-end'>
              <Menu as='div' className='relative inline-block'>
                <div>
                  <Menu.Button
                    className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow enabled:hover:shadow-md enabled:focus:shadow-none enabled:focus:opacity-80 disabled:opacity-50'
                    // disabled={!hasActiveSubscription || !cachedProfile?.state?.data?.create_memo}
                  >
                    CREATE
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-green-500 focus:outline-none'>
                    <div className='py-1'>
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm cursor-pointer'
                            )}
                            onClick={() => {
                              setIsCreateMemoModalOpen(true);
                              setIsOpen(!isOpen);
                            }}
                          >
                            Create Memo
                          </span>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm cursor-pointer'
                            )}
                            onClick={() => {
                              setIsCreatePolicyModalOpen(true);
                              setIsOpen(!isOpen);
                            }}
                          >
                            Create Policy
                          </span>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
          
          {/* Bulk Actions Section - Moved to Left Side */}
          <div className="mt-8">
            <div className="flex flex-wrap justify-between items-center gap-2">
              {/* Bulk Actions - Left Side */}
              {selectedDirectives.size > 0 && (
                <div className="flex items-center gap-3 md:pl-4 lg:pl-10">
                  <button
                    onClick={handleBulkDelete}
                    disabled={bulkDeleteMutation.isLoading || !hasActiveSubscription}
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
                    onClick={() => setSelectedDirectives(new Set())}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Clear Selected
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    {selectedDirectives.size} selected
                  </span>
                </div>
              )}

              {/* Right side - can be used for filters or empty */}
              <div className="flex flex-wrap justify-center md:justify-end md:pr-4 lg:pr-10 gap-2">
                {/* Add any filter tabs here if needed in the future */}
              </div>
            </div>
          </div>

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
                          disabled={!createMemoPolicyItems || createMemoPolicyItems.length === 0}
                          className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                        />
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-center text-sm font-semibold text-gray-900'>
                        Title
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-center text-sm font-semibold text-gray-900'>
                        Responses
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-center text-sm font-semibold text-gray-900'>
                        <span className='sr-only'>Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                </table>
                <hr />
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
        </div>
      </div>
      <CreateMemoModal 
        isOpen={isCreateMemoModalOpen} 
        setIsOpen={setIsCreateMemoModalOpen} 
        refetch={refetch}
        employeeData={employeeData}
        onSearchChange={setEmployeeSearchTerm}
      />
      <CreatePolicyModal 
        isOpen={isCreatePolicyModalOpen} 
        setIsOpen={setIsCreatePolicyModalOpen} 
        refetch={refetch}
        employeeData={employeeData}
        onSearchChange={setEmployeeSearchTerm}
      />
      <EmployeeResponsesModal 
        isOpen={isEmployeeResponsesModalOpen} 
        setIsOpen={setIsEmployeeResponsesModalOpen}
        memoTitle={selectedMemoTitle}
        directiveId={selectedMemoTitle?.id}
      />
      <ConfirmModal
        message='Are you sure you want to delete this memo/policy?'
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        confirmAction={deleteMemo}
        // isLoading={false}
        isLoading={isLoading}
      />
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        selectedCount={selectedDirectives.size}
        moduleName="directives"
        onConfirm={confirmBulkDelete}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        isLoading={bulkDeleteMutation.isLoading}
      />

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;
