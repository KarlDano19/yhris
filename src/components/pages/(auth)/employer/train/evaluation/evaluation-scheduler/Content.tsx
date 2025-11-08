'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { Tooltip } from 'react-tooltip';

import classNames from '@/helpers/classNames';
import LoadingSpinner from '@/components/LoadingSpinner';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import ProgressModal from '@/components/ProgressModal';
import Pagination from '@/components/Pagination';
import PlaceholderAvatar from '@/components/common/PlaceholderAvatar';
import SeederButton from '@/components/SeederButton';
import CreateEvaluationSchedulerModal from './modals/CreateEvaluationSchedulerModal';
import EditEvaluationSchedulerModal from './modals/EditEvaluationSchedulerModal';
import ConfirmSendEmailEvaluationSchedulerModal from './modals/ConfirmSendEmailEvaluationSchedulerModal';
import useGetEvaluationSchedulerItems from './hooks/useGetEvaluationSchedulerItems';
import useDeleteEvaluationScheduler from './hooks/useDeleteEvaluationScheduler';
import useBulkDeleteEvaluationSchedulers from './hooks/useBulkDeleteEvaluationSchedulers';
import useSeedEvaluationSchedulers from './hooks/useSeedEvaluationSchedulers';
import useUnseedEvaluationSchedulers from './hooks/useUnseedEvaluationSchedulers';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';

type T_BulkDeleteModalData = DeleteModalData & {
  selectedCount: number;
};

