'use client';

import React, { useEffect, useState } from 'react';

import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

import { handlePrintIndividualEvaluations } from '../PrintData';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import useDeleteEvaluationHistory from '../hooks/useDeleteEvaluationHistory';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import classNames from '@/helpers/classNames';
import CustomDatePicker from '@/components/CustomDatePicker';
import Pagination from '@/components/Pagination';
import useFileforge from '@/components/hooks/useFileforge';
import useGetEvaluationHistoryItems from '../hooks/useGetEvaluationHistoryItems';
import EvaluationDetailsModal from '../modals/EvaluationDetailsModal';
import PrintIndividualEvaluationsSelectionModal, { ExportFormat } from '../modals/PrintIndividualEvaluationsSelectionModal';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import PrintIcon from '@/svg/PrintIcon';
import DeleteIcon from '@/svg/DeleteIcon';

type T_ModalData = {
  id: number;
  open: boolean;
};

const IndividualEvaluations = ({ hasActiveSubscription, isActive }: { hasActiveSubscription: boolean; isActive?: boolean }) => {
  const [evaluationHistoryItems, setEvaluationHistoryItems] = useState<any>([]);
  const [allEvaluationRecords, setAllEvaluationRecords] = useState<any>([]);
  const [isEvaluationDetailsModalOpen, setIsEvaluationDetailsModalOpen] = useState<T_ModalData | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isDeleteEvaluationHistoryModalOpen, setIsDeleteEvaluationHistoryModalOpen] = useState<DeleteModalData | null>(null);
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
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalRecords: number;
    totalPages: number;
  }>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const deleteEvaluationHistoryMutation = useDeleteEvaluationHistory();
  const { mutate: deleteEvaluationHistory, isLoading: isDeleteEvaluationHistoryLoading } = deleteEvaluationHistoryMutation;
  
  const handleDeleteEvaluationHistory = async (evaluation_form_id: number) => {
    try {
      const callbackReq = {
        onSuccess: (data: any) => {
          toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 3000 });
          setIsDeleteEvaluationHistoryModalOpen(null);
          refetchEvaluationHistoryItems();
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, { duration: 5000 });
        },
      };
      deleteEvaluationHistory(evaluation_form_id, callbackReq);
    } catch (error: any) {
      const errorMessage = typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : 'Failed to delete evaluation history';
      toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 5000 });
      throw error;
    }
  };
  const {
    data: dataEvaluationHistoryItems,
    isLoading: isLoadingEvaluationHistoryItems,
    refetch: refetchEvaluationHistoryItems,
  } = useGetEvaluationHistoryItems(
    {
      ...appliedFilter,
      pageSize: pageSize,
      currentPage: currentPage,
    },
    isActive !== false // Only fetch when tab is active (default to true for backward compatibility)
  );

  // Fileforge hook for PDF generation
  const { generatePDFLocally, isGenerating: isPrintGenerating } = useFileforge({
    onSuccess: () => {
      toast.custom(() => <CustomToast message='PDF generated successfully.' type='success' />, { duration: 3000 });
    },
    onError: (error) => {
      console.error('Print error:', error);
      toast.custom(() => <CustomToast message='Failed to generate PDF.' type='error' />, { duration: 3000 });
    },
  });

  // Handle print button click - fetches all records and opens modal
  const handlePrintClick = async () => {
    if (!evaluationHistoryItems || evaluationHistoryItems.length === 0) {
      toast.custom(() => <CustomToast message='No evaluation data available to export.' type='error' />, { duration: 3000 });
      return;
    }

    try {
      // Fetch ALL evaluation data (not paginated) for the modal
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      let searchParams = new URLSearchParams();
      if (appliedFilter.from) searchParams.append('from', appliedFilter.from.toLocaleDateString('en-CA'));
      if (appliedFilter.to) searchParams.append('to', appliedFilter.to.toLocaleDateString('en-CA'));
      if (appliedFilter.search) searchParams.append('search', appliedFilter.search);
      searchParams.append('view_type', 'select'); // Get all records without pagination
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/evaluation-histories/?${searchParams}`,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch evaluation data');
      }

      const allData = await response.json();
      const records = Array.isArray(allData) ? allData : allData.records || [];
      
      setAllEvaluationRecords(records);
      setIsPrintModalOpen(true);
    } catch (error) {
      console.error('Error fetching evaluation data:', error);
      toast.custom(() => <CustomToast message='Failed to fetch evaluation data.' type='error' />, { duration: 3000 });
    }
  };

  // Generate CSV filename
  const generateCSVFilename = (dateFilter?: { from: string; to: string }) => {
    const dateFrom = dateFilter?.from ? new Date(dateFilter.from).toISOString().split('T')[0] : 'all-time';
    const dateTo = dateFilter?.to ? new Date(dateFilter.to).toISOString().split('T')[0] : 'all-time';
    return `individual-evaluations-${dateFrom}-to-${dateTo}.csv`;
  };

  // Handle CSV export
  const handleCSVExport = async (formattedData: any[], dateFilter?: { from: string; to: string }) => {
    try {
      setIsExportingCSV(true);

      // Define CSV headers
      const headers = [
        'Employee Name',
        'Date of Evaluation',
        'Evaluation Period',
        'Evaluation Form',
        'Total Score',
        'Max Score',
        'Passing Score',
        'Status'
      ];

      // Convert data to CSV rows
      const csvRows = formattedData.map((item: any) => {
        const status = item.form_total_score >= item.passing_score ? 'Passed' : 'Failed';
        return [
          `"${(item.employee_name || '').replace(/"/g, '""')}"`,
          `"${item.date_of_evaluation || ''}"`,
          `"${(item.evaluation_period || '').replace(/"/g, '""')}"`,
          `"${(item.evaluation_form || '').replace(/"/g, '""')}"`,
          item.form_total_score || 0,
          item.max_total_score || 0,
          item.passing_score || 0,
          status
        ].join(',');
      });

      // Combine headers and rows
      const csvContent = [headers.join(','), ...csvRows].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', generateCSVFilename(dateFilter));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.custom(() => <CustomToast message='CSV exported successfully.' type='success' />, { duration: 3000 });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.custom(() => <CustomToast message='Failed to export CSV.' type='error' />, { duration: 3000 });
    } finally {
      setIsExportingCSV(false);
    }
  };

  // Handle print modal confirmation - filters and prints/exports data based on selected forms and format
  const handlePrintConfirm = async (selectedOption: string, selectedForms?: string[], format: ExportFormat = 'pdf') => {
    try {
      // Format and filter the data based on selected forms
      let formattedData = allEvaluationRecords.map((item: any) => ({
        ...item,
        date_of_evaluation: new Intl.DateTimeFormat('en-US').format(new Date(item.date_of_evaluation))
      }));

      // Filter by selected evaluation forms if not "all"
      if (selectedOption === 'selected' && selectedForms && selectedForms.length > 0) {
        formattedData = formattedData.filter((item: any) => 
          selectedForms.includes(item.evaluation_form)
        );
      }

      // Prepare date filter
      const dateFilter = appliedFilter.from || appliedFilter.to
        ? {
            from: appliedFilter.from ? appliedFilter.from.toLocaleDateString('en-CA') : '',
            to: appliedFilter.to ? appliedFilter.to.toLocaleDateString('en-CA') : '',
          }
        : undefined;

      // Export based on selected format
      if (format === 'csv') {
        await handleCSVExport(formattedData, dateFilter);
      } else {
        await handlePrintIndividualEvaluations(
          generatePDFLocally,
          formattedData,
          dateFilter,
          appliedFilter.search
        );
      }
    } catch (error) {
      console.error('Error exporting evaluations:', error);
      const errorMessage = format === 'csv' ? 'Failed to export CSV.' : 'Failed to generate PDF.';
      toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 3000 });
    }
  };

  useEffect(() => {
    if (dataEvaluationHistoryItems) {
      let items = [];
      let totalPages = 1;
      let totalRecords = 0;

      // Handle paginated response structure
      if (dataEvaluationHistoryItems.records) {
        items = dataEvaluationHistoryItems.records.map((item: any) => {
          item['date_of_evaluation'] = Intl.DateTimeFormat('en-US').format(new Date(item.date_of_evaluation));
          return item;
        });
        totalPages = dataEvaluationHistoryItems.total_pages || 1;
        totalRecords = dataEvaluationHistoryItems.total_records || items.length;
      } 
      // Handle array response structure (no pagination from backend)
      else if (Array.isArray(dataEvaluationHistoryItems)) {
        items = dataEvaluationHistoryItems.map((item: any) => {
          item['date_of_evaluation'] = Intl.DateTimeFormat('en-US').format(new Date(item.date_of_evaluation));
          return item;
        });
        
        // Calculate pagination locally if backend doesn't support it
        totalRecords = items.length;
        totalPages = Math.ceil(totalRecords / pageSize);
      }

      // Backend already sorts by date_of_evaluation descending, no client-side sorting needed

      setEvaluationHistoryItems(items);
      setPagination({
        totalPages,
        totalRecords
      });
    }
  }, [dataEvaluationHistoryItems, pageSize]);

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
    setCurrentPage(1);
    setIsSearching(true);
    setAppliedFilter({
      ...itemsFilter,
      search: searchText
    });
  };

  useEffect(() => {
    if (!isLoadingEvaluationHistoryItems && isSearching) {
      setIsSearching(false);
    }
  }, [isLoadingEvaluationHistoryItems, isSearching]);

  const renderRows = () => {
    if (isSearching || isLoadingEvaluationHistoryItems) {
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
    if (evaluationHistoryItems && evaluationHistoryItems.length > 0) {
      return evaluationHistoryItems.map((item: any) => (
        <tr
          key={item.id}
          // className='cursor-pointer'
          // onClick={() => setIsEvaluationDetailsModalOpen({ id: item.id, open: true })}
        >
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {item.employee_name}
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {item.date_of_evaluation}
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {item.evaluation_period}
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {item.evaluation_form}
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <span
              className={classNames(
                "text-gray-500",
                item.form_total_score < item.passing_score && "text-red-500"
              )}
            >
              {item.form_total_score}
            </span>
            /<span>{item.max_total_score}</span>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 flex items-center justify-center gap-2">
            <button
              className="bg-green-500 rounded-md py-2.5 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50"
              onClick={() =>
                setIsEvaluationDetailsModalOpen({ id: item.id, open: true })
              }
            >
              View
            </button>
            <button
              onClick={() =>
                setIsDeleteEvaluationHistoryModalOpen({
                  id: item.id,
                  open: true,
                })
              }
            >
              <DeleteIcon />
            </button>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={7}>
            <h4 className='text-center text-gray-300 text-sm my-4'>There{`'`}s no data yet.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='px-2 md:px-8 lg:px-4'>
        <h2 className='text-xl font-bold text-indigo-dye'>Individual Evaluations</h2>
        <div className={classNames('mt-6 flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
          <div className='flex-none flex flex-col md:flex-row items-left md:items-center gap-2 flex-wrap md:flex-nowrap'>
            <div className='relative flex-1 md:flex-none min-w-[140px] md:min-w-0'>
              <CustomDatePicker
                id='from-datepicker'
                placeholder={'mm/dd/yyyy'}
                className='appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 md:placeholder:text-black text-sm leading-6'
                selected={itemsFilter.from}
                pickerOnChange={(date: any) => {
                  if (itemsFilter) setItemsFilter({ ...itemsFilter, from: date });
                }}
                inputOnChange={(value: any) => {
                  setItemsFilter({
                    ...itemsFilter,
                    from: value?.target?.value === '' ? null : value,
                  });
                }}
              />
            </div>
            <p className='text-gray-600 text-sm md:text-base self-center'>to</p>
            <div className='relative flex-1 md:flex-none min-w-[140px] md:min-w-0'>
              <CustomDatePicker
                id='to-datepicker'
                placeholder={'mm/dd/yyyy'}
                className='appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 md:placeholder:text-black text-sm leading-6'
                selected={itemsFilter.to}
                pickerOnChange={(date: any) => {
                  if (itemsFilter) setItemsFilter({ ...itemsFilter, to: date });
                  if (!itemsFilter) setItemsFilter(date);
                }}
                inputOnChange={(value: any) => {
                  setItemsFilter({
                    ...itemsFilter,
                    to: value?.target?.value === '' ? null : value,
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
                data-tooltip-content='Search for Employee Name'
                data-tooltip-place='bottom'
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
              <button
                onClick={handlePrintClick}
                disabled={isPrintGenerating || isExportingCSV || isLoadingEvaluationHistoryItems || evaluationHistoryItems.length === 0}
                className='flex items-center justify-center bg-white text-black rounded-md p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                title='Export individual evaluations'
                data-tooltip-id='export-tooltip'
                data-tooltip-content='Export to PDF or CSV'
              >
                {isPrintGenerating || isExportingCSV ? (
                  <div className="animate-spin w-6 h-6"></div>
                ) : (
                  <div>
                    <PrintIcon />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className={classNames('mt-8 flow-root', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
          <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='min-w-full py-2 sm:px-6 lg:px-8'>
              <table className='min-w-full divide-y divide-gray-300 text-center'>
                <thead>
                  <tr>
                    <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                      Employee
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                      Evaluation Date
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                      Evaluation Period
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                      Evaluation Form
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                      Overall Rating
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
      {isEvaluationDetailsModalOpen && (
        <EvaluationDetailsModal
          refetch={refetchEvaluationHistoryItems}
          isOpen={isEvaluationDetailsModalOpen}
          setIsOpen={setIsEvaluationDetailsModalOpen}
        />
      )}

      {isDeleteEvaluationHistoryModalOpen && (
        <DeleteModal
          isOpen={isDeleteEvaluationHistoryModalOpen}
          setIsOpen={setIsDeleteEvaluationHistoryModalOpen}
          onConfirm={(data) => handleDeleteEvaluationHistory(data?.id)}
          isLoading={isDeleteEvaluationHistoryLoading}
        />
      )}
      <PrintIndividualEvaluationsSelectionModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onConfirm={handlePrintConfirm}
        isLoading={isPrintGenerating || isExportingCSV}
        evaluationRecords={allEvaluationRecords}
      />

      <Tooltip id='search-tooltip'/>
      <Tooltip id='export-tooltip'/>
    </>
  );
};

export default IndividualEvaluations;
