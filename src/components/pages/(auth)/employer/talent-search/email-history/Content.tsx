'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import useGetEmailMonitoring from '../hook/email-monitoring/useGetEmailMonitoring';
import useDeleteEmailMonitoring from '../hook/email-monitoring/useDeleteEmailMonitoring';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import DeleteIcon from '@/svg/DeleteIcon';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

interface T_ModalData extends DeleteModalData {
  id: number;
}

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

  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

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
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const renderRows = () => {
    if (isSearching || isEmailMonitoringLoading) {
      return (
        <tr>
          <td colSpan={5}>
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
            {new Date(item.scheduled_date).toLocaleDateString()}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            <div>
              <button
                onClick={() => setIsDeleteModalOpen({ id: item.id, open: true })}
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
          <td colSpan={5}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>No email history found.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/talent-search' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Talent Search</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Email History</h2>
          {/* {(appliedFilter.from || appliedFilter.to || appliedFilter.search) && (
            <div className='mt-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md'>
              <div className='flex items-center justify-between'>
                <div className='text-sm text-blue-700'>
                  <span className='font-medium'>Filters applied:</span>
                  {appliedFilter.from && appliedFilter.to && (
                    <span className='ml-2'>Date range: {new Date(appliedFilter.from).toLocaleDateString()} - {new Date(appliedFilter.to).toLocaleDateString()}</span>
                  )}
                  {appliedFilter.from && !appliedFilter.to && (
                    <span className='ml-2'>From: {new Date(appliedFilter.from).toLocaleDateString()}</span>
                  )}
                  {!appliedFilter.from && appliedFilter.to && (
                    <span className='ml-2'>Until: {new Date(appliedFilter.to).toLocaleDateString()}</span>
                  )}
                  {appliedFilter.search && (
                    <span className='ml-2'>Search: &quot;{appliedFilter.search}&quot;</span>
                  )}
                </div>
                <button
                  onClick={handleResetFilters}
                  className='text-blue-600 hover:text-blue-800 text-sm underline'
                >
                  Clear all
                </button>
              </div>
            </div>
          )} */}
          <div className='mt-6 flex flex-col lg:flex-row items-left gap-4'>
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

          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 sm:-mx-6 lg:-mx-8'>
              <div className='py-2 sm:px-6 lg:px-8'>
                <div className='overflow-x-auto'>
                  <table className='divide-y divide-gray-300 text-center min-w-full'>
                    <thead>
                      <tr>
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
    </>
  );
};

export default Content;
