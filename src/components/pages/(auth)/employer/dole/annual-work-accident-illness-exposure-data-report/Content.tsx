'use client';

import React, { useEffect, useState, Fragment, useRef, forwardRef } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { Tooltip } from 'react-tooltip';
import { useForm } from 'react-hook-form';
import { ArrowLeftIcon, MagnifyingGlassIcon, EllipsisHorizontalIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import ProgressModal from '@/components/ProgressModal';
import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import classNames from '@/helpers/classNames';

import useGetAnnualAccidentIllnessReportItems from './hooks/useGetAnnualAccidentIllnessReportItems';
import useDeleteAnnualAccidentIllnessReport from './hooks/useDeleteAnnualAccidentIllnessReport';
import useUpdateAnnualAccidentIllness from './hooks/useUpdateAnnualAccidentIllness';
import { getPrintAnnualAccidentIllnessReportDetails } from './hooks/useGetPrintAnnualAccidentIllnessDetails';
import CreateReportModal from './modals/CreateReportModal';
import EditReportModal from './modals/EditReportModal';
import SendEmailModal from '@/components/SendEmailModal';
import SelectBranchModal from './modals/SelectBranchModal';
import AnnualAccidentIllnessAttachmentSection from './components/AnnualAccidentIllnessAttachmentSection';
import useSendEmail from './hooks/useSendEmail';
import useGetAnnualAccidentIllnessReportDetails from './hooks/useGetAnnualAccidentIllnessReportDetails';
import ExportProgressModal from '../work-accident-illness-report/modals/ExportProgressModal';
import useFileforge from '@/components/hooks/useFileforge';
import { handlePrintPDF } from './PrintData';
import useBulkDeleteAnnualWorkAccidentIllnessReport from './hooks/useBulkDeleteAnnualWorkAccidentIllnessReport';

import SelectChevronDown from '@/svg/SelectChevronDown';
import EditIcon from '@/svg/EditIcon';
import EmailLogo from '@/svg/EmailLogo';
import PrintIcon from "@/svg/PrintIcon";
import DeleteIcon from '@/svg/DeleteIcon';
import { useSmartMenuOptions } from '@/components/SmartPermissions/useSmartMenuOptions';


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
  const cachedWAIReport = queryClient.getQueryCache().find(['workAccidentIlnessReportsItemsCache']) as {
    state: { data: any } | undefined;
  };
  const [annualAccidentIllnessReportItems, setAnnualAccidentIllnessReportItems] = useState<any>([]);
  const [isDeleteAnnualAccidentIllnessReportModalOpen, setIsDeleteAnnualAccidentIllnessReportModalOpen] =
    useState<T_ModalData | null>(null);
  const [isEditAnnualAccidentIllnessReportModalOpen, setIsEditAnnualAccidentIllnessReportModalOpen] =
    useState<T_ModalData | null>(null);
  const [isCreateAnnualAccidentIllnessReportModalOpen, setIsCreateAnnualAccidentIllnessReportModalOpen] =
    useState<boolean>(false);
  const [isExportProgressModalOpen, setIsExportProgressModalOpen] = useState<boolean>(false);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState<T_ModalData | null>(null);
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
  const [appliedFilter, setAppliedFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const {
    data: annualAccidentIllnessReportData,
    isLoading: isAnnualAccidentIllnessReportLoading,
    refetch: annualAccidentIllnessReportRefetch,
  } = useGetAnnualAccidentIllnessReportItems({
    ...appliedFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });

  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [isSelectBranchModalOpen, setIsSelectBranchModalOpen] = useState<boolean>(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [generatingItemId, setGeneratingItemId] = useState<number | null>(null);

  // Email-specific state
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentExist, setAttachmentExist] = useState(false);
  
  // Bulk delete states
  const [selectedReports, setSelectedReports] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteConfirmModalOpen, setIsBulkDeleteConfirmModalOpen] = useState<DeleteModalData | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);

  // Form Methods
  const createFormMethods = useForm();
  const editFormMethods = useForm();
  const updateAnnualAccidentIllnessReport = useUpdateAnnualAccidentIllness();
  const { mutate: deleteAnnualAccidentIllnessReport, isLoading: isDeleteAnnualAccidentIllnessReportLoading } = useDeleteAnnualAccidentIllnessReport();
  const { mutate: sendEmailMutate, isLoading: isEmailLoading } = useSendEmail();
  
  // Get the current report details for attachment
  const { data: currentReportDetails } = useGetAnnualAccidentIllnessReportDetails(
    isSendEmailModalOpen?.id || null
  );
  
  const bulkDeleteMutation = useBulkDeleteAnnualWorkAccidentIllnessReport();

  const { generatePDFLocally, isGenerating } = useFileforge({
    pageMargins: {
      top: '0.1in',
      right: '0.1in',
      bottom: '0.1in',
      left: '0.1in'
    },
    onSuccess: () => {
      setGeneratingItemId(null);
      toast.custom(() => <CustomToast message='PDF generated successfully.' type='success' />, { duration: 3000 });
    },
    onError: (error) => {
      setGeneratingItemId(null);
      toast.custom(() => <CustomToast message={`Failed to generate PDF: ${error.message}`} type='error' />, { duration: 5000 });
    }
  });

  useEffect(() => {
    if (annualAccidentIllnessReportData) {
      annualAccidentIllnessReportData.records?.map((item: any) => {
        const incidentDate = new Date(item.date_of_incident);
        item.date_of_incident = `${
          incidentDate.getMonth() + 1
        }/${incidentDate.getDate()}/${incidentDate.getFullYear()}`;

        const returnDate = new Date(item.date_returned_to_work);
        item.date_returned_to_work = `${returnDate.getMonth() + 1}/${returnDate.getDate()}/${returnDate.getFullYear()}`;

        const returnedIllnessDate = new Date(item.date_returned_to_work_illness);
        item.date_returned_to_work_illness = `${
          returnedIllnessDate.getMonth() + 1
        }/${returnedIllnessDate.getDate()}/${returnedIllnessDate.getFullYear()}`;

        return item;
      });
      setAnnualAccidentIllnessReportItems(annualAccidentIllnessReportData.records);
      setPagination({
        totalPages: annualAccidentIllnessReportData.total_pages,
        totalRecords: annualAccidentIllnessReportData.total_records,
      });
    }
  }, [annualAccidentIllnessReportData]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openMenuId !== null) {
        const target = event.target as HTMLElement;
        if (!target.closest('.menu-container')) {
          setOpenMenuId(null);
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  // Close all menus when changing pages
  useEffect(() => {
    setOpenMenuId(null);
  }, [currentPage]);

  // Update select all state when reports change
  useEffect(() => {
    if (annualAccidentIllnessReportItems) {
      const allReportIds = new Set(annualAccidentIllnessReportItems.map((item: any) => item.id));
      const allSelected = allReportIds.size > 0 && 
        Array.from(allReportIds).every((id: any) => selectedReports.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedReports, annualAccidentIllnessReportItems]);

  // New function to handle menu clicks
  const handleMenuClick = (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleStatusChange = async (itemId: number, newStatus: string) => {
    try {
      await updateAnnualAccidentIllnessReport.mutateAsync({
        annual_work_accident_illness_exposure_data_report_id: itemId,
        data: { status: newStatus }
      });
      
      toast.custom(() => <CustomToast message='Status updated successfully.' type='success' />, { duration: 3000 });
      annualAccidentIllnessReportRefetch();
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

      // Add annual_work_accident_illness_report_id
      payload.append('annual_work_accident_illness_report_id', isSendEmailModalOpen.id.toString());

      const callbackReq = {
        onSuccess: () => {
          setIsSendEmailModalOpen(null);
          annualAccidentIllnessReportRefetch();
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

  const handlePrintPDFLocal = async (item: any) => {
    try {
      setGeneratingItemId(item.id);
      // Fetch detailed data using the print hook's function directly
      const detailedData = await getPrintAnnualAccidentIllnessReportDetails(item.id);
      
      // Filter data by year and get the correct item
      const year = item.year || new Date().getFullYear();
      
      // Find the report for the specific year (filter by year only)
      const filteredItem = annualAccidentIllnessReportItems.find((reportItem: any) => 
        reportItem.year === year
      );
      
      // Create item with filtered data
      const itemWithData = {
        ...(detailedData || filteredItem || item),
        exposure_data: `JANUARY 1 TO DECEMBER 31, ${year}`,
        // Ensure we use the number of employees from the filtered year
        number_of_employees: filteredItem ? filteredItem.number_of_employees : item.number_of_employees,
      };
      
      await handlePrintPDF(itemWithData, generatePDFLocally);
    } catch (error) {
      setGeneratingItemId(null);
      toast.custom(() => <CustomToast message={`Failed to generate PDF: ${error}`} type='error' />, { duration: 5000 });
    }
  };

  const handlePrintWithBranch = () => {
    if (selectedBranch) {
      const filteredItems = annualAccidentIllnessReportItems.filter((item: any) => item.branch === selectedBranch);
      handlePrint();
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

  const checkIfDateIsValid = () => {
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
    setAppliedFilter({
      ...itemsFilter,
    });
    setCurrentPage(1); // Reset to first page when searching
  };

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  // Handle individual report selection
  const handleReportSelect = (reportId: number) => {
    setSelectedReports(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });
  };

  // Handle select all functionality
  const handleSelectAll = () => {
    if (!annualAccidentIllnessReportItems) return;
    
    if (selectAll) {
      setSelectedReports(new Set());
    } else {
      const allIds = annualAccidentIllnessReportItems.map((item: any) => item.id);
      setSelectedReports(new Set(allIds));
    }
  };

  // Handle bulk delete - opens confirmation modal
  const handleBulkDelete = () => {
    if (selectedReports.size === 0) return;
    setBulkDeleteCount(selectedReports.size);
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
      const reportIds = Array.from(selectedReports);
      await bulkDeleteMutation.mutateAsync(reportIds);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete reports';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
      setIsBulkDeleteModalOpen(false);
    }
  };

  // Handle success after deletion completes
  const handleBulkDeleteSuccess = () => {
    toast.custom(() => <CustomToast message={`${bulkDeleteCount} report(s) deleted successfully.`} type="success" />, { duration: 3000 });
    setSelectedReports(new Set());
    setSelectAll(false);
    setBulkDeleteCount(0);
    annualAccidentIllnessReportRefetch();
  };

  // Menu options for Export and Generate Report
  const menuOptions = [
    {
      id: 'generate-dole-awair-btn',
      name: 'Export',
      action: () => {
        setIsExportProgressModalOpen(true);
      },
    },
  ];

  const smartMenuOptions = useSmartMenuOptions(menuOptions);

  const renderRows = () => {
    if (isAnnualAccidentIllnessReportLoading) {
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
    if (annualAccidentIllnessReportItems && annualAccidentIllnessReportItems.length > 0) {
      return annualAccidentIllnessReportItems.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <input
              type="checkbox"
              checked={selectedReports.has(item.id)}
              onChange={() => handleReportSelect(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date_of_report}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.number_of_employees}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.total_hours_worked}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.total_disabling_injuries}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.total_non_disabling_injuries}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.frequency_rate}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.severity_rate}</td>
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
                id="edit-dole-awair-btn"
                onClick={() =>
                  setIsEditAnnualAccidentIllnessReportModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
              >
                <EditIcon />
              </SmartButton>
              <SmartButton
                id="edit-dole-awair-btn"
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
                id="generate-dole-awair-btn"
                onClick={() => handlePrintPDFLocal(item)}
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
                id="edit-dole-awair-btn"
                onClick={() =>
                  setIsDeleteAnnualAccidentIllnessReportModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={selectedReports.size > 1}
                className={selectedReports.size > 1 ? 'opacity-50 cursor-not-allowed' : ''}
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
          <td colSpan={9}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add data.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 mb-20 pb-56 md:pb-0 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/dole' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h2 className='text-xl font-bold'>DOLE</h2>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Annual Work Accident/ Illness Exposure Data Report</h2>
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
              <button
                className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
                onClick={checkIfDateIsValid}
              >
                <MagnifyingGlassIcon className='h-5 w-5' />
              </button>
            </div>
            <div className='flex-1 flex justify-start lg:justify-end'>
              <SmartButton
                id="create-dole-awair-btn"
                className='bg-green-500 rounded-l-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsCreateAnnualAccidentIllnessReportModalOpen(true)}
              >
                CREATE
              </SmartButton>
              <Menu as='div' className='relative menu-container'>
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
                              className={classNames(
                                item.disabled ? 'bg-gray-200 cursor-not-allowed opacity-50' : '',
                                'block px-4 py-2 text-sm cursor-pointer text-center',
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                item.disabled ? 'bg-gray-200 cursor-not-allowed opacity-50' : ''
                              )}
                              onClick={(e) => {
                                if (item.disabled) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  return false;
                                }
                                item.action();
                              }}
                              data-permission-id={item.id}
                              data-has-permission={item.hasPermission}
                              data-is-disabled={item.disabled}
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
          {selectedReports.size > 1 && (
            <div className="mt-4 ">
              <div className="flex items-center gap-3">
                <SmartButton
                  id="edit-dole-awair-btn"
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
                  {selectedReports.size} selected
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
                          disabled={!annualAccidentIllnessReportItems || annualAccidentIllnessReportItems.length === 0}
                          className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                        />
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date of Report
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Number of Employees
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Total Hours Worked
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Disabling Injuries/Illnesses
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Non-Disabling Injuries
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Frequency Rate
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Severity Rate
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
      {isSelectBranchModalOpen && (
        <SelectBranchModal
          isOpen={isSelectBranchModalOpen}
          setIsOpen={setIsSelectBranchModalOpen}
          onBranchSelect={(branch) => {
            setSelectedBranch(branch);
            handlePrintWithBranch();
          }}
        />
      )}
      {isCreateAnnualAccidentIllnessReportModalOpen && (
        <CreateReportModal
          refetch={annualAccidentIllnessReportRefetch}
          isOpen={isCreateAnnualAccidentIllnessReportModalOpen}
          setIsOpen={setIsCreateAnnualAccidentIllnessReportModalOpen}
          formMethods={createFormMethods}
        />
      )}
      {isDeleteAnnualAccidentIllnessReportModalOpen && (
        <DeleteModal
          isOpen={isDeleteAnnualAccidentIllnessReportModalOpen}
          setIsOpen={setIsDeleteAnnualAccidentIllnessReportModalOpen}
          onConfirm={() => {
            const callbackReq = {
              onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
                setIsDeleteAnnualAccidentIllnessReportModalOpen(null);
                annualAccidentIllnessReportRefetch();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
              },
            };
            deleteAnnualAccidentIllnessReport(isDeleteAnnualAccidentIllnessReportModalOpen.id, callbackReq);
          }}
          isLoading={isDeleteAnnualAccidentIllnessReportLoading}
        />
      )}
      {isEditAnnualAccidentIllnessReportModalOpen && (
        <EditReportModal
          refetch={annualAccidentIllnessReportRefetch}
          isOpen={isEditAnnualAccidentIllnessReportModalOpen}
          setIsOpen={setIsEditAnnualAccidentIllnessReportModalOpen}
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
          title="Send Annual Work Accident Illness Report"
          isOpen={!!isSendEmailModalOpen}
          onClose={() => setIsSendEmailModalOpen(null)}
          onSubmit={handleEmailSubmit}
          defaultRecipients={[]}
          showAttachment={true}
          customAttachmentSection={
            <AnnualAccidentIllnessAttachmentSection
              pdfAttachment={currentReportDetails?.attachment || null}
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
          customText={`${bulkDeleteCount} Annual Work Accident Illness Report${bulkDeleteCount > 1 ? 's' : ''}`}
        />
      )}

      {/* Bulk Delete Progress Modal */}
      {isBulkDeleteModalOpen && (
        <ProgressModal
          isOpen={isBulkDeleteModalOpen}
          setIsOpen={setIsBulkDeleteModalOpen}
          onConfirm={confirmBulkDelete}
          title={`Deleting ${bulkDeleteCount} Annual Work Accident Illness Report${bulkDeleteCount > 1 ? 's' : ''}...`}
          isProcessing={bulkDeleteMutation.isLoading}
          onSuccess={handleBulkDeleteSuccess}
        />
      )}
      <Tooltip id='email-tooltip'/>
    </>
  );
}

export default Content;
