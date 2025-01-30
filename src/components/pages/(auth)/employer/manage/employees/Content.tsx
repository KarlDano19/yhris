'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';

import { Menu, Transition } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import classNames from '@/helpers/classNames';
import EmployeesModal from './modals/EmployeesModal';
import ImportModal from './modals/ImportModal';
import ExportProgressModal from './modals/ExportProgressModal';
import DataExportAgreementModal from './modals/DataExportAgreementModal';
import useGetEmployeeItems from './hooks/useGetEmployeeItems';
import useUpdateEmployerAgreeExport from './hooks/useUpdateEmployerAgreeExport';
import DeleteEmployeeDetailModal from './modals/DeleteEmployeeDetail';
import EditEmployeeDetailsModal from './modals/EditEmployeeDetailsModal';
import ExportTemplateModal from './modals/ExportTemplateModal';

import { ArrowLeftIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import EditIcon from "@/svg/EditIcon";
import DeleteIcon from "@/svg/DeleteIcon";

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
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const [selectedEmployeeId, setselectedEmployeeId] = useState<number | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isExportProgressModalOpen, setIsExportProgressModalOpen] = useState<boolean>(false);
  const [isAgreementAccepted, setIsAgreementAccepted] = useState<boolean>(false);
  const [isExportTemplateModalOpen, setIsExportTemplateModalOpen] = useState<boolean>(false);
  const [isEmployeesDeleteModalOpen, setIsEmployeesDeleteModalOpen] = useState<T_ModalData | null>(null);;
  const [isEmployeesEditModalOpen, setIsEmployeesEditModalOpen] = useState<T_ModalData | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [isDataAgreementModalOpen, setIsDataAgreementModalOpen] = useState<boolean>(false);
  const [itemsFilter, setItemsFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const {
    data: employeeListData,
    isLoading: isEmployeeListLoading,
    refetch: employeeListRefetch,
  } = useGetEmployeeItems({ ...itemsFilter, pageSize: pageSize, currentPage: currentPage });

  const { mutate: updateEmployerAgreeExport } = useUpdateEmployerAgreeExport();

  const cachedData: any = cachedProfile?.state?.data;
  const hasAgreed = cachedData?.is_export_agreed;

  useEffect(() => {
    if (!hasAgreed) {
      setIsAgreementAccepted(true);
    }
  }, [hasAgreed]);

  const menuOptions = [
    {
      name: "Download Template",
      action: () => {
        setIsExportTemplateModalOpen(true);
      },
    },
    {
      name: 'Import',
      action: () => {
        setIsImportModalOpen(true);
      },
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
    },
  ];

  useEffect(() => {
    if (employeeListData) {
      employeeListData.records.map((employee: any) => {
        employee.date_hired = Intl.DateTimeFormat('en-US').format(new Date(employee.date_hired));
        return employee;
      });
      setEmployeeItems(employeeListData.records);
      setPagination({
        totalPages: employeeListData.total_pages,
        totalRecords: employeeListData.total_records,
      });
    }
  }, [employeeListData]);

  useEffect(() => {
    employeeListRefetch();
  }, [currentPage, pageSize]);


  const checkIfDateIsValid = () => {
    const dateFrom = Date.parse(itemsFilter.from);
    const dateTo = Date.parse(itemsFilter.to);

    if (dateFrom && !dateTo) {
      return toast.custom(() => <CustomToast message='Invalid date to.' type='error' />, {
        duration: 5000,
      });
    }
    if (!dateFrom && dateTo) {
      return toast.custom(() => <CustomToast message='Invalid date from.' type='error' />, {
        duration: 5000,
      });
    }
    if (dateFrom > dateTo) {
      return toast.custom(
        () => <CustomToast message='You have entered an invalid date range. Please select again.' type='error' />,
        {
          duration: 5000,
        }
      );
    }
    employeeListRefetch();
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
    if (isEmployeeListLoading) {
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
    if (employeeItems && employeeItems.length > 0) {
      return employeeItems.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date_hired}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.firstname}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.middlename}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.lastname}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.email}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.mobile}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.gender}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 overflow-hidden text-ellipsis max-w-xs'>{item.address}</td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEmployeesEditModalOpen({ id: item.id, open: true })}
              >
                <EditIcon />
              </button>
              <button
                onClick={() => setIsEmployeesDeleteModalOpen({ id: item.id, open: true })}
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
          <h2 className='text-xl font-bold text-indigo-dye'>Employees</h2>
          <div className='mt-6 flex flex-col lg:flex-row items-center gap-4'>
            <div className='flex-none flex flex-col lg:flex-row items-center gap-2'>
              <div className='relative'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
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
              <p>to</p>
              <div className='relative'>
                <CustomDatePicker
                  id='to-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-44 rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
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
            <div className='flex-none lg:w-1/3'>
              <div className='relative flex items-center'>
                <input
                  type='text'
                  name='search'
                  id='search'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) => setItemsFilter({ ...itemsFilter, search: e.target.value })}
                  placeholder='Search ...'
                />
              </div>
            </div>
            <button
              className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
              onClick={checkIfDateIsValid}
            >
              <MagnifyingGlassIcon className='h-5 w-5' />
            </button>
            <div className='flex-1 flex justify-end'>
              <button
                className='bg-green-500 rounded-l-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                disabled
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
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              )}
                              onClick={item.action}
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
          </div>

          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300 text-center'>
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date Hired
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        First Name
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Middle Name
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Last Name
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Email
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Contact No.
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Gender
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Address
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Action
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
          itemsFilter={itemsFilter}
        />
      )}
      {isImportModalOpen && (
        <ImportModal refetch={employeeListRefetch} isOpen={isImportModalOpen} setIsOpen={setIsImportModalOpen} />
      )}
      {isExportTemplateModalOpen && (
        <ExportTemplateModal
          isOpen={isExportTemplateModalOpen}
          setIsOpen={setIsExportTemplateModalOpen}
          itemsFilter={itemsFilter}
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
        />
      )}
    </>
  );
};

export default Content;
