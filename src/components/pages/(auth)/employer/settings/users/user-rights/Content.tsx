'use client';
'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import { Tooltip } from 'react-tooltip';

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
type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

const Content = () => {
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
            <div role='status' className='py-5 text-center'>
              <svg
                aria-hidden='true'
                className='inline w-12 h-12 mr-2 text-gray-200 animate-spin fill-yellow-400'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
              <span className='sr-only'>Loading...</span>
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
          <div className='mt-6 flex flex-col lg:flex-row items-center gap-4'>
            <div className='flex-none lg:w-1/3'>
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
              className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
              onClick={handleSearch}
            >
              <MagnifyingGlassIcon className='h-5 w-5' />
            </button>
          </div>

          <div className='mt-8 flow-root'>
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
