'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Tooltip } from 'react-tooltip';

import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import useGetEmployeePaginatedSelect from '@/components/hooks/useGetEmployeePaginatedSelect';
import useGetEmailTemplateItems from './hooks/useGetEmailTemplateItems';
import CreateEmailTemplateModal from './modal/CreateEmailTemplate';
import DeleteEmailTemplateModal from './modal/DeleteEmailTemplateModal';
import EditEmailTemplateModal from './modal/EditEmailTemplateModal';
import SuccessModal from './modal/SuccessModal';

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
  
  // Employee search state for modals
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [debouncedEmployeeSearch, setDebouncedEmployeeSearch] = useState('');
  const {
    data: dataEmailTemplate,
    isLoading: isGetEmailTemplateLoading,
    refetch: refetchEmailTemplate,
  } = useGetEmailTemplateItems({
    ...appliedFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });

  // Employee data fetching for modals
  const { data: employeeData } = useGetEmployeePaginatedSelect(
    debouncedEmployeeSearch && debouncedEmployeeSearch.length >= 2 ? {
      search: debouncedEmployeeSearch,
      current_page: 1,
      page_size: 500
    } : null
  );

  // Debouncing effect for employee search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedEmployeeSearch(employeeSearchTerm), 500);
    return () => clearTimeout(timer);
  }, [employeeSearchTerm]);

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

  useEffect(() => {
    if (selectedEmailTemplateId) {
      if (actionType === 'edit') {
        setIsEditEmailTemplateModalOpen(true);
      }
      if (actionType === 'delete') {
        setIsDeleteEmailTemplateModalOpen(true);
      }
    }
  }, [selectedEmailTemplateId, actionType]);

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
              <button onClick={() => openDeleteEvaluationModal(item)}>
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
        employeeData={employeeData}
        onSearchChange={setEmployeeSearchTerm}
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
          employeeData={employeeData}
          onSearchChange={setEmployeeSearchTerm}
        />
      )}

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;
