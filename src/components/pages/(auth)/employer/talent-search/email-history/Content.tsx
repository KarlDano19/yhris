'use client';

import React, { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import BackButton from '@/components/BackButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatDateToLocal } from '@/helpers/date';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import ProgressModal from '@/components/ProgressModal';
import useGetEmailMonitoring from '../hook/email-monitoring/useGetEmailMonitoring';
import useDeleteEmailMonitoring from '../hook/email-monitoring/useDeleteEmailMonitoring';
import useBulkDeleteEmailMonitoring from '../hook/email-monitoring/useBulkDeleteEmailMonitoring';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import DeleteIcon from '@/svg/DeleteIcon';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

interface T_ModalData extends DeleteModalData {
  id: number;
}

type T_BulkDeleteModalData = DeleteModalData & {
  selectedCount: number;
};

const Content = () => {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<T_ModalData | null>(null);
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
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
  const {
    data: emailMonitoringData,
    isLoading: isEmailMonitoringLoading,
    refetch: emailMonitoringRefetch,
  } = useGetEmailMonitoring({ ...appliedFilter, page_size: pageSize, current_page: currentPage });
  
  const { mutate: deleteEmailMonitoring, isLoading: isDeleteLoading } = useDeleteEmailMonitoring();
  const bulkDeleteMutation = useBulkDeleteEmailMonitoring();

  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isBulkDeleteConfirmModalOpen, setIsBulkDeleteConfirmModalOpen] = useState<T_BulkDeleteModalData | null>(null);
  const [isBulkDeleteProgressModalOpen, setIsBulkDeleteProgressModalOpen] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);

  useEffect(() => {
    if (emailMonitoringData) {
      setEmployeeItems(emailMonitoringData.records);
      setPagination({
        totalPages: emailMonitoringData.total_pages,
        totalRecords: emailMonitoringData.total_records,
      });
    }
  }, [emailMonitoringData]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    setSelectedItems([]); // Clear selections when filters change
  }, [appliedFilter]);

  useEffect(() => {
    emailMonitoringRefetch();
  }, [appliedFilter, pageSize, currentPage, emailMonitoringRefetch]);

  const handleSearch = () => {
    const dateFrom = pendingFilter.from;
    const dateTo = pendingFilter.to;
    
    // Convert dates to ISO format (YYYY-MM-DD) if they exist
    let formattedFrom = '';
    let formattedTo = '';
    
    if (dateFrom) {
      try {
        const fromDate = new Date(dateFrom);
        if (isNaN(fromDate.getTime())) {
          return toast.custom(() => <CustomToast message='Invalid date from.' type='error' />, { duration: 5000 });
        }
        // Use local date to avoid timezone issues
        const year = fromDate.getFullYear();
        const month = String(fromDate.getMonth() + 1).padStart(2, '0');
        const day = String(fromDate.getDate()).padStart(2, '0');
        formattedFrom = `${year}-${month}-${day}`;
      } catch (error) {
        return toast.custom(() => <CustomToast message='Invalid date from.' type='error' />, { duration: 5000 });
      }
    }
    
    if (dateTo) {
      try {
        const toDate = new Date(dateTo);
        if (isNaN(toDate.getTime())) {
          return toast.custom(() => <CustomToast message='Invalid date to.' type='error' />, { duration: 5000 });
        }
        // Use local date to avoid timezone issues
        const year = toDate.getFullYear();
        const month = String(toDate.getMonth() + 1).padStart(2, '0');
        const day = String(toDate.getDate()).padStart(2, '0');
        formattedTo = `${year}-${month}-${day}`;
      } catch (error) {
        return toast.custom(() => <CustomToast message='Invalid date to.' type='error' />, { duration: 5000 });
      }
    }
    
    // Validate date range if both dates are provided
    if (formattedFrom && formattedTo && formattedFrom > formattedTo) {
      return toast.custom(
        () => <CustomToast message='You have entered an invalid date range. Please select again.' type='error' />,
        { duration: 5000 }
      );
    }
    
    setCurrentPage(1);
    setIsSearching(true);
    setAppliedFilter({
      ...pendingFilter,
      from: formattedFrom,
      to: formattedTo
    });
  };

  const handleResetFilters = () => {
    setPendingFilter({
      from: '',
      to: '',
      search: '',
    });
    setAppliedFilter({
      from: '',
      to: '',
      search: '',
    });
  };

  useEffect(() => {
    if (!isEmailMonitoringLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isEmailMonitoringLoading, isSearching]);

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
    setSelectedItems([]); // Clear selections when page changes
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
    setSelectedItems([]); // Clear selections when page size changes
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = employeeItems.map((item: any) => item.id);
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: number, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  // Handle bulk delete - opens confirmation modal
  const handleBulkDelete = () => {
    if (selectedItems.length <= 1) return;
    setBulkDeleteCount(selectedItems.length);
    setIsBulkDeleteConfirmModalOpen({
      open: true,
      selectedCount: selectedItems.length,
    });
  };

  // Confirm and proceed to progress modal
  const confirmBulkDeleteWarning = () => {
    setIsBulkDeleteConfirmModalOpen(null);
    setIsBulkDeleteProgressModalOpen(true);
  };

  // Perform the actual deletion (called by ProgressModal)
  const confirmBulkDelete = async () => {
    try {
      await bulkDeleteMutation.mutateAsync(selectedItems);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete email monitoring records';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
      setIsBulkDeleteProgressModalOpen(false);
    }
  };

  // Handle success after deletion completes
  const handleBulkDeleteSuccess = () => {
    toast.custom(() => <CustomToast message={`${bulkDeleteCount} email monitoring record(s) deleted successfully.`} type="success" />, { duration: 3000 });
    setSelectedItems([]);
    setBulkDeleteCount(0);
    emailMonitoringRefetch();
  };

  const renderRows = () => {
    if (isSearching || isEmailMonitoringLoading) {
      return (
        <tr>
          <td colSpan={7}>
            <div className='py-5'>
              <LoadingSpinner size="lg" color="yellow" />
            </div>
          </td>
        </tr>
      );
    }
    if (emailMonitoringData && emailMonitoringData.records.length > 0) {
      return emailMonitoringData.records.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={selectedItems.includes(item.id)}
              onChange={(e) => handleSelectItem(item.id, e.target.checked)}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.applicant_name}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.to_email}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 overflow-hidden text-ellipsis max-w-xs'>
            {item.subject}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : item.status === 'sent'
                  ? 'bg-green-100 text-green-800'
                  : item.status === 'failed'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {item.status}
            </span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            {formatDateToLocal(item.scheduled_date)}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            <div>
              <button
                onClick={() => setIsDeleteModalOpen({ id: item.id, open: true })}
                disabled={selectedItems.length > 1}
                className={selectedItems.length > 1 ? 'opacity-50 cursor-not-allowed' : ''}
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
          <td colSpan={7}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>No email history found.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 mb-20 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <BackButton label="Talent Search" href="/talent-search" />
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Email History</h2>
        </div>

        {/* Content Section with flex-1 */}
        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          <div className='flex flex-col lg:flex-row items-left gap-4'>
            <div className='flex-none flex flex-col lg:flex-row items-left gap-2'>
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
              <div className='flex-none w-11/12 lg:w-1/3'>
                <div className='relative flex items-center'>
                  <input
                    type='text'
                    name='search'
                    id='search'
                    className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                    value={pendingFilter.search}
                    onChange={(e) => {
                      setPendingFilter({ ...pendingFilter, search: e.target.value });
                      setShowAutocomplete(true);
                    }}
                    onFocus={() => {
                      if (pendingFilter.search) setShowAutocomplete(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowAutocomplete(false), 100);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                        setShowAutocomplete(false);
                      }
                    }}
                    placeholder='Search ...'
                  />
                </div>
              </div>
              <button
                className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
                onClick={handleSearch}
              >
                <MagnifyingGlassIcon className='h-5 w-5' />
              </button>
            </div>
          </div>

          {/* Bulk Actions Section */}
          {selectedItems.length > 1 && (
            <div className="mt-4 p-3">
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
                  {selectedItems.length} selected
                </span>
              </div>
            </div>
          )}

          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 sm:-mx-6 lg:-mx-8'>
              <div className='py-2 sm:px-6 lg:px-8'>
                <div className='overflow-x-auto'>
                  <table className='divide-y divide-gray-300 text-center min-w-full'>
                    <thead>
                      <tr>
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={employeeItems.length > 0 && selectedItems.length === employeeItems.length}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                        </th>
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          Name
                        </th>
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          To Email
                        </th>
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          Subject
                        </th>
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          Status
                        </th>
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          Scheduled Date
                        </th>
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                  </table>
                </div>
                <hr />
              </div>
            </div>
          </div>
        </div>
        
        {/* Sticky Pagination */}
        <div className="px-2 md:px-8 lg:px-4 mt-8 mb-0 md:sticky md:bottom-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t">
          <Pagination
            pagination={pagination}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageSizeChange={pageSizeChange}
            onPageChange={paginationChange}
          />
        </div>
      </div>
      {isDeleteModalOpen && (
        <DeleteModal<T_ModalData>
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          onConfirm={() => {
            const callbackReq = {
              onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
                setIsDeleteModalOpen(null);
                emailMonitoringRefetch();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
              },
            };
            deleteEmailMonitoring(isDeleteModalOpen.id, callbackReq);
          }}
          isLoading={isDeleteLoading}
        />
      )}
      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteConfirmModalOpen && (
        <DeleteModal<T_BulkDeleteModalData>
          isOpen={isBulkDeleteConfirmModalOpen}
          setIsOpen={setIsBulkDeleteConfirmModalOpen}
          onConfirm={confirmBulkDeleteWarning}
          isLoading={false}
          customText={`${bulkDeleteCount} email monitoring record${bulkDeleteCount > 1 ? 's' : ''}`}
        />
      )}

      {/* Bulk Delete Progress Modal */}
      {isBulkDeleteProgressModalOpen && (
        <ProgressModal
          isOpen={isBulkDeleteProgressModalOpen}
          setIsOpen={setIsBulkDeleteProgressModalOpen}
          onConfirm={confirmBulkDelete}
          title={`Deleting ${bulkDeleteCount} email monitoring record${bulkDeleteCount > 1 ? 's' : ''}...`}
          isProcessing={bulkDeleteMutation.isLoading}
          onSuccess={handleBulkDeleteSuccess}
        />
      )}
    </>
  );
};

export default Content;
