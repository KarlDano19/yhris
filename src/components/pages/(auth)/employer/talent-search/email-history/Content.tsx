'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import useGetEmailMonitoring from '../hook/email-monitoring/useGetEmailMonitoring';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import DeleteIcon from '@/svg/DeleteIcon';
import DeleteModal from '../modal/DeleteModal';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

const Content = () => {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<T_ModalData | null>(null);
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const cachedRigths = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };

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

  useEffect(() => {
    emailMonitoringRefetch();
  }, [appliedFilter, pageSize, currentPage, emailMonitoringRefetch]);

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
            <div role='status' className='py-5 text-center'>
              <svg
                aria-hidden='true'
                className='inline w-12 h-12 mr-2 text-gray-200 animate-spin fill-yellow-400'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
              <span className='sr-only'>Loading...</span>
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
                disabled={!cachedRigths?.state?.data?.edit_employee}
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
            {/* <div className='flex-1 flex justify-start lg:justify-end'>
              <button
                // onClick={() => setIsAddEmailModalOpen(true)}
                className='bg-green-500 rounded-l-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                disabled={!cachedRigths?.state?.data?.create_employee}
              >
                SEND EMAIL
              </button>
            </div> */}
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
      {isDeleteModalOpen && isDeleteModalOpen.open && (
        <DeleteModal refetch={emailMonitoringRefetch} isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} />
      )}
    </>
  );
};

export default Content;
