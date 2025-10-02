'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import { Menu, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { Tooltip } from 'react-tooltip';
import { ArrowLeftIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

import LoadingSpinner from '@/components/LoadingSpinner';
import CustomToast from '@/components/CustomToast';
import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import classNames from '@/helpers/classNames';

import useGetShcMinutesMeetingItems from './hooks/useGetShcMinutesMettingItems';
import useUpdateShcMinutesMeeting from './hooks/useUpdateShcMinutesMeeting';
import useBulkDeleteShcMinutesMeeting from './hooks/useBulkDeleteShcMinutesMeeting';
import CreateShcMettingMinutesModal from './modals/CreateShcMettingMinutesModal';
import UpdateShcMinutesMeetingModal from './modals/UpdateShcMinutesMeeting';
import DeleteShcMinutesMeetingModal from './modals/DeleteShcMinutesMeetingModal';
import ExportProgressModal from './modals/ExportProgressModals';
import SendEmailModal from './modals/SendEmailModal';

import SelectChevronDown from '@/svg/SelectChevronDown';
import EditIcon from '@/svg/EditIcon';
import EmailLogo from '@/svg/EmailLogo';
import DeleteIcon from '@/svg/DeleteIcon';
import BulkDeleteModal from '@/components/BulkDeleteModal';


type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

const statusOptions = [
  { value: 'on-schedule', label: 'On Schedule', color: 'bg-purple-100 text-purple-700' },
  { value: 'for-submission', label: 'For Submission', color: 'bg-blue-100 text-blue-700' },
  { value: 'for-review', label: 'For Review', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-700' },
];

function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const [shcMinutesMeetingItems, setShcMinutesMeetingItems] = useState<any>([]);
  const [isShcMinutesMeetingDeleteModalOpen, setIsShcMinutesMeetingDeleteModalOpen] = useState<T_ModalData | null>(
    null
  );
  const [isUpdateShcMinutesMeetingModalOpen, setIsUpdateShcMinutesMeetingModalOpen] = useState<T_ModalData | null>(
    null
  );
  const [isCreateShcMeetingMinutesModalOpen, setIsCreateShcMeetingMinutesModalOpen] = useState<boolean>(false);
  const [isExportProgressModalOpen, setIsExportProgressModalOpen] = useState<boolean>(false);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState<T_ModalData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Bulk delete states
  const [selectedShcMinutesMeeting, setSelectedShcMinutesMeeting] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const cachedRigths = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };
  const updateShcMinutesMeeting = useUpdateShcMinutesMeeting();
  const bulkDeleteMutation = useBulkDeleteShcMinutesMeeting();
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [itemsFilter, setItemsFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const {
    data: shcMinutesMeetingData,
    isLoading: isShcMinutesMeetingLoading,
    refetch: shcMinutesMeetingRefetch,
  } = useGetShcMinutesMeetingItems({
    ...itemsFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });

  // Form Methods
  const createFormMethods = useForm();
  const editFormMethods = useForm();

  const menuOptions = [ 
    {
      name: 'Export',
      action: () => {
        setIsExportProgressModalOpen(true);
      },
      disabled: !cachedRigths?.state?.data?.export_dole_SHC_minute,
    },
  ];

  useEffect(() => {
    if (shcMinutesMeetingData) {
      const formattedRecords = shcMinutesMeetingData.records.map((item: any) => {
        // Create a new object to avoid mutating the original data
        const formattedItem = { ...item };
        
        // Format date
        const incidentDate = new Date(formattedItem.date_of_meeting);
        formattedItem.date_of_meeting = `${incidentDate.getMonth() + 1}/${incidentDate.getDate()}/${incidentDate.getFullYear()}`;

        // Format time_of_meeting to 12-hour format
        if (formattedItem.time_of_meeting) {
          const [hours, minutes, seconds] = formattedItem.time_of_meeting.split(":");
          const date = new Date();
          date.setHours(Number(hours), Number(minutes), Number(seconds || 0));
          formattedItem.time_of_meeting = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
        }
        
        // Ensure attendees and absentees are arrays
        formattedItem.attendees = Array.isArray(formattedItem.attendees) ? formattedItem.attendees : [];
        formattedItem.absentees = Array.isArray(formattedItem.absentees) ? formattedItem.absentees : [];

        return formattedItem;
      });
      
      setShcMinutesMeetingItems(formattedRecords);
      setPagination({
        totalPages: shcMinutesMeetingData.total_pages,
        totalRecords: shcMinutesMeetingData.total_records,
      });
    }
  }, [shcMinutesMeetingData]);

  useEffect(() => {
    shcMinutesMeetingRefetch();
  }, [currentPage, pageSize, shcMinutesMeetingRefetch]);

  useEffect(() => {
    if (!isShcMinutesMeetingLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isShcMinutesMeetingLoading, isSearching]);

  // Update select all state when SHC minutes meeting items change
  useEffect(() => {
    if (shcMinutesMeetingItems) {
      const allShcMinutesMeetingIds = new Set(shcMinutesMeetingItems.map((s: any) => s.id));
      const allSelected = allShcMinutesMeetingIds.size > 0 && 
        Array.from(allShcMinutesMeetingIds).every((id: any) => selectedShcMinutesMeeting.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedShcMinutesMeeting, shcMinutesMeetingItems]);

  const handleStatusChange = async (itemId: number, newStatus: string) => {
    try {
      await updateShcMinutesMeeting.mutateAsync({
        shc_meeting_minutes_id: itemId,
        data: { status: newStatus }
      });
      
      toast.custom(() => <CustomToast message='Status updated successfully.' type='success' />, { duration: 3000 });
      shcMinutesMeetingRefetch();
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error || 'Failed to update status.'} type='error' />, { duration: 5000 });
    }
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-700';
  };

  // Handle individual SHC minutes meeting selection
  const handleShcMinutesMeetingSelect = (shcMinutesMeetingId: number) => {
    setSelectedShcMinutesMeeting(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shcMinutesMeetingId)) {
        newSet.delete(shcMinutesMeetingId);
      } else {
        newSet.add(shcMinutesMeetingId);
      }
      return newSet;
    });
  };

  // Handle select all functionality
  const handleSelectAll = () => {
    if (!shcMinutesMeetingItems) return;
    
    if (selectAll) {
      setSelectedShcMinutesMeeting(new Set());
    } else {
      const allIds = shcMinutesMeetingItems.map((item: any) => item.id);
      setSelectedShcMinutesMeeting(new Set(allIds));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedShcMinutesMeeting.size === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const shcMinutesMeetingIds = Array.from(selectedShcMinutesMeeting);
      await bulkDeleteMutation.mutateAsync(shcMinutesMeetingIds);
      
      toast.custom(() => <CustomToast message={`${selectedShcMinutesMeeting.size} SHC minutes of meeting deleted successfully.`} type="success" />, { duration: 3000 });
      setSelectedShcMinutesMeeting(new Set());
      setSelectAll(false);
      setIsBulkDeleteModalOpen(false);
      shcMinutesMeetingRefetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete SHC minutes of meeting';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
    }
  };

  const handlePrint = () => {
    // Create a new div element
    const printDiv = document.createElement('div');

    // Copy the content of the original printSection
    const originalPrintSection = document.getElementById('printSection');
    if (originalPrintSection) {
      printDiv.innerHTML = originalPrintSection.innerHTML;
    }

    // Style the new div to be off-screen
    printDiv.style.width = '1980px';
    printDiv.style.height = '100%';
    printDiv.style.position = 'absolute';
    printDiv.style.left = '-9999px';
    printDiv.style.top = '-9999px';

    // Add the new div to the body
    document.body.appendChild(printDiv);

    // Use html2canvas on the new div
    html2canvas(printDiv).then((canvas) => {
      // Remove the temporary div
      document.body.removeChild(printDiv);

      const imgData = canvas.toDataURL('image/png');
      const newWindow = window.open('', '_blank');
      newWindow?.document.write(`<img src="${imgData}" style="width:100%;height:auto;">`);
      newWindow?.document.close();
      setTimeout(() => {
        newWindow?.print();
      }, 500);
    });
  };

  const handleSearch = () => {
    const dateFrom = Date.parse(itemsFilter.from);
    const dateTo = Date.parse(itemsFilter.to);

    if (dateFrom && !dateTo) {
      return toast.custom(() => <CustomToast message='Invalid date to.' type='error' />, {
        duration: 5000,
      });
    }
    if (!dateFrom && dateTo) {
      return toast.custom(() => <CustomToast message='Invalid date from.' type='error' />, {
        duration: 5000,
      });
    }
    if (dateFrom > dateTo) {
      return toast.custom(
        () => <CustomToast message='You have entered an invalid date range. Please select again.' type='error' />,
        {
          duration: 5000,
        }
      );
    }
    setIsSearching(true);
    shcMinutesMeetingRefetch();
  };

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const renderRows = () => {
    if (isSearching || isShcMinutesMeetingLoading) {
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
    if (shcMinutesMeetingItems && shcMinutesMeetingItems.length > 0) {
      return shcMinutesMeetingItems.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <input
              type="checkbox"
              checked={selectedShcMinutesMeeting.has(item.id)}
              onChange={() => handleShcMinutesMeetingSelect(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date_of_meeting}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.time_of_meeting}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.venue}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{Array.isArray(item.attendees) ? item.attendees.length : 0}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{Array.isArray(item.absentees) ? item.absentees.length : 0}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='relative inline-block'>
              <select
                value={item.status || 'on-schedule'}
                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                disabled={!cachedRigths?.state?.data?.edit_dole_SHC_minute}
                className={`px-4 py-2 rounded-lg text-sm font-bold ${getStatusColor(item.status || 'on-schedule')} border-0 focus:ring-0 disabled:opacity-50 appearance-none pr-8`}
              >
                {statusOptions.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    style={{
                      backgroundColor: 'white',
                      color: '#111827'
                    }}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                <SelectChevronDown />
              </div>
            </div>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            <div className='flex items-center justify-center space-x-2'>
              <button
                onClick={() =>
                  setIsUpdateShcMinutesMeetingModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={!cachedRigths?.state?.data?.edit_dole_SHC_minute}
              >
                <EditIcon />
              </button>
              <button
                // className='opacity-50'
                onClick={() =>
                  setIsSendEmailModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                // disabled={!cachedRigths?.state?.data?.edit_dole_SHC_minute}
                // disabled={true}
                // data-tooltip-id='email-tooltip'
                // data-tooltip-content='Not available'
                // data-tooltip-place='bottom'
                disabled={!cachedRigths?.state?.data?.edit_dole_SHC_minute}
              >
                <EmailLogo />
              </button>
              <button
                onClick={() =>
                  setIsShcMinutesMeetingDeleteModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
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
          <td colSpan={100}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add data.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24'>
        <div className='flex p-4'>
          <Link href='/dole' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h2 className='text-xl font-bold'>DOLE</h2>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>SHC Minutes of Meeting</h2>
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
                  data-tooltip-content='Search for: Venue'
                  data-tooltip-place='bottom'
                  className='block flex-1 rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) => setItemsFilter({ ...itemsFilter, search: e.target.value })}
                  placeholder='Search ...'
                />
                <button
                  className='bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-100 flex items-center justify-center'
                  onClick={handleSearch}
                >
                  <MagnifyingGlassIcon className='h-5 w-5' />
                </button>
              </div>
            </div>
            <div className='flex-1 flex justify-start lg:justify-end'>
              <button
                className='bg-green-500 rounded-l-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsCreateShcMeetingMinutesModalOpen(true)}
                disabled={!cachedRigths?.state?.data?.create_dole_SHC_minute}
              >
                CREATE
              </button>
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
                      {menuOptions.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <span
                              className={classNames(
                                'block px-4 py-2 text-sm cursor-pointer text-center',
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                item.disabled ? 'bg-gray-200 cursor-not-allowed opacity-50' : ''
                              )}
                              onClick={() => {
                                if (!item.disabled) {
                                  item.action();
                                }
                              }}
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
          </div>

          {/* Bulk Actions Section - Left Side */}
          <div className="mt-8">
            <div className="flex flex-wrap justify-between items-center gap-2">
              {/* Bulk Actions - Left Side */}
              {selectedShcMinutesMeeting.size > 0 && (
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
                    onClick={() => setSelectedShcMinutesMeeting(new Set())}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Clear Selected
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    {selectedShcMinutesMeeting.size} selected
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
                          disabled={!shcMinutesMeetingItems || shcMinutesMeetingItems.length === 0}
                          className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                        />
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date of Meeting
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Time of Meeting
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Venue
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        No. of Attendees
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        No. of Absentees
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Status
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 text-center'>
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
      {isCreateShcMeetingMinutesModalOpen && (
        <CreateShcMettingMinutesModal
          refetch={shcMinutesMeetingRefetch}
          isOpen={isCreateShcMeetingMinutesModalOpen}
          setIsOpen={setIsCreateShcMeetingMinutesModalOpen}
          formMethods={createFormMethods}
        />
      )}
      {isUpdateShcMinutesMeetingModalOpen && (
        <UpdateShcMinutesMeetingModal
          refetch={shcMinutesMeetingRefetch}
          isOpen={isUpdateShcMinutesMeetingModalOpen}
          setIsOpen={setIsUpdateShcMinutesMeetingModalOpen}
          formMethods={editFormMethods}
        />
      )}
      {isShcMinutesMeetingDeleteModalOpen && (
        <DeleteShcMinutesMeetingModal
          refetch={shcMinutesMeetingRefetch}
          isOpen={isShcMinutesMeetingDeleteModalOpen}
          setIsOpen={setIsShcMinutesMeetingDeleteModalOpen}
        />
      )}
      {isExportProgressModalOpen && (
        <ExportProgressModal
          isOpen={isExportProgressModalOpen}
          setIsOpen={setIsExportProgressModalOpen}
          itemsFilter={itemsFilter}
        />
      )}
      {isSendEmailModalOpen && (
        <SendEmailModal
          refetch={shcMinutesMeetingRefetch}
          isOpen={isSendEmailModalOpen}
          setIsOpen={setIsSendEmailModalOpen}
        />
      )}
      
      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        selectedCount={selectedShcMinutesMeeting.size}
        moduleName="SHC minutes of meeting"
        onConfirm={confirmBulkDelete}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        isLoading={bulkDeleteMutation.isLoading}
      />

      <Tooltip id='search-tooltip' />
      <Tooltip id='email-tooltip' />
    </>
  );
}

export default Content;
