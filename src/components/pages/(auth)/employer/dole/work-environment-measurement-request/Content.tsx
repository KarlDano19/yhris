'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { Tooltip } from 'react-tooltip';
import { useForm } from 'react-hook-form';

import LoadingSpinner from '@/components/LoadingSpinner';
import CustomToast from '@/components/CustomToast';
import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import classNames from '@/helpers/classNames';
import useFileforge from '@/components/hooks/useFileforge';

import useGetWorkEnvironmentRequestItems from './hooks/useGetWorkEnvironmentRequestItems';
import { getPrintWorkEnvironmentRequestDetails } from './hooks/useGetPrintWorkEnvironmentRequestDetails';
import useUpdateWorkEnvironmentRequest from './hooks/useUpdateWorkEnvironmentRequest';
import CreateWemRequestModal from './modals/CreateWemRequestModal';
import DeleteWemRequestModal from './modals/DeleteWemRequestModal';
import EditWemRequestModal from './modals/EditWemRequestModal';
import SendEmailModal from './modals/SendEmailModal';
import ExportProgressModal from '../employee-compensation-logbook/modals/ExportProgressModal';

import SelectChevronDown from '@/svg/SelectChevronDown';
import EditIcon from '@/svg/EditIcon';
import EmailLogo from '@/svg/EmailLogo';
import PrintIcon from "@/svg/PrintIcon";
import DeleteIcon from '@/svg/DeleteIcon';

