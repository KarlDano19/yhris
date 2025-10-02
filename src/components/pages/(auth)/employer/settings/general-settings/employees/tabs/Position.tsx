'use client';

import React, { useEffect, useState, Fragment } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import CreateModal from '../modals/CreateModal';
import EditModal from '../modals/EditModal';
import DeleteModal from '../modals/DeleteModal';
import BulkDeleteModal from '../modals/BulkDeleteModal';
import CustomToast from '@/components/CustomToast';
import useGetPositionItems from '../hooks/position/useGetPositionItems';
import useBulkDeletePositions from '../hooks/position/useBulkDeletePositions';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import classNames from '@/helpers/classNames';


type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const Position = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
  const [positionItems, setPositionItems] = useState<any>([]);
  const [isAddPositionModalOpen, setIsAddPositionModalOpen] = useState<boolean>(false);
  const [isPositionEditModalOpen, setIsPositionEditModalOpen] = useState<T_ModalData | null>(null);
  const [isPositionDeleteModalOpen, setIsPositionDeleteModalOpen] = useState<T_ModalData | null>(null);
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
  const [selectedPositions, setSelectedPositions] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const {
    data: positionListData,
    isLoading: isPositionListLoading,
    refetch: positionListRefetch,
  } = useGetPositionItems({ ...appliedFilter, pageSize: pageSize, currentPage: currentPage });

  const bulkDeleteMutation = useBulkDeletePositions();

  const cachedData: any = cachedProfile?.state?.data;

  useEffect(() => {
    if (positionListData) {   
      setPositionItems(positionListData.records);
      setPagination({
        totalPages: positionListData.total_pages,
        totalRecords: positionListData.total_records,
      });
    }
  }, [positionListData]);

  useEffect(() => {
    positionListRefetch();
  }, [currentPage, pageSize, positionListRefetch]);

  useEffect(() => {
    if (!isPositionListLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isPositionListLoading, isSearching]);

  // Update select all state when positions change
  useEffect(() => {
    if (positionItems) {
      const allPositionIds = new Set(positionItems.map((p: any) => p.id));
      const allSelected = allPositionIds.size > 0 && 
        Array.from(allPositionIds).every((id: any) => selectedPositions.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedPositions, positionItems]);

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

  // Handle individual position selection
  const handlePositionSelect = (positionId: number) => {
    setSelectedPositions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(positionId)) {
        newSet.delete(positionId);
      } else {
        newSet.add(positionId);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!positionItems) return;
    
    if (selectAll) {
      setSelectedPositions(new Set());
    } else {
      const allIds = positionItems.map((p: any) => p.id);
      setSelectedPositions(new Set(allIds));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedPositions.size === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const positionIds = Array.from(selectedPositions);
      await bulkDeleteMutation.mutateAsync(positionIds);
      
      toast.custom(() => <CustomToast message={`${selectedPositions.size} position(s) deleted successfully.`} type="success" />, { duration: 3000 });
      setSelectedPositions(new Set());
      setSelectAll(false);
      setIsBulkDeleteModalOpen(false);
      positionListRefetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete positions';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
    }
  };

  const renderRows = () => {
    if (isSearching || isPositionListLoading) {
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
    if (positionItems && positionItems.length > 0) {
      return positionItems.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <input
              type="checkbox"
              checked={selectedPositions.has(item.id)}
              onChange={() => handlePositionSelect(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{formatDate(item.created_at)}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.name}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            <div className='flex space-x-2 justify-center'>
              <button
                onClick={() => setIsPositionEditModalOpen({ id: item.id, open: true })}
              >
                <EditIcon />
              </button>
              <button
                onClick={() => setIsPositionDeleteModalOpen({ id: item.id, open: true })}
                className={selectedPositions.size > 1 ? 'invisible' : ''}
              >
                <DeleteIcon />
              </button>
            </div>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={4}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add position.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <h2 className='text-xl font-bold text-indigo-dye'>Position</h2>
      
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
          <button
            onClick={() => setIsAddPositionModalOpen(true)}
            className='bg-green-500 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
            disabled={!hasActiveSubscription}
          >
            CREATE
          </button>
        </div>
      </div>
      
      {/* Bulk Actions - Below Date Filters */}
      {selectedPositions.size > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
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
            <button
              onClick={() => setSelectedPositions(new Set())}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear Selected
            </button>
            <span className="text-sm text-gray-700 font-medium">
              {selectedPositions.size} selected
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
                      disabled={!positionItems || positionItems.length === 0}
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
        module='position'
        refetch={positionListRefetch}
        isOpen={isAddPositionModalOpen}
        setIsOpen={setIsAddPositionModalOpen}
        />
      {isPositionEditModalOpen && (
        <EditModal
          module='position'
          refetch={positionListRefetch}
          isOpen={isPositionEditModalOpen}
          setIsOpen={setIsPositionEditModalOpen}
        />
      )}
      {isPositionDeleteModalOpen && (
        <DeleteModal
          module='position'
          refetch={positionListRefetch}
          isOpen={isPositionDeleteModalOpen}
          setIsOpen={setIsPositionDeleteModalOpen}
        />
      )}
      
      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        selectedCount={selectedPositions.size}
        moduleName="positions"
        onConfirm={confirmBulkDelete}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        isLoading={bulkDeleteMutation.isLoading}
      />

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Position;
