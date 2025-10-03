'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { useForm } from 'react-hook-form';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';
import { SmartMenuItem } from '@/components/SmartPermissions/SmartMenuItem';

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
  const updateWorkEnvironmentRequestStatus = useUpdateWorkEnvironmentRequest();

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
      <Tooltip id='search-tooltip'/>
    </>
  );
}

export default Content;
