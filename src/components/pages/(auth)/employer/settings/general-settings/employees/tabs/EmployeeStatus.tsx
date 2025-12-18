'use client';

import React, { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import ProgressModal from '@/components/ProgressModal';
import useGetEmployeeStatusItems from '../hooks/employee-status/useGetEmployeeStatusItems';
import useBulkDeleteEmployeeStatuses from '../hooks/employee-status/useBulkDeleteEmployeeStatuses';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import CreateModal from '../modals/CreateModal';
import EditModal from '../modals/EditModal';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import useDeleteEmployeeStatus from '../hooks/employee-status/useDeleteEmployeeStatus';
import classNames from '@/helpers/classNames';
import { formatDateToLocal } from '@/helpers/date';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

const EmployeeStatus = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
  const [employeeStatusItems, setEmployeeStatusItems] = useState<any>([]);
  const [isAddEmployeeStatusModalOpen, setIsAddEmployeeStatusModalOpen] = useState<boolean>(false);
  const [isEmployeeStatusEditModalOpen, setIsEmployeeStatusEditModalOpen] = useState<T_ModalData | null>(null);
  const [isEmployeeStatusDeleteModalOpen, setIsEmployeeStatusDeleteModalOpen] = useState<T_ModalData | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [itemsFilter, setItemsFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const [appliedFilter, setAppliedFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });

  // Bulk delete states
  const [selectedEmployeeStatuses, setSelectedEmployeeStatuses] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteConfirmModalOpen, setIsBulkDeleteConfirmModalOpen] = useState<DeleteModalData | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);

  const {
    data: employeeStatusListData,
    isLoading: isEmployeeStatusListLoading,
    refetch: employeeStatusListRefetch,
  } = useGetEmployeeStatusItems({ ...appliedFilter, pageSize: pageSize, currentPage: currentPage });

  const { mutate: deleteEmployeeStatus, isLoading: isDeleteEmployeeStatusLoading } = useDeleteEmployeeStatus();
  const bulkDeleteMutation = useBulkDeleteEmployeeStatuses();

  const cachedData: any = cachedProfile?.state?.data;

  useEffect(() => {
    if (employeeStatusListData) {
      setEmployeeStatusItems(employeeStatusListData.records);
      setPagination({
        totalPages: employeeStatusListData.total_pages,
        totalRecords: employeeStatusListData.total_records,
      });
    }
  }, [employeeStatusListData]);

  useEffect(() => {
    employeeStatusListRefetch();
  }, [currentPage, pageSize, employeeStatusListRefetch]);

  useEffect(() => {
    if (!isEmployeeStatusListLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isEmployeeStatusListLoading, isSearching]);

  // Update select all state when employee statuses change
  useEffect(() => {
    if (employeeStatusItems) {
      const allEmployeeStatusIds = new Set(employeeStatusItems.map((es: any) => es.id));
      const allSelected = allEmployeeStatusIds.size > 0 && 
        Array.from(allEmployeeStatusIds).every((id: any) => selectedEmployeeStatuses.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedEmployeeStatuses, employeeStatusItems]);

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
    setAppliedFilter({ ...itemsFilter });
  };

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  // Handle individual employee status selection
  const handleEmployeeStatusSelect = (employeeStatusId: number) => {
    setSelectedEmployeeStatuses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(employeeStatusId)) {
        newSet.delete(employeeStatusId);
      } else {
        newSet.add(employeeStatusId);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!employeeStatusItems) return;
    
    if (selectAll) {
      setSelectedEmployeeStatuses(new Set());
    } else {
      const allIds = employeeStatusItems.map((es: any) => es.id);
      setSelectedEmployeeStatuses(new Set(allIds));
    }
  };

  // Handle bulk delete - opens confirmation modal
  const handleBulkDelete = () => {
    if (selectedEmployeeStatuses.size === 0) return;
    setBulkDeleteCount(selectedEmployeeStatuses.size);
    setIsBulkDeleteConfirmModalOpen({
      open: true,
    });
  };

  // Confirm the warning and open progress modal
  const confirmBulkDeleteWarning = () => {
    setIsBulkDeleteConfirmModalOpen(null);
    setIsBulkDeleteModalOpen(true);
  };

  // Perform the actual deletion (called by ProgressModal)
  const confirmBulkDelete = async () => {
    try {
      const employeeStatusIds = Array.from(selectedEmployeeStatuses);
      await bulkDeleteMutation.mutateAsync(employeeStatusIds);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete employee statuses';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
      setIsBulkDeleteModalOpen(false);
    }
  };

  // Handle success after deletion completes
  const handleBulkDeleteSuccess = () => {
    toast.custom(() => <CustomToast message={`${bulkDeleteCount} employee status(es) deleted successfully.`} type="success" />, { duration: 3000 });
    setSelectedEmployeeStatuses(new Set());
    setSelectAll(false);
    setBulkDeleteCount(0);
    employeeStatusListRefetch();
  };

  const renderRows = () => {
    if (isSearching || isEmployeeStatusListLoading) {
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
    if (employeeStatusItems && employeeStatusItems.length > 0) {
      return employeeStatusItems.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <input
              type="checkbox"
              checked={selectedEmployeeStatuses.has(item.id)}
              onChange={() => handleEmployeeStatusSelect(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{formatDateToLocal(item.created_at)}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.name}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            <div className='flex space-x-2 justify-center'>
              <SmartButton
                id="edit-employee-status-btn"
                onClick={() => setIsEmployeeStatusEditModalOpen({ id: item.id, open: true })}
              >
                <EditIcon />
              </SmartButton>
              <SmartButton
                id="delete-employee-status-btn"
                onClick={() => setIsEmployeeStatusDeleteModalOpen({ id: item.id, open: true })}
                disabled={selectedEmployeeStatuses.size > 1}
                className={selectedEmployeeStatuses.size > 1 ? 'opacity-50 cursor-not-allowed' : ''}
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
          <td colSpan={4}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add employee status.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='flex flex-col min-h-[70vh]'>
        <h2 className='text-xl font-bold text-indigo-dye'>Employee Status</h2>
      
      <div className='flex-1'>
        <div className={classNames('mt-6 flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
        <div className='flex-none flex flex-col md:flex-row items-left md:items-center gap-2 flex-wrap md:flex-nowrap'>
          <div className='relative flex-1 md:flex-none min-w-[140px] md:min-w-0'>
            <CustomDatePicker
              id='from-datepicker'
              placeholder={'mm/dd/yyyy'}
              className='appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 md:placeholder:text-black text-sm leading-6'
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
          <p className='text-gray-600 text-sm md:text-base self-center'>to</p>
          <div className='relative flex-1 md:flex-none min-w-[140px] md:min-w-0'>
            <CustomDatePicker
              id='to-datepicker'
              placeholder={'mm/dd/yyyy'}
              className='appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 md:placeholder:text-black text-sm leading-6'
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
              data-tooltip-content='Search for: Name'
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
              className='bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-100'
              onClick={handleSearch}
            >
              <MagnifyingGlassIcon className='h-5 w-5' />
            </button>
          </div>
        </div>
        <div className='flex-1 flex justify-start lg:justify-end'>
          <SmartButton
            id="create-employee-status-btn"
            onClick={() => setIsAddEmployeeStatusModalOpen(true)}
            className='bg-green-500 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
          >
            CREATE
          </SmartButton>
        </div>
      </div>
      
      {/* Bulk Actions - Below Date Filters */}
      {selectedEmployeeStatuses.size > 1 && (
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <SmartButton
              id="delete-employee-status-btn"
              onClick={handleBulkDelete}
              disabled={bulkDeleteMutation.isLoading}
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
            </SmartButton>
            <span className="text-sm text-gray-700 font-medium">
              {selectedEmployeeStatuses.size} selected
            </span>
          </div>
        </div>
      )}

      <div className={classNames('mt-8 flow-root', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='min-w-full py-2 sm:px-6 lg:px-8'>
            <table className='min-w-full divide-y divide-gray-300 text-center'>
              <thead>
                <tr>
                  <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      disabled={!employeeStatusItems || employeeStatusItems.length === 0}
                      className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                    />
                  </th>
                  <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                    Date Created
                  </th>
                  <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                    Name
                  </th>
                  <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
            </table>
            <hr />
          </div>
        </div>
      </div>
      </div>
      
      {/* Sticky Pagination */}
      <div className="mt-8 mb-0 md:sticky md:bottom-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t">
        <Pagination
          pagination={pagination}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageSizeChange={pageSizeChange}
          onPageChange={paginationChange}
        />
      </div>
      </div>
    
      <CreateModal
        module='employee-status'
        refetch={employeeStatusListRefetch}
        isOpen={isAddEmployeeStatusModalOpen}
        setIsOpen={setIsAddEmployeeStatusModalOpen}
      />
      {isEmployeeStatusEditModalOpen && (
        <EditModal
          module='employee-status'
          refetch={employeeStatusListRefetch}
          isOpen={isEmployeeStatusEditModalOpen}
          setIsOpen={setIsEmployeeStatusEditModalOpen}
        />
      )}
      {isEmployeeStatusDeleteModalOpen && (
        <DeleteModal
          isOpen={isEmployeeStatusDeleteModalOpen}
          setIsOpen={setIsEmployeeStatusDeleteModalOpen}
          onConfirm={() => {
            const callbackReq = {
              onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
                setIsEmployeeStatusDeleteModalOpen(null);
                employeeStatusListRefetch();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
              },
            };
            deleteEmployeeStatus(isEmployeeStatusDeleteModalOpen.id, callbackReq);
          }}
          isLoading={isDeleteEmployeeStatusLoading}
        />
      )}
      
      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteConfirmModalOpen?.open && (
        <DeleteModal
          isOpen={isBulkDeleteConfirmModalOpen}
          setIsOpen={setIsBulkDeleteConfirmModalOpen}
          onConfirm={confirmBulkDeleteWarning}
          isLoading={false}
          customText={`${bulkDeleteCount} employee status${bulkDeleteCount > 1 ? 'es' : ''}`}
        />
      )}

      {/* Bulk Delete Progress Modal */}
      {isBulkDeleteModalOpen && (
        <ProgressModal
          isOpen={isBulkDeleteModalOpen}
          setIsOpen={setIsBulkDeleteModalOpen}
          onConfirm={confirmBulkDelete}
          title={`Deleting ${bulkDeleteCount} employee status${bulkDeleteCount > 1 ? 'es' : ''}...`}
          isProcessing={bulkDeleteMutation.isLoading}
          onSuccess={handleBulkDeleteSuccess}
        />
      )}

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default EmployeeStatus;
