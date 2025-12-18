'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import { Tooltip } from 'react-tooltip';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import LoadingSpinner from '@/components/LoadingSpinner';
import useGetPersonelMovementList from './hooks/useGetPersonelMovementList';
import CreatePersonelMovementModal from './modals/CreatePersonelMovementModal';
import EditPersonelMovementModal from './modals/EditPersonelMovementModal';
import PrintModal from './modals/PrintModal';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import PrintIcon from '@/svg/PrintIcon';
import EditIcon from '@/svg/EditIcon';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';

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

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
  const [isOpenCreatePersonelMovementModal, setIsOpenCreatePersonelMovementModal] = useState(false);
  const [isOpenEditPersonelMovementModal, setIsOpenEditPersonelMovementModal] = useState<T_ModalData | null>(null);
  const [isOpenPrintPersonelMovementModal, setIsOpenPrintPersonelMovementModal] = useState<T_ModalData | null>(null);
  const [personelMovementList, setPersonelMovementList] = useState<any>([]);
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
  const [isSearching, setIsSearching] = useState(false);

  const cachedData: any = cachedProfile?.state?.data;
  const {
    data: personelMovementListData,
    isLoading: isLoadingPersonelMovementList,
    refetch: personelMovementListRefetch,
  } = useGetPersonelMovementList({ ...appliedFilter, pageSize: pageSize, currentPage: currentPage });

  useEffect(() => {
    if (personelMovementListData) {
      const formattedRecords = personelMovementListData.records.map((item: any) => ({
        ...item,
        created_at: formatDateToLocal(item.created_at)
      }));
      setPersonelMovementList(formattedRecords);
      setPagination({
        totalPages: personelMovementListData.total_pages,
        totalRecords: personelMovementListData.total_records,
      });
    }
  }, [personelMovementListData]);

  useEffect(() => {
    personelMovementListRefetch();
  }, [currentPage, pageSize, personelMovementListRefetch]);

  useEffect(() => {
    if (!isLoadingPersonelMovementList && isSearching) {
      setIsSearching(false);
    }
  }, [isLoadingPersonelMovementList, isSearching]);

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

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

  const renderRows = () => {
    if (isSearching || isLoadingPersonelMovementList) {
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
    if (personelMovementList && personelMovementList.length > 0) {
      return personelMovementList.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.id}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.created_at}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.employee}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.position}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.reason}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span
              className={
                item.status === 'approved'
                  ? 'text-green-700 font-bold'
                  : item.status === 'pending'
                  ? 'text-yellow-600 font-bold'
                  : item.status === 'rejected'
                  ? 'text-red-600 font-bold'
                  : 'text-gray-700 font-bold'
              }
            >
              {item.status}
            </span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            <div className='flex space-x-2 justify-center'>
              <button 
                onClick={() => {
                  setIsOpenEditPersonelMovementModal({
                    id: item.id,
                    open: true,
                  });
                }}
              >
                <EditIcon />
              </button>
              <button 
                onClick={() => {
                  setIsOpenPrintPersonelMovementModal({
                    id: item.id,
                    open: true,
                  });
                }}
              >
                <PrintIcon />
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
            <h4 className='text-center text-gray-300 text-sm mb-4'>
              Please click create to add employee compensation logbook.
            </h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 pb-56 md:pb-0 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/manage' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Manage</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Employee Movement</h2>
        </div>

        {/* Content Section with flex-1 */}
        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          <div className={classNames('flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex-none flex flex-col md:flex-row items-left md:items-center gap-2 flex-wrap md:flex-nowrap'>
              <div className='relative flex-1 md:flex-none min-w-[140px] md:min-w-0'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className='appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 md:placeholder:text-black text-sm leading-6'
                  selected={pendingFilter.from}
                  pickerOnChange={(date: any) => {
                    setPendingFilter({ ...pendingFilter, from: date });
                  }}
                  inputOnChange={(value: any) => {
                    setPendingFilter({ ...pendingFilter, from: value });
                  }}
                />
              </div>
              <p className='text-gray-600 text-sm md:text-base self-center'>to</p>
              <div className='relative flex-1 md:flex-none min-w-[140px] md:min-w-0'>
                <CustomDatePicker
                  id='to-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className='appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 md:placeholder:text-black text-sm leading-6'
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
                <input
                  type='text'
                  name='search'
                  id='search'
                  data-tooltip-id='search-tooltip'
                  data-tooltip-content='Search for: Name / Position / Reason'
                  data-tooltip-place='bottom'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  value={pendingFilter.search}
                  onChange={(e) => {
                    setPendingFilter({ ...pendingFilter, search: e.target.value });
                  }}
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
              <SmartButton
                id="create-employee-movement-btn"
                onClick={() => setIsOpenCreatePersonelMovementModal(true)}
                className='bg-green-500 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
              >
                Create PMF
              </SmartButton>
            </div>
          </div>

          <div className={classNames('mt-8 flow-root', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300 text-center'>
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Ref #
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Employee Name
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Position
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Reason
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Status
                      </th>
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
      <CreatePersonelMovementModal
        refetch={personelMovementListRefetch}
        isOpen={isOpenCreatePersonelMovementModal}
        setIsOpen={setIsOpenCreatePersonelMovementModal}
      />
      {isOpenEditPersonelMovementModal && (
        <EditPersonelMovementModal  
          refetch={personelMovementListRefetch}
          isOpen={isOpenEditPersonelMovementModal}
          setIsOpen={setIsOpenEditPersonelMovementModal}
        />
      )}
      {isOpenPrintPersonelMovementModal && (
        <PrintModal
          refetch={personelMovementListRefetch}
          isOpen={isOpenPrintPersonelMovementModal}
          setIsOpen={setIsOpenPrintPersonelMovementModal}
        />
      )}

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;
