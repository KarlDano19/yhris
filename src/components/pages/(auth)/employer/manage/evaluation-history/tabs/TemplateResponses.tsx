'use client';

import React, { useEffect, useState } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import classNames from '@/helpers/classNames';
import CustomDatePicker from '@/components/CustomDatePicker';
import Pagination from '@/components/Pagination';
import useGetTemplateResponses from '../hooks/useGetTemplateResponses';
import useGetEvaluationResponseHistoryDetails from '../hooks/useGetEvaluationResponseHistoryDetails';
import EvaluationResponseDetailsModal from '../modals/EvaluationResponseDetailsModal';

import { UsersIcon } from '@heroicons/react/24/solid';

type T_ModalData = {
  id: number;
  open: boolean;
};

const TemplateResponses = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [templateResponses, setTemplateResponses] = useState<any>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isTemplateDetailsModalOpen, setIsTemplateDetailsModalOpen] = useState<T_ModalData | null>(null);
  const [itemsFilter, setItemsFilter] = useState<any>({
    from: '',
    to: '',
  });
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalRecords: number;
    totalPages: number;
  }>({
    totalPages: 1,
    totalRecords: 0,
  });

  const {
    data: dataTemplateResponses,
    isLoading: isLoadingTemplateResponses,
    refetch: refetchTemplateResponses,
  } = useGetTemplateResponses({
    from: itemsFilter.from ? itemsFilter.from.toLocaleDateString('en-CA') : '',
    to: itemsFilter.to ? itemsFilter.to.toLocaleDateString('en-CA') : '',
    search: '',
    pageSize: pageSize,
    currentPage: currentPage,
  });

  const {
    data: templateResponseDetails,
    isLoading: isLoadingTemplateDetails,
  } = useGetEvaluationResponseHistoryDetails(selectedTemplate?.evaluation_template_id || null);

  useEffect(() => {
    if (dataTemplateResponses) {
      console.log('TemplateResponses data:', dataTemplateResponses);
      
      // New analytics endpoint returns pre-aggregated data with pagination
      if (dataTemplateResponses.records) {
        // Backend already aggregated by template, no need for client-side grouping
        const items = dataTemplateResponses.records;
        
        setTemplateResponses(items);
        setPagination({
          totalPages: dataTemplateResponses.total_pages || 1,
          totalRecords: dataTemplateResponses.total_records || items.length
        });
      } else {
        // Handle empty or unexpected response
        setTemplateResponses([]);
        setPagination({
          totalPages: 1,
          totalRecords: 0
        });
      }
    }
  }, [dataTemplateResponses, pageSize]);

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleViewResponses = (item: any) => {
    setSelectedTemplate(item);
    setIsTemplateDetailsModalOpen({ id: item.evaluation_template_id, open: true });
  };

  const renderRows = () => {
    if (isLoadingTemplateResponses) {
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
    if (templateResponses && templateResponses.length > 0) {
      // Backend already handles pagination, just render the pre-aggregated data
      return templateResponses.map((template: any, index: number) => (
        <tr key={index} className='hover:bg-gray-50'>
          <td className='whitespace-nowrap px-3 py-5 text-center text-sm text-gray-500'>{template.evaluation_form}</td>
          <td className='whitespace-nowrap px-3 py-5 text-center text-sm text-gray-500'>{template.evaluation_period}</td>
          <td className='whitespace-nowrap px-3 py-5 text-center text-sm text-gray-500'>
            <div className='flex items-center justify-center gap-2'>
              <UsersIcon className='h-4 w-4 text-gray-400' />
              {template.total_responses}
            </div>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-center text-sm text-gray-500'>
            <span className={classNames('font-semibold', 
              (parseFloat(template.average_score) / parseFloat(template.average_total_score) * 100) >= 80 ? 'text-green-600' : 
              (parseFloat(template.average_score) / parseFloat(template.average_total_score) * 100) >= 60 ? 'text-yellow-600' : 
              'text-red-600')}>
              {template.average_score} / {template.average_total_score}
            </span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-center text-sm text-gray-500'>{template.last_evaluation_date}</td>
          <td className='whitespace-nowrap px-3 py-5 text-center text-sm text-gray-500'>
            <button 
              className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
              onClick={() => handleViewResponses(template)}
            >
              View
            </button>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={6}>
            <h4 className='text-center text-gray-300 text-sm my-4'>There{`'`}s no data yet.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='px-2 md:px-8 lg:px-4'>
        <h2 className='text-xl font-bold text-indigo-dye'>Template Responses</h2>
        {/* <p className='text-sm text-gray-600 mt-2'>View aggregated response data for evaluation templates</p> */}
        
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
              <table className='min-w-full divide-y divide-gray-300'>
                <thead>
                  <tr>
                    <th scope='col' className='px-3 py-3.5 text-center text-sm font-semibold text-gray-900'>
                      Evaluation Form
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-center text-sm font-semibold text-gray-900'>
                      Evaluation Period
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-center text-sm font-semibold text-gray-900'>
                      Total Responses
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-center text-sm font-semibold text-gray-900'>
                      Average Score
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-center text-sm font-semibold text-gray-900'>
                      Last Evaluation
                    </th>
                    <th scope='col' className='px-3 py-3.5 text-center text-sm font-semibold text-gray-900'>
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

      {/* Template Response Details Modal */}
      <EvaluationResponseDetailsModal
        isOpen={isTemplateDetailsModalOpen}
        setIsOpen={setIsTemplateDetailsModalOpen}
        selectedTemplate={selectedTemplate}
        templateResponseDetails={templateResponseDetails}
        isLoadingTemplateDetails={isLoadingTemplateDetails}
      />
    </>
  );
};

export default TemplateResponses;

