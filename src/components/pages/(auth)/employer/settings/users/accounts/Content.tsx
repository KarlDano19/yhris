'use client';
'use client';

import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import Link from 'next/link';

import { useForm } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';
import CustomToast from '@/components/CustomToast';

import classNames from '@/helpers/classNames';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import AddUserAccountModal from '../accounts/modals/AddUserAccountModal';
import useGetAccountsList from './hooks/useGetAccountsList';
import useSyncYPUsers from './hooks/useSyncYPUsers';
import UpdateUserAccountModal from './modals/UpdateUserAccountModal';
import ResetPasswordModal from './modals/ResetPasswordModal';
import DeleteModal from '@/components/DeleteModal';
import useDeleteAccount from './hooks/useDeleteAccount';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon, CloudArrowDownIcon } from "@heroicons/react/24/outline";
import DeleteIcon from '@/svg/DeleteIcon';
import EditIcon from '@/svg/EditIcon';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [accountsItems, setAccountsItems] = useState<any>([]);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState<boolean>(false);
  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] = useState<T_ModalData | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState<T_ModalData | null>(null);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState<T_ModalData | null>(null);
  const { mutate: deleteAccount, isLoading: isDeleteAccountLoading } = useDeleteAccount();
  const queryClient = useQueryClient();
  const cachedUserDetails = queryClient.getQueryCache().find(['userDetailsCache']) as { state: { data: any } | undefined };
  const [loginType, setLoginType] = useState<string>('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [itemsFilter, setItemsFilter] = useState<any>({
    search: '',
  });
  const [appliedFilter, setAppliedFilter] = useState<any>({
    search: '',
  });
  
  // Hooks
  const {
    data: accountsListData,
    isLoading: isAccountsListLoading,
    refetch: accountsListRefetch,
  } = useGetAccountsList({ ...appliedFilter, pageSize: pageSize, currentPage: currentPage });

  const {
    syncUsers,
    isLoading: isSyncLoading,
    isError: isSyncError,
    error: syncError,
    isSuccess: isSyncSuccess,
    data: syncData,
    reset: resetSync,
  } = useSyncYPUsers();

  // Form Methods
  const createFormMethods = useForm();
  const updateFormMethods = useForm();

  useEffect(() => {
    if (accountsListData) {
      setAccountsItems(accountsListData.records);
      setPagination({
        totalPages: accountsListData.total_pages,
        totalRecords: accountsListData.total_records,
      });
    }
  }, [accountsListData]);

  useEffect(() => {
    accountsListRefetch();
  }, [currentPage, pageSize, accountsListRefetch]);

  useEffect(() => {
    if (!isAccountsListLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isAccountsListLoading, isSearching]);

  useEffect(() => {
    if (cachedUserDetails?.state?.data) {
      setLoginType(cachedUserDetails.state.data.login_type);
    }
  }, [cachedUserDetails]);

  // Handle sync success/error
  useEffect(() => {
    if (isSyncSuccess && syncData) {
      const { sync_results } = syncData;
      const message = `Sync completed successfully!`;
      
      toast.custom((t) => (
        <CustomToast 
          message={message} 
          type="success" 
          duration={6000}
        />
      ));
      
      // Refresh the accounts list to show new users
      accountsListRefetch();
      resetSync();
    }
  }, [isSyncSuccess, syncData, accountsListRefetch, resetSync]);

  useEffect(() => {
    if (isSyncError && syncError) {
      const errorMessage = syncError.message || 'Failed to sync users from Yahshua Payroll';
      
      toast.custom((t) => (
        <CustomToast 
          message={`Sync failed: ${errorMessage}`} 
          type="error" 
          duration={5000}
        />
      ));
      
      resetSync();
    }
  }, [isSyncError, syncError, resetSync]);

  const handleSearch = () => {
    setCurrentPage(1);
    setIsSearching(true);
    setAppliedFilter({ ...itemsFilter });
    // No need to call refetch; useGetAccountsList will refetch on appliedFilter change
  };

  const handleSyncUsers = () => {
    if (isSyncLoading) return; // Prevent multiple clicks while syncing
    
    toast.custom((t) => (
      <CustomToast 
        message="Starting user sync from Yahshua Payroll..." 
        type="info" 
        duration={3000}
      />
    ));
    
    syncUsers();
  };

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const renderRows = () => {
    if (isSearching || isAccountsListLoading) {
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
    if (accountsItems && accountsItems.length > 0) {
      return accountsItems.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          <td className={classNames(item.is_active ? 'text-gray-900' : 'text-red-500', 'whitespace-nowrap px-3 py-5 text-sm text-gray-500')}>{item.name}</td>
          <td className={classNames(item.is_active ? 'text-gray-900' : 'text-red-500', 'whitespace-nowrap px-3 py-5 text-sm text-gray-500')}>{item.email}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <div className='flex space-x-2 justify-center'>
              <SmartButton id="edit-sub-account-btn" onClick={() => setIsUpdateAccountModalOpen({ id: item.id, open: true })}>
                <EditIcon />
              </SmartButton>
              <SmartButton id="edit-sub-account-btn" onClick={() => setIsResetPasswordModalOpen({ id: item.id, open: true })}>
                <ArrowPathIcon className='h-10 w-10 text-gray-800 mx-auto border border-gray-400 p-1.5 rounded-md' />
              </SmartButton>
              <SmartButton id="edit-sub-account-btn" onClick={() => setIsDeleteAccountModalOpen({ id: item.id, open: true })}>
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
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add employee.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 mb-20 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/settings/users' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Users</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Accounts</h2>
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
                    data-tooltip-content='Search for: Name'
                    data-tooltip-place='bottom'
                    className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                    onChange={(e) => setItemsFilter({ ...itemsFilter, search: e.target.value })}
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
                className='bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-100'
                onClick={handleSearch}
              >
                <MagnifyingGlassIcon className='h-5 w-5' />
              </button>
            </div>
            <div className='flex-1 flex justify-start lg:justify-end gap-3'>
              {loginType !== 'password' && (
                <SmartButton
                  id="sync-yp-users-btn"
                  onClick={handleSyncUsers}
                  disabled={isSyncLoading || !hasActiveSubscription}
                  className={classNames(
                    'bg-blue-600 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50',
                    'flex items-center gap-2',
                    isSyncLoading && 'cursor-not-allowed'
                  )}
                  data-tooltip-id='sync-tooltip'
                  data-tooltip-content='Sync users from Yahshua Payroll system. Only non-employee users will be imported.'
                  data-tooltip-place='bottom'
                >
                  {isSyncLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      SYNCING...
                    </>
                  ) : (
                    <>
                      <CloudArrowDownIcon className='h-4 w-4' />
                      SYNC YP USERS
                    </>
                  )}
                </SmartButton>
              )}
              <SmartButton
                id="create-sub-account-btn"
                onClick={() => setIsAddAccountModalOpen(true)}
                className='bg-green-500 rounded-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
              >
                CREATE
              </SmartButton>
            </div>
          </div>

          <div className={classNames('mt-8 flow-root', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300 text-center'>
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Name
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Email
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
      {isAddAccountModalOpen && (
        <AddUserAccountModal
          isOpen={isAddAccountModalOpen}
          setIsOpen={setIsAddAccountModalOpen}
          refetch={accountsListRefetch}
          formMethods={createFormMethods}
        />
      )}
      {isUpdateAccountModalOpen && (
        <UpdateUserAccountModal
          isOpen={isUpdateAccountModalOpen}
          setIsOpen={setIsUpdateAccountModalOpen}
          refetch={accountsListRefetch}
          formMethods={updateFormMethods}
        />
      )}
      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          isOpen={isResetPasswordModalOpen}
          setIsOpen={setIsResetPasswordModalOpen}
          refetch={accountsListRefetch}
        />
      )}

      {isDeleteAccountModalOpen && (
        <DeleteModal
          isOpen={isDeleteAccountModalOpen}
          setIsOpen={setIsDeleteAccountModalOpen}
          onConfirm={() => {
            const callbackReq = {
              onSuccess: (data: any) => {
                toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
                setIsDeleteAccountModalOpen(null);
                accountsListRefetch();
              },
              onError: (err: any) => {
                toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
              },
            };
            deleteAccount(isDeleteAccountModalOpen.id, callbackReq);
          }}
          isLoading={isDeleteAccountLoading}
        />
      )}

      <Tooltip id='search-tooltip'/>
      <Tooltip id='sync-tooltip'/>
    </>
  );
};

export default Content;
