'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';

import { ArrowLeftIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { useForm } from 'react-hook-form';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import LoadingSpinner from '@/components/LoadingSpinner';
import CustomToast from '@/components/CustomToast';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import ProgressModal from '@/components/ProgressModal';
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
import SendEmailModal from '@/components/SendEmailModal';
import ExportProgressModal from '../employee-compensation-logbook/modals/ExportProgressModal';

import SelectChevronDown from '@/svg/SelectChevronDown';
import EditIcon from '@/svg/EditIcon';
import EmailLogo from '@/svg/EmailLogo';
import PrintIcon from "@/svg/PrintIcon";
import DeleteIcon from '@/svg/DeleteIcon';

import { handlePrintPDF } from './PrintData';
import useBulkDeleteWorkEnvironmentRequest from "./hooks/useBulkDeleteWorkEnvironmentRequest";
import WemAttachmentSection from './components/WemAttachmentSection';
import useGetWorkEnvironmentRequestDetails from './hooks/useGetWorkEnvironmentRequestDetails';
import useSendEmail from './hooks/useSendEmail';


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
  const [workEnvironmentRequestItems, setWorkEnvironmentRequestItems] = useState<any>([]);
  const [isWorkEnvironmentRequestDeleteModalOpen, setIsWorkEnvironmentRequestDeleteModalOpen] =
    useState<T_ModalData | null>(null);
  const [isCreateWorkEnvironmentRequestModalOpen, setIsCreateWorkEnvironmentRequestModalOpen] =
    useState<boolean>(false);
  const [isUpdateWorkEnvironmentRequestModalOpen, setIsUpdateWorkEnvironmentRequestModalOpen] =
    useState<T_ModalData | null>(null);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState<T_ModalData | null>(null);
  const [pdfAttachment, setPdfAttachment] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentExist, setAttachmentExist] = useState(false);
  const [isExportProgressModalOpen, setIsExportProgressModalOpen] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [generatingItemId, setGeneratingItemId] = useState<number | null>(null);
  const updateWorkEnvironmentRequestStatus = useUpdateWorkEnvironmentRequest();
  const [selectedRequests, setSelectedRequests] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteConfirmModalOpen, setIsBulkDeleteConfirmModalOpen] = useState<DeleteModalData | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);

  const bulkDeleteMutation = useBulkDeleteWorkEnvironmentRequest();
  const { mutate: sendEmail, isLoading: isSendingEmail } = useSendEmail();
  const { data: workEnvironmentRequestDetails } = useGetWorkEnvironmentRequestDetails(
    isSendEmailModalOpen?.id || null
  );

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

  // Handle PDF attachment from work environment request details
  useEffect(() => {
    if (workEnvironmentRequestDetails && isSendEmailModalOpen) {
      if (workEnvironmentRequestDetails.attachment) {
        setPdfAttachment(workEnvironmentRequestDetails.attachment);
      } else {
        setPdfAttachment(null);
      }
    }
  }, [workEnvironmentRequestDetails, isSendEmailModalOpen]);

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
      payload.append('to', JSON.stringify(data.email));
      payload.append('context', data.message);
      if (data.cc && data.cc.length > 0) payload.append('cc', JSON.stringify(data.cc));
      if (data.bcc && data.bcc.length > 0) payload.append('bcc', JSON.stringify(data.bcc));
      payload.append('subject', data.subject);
      
      // Add attachment if provided (prioritize form data attachment, then local attachment)
      if (data.attachment) {
        payload.append('attachment', data.attachment);
      } else if (attachment) {
        payload.append('attachment', attachment);
      }
      
      // Add work_environment_measure_id
      payload.append('work_environment_measure_id', isSendEmailModalOpen.id.toString());
      
      const callbackReq = {
        onSuccess: (data: any) => {
          setIsSendEmailModalOpen(null);
          setPdfAttachment(null);
          setAttachment(null);
          setAttachmentExist(false);
          const successMessage = data?.message || 'Email sent successfully';
          toast.custom(() => <CustomToast message={successMessage} type='success' />, { duration: 5000 });
          if (workEnvironmentRequestItemsRefetch) {
            workEnvironmentRequestItemsRefetch();
          }
        },
        onError: (err: any) => {
          let errorMessage = 'Failed to send email';
          
          if (typeof err === 'string') {
            errorMessage = err;
          } else if (err?.message) {
            errorMessage = err.message;
          } else if (err?.response?.data?.message) {
            errorMessage = err.response.data.message;
          }
          
          toast.custom(() => <CustomToast message={errorMessage} type='error' />, {
            duration: 7000,
          });
        },
      };
      sendEmail(payload, callbackReq);
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

  // Handle bulk delete - opens confirmation modal
  const handleBulkDelete = () => {
    if (selectedRequests.size === 0) return;
    setBulkDeleteCount(selectedRequests.size);
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
      const requestIds = Array.from(selectedRequests);
      await bulkDeleteMutation.mutateAsync(requestIds);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete requests';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
      setIsBulkDeleteModalOpen(false);
    }
  };

  // Handle success after deletion completes
  const handleBulkDeleteSuccess = () => {
    toast.custom(() => <CustomToast message={`${bulkDeleteCount} request(s) deleted successfully.`} type="success" />, { duration: 3000 });
    setSelectedRequests(new Set());
    setSelectAll(false);
    setBulkDeleteCount(0);
    workEnvironmentRequestItemsRefetch();
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
              <SmartButton
                id="edit-dole-work-environment-request-btn"
                onClick={() =>
                  setIsUpdateWorkEnvironmentRequestModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
              >
                <EditIcon />
              </SmartButton>
              <button
                onClick={() =>
                  setIsSendEmailModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
              >
                <EmailLogo />
              </button>
              <SmartButton
                id="generate-dole-work-environment-request-btn"
                onClick={() => handlePrintPDFLocal(item)}
                disabled={generatingItemId === item.id}
                className={generatingItemId === item.id ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {generatingItemId === item.id ? (
                  <div className="animate-spin inline-block w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full">
                  </div>
                ) : (
                  <PrintIcon />
                )}
              </SmartButton>
              <SmartButton
                id="edit-dole-work-environment-request-btn"
                onClick={() =>
                  setIsWorkEnvironmentRequestDeleteModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={selectedRequests.size > 1}
                className={selectedRequests.size > 1 ? 'opacity-50 cursor-not-allowed' : ''}
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
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/dole' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>DOLE</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Work Environment Measurement (WEM) Request</h2>
        </div>

        {/* Content Section with flex-1 */}
        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          <div className={classNames('flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
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
            <div className='flex-1 flex justify-start lg:justify-end'>
              <SmartButton
                id="create-dole-work-environment-request-btn"
                className='bg-green-500 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsCreateWorkEnvironmentRequestModalOpen(true)}
              >
                CREATE
              </SmartButton>
            </div>
          </div>

          {/* Bulk Actions Section */}
          {selectedRequests.size > 1 && (
            <div className="mt-4 ">
              <div className="flex items-center gap-3">
                <SmartButton
                  id="edit-dole-work-environment-request-btn"
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
                  {selectedRequests.size} selected
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
          title="Send Work Environment Measure"
          isOpen={!!isSendEmailModalOpen}
          onClose={() => setIsSendEmailModalOpen(null)}
          onSubmit={handleEmailSubmit}
          defaultRecipients={workEnvironmentRequestDetails?.email ? [workEnvironmentRequestDetails.email] : []}
          showAttachment={true}
          customAttachmentSection={
            <WemAttachmentSection
              pdfAttachment={pdfAttachment}
              onViewAttachment={handleViewAttachment}
              onAttachmentUpload={handleAttachmentUpload}
              onRemoveAttachment={handleRemoveAttachment}
              attachment={attachment}
              attachmentExist={attachmentExist}
            />
          }
          submitButtonText="Send"
          isLoading={isSendingEmail}
        />
      )}
      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteConfirmModalOpen?.open && (
        <DeleteModal
          isOpen={isBulkDeleteConfirmModalOpen}
          setIsOpen={setIsBulkDeleteConfirmModalOpen}
          onConfirm={confirmBulkDeleteWarning}
          isLoading={false}
          customText={`${bulkDeleteCount} Work Environment Request${bulkDeleteCount > 1 ? 's' : ''}`}
        />
      )}

      {/* Bulk Delete Progress Modal */}
      {isBulkDeleteModalOpen && (
        <ProgressModal
          isOpen={isBulkDeleteModalOpen}
          setIsOpen={setIsBulkDeleteModalOpen}
          onConfirm={confirmBulkDelete}
          title={`Deleting ${bulkDeleteCount} Work Environment Request${bulkDeleteCount > 1 ? 's' : ''}...`}
          isProcessing={bulkDeleteMutation.isLoading}
          onSuccess={handleBulkDeleteSuccess}
        />
      )}
      <Tooltip id='search-tooltip'/>
    </>
  );
}

export default Content;
