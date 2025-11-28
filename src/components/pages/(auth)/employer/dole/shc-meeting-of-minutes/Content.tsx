'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';

import { Menu, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { Tooltip } from 'react-tooltip';
import { ArrowLeftIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { useQueryClient } from '@tanstack/react-query';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';
import { useSmartMenuOptions } from '@/components/SmartPermissions/useSmartMenuOptions';

import LoadingSpinner from '@/components/LoadingSpinner';
import CustomToast from '@/components/CustomToast';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import ProgressModal from '@/components/ProgressModal';
import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import classNames from '@/helpers/classNames';

import useGetShcMinutesMeetingItems from './hooks/useGetShcMinutesMettingItems';
import useDeleteShcMinutesMeeting from './hooks/useDeleteShcMinutesMeeting';
import useUpdateShcMinutesMeeting from './hooks/useUpdateShcMinutesMeeting';
import useBulkDeleteShcMinutesMeeting from './hooks/useBulkDeleteShcMinutesMeeting';
import CreateShcMettingMinutesModal from './modals/CreateShcMettingMinutesModal';
import UpdateShcMinutesMeetingModal from './modals/UpdateShcMinutesMeeting';
import ExportProgressModal from './modals/ExportProgressModals';
import SendEmailModal from '@/components/SendEmailModal';
import ShcMeetingMinutesAttachmentSection from './components/ShcMeetingMinutesAttachmentSection';
import useSendEmail from './hooks/useSendEmail';
import useGetMinutesMeetingDetails from './hooks/useGetMinutesMeetingDetails';

import SelectChevronDown from '@/svg/SelectChevronDown';
import EditIcon from '@/svg/EditIcon';
import EmailLogo from '@/svg/EmailLogo';
import DeleteIcon from '@/svg/DeleteIcon';
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

const statusOptions = [
  { value: 'on-schedule', label: 'On Schedule', color: 'bg-purple-100 text-purple-700' },
  { value: 'for-submission', label: 'For Submission', color: 'bg-blue-100 text-blue-700' },
  { value: 'for-review', label: 'For Review', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-700' },
];

function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const queryClient = useQueryClient();
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
  
  // Email-specific state
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentExist, setAttachmentExist] = useState(false);
  
  // Bulk delete states
  const [selectedShcMinutesMeeting, setSelectedShcMinutesMeeting] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteConfirmModalOpen, setIsBulkDeleteConfirmModalOpen] = useState<DeleteModalData | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);
  
  const updateShcMinutesMeeting = useUpdateShcMinutesMeeting();
  const { mutate: deleteShcMinutesMeeting, isLoading: isDeleteShcMinutesMeetingLoading } = useDeleteShcMinutesMeeting();
  const { mutate: sendEmailMutate, isLoading: isEmailLoading } = useSendEmail();
  
  // Get the current meeting details for attachment
  const { data: currentMeetingDetails } = useGetMinutesMeetingDetails(
    isSendEmailModalOpen?.id || null
  );
  
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
      id: 'export-dole-shc-minute-btn',
      name: 'Export',
      action: () => {
        setIsExportProgressModalOpen(true);
      },
    },
  ];

  const smartMenuOptions = useSmartMenuOptions(menuOptions);

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

  // Email-specific handlers
  const handleViewAttachment = (url: string) => {
    window.open(url, '_blank');
  };

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.custom(() => <CustomToast message='File size must be less than 10MB.' type='error' />, { duration: 2000 });
        // Clear the file input
        event.target.value = '';
        return;
      }
      setAttachment(file);
      setAttachmentExist(true);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setAttachmentExist(false);
  };

  const handleEmailSubmit = (data: any) => {
    if (isSendEmailModalOpen && isSendEmailModalOpen.id) {
      const payload = new FormData();
      payload.append('to', JSON.stringify(data.to));
      payload.append('subject', data.subject);
      payload.append('context', data.message);
      if (data.cc && data.cc.length > 0) payload.append('cc', JSON.stringify(data.cc));
      if (data.bcc && data.bcc.length > 0) payload.append('bcc', JSON.stringify(data.bcc));
      
      // Include attachment if present
      if (data.attachment) { // Prioritize attachment from global modal's form data
        payload.append('attachment', data.attachment);
      } else if (attachment) { // Fallback to local attachment state
        payload.append('attachment', attachment);
      }

      // Add shc_meeting_minutes_id
      payload.append('shc_meeting_minutes_id', isSendEmailModalOpen.id.toString());

      const callbackReq = {
        onSuccess: () => {
          // Invalidate the meeting details cache to fetch fresh data with updated attachment
          queryClient.invalidateQueries(['minutesMeetingDetailsCache', isSendEmailModalOpen.id]);
          setIsSendEmailModalOpen(null);
          shcMinutesMeetingRefetch();
          // Clear attachment state after successful send
          setAttachment(null);
          setAttachmentExist(false);
          toast.custom(() => <CustomToast message='Email sent successfully.' type='success' />, { duration: 3000 });
        },
        onError: (err: any) => {
          const errorMessage = err?.message || err?.response?.data?.message || 'Failed to send email.';
          toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 5000 });
        }
      };
      
      sendEmailMutate(payload, callbackReq);
    }
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

  // Handle bulk delete - opens confirmation modal
  const handleBulkDelete = () => {
    if (selectedShcMinutesMeeting.size === 0) return;
    setBulkDeleteCount(selectedShcMinutesMeeting.size);
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
      const shcMinutesMeetingIds = Array.from(selectedShcMinutesMeeting);
      await bulkDeleteMutation.mutateAsync(shcMinutesMeetingIds);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete SHC minutes of meeting';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
      setIsBulkDeleteModalOpen(false);
    }
  };

  // Handle success after deletion completes
  const handleBulkDeleteSuccess = () => {
    toast.custom(() => <CustomToast message={`${bulkDeleteCount} SHC minutes of meeting deleted successfully.`} type="success" />, { duration: 3000 });
    setSelectedShcMinutesMeeting(new Set());
    setSelectAll(false);
    setBulkDeleteCount(0);
    shcMinutesMeetingRefetch();
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
              <SmartButton
                id="edit-dole-shc-minute-btn"
                onClick={() =>
                  setIsUpdateShcMinutesMeetingModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
              >
                <EditIcon />
              </SmartButton>
              <SmartButton
                id="edit-dole-shc-minute-btn"
                onClick={() =>
                  setIsSendEmailModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
              >
                <EmailLogo />
              </SmartButton>
              <SmartButton
                id="edit-dole-shc-minute-btn"
                onClick={() =>
                  setIsShcMinutesMeetingDeleteModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={selectedShcMinutesMeeting.size > 1}
                className={selectedShcMinutesMeeting.size > 1 ? 'opacity-50 cursor-not-allowed' : ''}
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
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/dole' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h2 className='text-xl font-bold'>DOLE</h2>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>SHC Minutes of Meeting</h2>
        </div>

        {/* Content Section with flex-1 */}
        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          <div className={classNames('flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            {/* Desktop Layout */}
            <div className='hidden md:flex flex-none flex-col lg:flex-row items-left md:items-center gap-2'>
              <div className='relative'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full rounded-md py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
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
              <p className='text-gray-600'>to</p>
              <div className='relative'>
                <CustomDatePicker
                  id='to-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full rounded-md py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
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

            {/* Mobile Layout */}
            <div className='md:hidden flex-none flex flex-col items-left gap-2'>
              <div className='flex justify-start items-center gap-2 flex-wrap'>
                <div className='relative flex-1 min-w-[140px]'>
                  <CustomDatePicker
                    id='from-datepicker-mobile'
                    placeholder={'From Date'}
                    className='appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm leading-6'
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
                <p className='text-gray-600 text-sm'>to</p>
                <div className='relative flex-1 min-w-[140px]'>
                  <CustomDatePicker
                    id='to-datepicker-mobile'
                    placeholder={'To Date'}
                    className='appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm leading-6'
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
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
              <SmartButton
                id="create-dole-shc-minute-btn"
                className='bg-green-500 rounded-l-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsCreateShcMeetingMinutesModalOpen(true)}
              >
                CREATE
              </SmartButton>
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
                      {smartMenuOptions.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <span
                              onClick={() => item.action()}
                              className={classNames(
                                'block px-4 py-2 text-sm cursor-pointer text-center',
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                item.disabled ? 'bg-gray-200 cursor-not-allowed opacity-50' : ''
                              )}
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
          {selectedShcMinutesMeeting.size > 1 && (
            <div className="mt-4 ">
              <div className="flex items-center gap-3">
                <SmartButton
                  id="edit-dole-shc-minute-btn"
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
                </SmartButton>
                <span className="text-sm text-gray-700 font-medium">
                  {selectedShcMinutesMeeting.size} selected
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
        <DeleteModal
          isOpen={isShcMinutesMeetingDeleteModalOpen}
          setIsOpen={setIsShcMinutesMeetingDeleteModalOpen}
          onConfirm={() => {
            const callbackReq = {
              onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
                setIsShcMinutesMeetingDeleteModalOpen(null);
                shcMinutesMeetingRefetch();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
              },
            };
            deleteShcMinutesMeeting(isShcMinutesMeetingDeleteModalOpen.id, callbackReq);
          }}
          isLoading={isDeleteShcMinutesMeetingLoading}
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
          title="Send SHC Meeting Minutes"
          isOpen={!!isSendEmailModalOpen}
          onClose={() => setIsSendEmailModalOpen(null)}
          onSubmit={handleEmailSubmit}
          defaultRecipients={[]}
          showAttachment={true}
          customAttachmentSection={
            <ShcMeetingMinutesAttachmentSection
              pdfAttachment={currentMeetingDetails?.attachment || null}
              onViewAttachment={handleViewAttachment}
              onAttachmentUpload={handleAttachmentUpload}
              onRemoveAttachment={handleRemoveAttachment}
              attachment={attachment}
              attachmentExist={attachmentExist}
            />
          }
        />
      )}
      
      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteConfirmModalOpen?.open && (
        <DeleteModal
          isOpen={isBulkDeleteConfirmModalOpen}
          setIsOpen={setIsBulkDeleteConfirmModalOpen}
          onConfirm={confirmBulkDeleteWarning}
          isLoading={false}
          customText={`${bulkDeleteCount} SHC minutes of meeting${bulkDeleteCount > 1 ? 's' : ''}`}
        />
      )}

      {/* Bulk Delete Progress Modal */}
      {isBulkDeleteModalOpen && (
        <ProgressModal
          isOpen={isBulkDeleteModalOpen}
          setIsOpen={setIsBulkDeleteModalOpen}
          onConfirm={confirmBulkDelete}
          title={`Deleting ${bulkDeleteCount} SHC minutes of meeting${bulkDeleteCount > 1 ? 's' : ''}...`}
          isProcessing={bulkDeleteMutation.isLoading}
          onSuccess={handleBulkDeleteSuccess}
        />
      )}

      <Tooltip id='search-tooltip' />
      <Tooltip id='email-tooltip' />
    </>
  );
}

export default Content;