import { handlePrintPDF } from './PrintData';
import useBulkDeleteWorkEnvironmentRequest from "./hooks/useBulkDeleteWorkEnvironmentRequest";
import BulkDeleteModal from "@/components/modals/BulkDeleteModal";


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
  const [workEnvironmentRequestItems, setWorkEnvironmentRequestItems] = useState<any>([]);
  const [isWorkEnvironmentRequestDeleteModalOpen, setIsWorkEnvironmentRequestDeleteModalOpen] =
    useState<T_ModalData | null>(null);
  const [isCreateWorkEnvironmentRequestModalOpen, setIsCreateWorkEnvironmentRequestModalOpen] =
    useState<boolean>(false);
  const [isUpdateWorkEnvironmentRequestModalOpen, setIsUpdateWorkEnvironmentRequestModalOpen] =
    useState<T_ModalData | null>(null);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState<T_ModalData | null>(null);
  const [isExportProgressModalOpen, setIsExportProgressModalOpen] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [generatingItemId, setGeneratingItemId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const cachedRigths = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };
  const updateWorkEnvironmentRequestStatus = useUpdateWorkEnvironmentRequest();
  const [selectedRequests, setSelectedRequests] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const bulkDeleteMutation = useBulkDeleteWorkEnvironmentRequest();

  const { generatePDFLocally, isGenerating } = useFileforge({
    onSuccess: () => {
      setGeneratingItemId(null);
      toast.custom(() => <CustomToast message='PDF generated successfully.' type='success' />, { duration: 3000 });
    },
    onError: (error) => {
      setGeneratingItemId(null);
      toast.custom(() => <CustomToast message={`Failed to generate PDF: ${error.message}`} type='error' />, { duration: 5000 });
    }
  });

  // Form Methods
  const createFormMethods = useForm();
  const editFormMethods = useForm();

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
    data: workEnvironmentRequestItemsData,
    isLoading: isWorkEnvironmentRequestItemsLoading,
    refetch: workEnvironmentRequestItemsRefetch,
  } = useGetWorkEnvironmentRequestItems({
    ...itemsFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });
  


  // const menuOptions = [
  //   {
  //     name: 'Export',
  //     action: () => {
  //       setIsExportProgressModalOpen(true);
  //     },
  //     disabled: !cachedRigths?.state?.data?.export_dole_work_environment_request,
  //   },
  //   {
  //     name: 'Generate Report',
  //     action: () => {
  //       handlePrint();
  //     },
  //     disabled: !cachedRigths?.state?.data?.generate_dole_work_environment_request,
  //   },
  // ];

  useEffect(() => {
    if (workEnvironmentRequestItemsData) {
      workEnvironmentRequestItemsData.records.map((item: any) => {
        const applicationDate = new Date(item.date_of_application);
        item.date_of_application = `${
          applicationDate.getMonth() + 1
        }/${applicationDate.getDate()}/${applicationDate.getFullYear()}`;
        return item;
      });
      setWorkEnvironmentRequestItems(workEnvironmentRequestItemsData.records);
      setPagination({
        totalPages: workEnvironmentRequestItemsData.total_pages,
        totalRecords: workEnvironmentRequestItemsData.total_records,
      });
    }
  }, [workEnvironmentRequestItemsData]);

  useEffect(() => {
    workEnvironmentRequestItemsRefetch();
  }, [currentPage, pageSize, workEnvironmentRequestItemsRefetch]);

  useEffect(() => {
    if (!isWorkEnvironmentRequestItemsLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isWorkEnvironmentRequestItemsLoading, isSearching]);

  const handleStatusChange = async (itemId: number, newStatus: string) => {
    try {
      await updateWorkEnvironmentRequestStatus.mutateAsync({
        work_environment_measurement_request_id: itemId,
        data: { status: newStatus }
      });
      
      toast.custom(() => <CustomToast message='Status updated successfully.' type='success' />, { duration: 3000 });
      workEnvironmentRequestItemsRefetch();
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error || 'Failed to update status.'} type='error' />, { duration: 5000 });
    }
  };

  const getStatusColor = (status: string) => {
    // Handle backward compatibility with old status values
    const statusMapping: { [key: string]: string } = {
      'on-schedule': 'on-schedule',
      'for-submission': 'for-submission', 
      'for-review': 'for-review',
      'approved': 'approved',
    };
    
    const mappedStatus = statusMapping[status] || status;
    
    switch (mappedStatus) {
      case 'on-schedule':
        return 'bg-purple-100 text-purple-700';
      case 'for-submission':
        return 'bg-blue-100 text-blue-700';
      case 'for-review':
        return 'bg-yellow-100 text-yellow-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handlePrintPDFLocal = async (item: any) => {
    try {
      setGeneratingItemId(item.id);
      // Fetch detailed data using the print hook's function directly
      const detailedData = await getPrintWorkEnvironmentRequestDetails(item.id);
      
      // Use the detailed data directly for PDF generation
      await handlePrintPDF(detailedData, generatePDFLocally);
    } catch (error) {
      setGeneratingItemId(null);
      toast.custom(() => <CustomToast message={`Failed to generate PDF: ${error}`} type='error' />, { duration: 5000 });
    }
  };

  // const handlePrint = () => {
  //   // Create a new div element
  //   const printDiv = document.createElement('div');

  //   // Copy the content of the original printSection
  //   const originalPrintSection = document.getElementById('printSection');
  //   if (originalPrintSection) {
  //     printDiv.innerHTML = originalPrintSection.innerHTML;
  //   }

  //   // Style the new div to be off-screen
  //   printDiv.style.width = '1980px';
  //   printDiv.style.height = '100%';
  //   printDiv.style.position = 'absolute';
  //   printDiv.style.left = '-9999px';
  //   printDiv.style.top = '-9999px';

  //   // Add the new div to the body
  //   document.body.appendChild(printDiv);

  //   // Use html2canvas on the new div
  //   html2canvas(printDiv).then((canvas) => {
  //     // Remove the temporary div
  //     document.body.removeChild(printDiv);

  //     const imgData = canvas.toDataURL('image/png');
  //     const newWindow = window.open('', '_blank');
  //     newWindow?.document.write(`<img src="${imgData}" style="width:100%;height:auto;">`);
  //     newWindow?.document.close();
  //     setTimeout(() => {
  //       newWindow?.print();
  //     }, 500);
  //   });
  // };

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
    workEnvironmentRequestItemsRefetch();
  };

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const formatListVertical = (data: string[] | string) => {
    // Handle both array and string inputs
    let items: string[] = [];
    
    if (Array.isArray(data)) {
      // If it's an array, check if it contains comma-separated strings
      if (data.length === 1 && typeof data[0] === 'string' && data[0].includes(',')) {
        // Handle case like ["OSHC,None (New Client),Accredited Wem Officer"]
        items = data[0].split(',').map(item => item.trim()).filter(item => item.length > 0);
      } else {
        // Handle regular array of strings
        items = data;
      }
    } else if (typeof data === 'string') {
      // Split by comma and clean up whitespace
      items = data.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
    
    if (!items || items.length === 0) return null;
    
    return (
      <ul className="list-disc list-inside">
        {items.map((str, index) => (
          <li key={index} className="text-left">
            {str.charAt(0).toUpperCase() + str.slice(1)}
          </li>
        ))}
      </ul>
    );
  };

  // Handle individual request selection
  const handleRequestSelect = (requestId: number) => {
    setSelectedRequests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(requestId)) {
        newSet.delete(requestId);
      } else {
        newSet.add(requestId);
      }
      return newSet;
    });
  };

  // Handle select all functionality
  const handleSelectAll = () => {
    if (!workEnvironmentRequestItems) return;
    
    if (selectAll) {
      setSelectedRequests(new Set());
    } else {
      const allIds = workEnvironmentRequestItems.map((item: any) => item.id);
      setSelectedRequests(new Set(allIds));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedRequests.size === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const requestIds = Array.from(selectedRequests);
      await bulkDeleteMutation.mutateAsync(requestIds);
      
      toast.custom(() => <CustomToast message={`${selectedRequests.size} request(s) deleted successfully.`} type="success" />, { duration: 3000 });
      setSelectedRequests(new Set());
      setSelectAll(false);
      setIsBulkDeleteModalOpen(false);
      workEnvironmentRequestItemsRefetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete requests';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
    }
  };

  // Update select all state when requests change
  useEffect(() => {
    if (workEnvironmentRequestItems) {
      const allRequestIds = new Set(workEnvironmentRequestItems.map((item: any) => item.id));
      const allSelected = allRequestIds.size > 0 && 
        Array.from(allRequestIds).every((id: any) => selectedRequests.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedRequests, workEnvironmentRequestItems]);

  const renderRows = () => {
    if (isSearching || isWorkEnvironmentRequestItemsLoading) {
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
    if (workEnvironmentRequestItems && workEnvironmentRequestItems.length > 0) {
      return workEnvironmentRequestItems.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <input
              type="checkbox"
              checked={selectedRequests.has(item.id)}
              onChange={() => handleRequestSelect(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date_of_application}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.number_of_workers_total}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            {item.risk_classification
              .split('_')
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {formatListVertical(item.purpose_of_wem_request)}
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {formatListVertical(item.wem_conducted_by)}
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {formatListVertical(item.name_of_safety_officer)}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='relative inline-block'>
              <select
                value={item.status || 'on-schedule'}
                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                disabled={!cachedRigths?.state?.data?.edit_dole_work_environment_request}
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
            <div className='flex space-x-2'>
              <button
                onClick={() =>
                  setIsUpdateWorkEnvironmentRequestModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={!cachedRigths?.state?.data?.edit_dole_work_environment_request}
              >
                <EditIcon />
              </button>
              <button
                onClick={() =>
                  setIsSendEmailModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={!cachedRigths?.state?.data?.edit_dole_work_environment_request}
              >
                <EmailLogo />
              </button>
              <button
                onClick={() => handlePrintPDFLocal(item)}
                disabled={generatingItemId === item.id || !cachedRigths?.state?.data?.generate_dole_work_environment_request}
                className={generatingItemId === item.id ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {generatingItemId === item.id ? (
                  <div className="animate-spin inline-block w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full">
                  </div>
                ) : (
                  <PrintIcon />
                )}
              </button>
              <button
                onClick={() =>
                  setIsWorkEnvironmentRequestDeleteModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={!cachedRigths?.state?.data?.edit_dole_work_environment_request}
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
          <td colSpan={8}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>
              Please click create to add work environment measurement request.
            </h4>
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
            <h4>DOLE</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Work Environment Measurement (WEM) Request</h2>
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
                  data-tooltip-content='Search for: Risk Classification, Conducted By'
                  data-tooltip-place='bottom'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) => setItemsFilter({ ...itemsFilter, search: e.target.value })}
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
            {/* <div className='flex-1 flex justify-start lg:justify-end'>
              <button
                className='bg-green-500 rounded-l-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsCreateWorkEnvironmentRequestModalOpen(true)}
                disabled={!cachedRigths?.state?.data?.create_dole_work_environment_request}
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
            </div> */}
            <div className='flex-1 flex justify-start lg:justify-end'>
              <button
                className='bg-green-500 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsCreateWorkEnvironmentRequestModalOpen(true)}
                disabled={!hasActiveSubscription || !cachedRigths?.state?.data?.create_dole_work_environment_request}
              >
                CREATE
              </button>
            </div>
          </div>

          {/* Bulk Actions Section */}
          <div className="mt-8">
            <div className="flex flex-wrap justify-between items-center gap-2">
              {/* Bulk Actions - Left Side */}
              {selectedRequests.size > 0 && (
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
                    onClick={() => setSelectedRequests(new Set())}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Clear Selected
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    {selectedRequests.size} selected
                  </span>
                </div>
              )}
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
                          disabled={!workEnvironmentRequestItems || workEnvironmentRequestItems.length === 0}
                          className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                        />
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date of Application
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Number of Workers
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Risk Classification
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Purpose of WEM Request
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        WEM Conducted by
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Safety Officer(s)
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
      {isCreateWorkEnvironmentRequestModalOpen && (
        <CreateWemRequestModal
          refetch={workEnvironmentRequestItemsRefetch}
          isOpen={isCreateWorkEnvironmentRequestModalOpen}
          setIsOpen={setIsCreateWorkEnvironmentRequestModalOpen}
          formMethods={createFormMethods}
        />
      )}
      {isWorkEnvironmentRequestDeleteModalOpen && (
        <DeleteWemRequestModal
          refetch={workEnvironmentRequestItemsRefetch}
          isOpen={isWorkEnvironmentRequestDeleteModalOpen}
          setIsOpen={setIsWorkEnvironmentRequestDeleteModalOpen}
        />
      )}
      {isUpdateWorkEnvironmentRequestModalOpen && (
        <EditWemRequestModal
          refetch={workEnvironmentRequestItemsRefetch}
          isOpen={isUpdateWorkEnvironmentRequestModalOpen}
          setIsOpen={setIsUpdateWorkEnvironmentRequestModalOpen}
          formMethods={editFormMethods}
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
          refetch={workEnvironmentRequestItemsRefetch}
          isOpen={isSendEmailModalOpen}
          setIsOpen={setIsSendEmailModalOpen}
        />
      )}
      {isBulkDeleteModalOpen && (
        <BulkDeleteModal
          isOpen={isBulkDeleteModalOpen}
          selectedCount={selectedRequests.size}
          moduleName="Work Environment Request"
          onConfirm={confirmBulkDelete}
          onClose={() => setIsBulkDeleteModalOpen(false)}
          isLoading={bulkDeleteMutation.isLoading}
        />
      )}
      {/* Print Section
      <div className='container mx-auto p-4 hidden'>
        <div id='printSection'>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse border border-gray-800 table-fixed'>
              <thead>
                <tr>
                  <th
                    colSpan={6}
                    className='border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center'
                  >
                    Basic Information
                  </th>
                  <th
                    colSpan={3}
                    className='border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center py-1'
                  >
                    Risk and Safety Information
                  </th>
                  <th
                    colSpan={3}
                    className='border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center'
                  >
                    WEM Details Request
                  </th>
                  <th
                    colSpan={4}
                    className='border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center'
                  >
                    Monitoring Capability
                  </th>
                  <th
                    colSpan={3}
                    className='border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center'
                  >
                    Hazards
                  </th>
                </tr>
                <tr>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Date of Application
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Company Name
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Type of Industry
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Number of Workers Male
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Number of Workers Female
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Number of Workers Total
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Risk Classification
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Name of Safety Officer
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Safety Officer Level
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Purpose of WEM Request
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    WEM Conducted by
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Last WEM Date
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    WEM Internal Monitoring Capability
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    WEM Equipment Owned by Company
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Conducting Internal WEM
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Date of Internal Monitoring
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Purpose of WEM Request
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Chemical Hazards
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Ventilation
                  </th>
                </tr>
              </thead>
              <tbody>
                {workEnvironmentRequestItems.map((item: any, rowIndex: number) => (
                  <tr key={rowIndex}>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.date_of_application}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.company_name}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.type_of_industry}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.number_of_workers_male}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.number_of_workers_female}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.number_of_workers_total}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.risk_classification}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.name_of_safety_officer}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.safety_officer_levels}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.purpose_of_wem_request}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.wem_conducted_by}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.last_wem_date}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.wem_internal_monitoring_capability}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.wem_equipment_owned_by_company}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.conducting_internal_wem ? 'Yes' : 'No'}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.date_of_internal_monitoring}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.hazards_purpose_of_wem_request}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.chemical_hazards}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.ventilation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className='mt-4 text-xl text-center'>-- Nothing follows --</p>
        </div>
      </div> */}

      <Tooltip id='search-tooltip'/>
    </>
  );
}

export default Content;
