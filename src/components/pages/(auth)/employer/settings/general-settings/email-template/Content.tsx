'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import CustomToast from '@/components/CustomToast';
import useGetEmailTemplateItems from './hooks/useGetEmailTemplateItems';
import useBulkDeleteEmailTemplates from './hooks/useBulkDeleteEmailTemplates';
import CreateEmailTemplateModal from './modal/CreateEmailTemplate';
import DeleteEmailTemplateModal from './modal/DeleteEmailTemplateModal';
import EditEmailTemplateModal from './modal/EditEmailTemplateModal';
import SuccessModal from './modal/SuccessModal';
import BulkDeleteModal from '@/components/BulkDeleteModal';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import classNames from '@/helpers/classNames';

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
  const [isEditEmailTemplateModalOpen, setIsEditEmailTemplateModalOpen] = useState(false);
  const [isDeleteEmailTemplateModalOpen, setIsDeleteEmailTemplateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  // Bulk delete states
  const [selectedEmailTemplates, setSelectedEmailTemplates] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const {
    data: dataEmailTemplate,
    isLoading: isGetEmailTemplateLoading,
    refetch: refetchEmailTemplate,
  } = useGetEmailTemplateItems({
    ...appliedFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });

  const bulkDeleteMutation = useBulkDeleteEmailTemplates();

  const handleCreateTemplateSuccess = () => {
    setIsSuccessModalOpen(true);
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
    setAppliedFilter({
      ...itemsFilter,
      search: searchText
    });
  };

  useEffect(() => {
    refetchEmailTemplate();
  }, []);

  useEffect(() => {
    if (dataEmailTemplate && !isGetEmailTemplateLoading) {
      let items = [];
      let totalPages = 1;
      let totalRecords = 0;

      // Handle paginated response structure
      if (dataEmailTemplate.records) {
        items = dataEmailTemplate.records.map((item: any) => ({
          ...item,
          created_at: (() => {
            const d = new Date(item.created_at);
            return isNaN(d.getTime()) ? 'Invalid date' : d.toLocaleDateString('en-US');
          })(),
        }));
        totalPages = dataEmailTemplate.total_pages || 1;
        totalRecords = dataEmailTemplate.total_records || items.length;
      } 
      // Handle array response structure (no pagination from backend)
      else if (Array.isArray(dataEmailTemplate)) {
        items = dataEmailTemplate.map((item: any) => ({
          ...item,
          created_at: (() => {
            const d = new Date(item.created_at);
            return isNaN(d.getTime()) ? 'Invalid date' : d.toLocaleDateString('en-US');
          })(),
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
        setIsEditEmailTemplateModalOpen(true);
      }
      if (actionType === 'delete') {
        setIsDeleteEmailTemplateModalOpen(true);
      }
    }
  }, [selectedEmailTemplateId]);

  const openEditEvaluationModal = (emailTemplateDetails: any) => {
    setActionType('edit');
    if (selectedEmailTemplateId && selectedEmailTemplateId === emailTemplateDetails.id) {
      setIsEditEmailTemplateModalOpen(true);
    } else {
      setSelectedEmailTemplateId(emailTemplateDetails.id);
    }
  };

  const openDeleteEvaluationModal = (emailTemplateDetails: any) => {
    setActionType('delete');
    if (selectedEmailTemplateId && selectedEmailTemplateId === emailTemplateDetails.id) {
      setIsDeleteEmailTemplateModalOpen(true);
    } else {
      setSelectedEmailTemplateId(emailTemplateDetails.id);
    }
  };

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

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedEmailTemplates.size === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const emailTemplateIds = Array.from(selectedEmailTemplates);
      await bulkDeleteMutation.mutateAsync(emailTemplateIds);
      
      toast.custom(() => <CustomToast message={`${selectedEmailTemplates.size} email template(s) deleted successfully.`} type="success" />, { duration: 3000 });
      setSelectedEmailTemplates(new Set());
      setSelectAll(false);
      setIsBulkDeleteModalOpen(false);
      refetchEmailTemplate();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete email templates';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
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
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.to}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.cc}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.bcc}</td>
          <td className='px-3 py-5 text-sm text-gray-500 text-ellipsis'>
            <div className='flex justify-center space-x-2'>
              <button onClick={() => openEditEvaluationModal(item)}>
                <EditIcon />
              </button>
              <button 
                onClick={() => openDeleteEvaluationModal(item)}
                className={selectedEmailTemplates.size > 1 ? 'invisible' : ''}
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
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24'>
        <div className='flex p-4'>
          <Link href='/settings/general-settings' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>General Settings</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Email Template</h2>
          
          

          <div className={classNames('mt-6 flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
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
            <div className='flex-1 flex justify-start lg:justify-end'>
              <button
                className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsCreateModalOpen(true)}
                // disabled={!hasActiveSubscription}
              >
                CREATE
              </button>
            </div>
          </div>
          
          {/* Bulk Actions - Below Search/Filter Row */}
          {selectedEmailTemplates.size > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
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
                <button
                  onClick={() => setSelectedEmailTemplates(new Set())}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear Selected
                </button>
                <span className="text-sm text-gray-700 font-medium">
                  {selectedEmailTemplates.size} selected
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
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        To
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Cc
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
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
      <CreateEmailTemplateModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        refetch={refetchEmailTemplate}
        onSuccess={handleCreateTemplateSuccess}
      />
      <SuccessModal isOpen={isSuccessModalOpen} setIsOpen={setIsSuccessModalOpen} />
      {isDeleteEmailTemplateModalOpen && selectedEmailTemplateId && (
        <DeleteEmailTemplateModal
          refetch={refetchEmailTemplate}
          isOpen={isDeleteEmailTemplateModalOpen}
          setIsOpen={setIsDeleteEmailTemplateModalOpen}
          selectedEmailTemplateId={selectedEmailTemplateId}
          selectedEmailTemplateName={
            emailTemplatesItems.find((item: any) => item.id === selectedEmailTemplateId)?.subject
          }
        />
      )}
      {isEditEmailTemplateModalOpen && selectedEmailTemplateId && (
        <EditEmailTemplateModal
          refetch={refetchEmailTemplate}
          isOpen={isEditEmailTemplateModalOpen}
          setIsOpen={setIsEditEmailTemplateModalOpen}
          selectedEmailTemplateId={selectedEmailTemplateId}
        />
      )}

      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        selectedCount={selectedEmailTemplates.size}
        moduleName="email templates"
        onConfirm={confirmBulkDelete}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        isLoading={bulkDeleteMutation.isLoading}
      />

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;