function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const [evaluationSchedulerItems, setEvaluationSchedulerItems] = useState<any>([]);
  const [actionType, setActionType] = useState<string>('');
  const [selectedEvaluationSchedulerId, setSelectedEvaluationSchedulerId] = useState<number | null>(null);
  const [isEditEvaluationSchedulerModalOpen, setIsEditEvaluationSchedulerModalOpen] = useState(false);
  const [isDeleteEvaluationSchedulerModalOpen, setIsDeleteEvaluationSchedulerModalOpen] = useState<{ id: number; open: boolean } | null>(null);
  const [isConfirmSendEmailEvaluationSchedulerModalOpen, setIsConfirmSendEmailEvaluationSchedulerModalOpen] =
    useState(false);
  const [isCreateEvaluationSchedulerOpen, setIsCreateEvaluationSchedulerOpen] = useState(false);
  
  // Bulk delete states
  const [selectedEvaluationSchedulers, setSelectedEvaluationSchedulers] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteConfirmModalOpen, setIsBulkDeleteConfirmModalOpen] = useState<T_BulkDeleteModalData | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);

  const [itemsFilter, setItemsFilter] = useState<any>({
    search: '',
  });
  const [appliedFilter, setAppliedFilter] = useState<any>({
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
    data: dataEvaluationScheduler,
    isLoading: isGetEvaluationSchedulerLoading,
    refetch: refetchEvaluationScheduler,
  } = useGetEvaluationSchedulerItems({
    ...appliedFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });

  const { mutate: deleteEvaluationScheduler, isLoading: isDeleteEvaluationSchedulerLoading } = useDeleteEvaluationScheduler();
  const bulkDeleteMutation = useBulkDeleteEvaluationSchedulers();
  const [isSearching, setIsSearching] = useState(false);
  const formMethods = useForm();
  const editFormMethods = useForm();
  const seedEvaluationSchedulersMutation = useSeedEvaluationSchedulers();
  const unseedEvaluationSchedulersMutation = useUnseedEvaluationSchedulers();

  // Helper component to display recipient avatar with fallback
  const RecipientAvatar = ({ recipient, size = 40 }: { recipient: any; size?: number }) => {
    const [imageError, setImageError] = useState(false);

    // Check if recipient is a string (photo URL) or object (name data)
    const isPhotoUrl = typeof recipient === 'string';
    const hasValidImage = isPhotoUrl && 
      recipient.trim() !== '' && 
      !recipient.includes('no-photo.png') &&
      !imageError;

    if (!hasValidImage) {
      // Use actual firstname and lastname from the recipient object
      const firstName = recipient?.firstname || '';
      const lastName = recipient?.lastname || '';
      
      return (
        <div className='w-full h-full overflow-hidden rounded-full flex items-center justify-center'>
          <PlaceholderAvatar
            width={size}
            height={size}
            firstName={firstName}
            lastName={lastName}
            className='flex-shrink-0'
          />
        </div>
      );
    }

    return (
      <img
        src={recipient}
        alt="Recipient"
        width={size}
        height={size}
        className='w-full h-full rounded-full object-cover flex-shrink-0'
        onError={() => setImageError(true)}
      />
    );
  };

  useEffect(() => {
    if (dataEvaluationScheduler) {
      let items = [];
      let totalPages = 1;
      let totalRecords = 0;

      // Handle paginated response structure
      if (dataEvaluationScheduler.records) {
        items = dataEvaluationScheduler.records;
        totalPages = dataEvaluationScheduler.total_pages || 1;
        totalRecords = dataEvaluationScheduler.total_records || items.length;
      } 
      // Handle array response structure (no pagination from backend)
      else if (Array.isArray(dataEvaluationScheduler)) {
        items = dataEvaluationScheduler;
        
        // Calculate pagination locally if backend doesn't support it
        totalRecords = items.length;
        totalPages = Math.ceil(totalRecords / pageSize);
      }

      setEvaluationSchedulerItems(items);
      setPagination({
        totalPages,
        totalRecords
      });
    }
  }, [dataEvaluationScheduler, pageSize]);

  // Update select all state when evaluation schedulers change
  useEffect(() => {
    if (evaluationSchedulerItems) {
      const allSchedulerIds = new Set(evaluationSchedulerItems.map((s: any) => s.id));
      const allSelected = allSchedulerIds.size > 0 && 
        Array.from(allSchedulerIds).every((id: any) => selectedEvaluationSchedulers.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedEvaluationSchedulers, evaluationSchedulerItems]);

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  useEffect(() => {
    if (selectedEvaluationSchedulerId) {
      if (actionType === 'edit') {
        setIsEditEvaluationSchedulerModalOpen(true);
      }
      if (actionType === 'delete') {
        setIsDeleteEvaluationSchedulerModalOpen({ id: selectedEvaluationSchedulerId, open: true });
      }
      if (actionType === 'send-email') {
        setIsConfirmSendEmailEvaluationSchedulerModalOpen(true);
      }
    }
  }, [selectedEvaluationSchedulerId, actionType]);

  const openEditEvaluationModal = (evaluationDetails: any) => {
    setActionType('edit');
    if (selectedEvaluationSchedulerId && selectedEvaluationSchedulerId === evaluationDetails.id) {
      setIsEditEvaluationSchedulerModalOpen(true);
    } else {
      setSelectedEvaluationSchedulerId(evaluationDetails.id);
    }
  };

  const openDeleteEvaluationModal = (evaluationDetails: any) => {
    setActionType('delete');
    if (selectedEvaluationSchedulerId && selectedEvaluationSchedulerId === evaluationDetails.id) {
      setIsDeleteEvaluationSchedulerModalOpen({ id: evaluationDetails.id, open: true });
    } else {
      setSelectedEvaluationSchedulerId(evaluationDetails.id);
    }
  };

  const handleSeedEvaluationSchedulers = async (count: number) => {
    try {
      const result = await seedEvaluationSchedulersMutation.mutateAsync({ count });
      toast.custom(() => <CustomToast message={result.message} type='success' />, { duration: 3000 });
    } catch (error: any) {
      const errorMessage = typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : 'Failed to seed evaluation schedulers';
      toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 5000 });
      throw error;
    }
  };

  const handleUnseedEvaluationSchedulers = async () => {
    try {
      const result = await unseedEvaluationSchedulersMutation.mutateAsync();
      toast.custom(() => <CustomToast message={result.message} type='success' />, { duration: 3000 });
    } catch (error: any) {
      const errorMessage = typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : 'Failed to unseed evaluation schedulers';
      toast.custom(() => <CustomToast message={errorMessage} type='error' />, { duration: 5000 });
      throw error;
    }
  };

  const openConfirmSendEmailEvaluationSchedulerModal = (evaluationDetails: any) => {
    setActionType('send-email');
    if (selectedEvaluationSchedulerId && selectedEvaluationSchedulerId === evaluationDetails.id) {
      setIsConfirmSendEmailEvaluationSchedulerModalOpen(true);
    } else {
      setSelectedEvaluationSchedulerId(evaluationDetails.id);
    }
  };

  const renderRecipientsRoundPhoto = (recipients: any) => {
    return (
      <div 
        className='inline-flex items-center overflow-x-auto overflow-y-visible pb-2.5 max-w-[200px]'
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#2d3e58 #f1f1f1',
          zIndex: 0
        }}
      >
        {(recipients || []).map((recipient: any, index: number) => {
          return (
            <div
              key={index}
              className='w-[40px] h-[40px] border-2 border-[#fff] rounded-full relative flex-shrink-0'
              style={{ 
                marginRight: '4px'
              }}
            >
              <RecipientAvatar recipient={recipient} size={40} />
            </div>
          );
        })}
      </div>
    );
  };

  const handleSearch = () => {
    setIsSearching(true);
    setAppliedFilter({
      ...itemsFilter,
      search: searchText
    });
  };

  useEffect(() => {
    if (!isGetEvaluationSchedulerLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isGetEvaluationSchedulerLoading, isSearching]);

  // Handle individual evaluation scheduler selection
  const handleEvaluationSchedulerSelect = (schedulerId: number) => {
    setSelectedEvaluationSchedulers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(schedulerId)) {
        newSet.delete(schedulerId);
      } else {
        newSet.add(schedulerId);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!evaluationSchedulerItems) return;
    
    if (selectAll) {
      setSelectedEvaluationSchedulers(new Set());
    } else {
      const allIds = evaluationSchedulerItems.map((s: any) => s.id);
      setSelectedEvaluationSchedulers(new Set(allIds));
    }
  };

  // Handle bulk delete - opens confirmation modal
  const handleBulkDelete = () => {
    if (selectedEvaluationSchedulers.size === 0) return;
    setBulkDeleteCount(selectedEvaluationSchedulers.size);
    setIsBulkDeleteConfirmModalOpen({
      open: true,
      selectedCount: selectedEvaluationSchedulers.size,
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
      const schedulerIds = Array.from(selectedEvaluationSchedulers);
      await bulkDeleteMutation.mutateAsync(schedulerIds);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete evaluation schedulers';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
      setIsBulkDeleteModalOpen(false);
    }
  };

  // Handle success after deletion completes
  const handleBulkDeleteSuccess = () => {
    toast.custom(() => <CustomToast message={`${bulkDeleteCount} evaluation scheduler(s) deleted successfully.`} type="success" />, { duration: 3000 });
    setSelectedEvaluationSchedulers(new Set());
    setSelectAll(false);
    setBulkDeleteCount(0);
    refetchEvaluationScheduler();
  };

  const renderRows = () => {
    if (isSearching || isGetEvaluationSchedulerLoading) {
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
    if (evaluationSchedulerItems && evaluationSchedulerItems?.length > 0) {
      return evaluationSchedulerItems?.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <input
              type="checkbox"
              checked={selectedEvaluationSchedulers.has(item.id)}
              onChange={() => handleEvaluationSchedulerSelect(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
            />
          </td>
          <td className='whitespace-nowrap text-ellipsis px-3 py-5 text-sm text-gray-500'>{item.name}</td>
          <td className='whitespace-nowrap text-ellipsis px-3 py-5 text-sm text-gray-500'>
            {item.evaluation_template}
          </td>
          <td className='whitespace-nowrap text-ellipsis px-3 py-5 text-sm text-gray-500'>{item.evaluation_period}</td>
          <td className='whitespace-nowrap text-ellipsis px-3 py-5 text-sm text-gray-500'>
            {item.evaluation_schedule}
          </td>
          <td className='whitespace-nowrap text-ellipsis px-3 py-5 text-sm text-gray-500'>
            {renderRecipientsRoundPhoto(item.recipients)}
          </td>
          <td className='whitespace-nowrap text-ellipsis px-3 py-5 text-sm text-gray-500'>
            <div className='flex justify-center space-x-2'>
              <button
                className='border rounded px-[0.65em] border-[#3d6cee9f]'
                onClick={() => openConfirmSendEmailEvaluationSchedulerModal(item)}
              >
                <Image
                  src='/assets/send-icon.png'
                  width={20}
                  height={20}
                  alt='send-icon'
                  className='max-w-[20px] max-h-[20px]'
                />
              </button>
              <button
                onClick={() => openEditEvaluationModal(item)}
              >
                <EditIcon />
              </button>
              <button 
                onClick={() => openDeleteEvaluationModal(item)}
                disabled={selectedEvaluationSchedulers.size > 1}
                className={selectedEvaluationSchedulers.size > 1 ? 'opacity-50 cursor-not-allowed' : ''}
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
                Please click create to add an evaluation scheduler.
              </h4>
            </td>
          </tr>
        </>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/train' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Train</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Evaluation Scheduler</h2>
        </div>

        {/* Content Section with flex-1 */}
        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          <div className={classNames('flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex gap-2 lg:w-1/3 pr-5 md:pr-16'>
              <div className='flex-none w-11/12 lg:w-full'>
                <div className='relative flex items-center'>
                  <input
                  type='text'
                  name='search'
                  id='search'
                  data-tooltip-id='search-tooltip'
                  data-tooltip-content='Search for Schedule: Name / Evaluation Template'
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
              </div>
            </div>
            <button
              className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
              onClick={handleSearch}
            >
                <MagnifyingGlassIcon className='h-5 w-5' />
              </button>
            </div>
            <div className='flex-1 flex justify-start lg:justify-end gap-3 flex-wrap'>
              <SeederButton
                onSeed={handleSeedEvaluationSchedulers}
                onUnseed={handleUnseedEvaluationSchedulers}
                isLoading={seedEvaluationSchedulersMutation.isLoading}
                isUnseeding={unseedEvaluationSchedulersMutation.isLoading}
                disabled={!hasActiveSubscription}
                maxCount={1000}
              />
              <button
                className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsCreateEvaluationSchedulerOpen(true)}
                disabled={!hasActiveSubscription}
              >
                CREATE
              </button>
            </div>
          </div>

          {/* Bulk Actions - Below Date Filters */}
          {selectedEvaluationSchedulers.size > 1 && (
            <div className="mt-4 ">
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
                  {selectedEvaluationSchedulers.size} selected
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
                          disabled={!evaluationSchedulerItems || evaluationSchedulerItems.length === 0}
                          className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                        />
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Schedule Name
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Evaluation Template
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Evaluation Period
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Evaluation Schedule
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Recipients
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
      {isCreateEvaluationSchedulerOpen && (
        <CreateEvaluationSchedulerModal
          refetch={refetchEvaluationScheduler}
          isOpen={isCreateEvaluationSchedulerOpen}
          setIsOpen={setIsCreateEvaluationSchedulerOpen}
          {...formMethods}
          Controller={Controller}
        />
      )}
      {isEditEvaluationSchedulerModalOpen && selectedEvaluationSchedulerId && (
        <EditEvaluationSchedulerModal
          refetch={refetchEvaluationScheduler}
          isOpen={isEditEvaluationSchedulerModalOpen}
          setIsOpen={setIsEditEvaluationSchedulerModalOpen}
          selectedEvaluationSchedulerId={selectedEvaluationSchedulerId}
          {...editFormMethods}
          Controller={Controller}
        />
      )}
      {isDeleteEvaluationSchedulerModalOpen && (
        <DeleteModal
          isOpen={isDeleteEvaluationSchedulerModalOpen}
          setIsOpen={setIsDeleteEvaluationSchedulerModalOpen}
          onConfirm={() => {
            const callbackReq = {
              onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
                setIsDeleteEvaluationSchedulerModalOpen(null);
                refetchEvaluationScheduler();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
              },
            };
            deleteEvaluationScheduler(isDeleteEvaluationSchedulerModalOpen.id, callbackReq);
          }}
          isLoading={isDeleteEvaluationSchedulerLoading}
        />
      )}
      {isConfirmSendEmailEvaluationSchedulerModalOpen && selectedEvaluationSchedulerId && (
        <ConfirmSendEmailEvaluationSchedulerModal
          refetch={refetchEvaluationScheduler}
          isOpen={isConfirmSendEmailEvaluationSchedulerModalOpen}
          setIsOpen={setIsConfirmSendEmailEvaluationSchedulerModalOpen}
          selectedEvaluationSchedulerId={selectedEvaluationSchedulerId}
        />
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteConfirmModalOpen?.open && (
        <DeleteModal<T_BulkDeleteModalData>
          isOpen={isBulkDeleteConfirmModalOpen}
          setIsOpen={setIsBulkDeleteConfirmModalOpen}
          onConfirm={confirmBulkDeleteWarning}
          isLoading={false}
          customText={`${bulkDeleteCount} evaluation scheduler${bulkDeleteCount > 1 ? 's' : ''}`}
        />
      )}

      {/* Bulk Delete Progress Modal */}
      {isBulkDeleteModalOpen && (
        <ProgressModal
          isOpen={isBulkDeleteModalOpen}
          setIsOpen={setIsBulkDeleteModalOpen}
          onConfirm={confirmBulkDelete}
          title={`Deleting ${bulkDeleteCount} evaluation scheduler${bulkDeleteCount > 1 ? 's' : ''}...`}
          isProcessing={bulkDeleteMutation.isLoading}
          onSuccess={handleBulkDeleteSuccess}
        />
      )}

      <Tooltip id='search-tooltip'/>
    </>
  );
}

export default Content;
