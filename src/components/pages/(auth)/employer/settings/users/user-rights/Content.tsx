'use client';
'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import { Tooltip } from 'react-tooltip';

import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import useGetUserRightsList from './hooks/useGetUserRightsList';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import EditIcon from '@/svg/EditIcon';
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
import EmployeeRightsModal from './modals/EmployeeRightsModal';
import BenefitsRightsModal from './modals/BenefitsRightsModal';
import classNames from '@/helpers/classNames';
type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

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
  const [employeeRightsModal, setEmployeeRightsModal] = useState<T_ModalData | null>(null);
  const [benefitsRightsModal, setBenefitsRightsModal] = useState<T_ModalData | null>(null);
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
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.name}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.email}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span onClick={() => setJobUserRightsModal({ id: item.id, open: true })}>Edit</span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span onClick={() => setScreenApplicantsRightsModal({ id: item.id, open: true })}>Edit</span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span onClick={() => setOrientRightsModal({ id: item.id, open: true })}>Edit</span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span onClick={() => setManageRightsModal({ id: item.id, open: true })}>Edit</span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span onClick={() => setEmployeeRightsModal({ id: item.id, open: true })}>Edit</span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span onClick={() => setBenefitsRightsModal({ id: item.id, open: true })}>Edit</span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span onClick={() => setTrainRightsModal({ id: item.id, open: true })}>Edit</span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span onClick={() => setPayrollRightsModal({ id: item.id, open: true })}>Edit</span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span onClick={() => setEmployeeSeparationRightsModal({ id: item.id, open: true })}>Edit</span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span onClick={() => setEmployeekitRightsModal({ id: item.id, open: true })}>Edit</span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span onClick={() => setDoleRightsModal({ id: item.id, open: true })}>Edit</span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span onClick={() => setSettingsRightsModal({ id: item.id, open: true })}>Edit</span>
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <span onClick={() => setAuditLogsRightsModal({ id: item.id, open: true })}>Edit</span>
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
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/settings/users' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Users</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Accounts</h2>
          <div className={classNames('mt-6 flex flex-col lg:flex-row items-center gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex gap-2 lg:w-1/3'>
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
                        Post a Job
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Screen Applicants
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Orient
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Manage
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Employee
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Benefits
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Train
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Payroll
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Employee Separation
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Employee Kit
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Dole
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Settings
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Audit Logs
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                </table>
                <hr />
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
      {employeeRightsModal && (
        <EmployeeRightsModal
          isOpen={employeeRightsModal}
          setIsOpen={setEmployeeRightsModal}
          refetch={userRightsListRefetch}
        />
      )}
      {benefitsRightsModal && (
        <BenefitsRightsModal
          isOpen={benefitsRightsModal}
          setIsOpen={setBenefitsRightsModal}
          refetch={userRightsListRefetch}
        />
      )}

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;
