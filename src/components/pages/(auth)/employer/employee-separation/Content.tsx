'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import LoadingSpinner from '@/components/LoadingSpinner';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import Pagination from '@/components/Pagination';
import AddSeparationModal from './modals/AddSeparationModal';
import LetterModal from './modals/LetterModal';
import SignDocumentsModal from './modals/SignDocumentsModal';
import LastPayModal from './modals/LastPayModal';
import QuitclaimModal from './modals/QuitclaimModal';
import DeleteSeparationModal from './modals/DeleteSeparationModal';
import useGetSeparationItems from './hooks/useGetSeparationItems';
import usePatchSeparation from './hooks/usePatchSeparation';
import SeparationLetter from './SeparationLetter';
import SignDocuments from './SignDocuments';
import LastPay from './LastPay';
import Quitclaim from './Quitclaim';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import DeleteIcon from '@/svg/DeleteIcon';

import {
  T_DocumentsModal,
  T_LastPayModal,
  T_LetterModal,
  T_QuitclaimModal,
  T_DeleteSepartionModal,
} from '@/types/globals';
import { useQueryClient } from '@tanstack/react-query';

import classNames from '@/helpers/classNames';

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [separationItems, setSeparationItems] = useState<any>([]);
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
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalRecords: number;
    totalPages: number;
  }>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [isAddSeparationModalOpen, setIsAddSeparationModalOpen] = useState(false);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState<T_LetterModal | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState<T_DocumentsModal | null>(null);
  const [isLastPayModalOpen, setIsLastPayModalOpen] = useState<T_LastPayModal | null>(null);
  const [isQuitclaimModalOpen, setIsQuitclaimModalOpen] = useState<T_QuitclaimModal | null>(null);
  const [isDeleteSepartionModalOpen, setIsDeleteSepartionModalOpen] = useState<T_DeleteSepartionModal | null>(null);
  const { mutate, isLoading } = usePatchSeparation();
  const { data: dataSeparation, isLoading: isGetSeparationLoading, refetch } = useGetSeparationItems({
    ...appliedFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };
  const [isSearching, setIsSearching] = useState(false);

  const setReceived = (id: string, emailType: string) => {
    const itemIndex = separationItems.findIndex((item: any) => item.id === id);
    const separationItemsCopy = JSON.parse(JSON.stringify(separationItems));
    const currentDate = new Date();
    separationItemsCopy[itemIndex].id = id;
    separationItemsCopy[itemIndex].actionType = 'received';
    separationItemsCopy[itemIndex].emailType = emailType;
    separationItemsCopy[itemIndex].dateReceived = currentDate;
    if (emailType === 'letters') {
      separationItemsCopy[itemIndex].isLetterReceived = true;
      separationItemsCopy[itemIndex].letterReceivedDate = new Intl.DateTimeFormat('en-US').format(currentDate);
    }
    if (emailType === 'sign documents') {
      separationItemsCopy[itemIndex].isDocumentsReceived = true;
      separationItemsCopy[itemIndex].documentReceivedDate = new Intl.DateTimeFormat('en-US').format(currentDate);
    }
    if (emailType === 'quit claim') {
      separationItemsCopy[itemIndex].isQuitclaimReceived = true;
      separationItemsCopy[itemIndex].quitclaimReceivedDate = new Intl.DateTimeFormat('en-US').format(currentDate);
    }
    const callbackReq = {
      onSuccess: (data: any) => {
        setSeparationItems([...separationItemsCopy]);
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(separationItemsCopy[itemIndex], callbackReq);
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
    setAppliedFilter({
      ...itemsFilter,
      search: searchText
    });
  };

  useEffect(() => {
    if (!isGetSeparationLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isGetSeparationLoading, isSearching]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (dataSeparation) {
      let items = [];
      let totalPages = 1;
      let totalRecords = 0;

      // Handle paginated response structure
      if (dataSeparation.records) {
        items = dataSeparation.records.map((separation: any) => {
          separation['separationDate'] = Intl.DateTimeFormat('en-US').format(new Date(separation.date_of_separation));
          separation['name'] = separation.name;
          separation['reasonForLeaving'] = separation.reason_of_leaving;
          separation['isLetterSent'] = separation.is_letter_sent;
          separation['isLetterReceived'] = separation.is_letter_received;
          separation['letterReceivedDate'] =
            separation.letter_received_date &&
            new Intl.DateTimeFormat('en-US').format(new Date(separation.letter_received_date));
          separation['isDocumentsSent'] = separation.is_documents_sent;
          separation['isDocumentsReceived'] = separation.is_documents_received;
          separation['documentReceivedDate'] =
            separation.documents_received_date &&
            new Intl.DateTimeFormat('en-US').format(new Date(separation.documents_received_date));
          separation['isLastPayReleased'] = separation.is_last_pay_released;
          separation['isQuitclaimSigned'] = separation.is_quit_claim_signed;
          separation['isQuitclaimReceived'] = separation.is_quit_claim_received;
          separation['quitclaimReceivedDate'] =
            separation.quit_claim_received_date &&
            new Intl.DateTimeFormat('en-US').format(new Date(separation.quit_claim_received_date));
          separation['separationLetter'] = {
            date: '',
            to: '',
            message: '',
          };
          separation['acceptanceLetter'] = {
            date: '',
            to: '',
            message: '',
          };
          separation['signDocuments'] = {
            template: '',
            to: '',
            message: '',
          };
          separation['lastPay'] = {
            template: '',
            to: '',
            message: '',
          };
          separation['quitClaim'] = {
            template: '',
            to: '',
            message: '',
          };
          return separation;
        });
        totalPages = dataSeparation.total_pages || 1;
        totalRecords = dataSeparation.total_records || items.length;
      } 
      // Handle array response structure (no pagination from backend)
      else if (Array.isArray(dataSeparation)) {
        items = dataSeparation.map((separation: any) => {
          separation['separationDate'] = Intl.DateTimeFormat('en-US').format(new Date(separation.date_of_separation));
          separation['name'] = separation.name;
          separation['reasonForLeaving'] = separation.reason_of_leaving;
          separation['isLetterSent'] = separation.is_letter_sent;
          separation['isLetterReceived'] = separation.is_letter_received;
          separation['letterReceivedDate'] =
            separation.letter_received_date &&
            new Intl.DateTimeFormat('en-US').format(new Date(separation.letter_received_date));
          separation['isDocumentsSent'] = separation.is_documents_sent;
          separation['isDocumentsReceived'] = separation.is_documents_received;
          separation['documentReceivedDate'] =
            separation.documents_received_date &&
            new Intl.DateTimeFormat('en-US').format(new Date(separation.documents_received_date));
          separation['isLastPayReleased'] = separation.is_last_pay_released;
          separation['isQuitclaimSigned'] = separation.is_quit_claim_signed;
          separation['isQuitclaimReceived'] = separation.is_quit_claim_received;
          separation['quitclaimReceivedDate'] =
            separation.quit_claim_received_date &&
            new Intl.DateTimeFormat('en-US').format(new Date(separation.quit_claim_received_date));
          separation['separationLetter'] = {
            date: '',
            to: '',
            message: '',
          };
          separation['acceptanceLetter'] = {
            date: '',
            to: '',
            message: '',
          };
          separation['signDocuments'] = {
            template: '',
            to: '',
            message: '',
          };
          separation['lastPay'] = {
            template: '',
            to: '',
            message: '',
          };
          separation['quitClaim'] = {
            template: '',
            to: '',
            message: '',
          };
          return separation;
        });
        
        // Calculate pagination locally if backend doesn't support it
        totalRecords = items.length;
        totalPages = Math.ceil(totalRecords / pageSize);
      }

      setSeparationItems(items);
      setPagination({
        totalPages,
        totalRecords
      });
    }
  }, [dataSeparation, pageSize]);

  const renderRows = () => {
    if (isSearching || isGetSeparationLoading) {
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
    if (separationItems && separationItems.length > 0) {
      return separationItems.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.separationDate}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex gap-2'>
              <span>{item.name}</span>
            </div>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.reasonForLeaving}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
            <SeparationLetter
              id={item.id}
              isLetterSent={item.isLetterSent}
              isLetterReceived={item.isLetterReceived}
              letterReceivedDate={item.letterReceivedDate}
              setIsLetterModalOpen={setIsLetterModalOpen}
              setReceived={setReceived}
              isLoading={isLoading}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
            <SignDocuments
              id={item.id}
              isDocumentsSent={item.isDocumentsSent}
              isDocumentsReceived={item.isDocumentsReceived}
              documentReceivedDate={item.documentReceivedDate}
              setIsDocumentModalOpen={setIsDocumentModalOpen}
              setReceived={setReceived}
              isLoading={isLoading}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
            <LastPay
              id={item.id}
              isLastPayReleased={item.isLastPayReleased}
              quitclaimReceivedDate={item.quitclaimReceivedDate}
              setIsLastPayModalOpen={setIsLastPayModalOpen}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
            <Quitclaim
              id={item.id}
              isQuitclaimSigned={item.isQuitclaimSigned}
              isQuitclaimReceived={item.isQuitclaimReceived}
              quitclaimReceivedDate={item.quitclaimReceivedDate}
              setIsQuitclaimModalOpen={setIsQuitclaimModalOpen}
              setReceived={setReceived}
              isLoading={isLoading}
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 align-top'>
            <div className='flex justify-center space-x-2'>
              <button 
                onClick={() => setIsDeleteSepartionModalOpen({ open: true, id: item.id, name: item.name })}
                disabled={!cachedProfile?.state?.data?.edit_separation}
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
            <h4 className='text-center text-gray-300 text-sm mt-4'>{`There's no data yet.`}</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>
              Please click create to add separation of employee.
            </h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Dashboard</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Employee Resignation/Separation</h2>
          <div className={classNames('mt-6 flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex-none flex flex-col lg:flex-row items-left gap-2'>
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
                  data-tooltip-id='search-tooltip'
                  data-tooltip-content='Search for: Employee Name / Reason of Leaving'
                  data-tooltip-place='bottom'
                  name='search'
                  id='search'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) => setSearchText(e.target.value)}
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
              <button
                className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsAddSeparationModalOpen(true)}
                disabled={!cachedProfile?.state?.data?.create_separation}
              >
                CREATE
              </button>
            </div>
          </div>
          <div className={classNames('mt-8 flow-root', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='-mx-4 -my-2 overflow-x-auto md:overflow-visible sm:-mx-6 lg:-mx-8 '>
              <div className='min-w-full py-2 sm:px-6 lg:px-8 '>
                <table className='min-w-full divide-y divide-gray-300 text-center'>
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date of Resignation/Separation
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Name
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Reason of Leaving
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Letter of Documentation
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Sign Documents
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Last Pay
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Quitclaim
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
        </div>
      </div>
      <AddSeparationModal 
        isOpen={isAddSeparationModalOpen} 
        setIsOpen={setIsAddSeparationModalOpen} 
        refetch={refetch} 
      />
      <LetterModal
        separationItems={separationItems}
        refetch={refetch}
        type={isLetterModalOpen?.type}
        isOpen={isLetterModalOpen}
        setIsOpen={setIsLetterModalOpen}
      />
      <SignDocumentsModal
        separationItems={separationItems}
        refetch={refetch}
        isOpen={isDocumentModalOpen}
        setIsOpen={setIsDocumentModalOpen}
      />
      <LastPayModal
        separationItems={separationItems}
        setSeparationItems={setSeparationItems}
        isOpen={isLastPayModalOpen}
        setIsOpen={setIsLastPayModalOpen}
      />
      <QuitclaimModal
        separationItems={separationItems}
        setSeparationItems={setSeparationItems}
        isOpen={isQuitclaimModalOpen}
        setIsOpen={setIsQuitclaimModalOpen}
      />
      {isDeleteSepartionModalOpen && (
        <DeleteSeparationModal
          refetch={refetch}
          isOpen={isDeleteSepartionModalOpen}
          setIsOpen={setIsDeleteSepartionModalOpen}
        />
      )}

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;
