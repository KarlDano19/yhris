'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';

import { Menu, Transition } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import classNames from '@/helpers/classNames';
import EmployeesModal from './modals/EmployeesModal';
import ImportModal from './modals/ImportModal';
import ExportProgressModal from './modals/ExportProgressModal';
import DataExportAgreementModal from './modals/DataExportAgreementModal';
import useGetEmployeeItemsList from './hooks/useGetEmployeeItems';
import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';
import useGetLocationItems from '@/components/hooks/useGetLocationItems';
import useGetDepartmentItems from '@/components/hooks/useGetDepartmentItems';
import useGetPositionItems from '@/components/hooks/useGetPositionItems';
import useUpdateEmployerAgreeExport from './hooks/useUpdateEmployerAgreeExport';
import DeleteEmployeeDetailModal from './modals/DeleteEmployeeDetail';
import EditEmployeeDetailsModal from './modals/EditEmployeeDetailsModal';
import AddEmployeeModal from './modals/AddEmpoyeeModal';
import ExportTemplateModal from './modals/ExportTemplateModal';


import { ArrowLeftIcon, MagnifyingGlassIcon, ChevronDownIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

const columnDefinitions = [
  { key: 'date_hired', label: 'Date Hired' },
  { key: 'system_id', label: 'System ID' },
  { key: 'employee_id', label: 'Employee ID' },
  { key: 'firstname', label: 'First Name' },
  { key: 'middlename', label: 'Middle Name' },
  { key: 'lastname', label: 'Last Name' },
  { key: 'location', label: 'Location' },
  { key: 'position', label: 'Position' },
  { key: 'department', label: 'Department' },
  { key: 'email', label: 'Email' },
  { key: 'mobile', label: 'Contact No.' },
  { key: 'gender', label: 'Gender' },
  { key: 'address', label: 'Address' },
];

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isExportProgressModalOpen, setIsExportProgressModalOpen] = useState<boolean>(false);
  const [isAgreementAccepted, setIsAgreementAccepted] = useState<boolean>(false);
  const [isExportTemplateModalOpen, setIsExportTemplateModalOpen] = useState<boolean>(false);
  const [isEmployeesDeleteModalOpen, setIsEmployeesDeleteModalOpen] = useState<T_ModalData | null>(null);
  const [isEmployeesEditModalOpen, setIsEmployeesEditModalOpen] = useState<T_ModalData | null>(null);
  const cachedRigths = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };

  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [isDataAgreementModalOpen, setIsDataAgreementModalOpen] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    date_hired: false,
    system_id: false,
    employee_id: false,
    firstname: true,
    middlename: true,
    lastname: true,
    location: true,
    position: true,
    department: true,
    email: true,
    mobile: false,
    gender: false,
    address: false,
  });
  const [pendingFilter, setPendingFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const [appliedFilter, setAppliedFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const {
    data: employeeListData,
    isLoading: isEmployeeListLoading,
    refetch: employeeListRefetch,
  } = useGetEmployeeItemsList({ ...appliedFilter, pageSize: pageSize, currentPage: currentPage });
  const { data: employeeItemsAll } = useGetEmployeeItems();
  const { data: locationItems } = useGetLocationItems();
  const { data: departmentItems } = useGetDepartmentItems();
  const { data: positionItems } = useGetPositionItems();

  const { mutate: updateEmployerAgreeExport } = useUpdateEmployerAgreeExport();

  const cachedData: any = cachedProfile?.state?.data;
  const hasAgreed = cachedData?.is_export_agreed;

  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!hasAgreed) {
      setIsAgreementAccepted(true);
    }
  }, [hasAgreed]);

  const menuOptions = [
    {
      name: 'Download Template',
      action: () => {
        setIsExportTemplateModalOpen(true);
      },
      disabled: !cachedRigths?.state?.data?.import_employee,
    },
    {
      name: 'Import',
      action: () => {
        setIsImportModalOpen(true);
      },
      disabled: !cachedRigths?.state?.data?.import_employee,
    },
    {
      name: 'Export',
      action: () => {
        if (!hasAgreed) {
          setIsDataAgreementModalOpen(true);
        } else if (employeeListData && employeeListData.records.length > 0) {
          setIsExportProgressModalOpen(true);
        } else {
          toast.custom(() => <CustomToast message='No employee data available for export.' type='error' />, {
            duration: 5000,
          });
        }
      },
      disabled: !cachedRigths?.state?.data?.export_employee,
    },
  ];

  useEffect(() => {
    // Add proper null/undefined checks
    if (employeeListData && employeeListData.records && Array.isArray(employeeListData.records)) {
      // Create a new array instead of mutating the original
      const formattedEmployees = employeeListData.records.map((employee: any) => ({
        ...employee,
        date_hired: Intl.DateTimeFormat('en-US').format(new Date(employee.date_hired))
      }));
      
      setEmployeeItems(formattedEmployees);
      setPagination({
        totalPages: employeeListData.total_pages || 1,
        totalRecords: employeeListData.total_records || 0,
      });
    } else {
      // Reset to empty state when data is invalid/undefined
      setEmployeeItems([]);
      setPagination({
        totalPages: 1,
        totalRecords: 0,
      });
    }
  }, [employeeListData]);

  useEffect(() => {
    employeeListRefetch();
  }, [appliedFilter, pageSize, currentPage, employeeListRefetch]);

  const handleSearch = () => {
    const dateFrom = Date.parse(pendingFilter.from);
    const dateTo = Date.parse(pendingFilter.to);
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
    setAppliedFilter({ ...pendingFilter });
  };

  useEffect(() => {
    if (!isEmployeeListLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isEmployeeListLoading, isSearching]);

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
      date_hired: false,
      system_id: false,
      employee_id: false,
      firstname: true,
      middlename: true,
      lastname: true,
      location: true,
      position: true,
      department: true,
      email: true,
      mobile: false,
      gender: false,
      address: false,
    };
    setVisibleColumns(defaultColumns);
  };

  const renderRows = () => {
    if (isSearching || isEmployeeListLoading) {
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
    if (employeeItems && employeeItems.length > 0) {
      return employeeItems.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          {visibleColumns.date_hired && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date_hired}</td>
          )}
          {visibleColumns.system_id && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.system_id}</td>
          )}
          {visibleColumns.employee_id && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.employee_id}</td>
          )}
          {visibleColumns.firstname && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.firstname}</td>
          )}
          {visibleColumns.middlename && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.middlename}</td>
          )}
          {visibleColumns.lastname && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.lastname}</td>
          )}
          {visibleColumns.location && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.location}</td>
          )}
          {visibleColumns.position && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.position || 'N/A'}</td>
          )}
          {visibleColumns.department && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.department || 'N/A'}</td>
          )}
          {visibleColumns.email && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.email}</td>
          )}
          {visibleColumns.mobile && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.mobile}</td>
          )}
          {visibleColumns.gender && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.gender}</td>
          )}
          {visibleColumns.address && (
            <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 overflow-hidden text-ellipsis max-w-xs'>
              {item.address}
            </td>
          )}
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            <div className='flex space-x-2'>
              <button
                onClick={() => setIsEmployeesEditModalOpen({ id: item.id, open: true })}
                disabled={!cachedRigths?.state?.data?.edit_employee}
              >
                <EditIcon />
              </button>
              <button
                onClick={() => setIsEmployeesDeleteModalOpen({ id: item.id, open: true })}
                disabled={!cachedRigths?.state?.data?.edit_employee}
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
          <Link href='/manage' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Manage</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Employee List</h2>
          <div className={classNames('mt-6 flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex-none flex flex-col lg:flex-row items-left gap-2'>
              <div className='relative'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={pendingFilter.from}
                  pickerOnChange={(date: any) => {
                    setPendingFilter({ ...pendingFilter, from: date });
                  }}
                  inputOnChange={(value: any) => {
                    setPendingFilter({ ...pendingFilter, from: value });
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
                  selected={pendingFilter.to}
                  pickerOnChange={(date: any) => {
                    setPendingFilter({ ...pendingFilter, to: date });
                  }}
                  inputOnChange={(value: any) => {
                    setPendingFilter({ ...pendingFilter, to: value });
                  }}
                  minDate={pendingFilter.from}
                />
              </div>
            </div>
            <div className='flex gap-2 lg:w-1/3'>
              <div className='flex flex-row w-full items-center gap-2'>
                <div className='relative flex items-center flex-1'>
                  <input
                    type='text'
                    name='search'
                    id='search'
                    className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                    value={pendingFilter.search}
                    onChange={(e) => {
                      setPendingFilter({ ...pendingFilter, search: e.target.value });
                      setShowAutocomplete(true);
                    }}
                    onFocus={() => {
                      if (pendingFilter.search) setShowAutocomplete(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowAutocomplete(false), 100);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                        setShowAutocomplete(false);
                      }
                    }}
                    placeholder='Search ...'
                  />
                  {pendingFilter.search && showAutocomplete && (
                    <ul className='absolute left-0 top-full mt-1 z-10 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-y-auto'>
                      {employeeItemsAll
                        .filter(
                          (item: any) =>
                            item.firstname?.toLowerCase().includes(pendingFilter.search.toLowerCase()) ||
                            item.lastname?.toLowerCase().includes(pendingFilter.search.toLowerCase()) ||
                            item.position?.toLowerCase().includes(pendingFilter.search.toLowerCase()) ||
                            item.department?.toLowerCase().includes(pendingFilter.search.toLowerCase())
                        )
                        .map((item: any) => (
                          <li
                            key={item.id}
                            className='px-3 py-2 hover:bg-gray-200 cursor-pointer'
                            onClick={() => {
                              setPendingFilter({ ...pendingFilter, search: item.firstname });
                              setShowAutocomplete(false);
                              document.getElementById('search')?.blur();
                            }}
                          >
                            <div className='flex flex-col'>
                              <span className='font-medium'>{item.firstname} {item.lastname}</span>
                              {(item.position || item.department) && (
                                <span className='text-xs text-gray-500'>
                                  {item.position && item.department 
                                    ? `${item.position} | ${item.department}`
                                    : item.position || item.department
                                  }
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
                <button
                  className='bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-100'
                  onClick={handleSearch}
                >
                  <MagnifyingGlassIcon className='h-5 w-5' />
                </button>
              </div>
            </div>
            <div className='flex-1 flex justify-start lg:justify-end'>
              <div className='flex'>
                <button
                  onClick={() => setIsAddEmployeeModalOpen(true)}
                  className='bg-green-500 rounded-l-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                  disabled={!cachedRigths?.state?.data?.create_employee}
                >
                  CREATE
                </button>
                <Menu as='div' className='relative'>
                  <Menu.Button className='bg-green-500 py-2.5 px-3 rounded-r-md text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'>
                    <span className='sr-only'>Open options</span>
                    <div className='flex gap-4'>
                      <ChevronDownIcon className='flex-none h-5 w-5' aria-hidden='true' />
                    </div>
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
                    <Menu.Items className='absolute right-0 z-10 mt-2 w-[8.6rem] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                      <div className='py-1'>
                        {menuOptions.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <span
                                className={classNames(
                                  'block px-4 py-2 text-sm cursor-pointer text-center',
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  item.disabled ? 'bg-gray-200 cursor-not-allowed opacity-50' : ''
                                )}
                                onClick={() => {
                                  if (!item.disabled) {
                                    item.action();
                                  }
                                }}
                              >
                                {item.name}
                              </span>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <Menu as='div' className='relative ml-2'>
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
                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          <div className={classNames('mt-8 flow-root', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='-mx-4 -my-2 sm:-mx-6 lg:-mx-8'>
              <div className='py-2 sm:px-6 lg:px-8'>
                <div className='overflow-x-auto'>
                  <table className='divide-y divide-gray-300 text-center min-w-full'>
                    <thead>
                      <tr>
                        {visibleColumns.date_hired && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Date Hired
                          </th>
                        )}
                        {visibleColumns.system_id && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            System ID
                          </th>
                        )}
                        {visibleColumns.employee_id && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Employee ID
                          </th>
                        )}
                        {visibleColumns.firstname && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            First Name
                          </th>
                        )}
                        {visibleColumns.middlename && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Middle Name
                          </th>
                        )}
                        {visibleColumns.lastname && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Last Name
                          </th>
                        )}
                        {visibleColumns.location && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Location
                          </th>
                        )}
                        {visibleColumns.position && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Position
                          </th>
                        )}
                        {visibleColumns.department && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Department
                          </th>
                        )}
                        {visibleColumns.email && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Email
                          </th>
                        )}
                        {visibleColumns.mobile && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Contact No.
                          </th>
                        )}
                        {visibleColumns.gender && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Gender
                          </th>
                        )}
                        {visibleColumns.address && (
                          <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                            Address
                          </th>
                        )}
                        <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody>
                  </table>
                </div>
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
      {isDataAgreementModalOpen && (
        <DataExportAgreementModal
          isOpen={isDataAgreementModalOpen}
          setIsOpen={setIsDataAgreementModalOpen}
          setIsAgreementAccepted={(isAgree) => {
            setIsDataAgreementModalOpen(false);
            updateEmployerAgreeExport({ is_export_agree: isAgree });
            setIsExportProgressModalOpen(true);
          }}
        />
      )}
      {isExportProgressModalOpen && (
        <ExportProgressModal
          isOpen={isExportProgressModalOpen}
          setIsOpen={setIsExportProgressModalOpen}
          itemsFilter={appliedFilter}
        />
      )}
      {isImportModalOpen && (
        <ImportModal refetch={employeeListRefetch} isOpen={isImportModalOpen} setIsOpen={setIsImportModalOpen} />
      )}
      {isExportTemplateModalOpen && (
        <ExportTemplateModal
          isOpen={isExportTemplateModalOpen}
          setIsOpen={setIsExportTemplateModalOpen}
          itemsFilter={appliedFilter}
        />
      )}
      {isEmployeesDeleteModalOpen && (
        <DeleteEmployeeDetailModal
          refetch={employeeListRefetch}
          isOpen={isEmployeesDeleteModalOpen}
          setIsOpen={setIsEmployeesDeleteModalOpen}
        />
      )}
      {isEmployeesEditModalOpen && (
        <EditEmployeeDetailsModal
          isOpen={isEmployeesEditModalOpen}
          setIsOpen={setIsEmployeesEditModalOpen}
          refetch={employeeListRefetch}
          locationItems={locationItems}
          departmentItems={departmentItems}
          positionItems={positionItems}
        />
      )}
      <AddEmployeeModal
        refetch={employeeListRefetch}
        isOpen={isAddEmployeeModalOpen}
        setIsOpen={setIsAddEmployeeModalOpen}
        locationItems={locationItems}
        departmentItems={departmentItems}
        positionItems={positionItems}
      />

    </>
  );
};

export default Content;
