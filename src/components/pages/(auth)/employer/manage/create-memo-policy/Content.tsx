'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';

import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';
import ProgressModal from '@/components/ProgressModal';
import useGetDirectivesItems from './hooks/useGetDirectivesItems';
import useDeleteDirectivesItem from './hooks/useDeleteDirectivesItem';
import useBulkDeleteDirectives from './hooks/useBulkDeleteDirectives';
import CreateMemoModal from './modals/CreateMemoModal';
import CreatePolicyModal from './modals/CreatePolicyModal';
import EmployeeResponsesModal from './modals/ResponsesModal';
import EditMemoModal from './modals/EditMemoModal';
import EditPolicyModal from './modals/EditPolicyModal';
import ConfirmModal from '@/components/ConfirmModal';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import ClipIcon from '@/svg/ClipIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import EditIcon from '@/svg/EditIcon';
import Image from 'next/image';
import useSendDirectiveEmail from './hooks/useSendDirectiveEmail';

import classNames from '@/helpers/classNames';
import { SmartButton } from '@/components/SmartPermissions/SmartButton';
import { formatDateToLocal } from '@/helpers/date';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const { mutate, isLoading } = useDeleteDirectivesItem();
  const bulkDeleteMutation = useBulkDeleteDirectives();
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
  const [createMemoPolicyItems, setCreateMemoPolicyItems] = useState<any>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<{ id: number; open: boolean } | null>(null);
  const [isCreateMemoModalOpen, setIsCreateMemoModalOpen] = useState(false);
  const [isCreatePolicyModalOpen, setIsCreatePolicyModalOpen] = useState(false);
  const [isEmployeeResponsesModalOpen, setIsEmployeeResponsesModalOpen] = useState(false);
  const [selectedMemoTitle, setSelectedMemoTitle] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMemoOpen, setIsEditMemoOpen] = useState(false);
  const [isEditPolicyOpen, setIsEditPolicyOpen] = useState(false);
  const [selectedDirectiveId, setSelectedDirectiveId] = useState<number | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false);
  const [pendingSendId, setPendingSendId] = useState<number | null>(null);
  
  // Bulk delete states
  const [selectedDirectives, setSelectedDirectives] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteConfirmModalOpen, setIsBulkDeleteConfirmModalOpen] = useState<DeleteModalData | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);
  
  const { data: dataDirectives, isLoading: isGetDirectivesLoading, refetch } = useGetDirectivesItems({
    ...appliedFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });
  const sendMutation = useSendDirectiveEmail();

  useEffect(() => {
    if (dataDirectives) {
      let items = [];
      let totalPages = 1;
      let totalRecords = 0;

      // Handle paginated response structure
      if (dataDirectives.records) {
        items = dataDirectives.records.map((directive: any) => {
          return {
            ...directive,
            date: formatDateToLocal(directive.date)
          };
        });
        totalPages = dataDirectives.total_pages || 1;
        totalRecords = dataDirectives.total_records || items.length;
      } 
      // Handle array response structure (no pagination from backend)
      else if (Array.isArray(dataDirectives)) {
        items = dataDirectives.map((directive: any) => {
          return {
            ...directive,
            date: formatDateToLocal(directive.date)
          };
        });
        
        // Calculate pagination locally if backend doesn't support it
        totalRecords = items.length;
        totalPages = Math.ceil(totalRecords / pageSize);
        
        // Manual pagination on client side if needed
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        items = items.slice(startIndex, endIndex);
      }

      setCreateMemoPolicyItems(items);
      setPagination({
        totalPages,
        totalRecords
      });
    }
  }, [dataDirectives, pageSize, currentPage]);

  // Update select all state when directives change
  useEffect(() => {
    if (createMemoPolicyItems) {
      const allDirectiveIds = new Set(createMemoPolicyItems.map((d: any) => d.id));
      const allSelected = allDirectiveIds.size > 0 && 
        Array.from(allDirectiveIds).every((id: any) => selectedDirectives.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedDirectives, createMemoPolicyItems]);


  // Handle individual directive selection
  const handleDirectiveSelect = (directiveId: number) => {
    setSelectedDirectives(prev => {
      const newSet = new Set(prev);
      if (newSet.has(directiveId)) {
        newSet.delete(directiveId);
      } else {
        newSet.add(directiveId);
      }
      return newSet;
    });
  };

  // Handle select all functionality
  const handleSelectAll = () => {
    if (!createMemoPolicyItems) return;
    
    if (selectAll) {
      setSelectedDirectives(new Set());
    } else {
      const allIds = createMemoPolicyItems.map((item: any) => item.id);
      setSelectedDirectives(new Set(allIds));
    }
  };

  // Handle bulk delete - opens confirmation modal
  const handleBulkDelete = () => {
    if (selectedDirectives.size === 0) return;
    setBulkDeleteCount(selectedDirectives.size);
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
      const directiveIds = Array.from(selectedDirectives);
      await bulkDeleteMutation.mutateAsync(directiveIds);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete directives';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
      setIsBulkDeleteModalOpen(false);
    }
  };

  // Handle success after deletion completes
  const handleBulkDeleteSuccess = () => {
    toast.custom(() => <CustomToast message={`${bulkDeleteCount} directive(s) deleted successfully.`} type="success" />, { duration: 3000 });
    setSelectedDirectives(new Set());
    setSelectAll(false);
    setBulkDeleteCount(0);
    refetch();
  };

  const confirmSend = async () => {
    setIsSendConfirmOpen(false);
    const idToSend = pendingSendId;
    if (!idToSend) return;
    try {
      await sendMutation.mutateAsync(idToSend);
      toast.custom(() => <CustomToast message={'Email Sent'} type='success' />, { duration: 4000 });
      refetch();
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.custom(() => <CustomToast message={msg} type='error' />, { duration: 4000 });
    } finally {
      setPendingSendId(null);
    }
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
      search: searchText,
    });
    setCurrentPage(1); // Reset to first page when searching
  };

  useEffect(() => {
    if (!isGetDirectivesLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isGetDirectivesLoading, isSearching]);

  const renderRows = () => {
    if (isSearching || isGetDirectivesLoading) {
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
    const deletedCount = createMemoPolicyItems.filter((item: any) => item.isDeleted).length;
    if (createMemoPolicyItems && createMemoPolicyItems.length > 0 && createMemoPolicyItems.length !== deletedCount) {
      return createMemoPolicyItems
        .map((item: any) => {
          return (
            !item.isDeleted && (
              <tr key={item.id}>
                <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                  <input
                    type="checkbox"
                    checked={selectedDirectives.has(item.id)}
                    onChange={() => handleDirectiveSelect(item.id)}
                    className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
                  />
                </td>
                <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date}</td>
                <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                  <div className='flex gap-2 justify-center'>
                    <span>{item.title}</span> <ClipIcon />
                  </div>
                </td>
                <td className='whitespace-nowrap px-3 py-5 text-sm text-savoy-blue'>
                  <button
                    type='button'
                    disabled={!item.is_sent}
                    onClick={() => {
                      setSelectedMemoTitle(item);
                      setIsEmployeeResponsesModalOpen(true);
                    }}
                    className={`font-bold bg-transparent border-0 p-0 ${item.is_sent ? 'hover:underline cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                    data-tooltip-id={!item.is_sent ? 'view-responses-tooltip' : undefined}
                    data-tooltip-content='Send the directive first to view responses'
                  >
                    View Responses
                  </button>
                </td>
                <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                  <div className='flex items-center justify-center gap-3'>
                    <button
                      type='button'
                      onClick={() => {
                        setPendingSendId(item.id);
                        setIsSendConfirmOpen(true);
                      }}
                      className='border rounded-md py-[0.65em] px-[0.65em] border-[#3d6cee9f]'
                    >
                      <Image
                        src='/assets/send-icon.png'
                        width={20}
                        height={20}
                        alt='send-icon'
                        className='max-w-[20px] max-h-[20px]'
                      />
                    </button>

                    {!item.is_sent && (
                      <button
                        type='button'
                        onClick={() => {
                          setSelectedDirectiveId(item.id);
                          if (item.directive_type === 'memo') {
                            setIsEditMemoOpen(true);
                          } else {
                            setIsEditPolicyOpen(true);
                          }
                        }}
                        className='cursor-pointer hover:opacity-75'
                      >
                        <EditIcon />
                      </button>
                    )}

                    <button
                      type='button'
                      onClick={() => {
                        setIsDeleteModalOpen({ id: item.id, open: true });
                      }}
                      className='cursor-pointer hover:opacity-75'
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            )
          );
        })
        .filter((item: any) => item);
    } else {
      return (
        <tr>
          <td colSpan={7}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add memo/policy.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 mb-20 pb-56 md:pb-0 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/manage' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Manage</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Create Memo/Policy</h2>
        </div>

        {/* Content Section with flex-1 */}
        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          <div className={classNames('flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
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
                      from: value,
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
                  data-tooltip-content='Search for Memo: Title'
                  data-tooltip-place='bottom'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  value={searchText}
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
              <Menu as='div' className='relative inline-block'>
                <div>
                  <Menu.Button
                    as={SmartButton}
                    id="create_memo_btn"
                    className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow enabled:hover:shadow-md enabled:focus:shadow-none enabled:focus:opacity-80 disabled:opacity-50'
                  >
                    CREATE
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-green-500 focus:outline-none'>
                    <div className='py-1'>
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            id="create-memo-btn"
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm cursor-pointer'
                            )}
                            onClick={() => {
                              setIsCreateMemoModalOpen(true);
                              setIsOpen(!isOpen);
                            }}
                         >
                            Create Memo
                          </span>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            id="create-memo-btn"
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm cursor-pointer'
                            )}
                            onClick={() => {
                              setIsCreatePolicyModalOpen(true);
                              setIsOpen(!isOpen);
                            }}
                         >
                            Create Policy
                          </span>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
          
          {/* Bulk Actions - Below Search/Filter Row */}
          {selectedDirectives.size > 1 && (
            <div className="mt-4 ">
              <div className="flex items-center gap-3">
                <SmartButton
                  id="edit-memo-btn"
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
                  {selectedDirectives.size} selected
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
                          disabled={!createMemoPolicyItems || createMemoPolicyItems.length === 0}
                          className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                        />
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-center text-sm font-semibold text-gray-900'>
                        Title
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-center text-sm font-semibold text-gray-900'>
                        Responses
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-center text-sm font-semibold text-gray-900'>
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
      <CreateMemoModal 
        isOpen={isCreateMemoModalOpen} 
        setIsOpen={setIsCreateMemoModalOpen} 
        refetch={refetch}
      />
      <CreatePolicyModal 
        isOpen={isCreatePolicyModalOpen} 
        setIsOpen={setIsCreatePolicyModalOpen} 
        refetch={refetch}
      />
      <EditMemoModal
        isOpen={isEditMemoOpen}
        setIsOpen={setIsEditMemoOpen}
        directiveId={selectedDirectiveId}
        refetch={refetch}
      />
      <EditPolicyModal
        isOpen={isEditPolicyOpen}
        setIsOpen={setIsEditPolicyOpen}
        directiveId={selectedDirectiveId}
        refetch={refetch}
      />
      <EmployeeResponsesModal 
        isOpen={isEmployeeResponsesModalOpen} 
        setIsOpen={setIsEmployeeResponsesModalOpen}
        memoTitle={selectedMemoTitle}
        directiveId={selectedMemoTitle?.id}
      />
      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          onConfirm={() => {
            const callbackReq = {
              onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
                setIsDeleteModalOpen(null);
                refetch();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
              },
            };
            mutate(isDeleteModalOpen.id, callbackReq);
          }}
          isLoading={isLoading}
        />
      )}
      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteConfirmModalOpen?.open && (
        <DeleteModal
          isOpen={isBulkDeleteConfirmModalOpen}
          setIsOpen={setIsBulkDeleteConfirmModalOpen}
          onConfirm={confirmBulkDeleteWarning}
          isLoading={false}
          customText={`${bulkDeleteCount} directive${bulkDeleteCount > 1 ? 's' : ''}`}
        />
      )}

      {/* Bulk Delete Progress Modal */}
      {isBulkDeleteModalOpen && (
        <ProgressModal
          isOpen={isBulkDeleteModalOpen}
          setIsOpen={setIsBulkDeleteModalOpen}
          onConfirm={confirmBulkDelete}
          title={`Deleting ${bulkDeleteCount} directive${bulkDeleteCount > 1 ? 's' : ''}...`}
          isProcessing={bulkDeleteMutation.isLoading}
          onSuccess={handleBulkDeleteSuccess}
        />
      )}

      {/* Send Email Confirmation Modal */}
      {isSendConfirmOpen && (
        <ConfirmModal
          isOpen={isSendConfirmOpen}
          setIsOpen={setIsSendConfirmOpen}
          message={"Are you sure you want to send this email?"}
          confirmAction={confirmSend}
          cancelAction={() => {
            setIsSendConfirmOpen(false);
            setPendingSendId(null);
          }}
          isLoading={sendMutation.isLoading}
        />
      )}

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;
