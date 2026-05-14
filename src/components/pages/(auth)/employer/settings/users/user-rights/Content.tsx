'use client';

import React, { useEffect, useState, Fragment } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Tooltip } from 'react-tooltip';
import { Menu, Transition } from '@headlessui/react';

import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import BackButton from '@/components/BackButton';
import useGetUserRightsList from './hooks/useGetUserRightsList';

import { MagnifyingGlassIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import JobUserRightsModal from './modals/JobUserRightsModal';
import ScreenApplicantsRightsModal from './modals/ScreenApplicantsRightsModal';
import OrientRightsModal from './modals/OrientRightsModal';
import ManageRightsModal from './modals/ManageRightsModal';
import TrainRightsModal from './modals/TrainRightsModal';
import PayrollRightsModal from './modals/PayrollRightsModal';
import EmployeeSeparationRightsModal from './modals/EmployeeSeparationRightsModal';
import DoleRightsModal from './modals/DoleRightsModal';
import SettingsRightsModal from './modals/SettingsRightsModal';
import AuditLogsRightsModal from './modals/AuditLogsRightsModal';
import EmployeekitRightsModal from './modals/EmployeekitRightsModal';
import classNames from '@/helpers/classNames';
type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

const columnDefinitions = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'post_job', label: 'Post a Job' },
  { key: 'screen_applicants', label: 'Screen Applicants' },
  { key: 'orient', label: 'Orient' },
  { key: 'manage', label: 'Manage' },
  { key: 'train', label: 'Train' },
  { key: 'payroll', label: 'Payroll' },
  { key: 'employee_separation', label: 'Employee Separation' },
  { key: 'employee_kit', label: 'Employee Kit' },
  { key: 'dole', label: 'DOLE' },
  { key: 'settings', label: 'Settings' },
  { key: 'audit_logs', label: 'Audit Logs' },
];

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
  const [userRightsItems, setUserRightsItems] = useState<any>([]);
  const [jobUserRightsModal, setJobUserRightsModal] = useState<T_ModalData | null>(null);
  const [screenApplicantsRightsModal, setScreenApplicantsRightsModal] = useState<T_ModalData | null>(null);
  const [orientRightsModal, setOrientRightsModal] = useState<T_ModalData | null>(null);
  const [manageRightsModal, setManageRightsModal] = useState<T_ModalData | null>(null);
  const [trainRightsModal, setTrainRightsModal] = useState<T_ModalData | null>(null);
  const [payrollRightsModal, setPayrollRightsModal] = useState<T_ModalData | null>(null);
  const [employeeSeparationRightsModal, setEmployeeSeparationRightsModal] = useState<T_ModalData | null>(null);
  const [doleRightsModal, setDoleRightsModal] = useState<T_ModalData | null>(null);
  const [auditLogsRightsModal, setAuditLogsRightsModal] = useState<T_ModalData | null>(null);
  const [settingsRightsModal, setSettingsRightsModal] = useState<T_ModalData | null>(null);
  const [employeekitRightsModal, setEmployeekitRightsModal] = useState<T_ModalData | null>(null);
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
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    email: true,
    post_job: true,
    screen_applicants: true,
    orient: true,
    manage: true,
    train: true,
    payroll: false,
    employee_separation: false,
    employee_kit: false,
    dole: false,
    settings: false,
    audit_logs: false,
  });
  const {
    data: userRightsListData,
    isLoading: isUserRightsListLoading,
    refetch: userRightsListRefetch,
  } = useGetUserRightsList({ ...appliedFilter, pageSize: pageSize, currentPage: currentPage });

  useEffect(() => {
    if (userRightsListData) {
      setUserRightsItems(userRightsListData.records);
      setPagination({
        totalPages: userRightsListData.total_pages,
        totalRecords: userRightsListData.total_records,
      });
    }
  }, [userRightsListData]);

  useEffect(() => {
    userRightsListRefetch();
  }, [currentPage, pageSize, userRightsListRefetch]);

  useEffect(() => {
    if (!isUserRightsListLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isUserRightsListLoading, isSearching]);

  const handleSearch = () => {
    setCurrentPage(1);
    setIsSearching(true);
    setAppliedFilter({ ...itemsFilter });
    // No need to call refetch; useGetUserRightsList will refetch on appliedFilter change
  };

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleColumnToggle = (columnKey: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const handleColumnReset = () => {
    const defaultColumns: Record<string, boolean> = {
      name: true,
      email: true,
      post_job: true,
      screen_applicants: true,
      orient: true,
      manage: true,
      train: true,
      payroll: false,
      employee_separation: false,
      employee_kit: false,
      dole: false,
      settings: false,
      audit_logs: false,
    };
    setVisibleColumns(defaultColumns);
  };

  const handleShowAll = () => {
    const allColumns: Record<string, boolean> = {
      name: true,
      email: true,
      post_job: true,
      screen_applicants: true,
      orient: true,
      manage: true,
      train: true,
      payroll: true,
      employee_separation: true,
      employee_kit: true,
      dole: true,
      settings: true,
      audit_logs: true,
    };
    setVisibleColumns(allColumns);
  };

  const renderRows = () => {
    if (isSearching || isUserRightsListLoading) {
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
    if (userRightsItems && userRightsItems.length > 0) {
      return userRightsItems.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          {visibleColumns.name && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.name}</td>
          )}
          {visibleColumns.email && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.email}</td>
          )}
          {visibleColumns.post_job && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <span onClick={() => setJobUserRightsModal({ id: item.id, open: true })}>Edit</span>
            </td>
          )}
          {visibleColumns.screen_applicants && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <span onClick={() => setScreenApplicantsRightsModal({ id: item.id, open: true })}>Edit</span>
            </td>
          )}
          {visibleColumns.orient && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <span onClick={() => setOrientRightsModal({ id: item.id, open: true })}>Edit</span>
            </td>
          )}
          {visibleColumns.manage && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <span onClick={() => setManageRightsModal({ id: item.id, open: true })}>Edit</span>
            </td>
          )}
          {visibleColumns.train && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <span onClick={() => setTrainRightsModal({ id: item.id, open: true })}>Edit</span>
            </td>
          )}
          {visibleColumns.payroll && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <span onClick={() => setPayrollRightsModal({ id: item.id, open: true })}>Edit</span>
            </td>
          )}
          {visibleColumns.employee_separation && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <span onClick={() => setEmployeeSeparationRightsModal({ id: item.id, open: true })}>Edit</span>
            </td>
          )}
          {visibleColumns.employee_kit && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <span onClick={() => setEmployeekitRightsModal({ id: item.id, open: true })}>Edit</span>
            </td>
          )}
          {visibleColumns.dole && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <span onClick={() => setDoleRightsModal({ id: item.id, open: true })}>Edit</span>
            </td>
          )}
          {visibleColumns.settings && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <span onClick={() => setSettingsRightsModal({ id: item.id, open: true })}>Edit</span>
            </td>
          )}
          {visibleColumns.audit_logs && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
              <span onClick={() => setAuditLogsRightsModal({ id: item.id, open: true })}>Edit</span>
            </td>
          )}
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={6}>
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
          <BackButton label="Users" href="/settings/users" />
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Accounts</h2>
        </div>

        {/* Content Section with flex-1 */}
        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          <div className={classNames('flex flex-col lg:flex-row items-center gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex gap-2 lg:w-1/3 pr-5 md:pr-16'>
              <div className='flex-none w-11/12 lg:w-full'>
                <div className='relative flex items-center'>
                  <input
                    type='text'
                    name='search'
                    id='search'
                    data-tooltip-id='search-tooltip'
                    data-tooltip-content='Search for: Name / Email'
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
            <div className='flex-1 flex justify-start lg:justify-end'>
              <Menu as='div' className='relative'>
                <Menu.Button className='bg-savoy-blue rounded-lg py-2.5 px-3 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50 flex items-center gap-2'>
                  <Cog6ToothIcon className='h-5 w-5' />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <div className='p-4'>
                      <div className='mb-4'>
                        <h3 className='text-sm font-semibold text-gray-900 mb-2'>
                          Filter Columns ({Object.values(visibleColumns).filter(Boolean).length} of {columnDefinitions.length})
                        </h3>
                        <p className='text-xs text-gray-600'>
                          Select which columns to display in the table.
                        </p>
                      </div>
                      <div className='max-h-64 overflow-y-auto mb-4'>
                        <div className='grid grid-cols-1 gap-2'>
                          {columnDefinitions.map((column) => (
                            <label key={column.key} className='flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-50'>
                              <input
                                type='checkbox'
                                checked={visibleColumns[column.key] || false}
                                onChange={() => handleColumnToggle(column.key)}
                                className='h-4 w-4 text-savoy-blue focus:ring-savoy-blue border-gray-300 rounded'
                              />
                              <span className='text-sm text-gray-700'>{column.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <button
                          onClick={handleColumnReset}
                          className='flex-1 bg-gray-500 text-white text-xs font-semibold py-2 px-3 rounded-md hover:bg-gray-600'
                        >
                          Reset
                        </button>
                        <button
                          onClick={handleShowAll}
                          className='flex-1 bg-savoy-blue text-white text-xs font-semibold py-2 px-3 rounded-md hover:bg-blue-700'
                        >
                          Show All
                        </button>
                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          <div className={classNames('mt-8 flow-root', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='py-2 sm:px-6 lg:px-8'>
                <table className='w-full divide-y divide-gray-300 text-center table-fixed'>
                  <thead>
                    <tr>
                      {visibleColumns.name && (
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-[150px]'>
                          Name
                        </th>
                      )}
                      {visibleColumns.email && (
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-[200px]'>
                          Email
                        </th>
                      )}
                      {visibleColumns.post_job && (
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-[100px]'>
                          Post a Job
                        </th>
                      )}
                      {visibleColumns.screen_applicants && (
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-[130px]'>
                          Screen Applicants
                        </th>
                      )}
                      {visibleColumns.orient && (
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-[100px]'>
                          Orient
                        </th>
                      )}
                      {visibleColumns.manage && (
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-[100px]'>
                          Manage
                        </th>
                      )}
                      {visibleColumns.train && (
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-[100px]'>
                          Train
                        </th>
                      )}
                      {visibleColumns.payroll && (
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-[100px]'>
                          Payroll
                        </th>
                      )}
                      {visibleColumns.employee_separation && (
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-[140px]'>
                          Employee Separation
                        </th>
                      )}
                      {visibleColumns.employee_kit && (
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-[120px]'>
                          Employee Kit
                        </th>
                      )}
                      {visibleColumns.dole && (
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-[100px]'>
                          DOLE
                        </th>
                      )}
                      {visibleColumns.settings && (
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-[100px]'>
                          Settings
                        </th>
                      )}
                      {visibleColumns.audit_logs && (
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900 w-[100px]'>
                          Audit Logs
                        </th>
                      )}
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
      {jobUserRightsModal && (
        <JobUserRightsModal
          isOpen={jobUserRightsModal}
          setIsOpen={setJobUserRightsModal}
          refetch={userRightsListRefetch}
        />
      )}
      {screenApplicantsRightsModal && (
        <ScreenApplicantsRightsModal
          isOpen={screenApplicantsRightsModal}
          setIsOpen={setScreenApplicantsRightsModal}
          refetch={userRightsListRefetch}
        />
      )}
      {orientRightsModal && (
        <OrientRightsModal
          isOpen={orientRightsModal}
          setIsOpen={setOrientRightsModal}
          refetch={userRightsListRefetch}
        />
      )}
      {manageRightsModal && (
        <ManageRightsModal
          isOpen={manageRightsModal}
          setIsOpen={setManageRightsModal}
          refetch={userRightsListRefetch}
        />
      )}
      {trainRightsModal && (
        <TrainRightsModal
          isOpen={trainRightsModal}
          setIsOpen={setTrainRightsModal}
          refetch={userRightsListRefetch}
        />
      )}
      {payrollRightsModal && (
        <PayrollRightsModal
          isOpen={payrollRightsModal}
          setIsOpen={setPayrollRightsModal}
          refetch={userRightsListRefetch}
        />
      )}
      {employeeSeparationRightsModal && (
        <EmployeeSeparationRightsModal
          isOpen={employeeSeparationRightsModal}
          setIsOpen={setEmployeeSeparationRightsModal}
          refetch={userRightsListRefetch}
        />
      )}
      {doleRightsModal && (
        <DoleRightsModal
          isOpen={doleRightsModal}
          setIsOpen={setDoleRightsModal}
          refetch={userRightsListRefetch}
        />
      )}
      {settingsRightsModal && (
        <SettingsRightsModal
          isOpen={settingsRightsModal}
          setIsOpen={setSettingsRightsModal}
          refetch={userRightsListRefetch}
        />
      )}
      {auditLogsRightsModal && (
        <AuditLogsRightsModal
          isOpen={auditLogsRightsModal}
          setIsOpen={setAuditLogsRightsModal}
          refetch={userRightsListRefetch}
        />
      )}
      {employeekitRightsModal && (
        <EmployeekitRightsModal
          isOpen={employeekitRightsModal}
          setIsOpen={setEmployeekitRightsModal}
          refetch={userRightsListRefetch}
        />
      )}

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;
