'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import Pagination from '@/components/Pagination';
import SelectionModal from './modals/SelectionTemplateModal';
import EditEvaluationModal from './modals/EditEvaluationTemplateModal';
import useGetEvaluationTemplateItems from './hooks/useGetEvaluationTemplateItems';
import useDeleteEvaluationTemplate from './hooks/useDeleteEvaluationTemplate';
import useBulkDeleteEvaluationTemplates from './hooks/useBulkDeleteEvaluationTemplates';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import classNames from '@/helpers/classNames';

type T_BulkDeleteModalData = DeleteModalData & {
  selectedCount: number;
};

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [evaluationItems, setEvaluationItems] = useState<any>([]);
  const [actionType, setActionType] = useState<string>('');
  const [selectedEvaluationTemplateId, setSelectedEvaluationTemplateId] = useState<number | null>(null);
  const [isEditEvaluationModalOpen, setIsEditEvaluationModalOpen] = useState(false);
  const [isDeleteEvaluationModalOpen, setIsDeleteEvaluationModalOpen] = useState<{ id: number; open: boolean } | null>(null);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  
  // Bulk delete states
  const [selectedEvaluationTemplates, setSelectedEvaluationTemplates] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState<T_BulkDeleteModalData | null>(null);

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
  const {
    data: dataEvaluation,
    isLoading: isGetEvaluationLoading,
    refetch: refetchEvaluation,
  } = useGetEvaluationTemplateItems({
    ...appliedFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });
  const { mutate: deleteEvaluationTemplate, isLoading: isDeleteEvaluationTemplateLoading } = useDeleteEvaluationTemplate();
  const bulkDeleteMutation = useBulkDeleteEvaluationTemplates();
  const [isSearching, setIsSearching] = useState(false);

  // Persisted form state for CreateEvaluationTemplateModal
  const formMethods = useForm({
    defaultValues: {
      criteria_rating_view_type: 'default',
      total_score: 1,
      passing_score: 1,
      is_show_remarks: false,
      is_show_criteria_comment: false,
      rating_type: 'none',
      evaluation_criterion: [
        {
          id: uuidv4(),
          criterion: [
            {
              id: uuidv4(),
              title: '',
              max_score: 1,
              is_disable_comment: true,
            },
          ],
        },
      ],
    },
  });

  useEffect(() => {
    if (dataEvaluation) {
      let items = [];
      let totalPages = 1;
      let totalRecords = 0;

      // Handle paginated response structure
      if (dataEvaluation.records) {
        items = dataEvaluation.records.map((item: any) => {
          item['created_at'] = Intl.DateTimeFormat('en-US').format(new Date(item.created_at));
          return item;
        });
        totalPages = dataEvaluation.total_pages || 1;
        totalRecords = dataEvaluation.total_records || items.length;
      } 
      // Handle array response structure (no pagination from backend)
      else if (Array.isArray(dataEvaluation)) {
        items = dataEvaluation.map((item: any) => {
          item['created_at'] = Intl.DateTimeFormat('en-US').format(new Date(item.created_at));
          return item;
        });
        
        // Calculate pagination locally if backend doesn't support it
        totalRecords = items.length;
        totalPages = Math.ceil(totalRecords / pageSize);
      }

      setEvaluationItems(items);
      setPagination({
        totalPages,
        totalRecords
      });
    }
  }, [dataEvaluation, pageSize]);

  // Update select all state when evaluation templates change
  useEffect(() => {
    if (evaluationItems) {
      const allEvaluationIds = new Set(evaluationItems.map((e: any) => e.id));
      const allSelected = allEvaluationIds.size > 0 && 
        Array.from(allEvaluationIds).every((id: any) => selectedEvaluationTemplates.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedEvaluationTemplates, evaluationItems]);

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  useEffect(() => {
    if (selectedEvaluationTemplateId) {
      if (actionType === 'edit') {
        setIsEditEvaluationModalOpen(true);
      }
      if (actionType === 'delete') {
        setIsDeleteEvaluationModalOpen({ id: selectedEvaluationTemplateId, open: true });
      }
    }
  }, [selectedEvaluationTemplateId, actionType]);

  const openEditEvaluationModal = (evaluationDetails: any) => {
    setActionType('edit');
    if (selectedEvaluationTemplateId && selectedEvaluationTemplateId === evaluationDetails.id) {
      setIsEditEvaluationModalOpen(true);
    } else {
      setSelectedEvaluationTemplateId(evaluationDetails.id);
    }
  };

  const openDeleteEvaluationModal = (evaluationDetails: any) => {
    setActionType('delete');
    if (selectedEvaluationTemplateId && selectedEvaluationTemplateId === evaluationDetails.id) {
      setIsDeleteEvaluationModalOpen({ id: evaluationDetails.id, open: true });
    } else {
      setSelectedEvaluationTemplateId(evaluationDetails.id);
    }
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
    if (!isGetEvaluationLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isGetEvaluationLoading, isSearching]);

  // Handle individual evaluation template selection
  const handleEvaluationTemplateSelect = (evaluationTemplateId: number) => {
    setSelectedEvaluationTemplates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(evaluationTemplateId)) {
        newSet.delete(evaluationTemplateId);
      } else {
        newSet.add(evaluationTemplateId);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!evaluationItems) return;
    
    if (selectAll) {
      setSelectedEvaluationTemplates(new Set());
    } else {
      const allIds = evaluationItems.map((e: any) => e.id);
      setSelectedEvaluationTemplates(new Set(allIds));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedEvaluationTemplates.size === 0) return;
    setIsBulkDeleteModalOpen({
      open: true,
      selectedCount: selectedEvaluationTemplates.size,
    });
  };

  const confirmBulkDelete = async () => {
    try {
      const evaluationTemplateIds = Array.from(selectedEvaluationTemplates);
      await bulkDeleteMutation.mutateAsync(evaluationTemplateIds);
      
      toast.custom(() => <CustomToast message={`${selectedEvaluationTemplates.size} evaluation template(s) deleted successfully.`} type="success" />, { duration: 3000 });
      setSelectedEvaluationTemplates(new Set());
      setSelectAll(false);
      setIsBulkDeleteModalOpen(null);
      refetchEvaluation();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete evaluation templates';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
    }
  };

  const renderRows = () => {
    if (isSearching || isGetEvaluationLoading) {
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
    if (evaluationItems && evaluationItems?.length > 0) {
      return evaluationItems?.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <input
              type="checkbox"
              checked={selectedEvaluationTemplates.has(item.id)}
              onChange={() => handleEvaluationTemplateSelect(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.created_at}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.name}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.evaluation_type}</td>
          <td className='px-3 py-5 text-sm text-gray-500 text-ellipsis'>{item.frequency}</td>
          <td className='px-3 py-5 text-sm text-gray-500 text-ellipsis'>
            <div className='flex justify-center space-x-2'>
              <button onClick={() => openEditEvaluationModal(item)}>
                <EditIcon />
              </button>
              <button 
                onClick={() => openDeleteEvaluationModal(item)}
                disabled={selectedEvaluationTemplates.size > 1}
                className={selectedEvaluationTemplates.size > 1 ? 'opacity-50 cursor-not-allowed' : ''}
              >
                <DeleteIcon />
              </button>
            </div>
          </td>
        </tr>
      ));
    } else {
      return (
        <>
          <tr>
            <td colSpan={7}>
              <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
              <h4 className='text-center text-gray-300 text-sm mb-4'>
                Please click create to add evaluation template.
              </h4>
            </td>
          </tr>
        </>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24'>
        <div className='flex p-4'>
          <Link href='/train' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Train</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Evaluation Template</h2>
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
                  data-tooltip-content='Search for Evaluation Template Name'
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
            <div className='flex-1 flex justify-start lg:justify-end'>
              <button
                className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsSelectionModalOpen(true)}
              >
                CREATE
              </button>
            </div>
          </div>
          
          {/* Bulk Actions - Below Date Filters */}
          {selectedEvaluationTemplates.size > 1 && (
            <div className="mt-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteMutation.isLoading}
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
                <span className="text-sm text-gray-700 font-medium">
                  {selectedEvaluationTemplates.size} selected
                </span>
              </div>
            </div>
          )}

          <div className={classNames('mt-8 flow-root', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div
              className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#2d3e58 #f1f1f1'
              }}
            >
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full text-center divide-y divide-gray-300'>
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          disabled={!evaluationItems || evaluationItems.length === 0}
                          className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                        />
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date Created
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Name
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Evaluation Type
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Frequency
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
      {isSelectionModalOpen && (
        <SelectionModal
          refetch={refetchEvaluation}
          isOpen={isSelectionModalOpen}
          setIsOpen={setIsSelectionModalOpen}
          formMethods={formMethods}
        />
      )}
      {isEditEvaluationModalOpen && selectedEvaluationTemplateId && (
        <EditEvaluationModal
          refetch={refetchEvaluation}
          isOpen={isEditEvaluationModalOpen}
          setIsOpen={setIsEditEvaluationModalOpen}
          selectedEvaluationTemplateId={selectedEvaluationTemplateId}
        />
      )}
      {isDeleteEvaluationModalOpen && (
        <DeleteModal
          isOpen={isDeleteEvaluationModalOpen}
          setIsOpen={setIsDeleteEvaluationModalOpen}
          onConfirm={() => {
            const callbackReq = {
              onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
                setIsDeleteEvaluationModalOpen(null);
                refetchEvaluation();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
              },
            };
            deleteEvaluationTemplate(isDeleteEvaluationModalOpen.id, callbackReq);
          }}
          isLoading={isDeleteEvaluationTemplateLoading}
        />
      )}

      {/* Bulk Delete Modal */}
      {isBulkDeleteModalOpen && (
        <DeleteModal<T_BulkDeleteModalData>
          isOpen={isBulkDeleteModalOpen}
          setIsOpen={setIsBulkDeleteModalOpen}
          onConfirm={confirmBulkDelete}
          isLoading={bulkDeleteMutation.isLoading}
          customText={`${isBulkDeleteModalOpen.selectedCount} evaluation template${isBulkDeleteModalOpen.selectedCount > 1 ? 's' : ''}`}
        />
      )}

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;
