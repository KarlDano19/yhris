'use client';

import React, { useEffect, useState, Fragment, useRef, forwardRef } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { Tooltip } from 'react-tooltip';
import { useForm } from 'react-hook-form';
import { createPortal } from 'react-dom';
import { ArrowLeftIcon, MagnifyingGlassIcon, EllipsisHorizontalIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import classNames from '@/helpers/classNames';

import useGetAnnualAccidentIllnessReportItems from './hooks/useGetAnnualAccidentIllnessReportItems';
import useUpdateAnnualAccidentIllness from './hooks/useUpdateAnnualAccidentIllness';
import { getPrintAnnualAccidentIllnessReportDetails } from './hooks/useGetPrintAnnualAccidentIllnessDetails';
import CreateReportModal from './modals/CreateReportModal';
import EditReportModal from './modals/EditReportModal';
import DeleteReportModal from './modals/DeleteReportModal';
import SendEmailModal from '@/components/SendEmailModal';
import SelectBranchModal from './modals/SelectBranchModal';
import AnnualAccidentIllnessAttachmentSection from './components/AnnualAccidentIllnessAttachmentSection';
import useSendEmail from './hooks/useSendEmail';
import useGetAnnualAccidentIllnessReportDetails from './hooks/useGetAnnualAccidentIllnessReportDetails';
import ExportProgressModal from '../work-accident-illness-report/modals/ExportProgressModal';
import useFileforge from '@/components/hooks/useFileforge';
import { handlePrintPDF } from './PrintData';

import SelectChevronDown from '@/svg/SelectChevronDown';
import EditIcon from '@/svg/EditIcon';
import EmailLogo from '@/svg/EmailLogo';
import PrintIcon from "@/svg/PrintIcon";
import DeleteIcon from '@/svg/DeleteIcon';


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
  const {
    data: annualAccidentIllnessReportData,
    isLoading: isAnnualAccidentIllnessReportLoading,
    refetch: annualAccidentIllnessReportRefetch,
  } = useGetAnnualAccidentIllnessReportItems({
    ...itemsFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });

  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [isSelectBranchModalOpen, setIsSelectBranchModalOpen] = useState<boolean>(false);
  const cachedRigths = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [generatingItemId, setGeneratingItemId] = useState<number | null>(null);

  // Email-specific state
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentExist, setAttachmentExist] = useState(false);

  // Form Methods
  const createFormMethods = useForm();
  const editFormMethods = useForm();
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const menuButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const updateAnnualAccidentIllnessReport = useUpdateAnnualAccidentIllness();
  const { mutate: sendEmailMutate, isLoading: isEmailLoading } = useSendEmail();
  
  // Get the current report details for attachment
  const { data: currentReportDetails } = useGetAnnualAccidentIllnessReportDetails(
    isSendEmailModalOpen?.id || null
  );

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
    annualAccidentIllnessReportRefetch();
  }, [currentPage, pageSize]);

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
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.custom(() => <CustomToast message='File size must be less than 5MB.' type='error' />, { duration: 2000 });
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
    annualAccidentIllnessReportRefetch();
  };

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  // Menu options for Export and Generate Report
  const menuOptions = [
    {
      name: 'Export',
      action: () => {
        setIsExportProgressModalOpen(true);
      },
      // disabled: !cachedRigths?.state?.data?.export_dole_awair,
      disabled: false,
    },
    // {
    //   name: 'Generate Report',
    //   action: () => {
    //     setIsSelectBranchModalOpen(true);
    //   },
    //   disabled: !cachedRigths?.state?.data?.generate_dole_awair,
    // },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.right - 138 + window.scrollX, // 138px = 8.6rem
    });
    setOpenMenuId(id);
  };

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
                disabled={!cachedRigths?.state?.data?.edit_dole_awair}
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
                  setIsEditAnnualAccidentIllnessReportModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={!cachedRigths?.state?.data?.edit_dole_awair}
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
                disabled={!cachedRigths?.state?.data?.edit_dole_awair}
              >
                <EmailLogo />
              </button>
              <button
                onClick={() => handlePrintPDFLocal(item)}
                disabled={generatingItemId === item.id || !cachedRigths?.state?.data?.generate_dole_awair}
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
                  setIsDeleteAnnualAccidentIllnessReportModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={!cachedRigths?.state?.data?.edit_dole_awair}
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
          <h2 className='text-xl font-bold text-indigo-dye'>Annual Work Accident/ Illness Exposure Data Report</h2>
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
              <button
                className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
                onClick={checkIfDateIsValid}
              >
                <MagnifyingGlassIcon className='h-5 w-5' />
              </button>
            </div>
            <div className='flex-1 flex justify-start lg:justify-end'>
              <button
                className='bg-green-500 rounded-l-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsCreateAnnualAccidentIllnessReportModalOpen(true)}
                disabled={!cachedRigths?.state?.data?.create_dole_awair}
              >
                CREATE
              </button>
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
        <DeleteReportModal
          refetch={annualAccidentIllnessReportRefetch}
          isOpen={isDeleteAnnualAccidentIllnessReportModalOpen}
          setIsOpen={setIsDeleteAnnualAccidentIllnessReportModalOpen}
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
      {/* Print Section */}
      {/* <div className="container mx-auto p-4 hidden">
        <div id="printSection">
          <Image
            className="mx-auto my-6"
            src="/assets/work-accident-illness-report.png"
            alt="Work Accident/Illness Report"
            width={1500}
            height={1000}
          />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-800 table-fixed">
              <thead>
                <tr>
                  <th
                    colSpan={6}
                    className="border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center"
                  >
                    Personal Information
                  </th>
                  <th
                    colSpan={7}
                    className="border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center py-1"
                  >
                    Employment Details
                  </th>
                  <th
                    colSpan={5}
                    className="border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center"
                  >
                    Illness
                  </th>
                  <th
                    colSpan={7}
                    className="border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center"
                  >
                    Nature/Extent of Injury
                  </th>
                </tr>
                <tr>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Name of Injured Worker
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Age
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Civil Status
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Address
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    No. of Dependents
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Sex
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Occupation
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Employment Status
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Average Weekly Wage
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Length of Service in Establishment prior to Accident or
                    Illness
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Years of Experience at the Occupation
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Hours of Work per day
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Hours of Work per Week
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Reportable Illness
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Date Illness Begun
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Date Returned to Work
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Days Lost
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Day/s Charged
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Extent of Disability
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Nature of Injury
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Parts of the Body Affected
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Date Disability Began
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Date Returned to Work
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Days Lost
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Day/s Charged
                  </th>
                </tr>
              </thead>
              <tbody>
                {annualAccidentIllnessReportItems.map(
                  (item: any, rowIndex: number) => (
                    <tr key={rowIndex}>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.employee}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.age}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.civil_status}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.address}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.no_of_dependents}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.sex}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.occupation}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.employment_status}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.average_weekly_earnings}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.length_of_service}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.years_of_experience}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.hours_worked_per_day}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.hours_worked_per_week}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.reportable_illness}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.date_of_illness}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.date_returned_to_work_illness}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.days_of_absence_illness}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.days_chargeable_illness}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.extent_of_disability}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.nature_of_injury}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.part_of_body_affected}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.date_of_disability}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.date_returned_to_work}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.days_of_absence}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.days_chargeable}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xl text-center">-- Nothing follows --</p>
        </div>
      </div> */}
      <Tooltip id='email-tooltip'/>
    </>
  );
}

export default Content;
