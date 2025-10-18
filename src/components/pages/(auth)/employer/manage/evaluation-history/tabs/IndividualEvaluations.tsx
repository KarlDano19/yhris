'use client';
import React, { useEffect, useState, useRef } from 'react';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import classNames from '@/helpers/classNames';
import CustomDatePicker from '@/components/CustomDatePicker';
import Pagination from '@/components/Pagination';
import useGetEvaluationHistoryItems from '../hooks/useGetEvaluationHistoryItems';
import EvaluationDetailsModal from '../modals/EvaluationDetailsModal';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

type T_ModalData = {
  id: number;
  open: boolean;
};

const IndividualEvaluations = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [evaluationHistoryItems, setEvaluationHistoryItems] = useState<any>([]);
  const [isEvaluationDetailsModalOpen, setIsEvaluationDetailsModalOpen] = useState<T_ModalData | null>(null);
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

  const {
    data: dataEvaluationHistoryItems,
    isLoading: isLoadingEvaluationHistoryItems,
    refetch: refetchEvaluationHistoryItems,
  } = useGetEvaluationHistoryItems({
    ...appliedFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });

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
          className='cursor-pointer'
          onClick={() => setIsEvaluationDetailsModalOpen({ id: item.id, open: true })}
        >
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.employee_name}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date_of_evaluation}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.evaluation_period}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.evaluation_form}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span className={classNames('text-gray-500', item.form_total_score < item.passing_score && 'text-red-500')}>
              {item.form_total_score}
            </span>
            /<span>{item.total_score}</span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <button className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'>
              View
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
                    from: value?.target?.value === '' ? null : value,
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

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default IndividualEvaluations;

