'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';

import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { Tooltip } from 'react-tooltip';

import CustomToast from '@/components/CustomToast';
import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import classNames from '@/helpers/classNames';
import CreateShcMettingMinutesModal from './modals/CreateShcMettingMinutesModal';

import { ArrowLeftIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import useGetShcMinutesMeetingItems from './hooks/useGetShcMinutesMettingItems';
import UpdateShcMinutesMeetingModal from './modals/UpdateShcMinutesMeeting';
import DeleteShcMinutesMeetingModal from './modals/DeleteShcMinutesMeetingModal';
import ExportProgressModal from './modals/ExportProgressModals';
import EmailLogo from '@/svg/EmailLogo';
import SendEmailModal from './modals/SendEmailModal';
import { useQueryClient } from '@tanstack/react-query';
import useUpdateShcMinutesMeeting from './hooks/useUpdateShcMinutesMeeting';
import SelectChevronDown from '@/svg/SelectChevronDown';

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
  const queryClient = useQueryClient();
  const cachedRigths = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };
  const updateShcMinutesMeeting = useUpdateShcMinutesMeeting();
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
    if (shcMinutesMeetingItems && shcMinutesMeetingItems.length > 0) {
      return shcMinutesMeetingItems.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
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
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/dole' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h2 className='text-xl font-bold'>DOLE</h2>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>SHC Minutes of Meeting</h2>
          <div className='mt-6 flex flex-col lg:flex-row items-left gap-4'>
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
                disabled={!hasActiveSubscription || !cachedRigths?.state?.data?.create_dole_SHC_minute}
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

          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300 text-center'>
                  <thead>
                    <tr>
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
        />
      )}
      {isUpdateShcMinutesMeetingModalOpen && (
        <UpdateShcMinutesMeetingModal
          refetch={shcMinutesMeetingRefetch}
          isOpen={isUpdateShcMinutesMeetingModalOpen}
          setIsOpen={setIsUpdateShcMinutesMeetingModalOpen}
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

      <Tooltip id='search-tooltip' />
      <Tooltip id='email-tooltip' />
    </>
  );
}

export default Content;
