'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import LoadingSpinner from '@/components/LoadingSpinner';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import ProgressModal from '@/components/ProgressModal';
import Pagination from '@/components/Pagination';
import CustomToast from '@/components/CustomToast';
import useGetEmailTemplateItems from './hooks/useGetEmailTemplateItems';
import useDeleteEmailTemplate from './hooks/useDeleteEmailTemplate';
import useBulkDeleteEmailTemplates from './hooks/useBulkDeleteEmailTemplates';
import useSeedEmailTemplates from './hooks/useSeedEmailTemplates';
import useUnseedEmailTemplates from './hooks/useUnseedEmailTemplates';
import CreateEditEmailTemplateModal from './modal/CreateEditEmailTemplateModal';
import SeederButton from '@/components/SeederButton';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import classNames from '@/helpers/classNames';
import { formatDateToLocal } from '@/helpers/date';

type T_EmailTemplateModalData = {
  id: number | null;
  open: boolean;
  mode: 'create' | 'edit';
};

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [itemsFilter, setItemsFilter] = useState<any>({
    search: '',
  });
  const [appliedFilter, setAppliedFilter] = useState<any>({
    search: '',
  });
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalRecords: number;
    totalPages: number;
  }>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [emailTemplatesItems, setEmailTemplatesItems] = useState<any>([]);
  const [actionType, setActionType] = useState<string>('');
  const [selectedEmailTemplateId, setSelectedEmailTemplateId] = useState<number | null>(null);
  const [emailTemplateModal, setEmailTemplateModal] = useState<T_EmailTemplateModalData | null>(null);
  const [isDeleteEmailTemplateModalOpen, setIsDeleteEmailTemplateModalOpen] = useState<{ open: boolean; id?: number; templateName?: string } | null>(null);
  
  // Bulk delete states
  const [selectedEmailTemplates, setSelectedEmailTemplates] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteConfirmModalOpen, setIsBulkDeleteConfirmModalOpen] = useState<DeleteModalData | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);

  const {
    data: dataEmailTemplate,
    isLoading: isGetEmailTemplateLoading,
    refetch: refetchEmailTemplate,
  } = useGetEmailTemplateItems({
    ...appliedFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });

  const { mutate: deleteEmailTemplate, isLoading: isDeleteEmailTemplateLoading } = useDeleteEmailTemplate();
  const bulkDeleteMutation = useBulkDeleteEmailTemplates();
  const seedMutation = useSeedEmailTemplates();
  const unseedMutation = useUnseedEmailTemplates();

  const handleCreateTemplateSuccess = () => {
    setSelectedEmailTemplateId(null);
    setActionType('');
    // Reset the modal state to close the create/edit modal
    setEmailTemplateModal(null);
  };

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setAppliedFilter({
      ...itemsFilter,
      search: searchText
    });
  };

  useEffect(() => {
    refetchEmailTemplate();
  }, [refetchEmailTemplate]);

  useEffect(() => {
    if (dataEmailTemplate && !isGetEmailTemplateLoading) {
      let items = [];
      let totalPages = 1;
      let totalRecords = 0;

      // Handle paginated response structure
      if (dataEmailTemplate.records) {
        items = dataEmailTemplate.records.map((item: any) => ({
          ...item,
          created_at: formatDateToLocal(item.created_at),
        }));
        totalPages = dataEmailTemplate.total_pages || 1;
        totalRecords = dataEmailTemplate.total_records || items.length;
      } 
      // Handle array response structure (no pagination from backend)
      else if (Array.isArray(dataEmailTemplate)) {
        items = dataEmailTemplate.map((item: any) => ({
          ...item,
          created_at: formatDateToLocal(item.created_at),
        }));
        
        // Calculate pagination locally if backend doesn't support it
        totalRecords = items.length;
        totalPages = Math.ceil(totalRecords / pageSize);
      }

      setEmailTemplatesItems(items);
      setPagination({
        totalPages,
        totalRecords
      });
    }
  }, [dataEmailTemplate, isGetEmailTemplateLoading, pageSize]);

  // Update select all state when email templates change
  useEffect(() => {
    if (emailTemplatesItems) {
      const allEmailTemplateIds = new Set(emailTemplatesItems.map((e: any) => e.id));
      const allSelected = allEmailTemplateIds.size > 0 && 
        Array.from(allEmailTemplateIds).every((id: any) => selectedEmailTemplates.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedEmailTemplates, emailTemplatesItems]);

  useEffect(() => {
    if (selectedEmailTemplateId) {
      if (actionType === 'edit') {
        setEmailTemplateModal({ id: selectedEmailTemplateId, open: true, mode: 'edit' });
      }
      if (actionType === 'delete') {
        const templateName = emailTemplatesItems.find((item: any) => item.id === selectedEmailTemplateId)?.subject || '';
        setIsDeleteEmailTemplateModalOpen({ 
          open: true, 
          id: selectedEmailTemplateId,
          templateName 
        });
      }
    }
  }, [selectedEmailTemplateId, actionType, emailTemplatesItems]);

  const openEditEvaluationModal = (emailTemplateDetails: any) => {
    setActionType('edit');
    if (selectedEmailTemplateId && selectedEmailTemplateId === emailTemplateDetails.id) {
      setEmailTemplateModal({ id: emailTemplateDetails.id, open: true, mode: 'edit' });
    } else {
      setSelectedEmailTemplateId(emailTemplateDetails.id);
    }
  };

  const openDeleteEvaluationModal = (emailTemplateDetails: any) => {
    setActionType('delete');
    if (selectedEmailTemplateId && selectedEmailTemplateId === emailTemplateDetails.id) {
      setIsDeleteEmailTemplateModalOpen({ 
        open: true, 
        id: emailTemplateDetails.id,
        templateName: emailTemplateDetails.subject 
      });
    } else {
      setSelectedEmailTemplateId(emailTemplateDetails.id);
    }
  };

  useEffect(() => {
    if (!emailTemplateModal?.open) {
      setSelectedEmailTemplateId(null);
      setActionType('');
    }
  }, [emailTemplateModal]);

  // Handle individual email template selection
  const handleEmailTemplateSelect = (emailTemplateId: number) => {
    setSelectedEmailTemplates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(emailTemplateId)) {
        newSet.delete(emailTemplateId);
      } else {
        newSet.add(emailTemplateId);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!emailTemplatesItems) return;
    
    if (selectAll) {
      setSelectedEmailTemplates(new Set());
    } else {
      const allIds = emailTemplatesItems.map((e: any) => e.id);
      setSelectedEmailTemplates(new Set(allIds));
    }
  };

  // Handle bulk delete - opens confirmation modal
  const handleBulkDelete = () => {
    if (selectedEmailTemplates.size === 0) return;
    setBulkDeleteCount(selectedEmailTemplates.size);
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
      const emailTemplateIds = Array.from(selectedEmailTemplates);
      await bulkDeleteMutation.mutateAsync(emailTemplateIds);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete email templates';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
      setIsBulkDeleteModalOpen(false);
    }
  };

  // Handle success after deletion completes
  const handleBulkDeleteSuccess = () => {
    toast.custom(() => <CustomToast message={`${bulkDeleteCount} email template(s) deleted successfully.`} type="success" />, { duration: 3000 });
    setSelectedEmailTemplates(new Set());
    setSelectAll(false);
    setBulkDeleteCount(0);
    refetchEmailTemplate();
  };

  // Handle seeding email templates
  const handleSeedEmailTemplates = async (count: number) => {
    try {
      const result = await seedMutation.mutateAsync({ count });
      toast.custom(
        () => <CustomToast message={result.message} type="success" />,
        { duration: 3000 }
      );
      // Clear any selected template and action type to prevent modal from opening
      setSelectedEmailTemplateId(null);
      setActionType('');
      refetchEmailTemplate();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to seed email templates';
      toast.custom(
        () => <CustomToast message={errorMessage} type="error" />,
        { duration: 5000 }
      );
      throw error;
    }
  };

  // Handle unseeding email templates
  const handleUnseedEmailTemplates = async () => {
    try {
      const result = await unseedMutation.mutateAsync();
      toast.custom(
        () => <CustomToast message={result.message} type="success" />,
        { duration: 3000 }
      );
      // Clear all selection states
      setSelectedEmailTemplates(new Set());
      setSelectAll(false);
      setSelectedEmailTemplateId(null);
      setActionType('');
      refetchEmailTemplate();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unseed email templates';
      toast.custom(
        () => <CustomToast message={errorMessage} type="error" />,
        { duration: 5000 }
      );
      throw error;
    }
  };

  const renderRows = () => {
    if (isGetEmailTemplateLoading) {
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
    if (emailTemplatesItems && emailTemplatesItems.length > 0) {
      return emailTemplatesItems.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <input
              type="checkbox"
              checked={selectedEmailTemplates.has(item.id)}
              onChange={() => handleEmailTemplateSelect(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.created_at}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.subject}</td>
          <td className='px-3 py-5 text-sm text-gray-500 w-48 max-w-48'>
            <div 
              className='truncate cursor-pointer hover:text-blue-600 hover:underline'
              onClick={() => openEditEvaluationModal(item)}
              title={item.to || ''}
            >
              {item.to || ''}
            </div>
          </td>
          <td className='px-3 py-5 text-sm text-gray-500 w-32 max-w-32'>
            <div 
              className='truncate cursor-pointer hover:text-blue-600 hover:underline'
              onClick={() => openEditEvaluationModal(item)}
              title={item.cc || ''}
            >
              {item.cc || ''}
            </div>
          </td>
          <td className='px-3 py-5 text-sm text-gray-500 w-32 max-w-32'>
            <div 
              className='truncate cursor-pointer hover:text-blue-600 hover:underline'
              onClick={() => openEditEvaluationModal(item)}
              title={item.bcc || ''}
            >
              {item.bcc || ''}
            </div>
          </td>
          <td className='px-3 py-5 text-sm text-gray-500 text-ellipsis'>
            <div className='flex justify-center space-x-2'>
              <SmartButton id="edit-email-template-btn" onClick={() => openEditEvaluationModal(item)}>
                <EditIcon />
              </SmartButton>
              <SmartButton 
                id="delete-email-template-btn" 
                onClick={() => openDeleteEvaluationModal(item)}
                disabled={selectedEmailTemplates.size > 1}
                className={selectedEmailTemplates.size > 1 ? 'opacity-50 cursor-not-allowed' : ''}
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
          <td colSpan={7}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>{`There's no data yet.`}</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add Email Template.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 mb-20 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/settings/general-settings' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>General Settings</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <div className='flex items-center justify-between mb-0'>
            <h2 className='text-xl font-bold text-indigo-dye'>Email Template</h2>
            <div className='hidden lg:block -mb-4'>
              <SeederButton
                onSeed={handleSeedEmailTemplates}
                onUnseed={handleUnseedEmailTemplates}
                isLoading={seedMutation.isLoading}
                isUnseeding={unseedMutation.isLoading}
              />
            </div>
          </div>
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
                  data-tooltip-content='Search for: Subject'
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
            <div className='flex-1 flex justify-start lg:justify-end gap-3 flex-wrap items-center'>
              <div className='lg:hidden'>
                <SeederButton
                  onSeed={handleSeedEmailTemplates}
                  onUnseed={handleUnseedEmailTemplates}
                  isLoading={seedMutation.isLoading}
                  isUnseeding={unseedMutation.isLoading}
                />
              </div>
              <SmartButton
                id="create-email-template-btn"
                className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setEmailTemplateModal({ id: null, open: true, mode: 'create' })}
              >
                CREATE
              </SmartButton>
            </div>
          </div>
          
          {/* Bulk Actions - Below Search/Filter Row */}
          {selectedEmailTemplates.size > 1 && (
            <div className="mt-4 ">
              <div className="flex items-center gap-3">
                <SmartButton
                  id="delete-email-template-btn"
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
                </SmartButton>
                <span className="text-sm text-gray-700 font-medium">
                  {selectedEmailTemplates.size} selected
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
                          disabled={!emailTemplatesItems || emailTemplatesItems.length === 0}
                          className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                        />
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date Created
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Subject
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-48 max-w-48'>
                        To
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-32 max-w-32'>
                        Cc
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-32 max-w-32'>
                        Bcc
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

      {/* Create/Edit Modal */}
      {emailTemplateModal && (
        <CreateEditEmailTemplateModal
          isOpen={emailTemplateModal}
          setIsOpen={setEmailTemplateModal}
          refetch={refetchEmailTemplate}
          onSuccess={handleCreateTemplateSuccess}
        />
      )}


      {/* Delete Modal */}
      {isDeleteEmailTemplateModalOpen && (
        <DeleteModal
          isOpen={isDeleteEmailTemplateModalOpen}
          setIsOpen={setIsDeleteEmailTemplateModalOpen}
          onConfirm={() => {
            if (!isDeleteEmailTemplateModalOpen.id) return;
            
            const callbackReq = {
              onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
                setIsDeleteEmailTemplateModalOpen(null);
                setSelectedEmailTemplateId(null);
                setActionType('');
                refetchEmailTemplate();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
              },
            };
            deleteEmailTemplate(isDeleteEmailTemplateModalOpen.id, callbackReq);
          }}
          isLoading={isDeleteEmailTemplateLoading}
          customText={`${isDeleteEmailTemplateModalOpen.templateName} Email Template`}
        />
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteConfirmModalOpen?.open && (
        <DeleteModal
          isOpen={isBulkDeleteConfirmModalOpen}
          setIsOpen={setIsBulkDeleteConfirmModalOpen}
          onConfirm={confirmBulkDeleteWarning}
          isLoading={false}
          customText={`${bulkDeleteCount} email template${bulkDeleteCount > 1 ? 's' : ''}`}
        />
      )}

      {/* Bulk Delete Progress Modal */}
      {isBulkDeleteModalOpen && (
        <ProgressModal
          isOpen={isBulkDeleteModalOpen}
          setIsOpen={setIsBulkDeleteModalOpen}
          onConfirm={confirmBulkDelete}
          title={`Deleting ${bulkDeleteCount} email template${bulkDeleteCount > 1 ? 's' : ''}...`}
          isProcessing={bulkDeleteMutation.isLoading}
          onSuccess={handleBulkDeleteSuccess}
        />
      )}

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;