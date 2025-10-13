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
import useGetDepartmentItems from '../hooks/department/useGetDepartmentItems';
import useBulkDeleteDepartments from '../hooks/department/useBulkDeleteDepartments';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import CreateModal from '../modals/CreateModal';
import EditModal from '../modals/EditModal';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import useDeleteDepartment from '../hooks/department/useDeleteDepartments';
import classNames from '@/helpers/classNames';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

type T_BulkDeleteModalData = DeleteModalData & {
  selectedCount: number;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const Department = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
  const [departmentItems, setDepartmentItems] = useState<any>([]);
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState<boolean>(false);
  const [isDepartmentEditModalOpen, setIsDepartmentEditModalOpen] = useState<T_ModalData | null>(null);
  const [isDepartmentDeleteModalOpen, setIsDepartmentDeleteModalOpen] = useState<T_ModalData | null>(null);
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
  const [selectedDepartments, setSelectedDepartments] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState<T_BulkDeleteModalData | null>(null);

  const {
    data: departmentListData,
    isLoading: isDepartmentListLoading,
    refetch: departmentListRefetch,
  } = useGetDepartmentItems({ ...appliedFilter, pageSize: pageSize, currentPage: currentPage });

  const { mutate: deleteDepartment, isLoading: isDeleteDepartmentLoading } = useDeleteDepartment();
  const bulkDeleteMutation = useBulkDeleteDepartments();

  const cachedData: any = cachedProfile?.state?.data;

  useEffect(() => {
    if (departmentListData) {
      setDepartmentItems(departmentListData.records);
      setPagination({
        totalPages: departmentListData.total_pages,
        totalRecords: departmentListData.total_records,
      });
    }
  }, [departmentListData]);

  useEffect(() => {
    departmentListRefetch();
  }, [currentPage, pageSize, departmentListRefetch]);

  useEffect(() => {
    if (!isDepartmentListLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isDepartmentListLoading, isSearching]);

  // Update select all state when departments change
  useEffect(() => {
    if (departmentItems) {
      const allDepartmentIds = new Set(departmentItems.map((d: any) => d.id));
      const allSelected = allDepartmentIds.size > 0 && 
        Array.from(allDepartmentIds).every((id: any) => selectedDepartments.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedDepartments, departmentItems]);

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

  // Handle individual department selection
  const handleDepartmentSelect = (departmentId: number) => {
    setSelectedDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(departmentId)) {
        newSet.delete(departmentId);
      } else {
        newSet.add(departmentId);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!departmentItems) return;
    
    if (selectAll) {
      setSelectedDepartments(new Set());
    } else {
      const allIds = departmentItems.map((d: any) => d.id);
      setSelectedDepartments(new Set(allIds));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedDepartments.size === 0) return;
    setIsBulkDeleteModalOpen({
      open: true,
      selectedCount: selectedDepartments.size,
    });
  };

  const confirmBulkDelete = async () => {
    try {
      const departmentIds = Array.from(selectedDepartments);
      await bulkDeleteMutation.mutateAsync(departmentIds);
      
      toast.custom(() => <CustomToast message={`${selectedDepartments.size} department(s) deleted successfully.`} type="success" />, { duration: 3000 });
      setSelectedDepartments(new Set());
      setSelectAll(false);
      setIsBulkDeleteModalOpen(null);
      departmentListRefetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete departments';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
    }
  };

  const renderRows = () => {
    if (isSearching || isDepartmentListLoading) {
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
    if (departmentItems && departmentItems.length > 0) {
      return departmentItems.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <input
              type="checkbox"
              checked={selectedDepartments.has(item.id)}
              onChange={() => handleDepartmentSelect(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{formatDate(item.created_at)}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.name}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            <div className='flex space-x-2 justify-center'>
              <SmartButton
                id="edit-department-btn"
                onClick={() => setIsDepartmentEditModalOpen({ id: item.id, open: true })}
              >
                <EditIcon />
              </SmartButton>
              <SmartButton
                id="delete-department-btn"
                onClick={() => setIsDepartmentDeleteModalOpen({ id: item.id, open: true })}
                disabled={selectedDepartments.size > 1}
                className={selectedDepartments.size > 1 ? 'opacity-50 cursor-not-allowed' : ''}
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
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add department.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <h2 className='text-xl font-bold text-indigo-dye'>Department</h2>
      
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
            id="create-department-btn"
            onClick={() => setIsAddDepartmentModalOpen(true)}
            className='bg-green-500 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
          >
            CREATE
          </SmartButton>
        </div>
      </div>
      
      {/* Bulk Actions - Below Date Filters */}
      {selectedDepartments.size > 1 && (
        <div className="mt-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <button
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
            </button>
            <span className="text-sm text-gray-700 font-medium">
              {selectedDepartments.size} selected
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
                      disabled={!departmentItems || departmentItems.length === 0}
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
        <Pagination
          pagination={pagination}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageSizeChange={pageSizeChange}
          onPageChange={paginationChange}
        />
      </div>
      
      <CreateModal
        module='department'
        refetch={departmentListRefetch}
        isOpen={isAddDepartmentModalOpen}
        setIsOpen={setIsAddDepartmentModalOpen}
      />
      {isDepartmentEditModalOpen && (
        <EditModal
          module='department'
          refetch={departmentListRefetch}
          isOpen={isDepartmentEditModalOpen}
          setIsOpen={setIsDepartmentEditModalOpen}
        />
      )}
      {isDepartmentDeleteModalOpen && (
        <DeleteModal
          isOpen={isDepartmentDeleteModalOpen}
          setIsOpen={setIsDepartmentDeleteModalOpen}
          onConfirm={() => {
            const callbackReq = {
              onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
                setIsDepartmentDeleteModalOpen(null);
                departmentListRefetch();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
              },
            };
            deleteDepartment(isDepartmentDeleteModalOpen.id, callbackReq);
          }}
          isLoading={isDeleteDepartmentLoading}
        />
      )}
      
      {/* Bulk Delete Modal */}
      {isBulkDeleteModalOpen && (
        <DeleteModal<T_BulkDeleteModalData>
          isOpen={isBulkDeleteModalOpen}
          setIsOpen={setIsBulkDeleteModalOpen}
          onConfirm={confirmBulkDelete}
          isLoading={bulkDeleteMutation.isLoading}
          customText={`${isBulkDeleteModalOpen.selectedCount} department${isBulkDeleteModalOpen.selectedCount > 1 ? 's' : ''}`}
        />
      )}

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Department;
