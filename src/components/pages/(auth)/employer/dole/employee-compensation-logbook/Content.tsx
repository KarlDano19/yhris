'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';
import { useSmartMenuOptions } from '@/components/SmartPermissions/useSmartMenuOptions';

import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { Tooltip } from 'react-tooltip';
import { ArrowLeftIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { useForm } from 'react-hook-form';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import classNames from '@/helpers/classNames';

import useGetEmployeeCompensationLogbookItems from './hooks/useGetEmployeeCompensationLogbookItems';
import CreateEmployeeCompensationLogModal from './modals/CreateEmployeeCompensationLogModal';
import EditEmployeeCompensationLogModal from './modals/EditEmployeeCompensationLogModal';
import DeleteEmployeeCompensationLogModal from './modals/DeleteEmployeeCompensationLogModal';
import SelectBranchModal from './modals/SelectBranchModal';
import ExportProgressModal from './modals/ExportProgressModal';

import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';

import useBulkDeleteEmployeeCompensationLogbook from "./hooks/useBulkDeleteEmployeeCompensationLogbook";
import BulkDeleteModal from "@/components/BulkDeleteModal";

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const [employeeCompensationLogbookItems, setEmployeeCompensationLogbookItems] = useState<any>([]);
  const [isEmployeesCompensationLogbookCreateModalOpen, setIsEmployeesCompensationLogbookCreateModalOpen] =
    useState<boolean>(false);
  const [isEmployeesCompensationLogbookEditModalOpen, setIsEmployeesCompensationLogbookEditModalOpen] =
    useState<T_ModalData | null>(null);
  const [isEmployeesCompensationLogbookDeleteModalOpen, setIsEmployeesCompensationLogbookDeleteModalOpen] =
    useState<T_ModalData | null>(null);
  const [isExportProgressModalOpen, setIsExportProgressModalOpen] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
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
  const [isSearching, setIsSearching] = useState(false);
  const {
    data: employeeCompensationLogbookData,
    isLoading: isEmployeeCompensationLogbookListLoading,
    refetch: employeeCompensationLogbookListRefetch,
  } = useGetEmployeeCompensationLogbookItems({ ...appliedFilter, pageSize: pageSize, currentPage: currentPage });
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [isSelectBranchModalOpen, setIsSelectBranchModalOpen] = useState<boolean>(false);

  // Form Methods
  const createFormMethods = useForm();
  const editFormMethods = useForm();

  const menuOptions = [
    {
      id: 'export-dole-employee-compensation-btn',
      name: 'Export',
      action: () => {
        setIsExportProgressModalOpen(true);
      },
    },
    {
      id: 'generate-dole-employee-compensation-btn',
      name: 'Generate Report',
      action: () => {
        setIsSelectBranchModalOpen(true);
      },
    },
  ];

  // Use the smart menu options hook to handle permissions
  const smartMenuOptions = useSmartMenuOptions(menuOptions);
  
  const [selectedLogbooks, setSelectedLogbooks] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const bulkDeleteMutation = useBulkDeleteEmployeeCompensationLogbook();

  const handleLogbookSelect = (logbookId: number) => {
    setSelectedLogbooks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logbookId)) {
        newSet.delete(logbookId);
      } else {
        newSet.add(logbookId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (!employeeCompensationLogbookItems) return;
    
    if (selectAll) {
      setSelectedLogbooks(new Set());
    } else {
      const allIds = employeeCompensationLogbookItems.map((item: any) => item.id);
      setSelectedLogbooks(new Set(allIds));
    }
  };

  const handleBulkDelete = () => {
    if (selectedLogbooks.size === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const logbookIds = Array.from(selectedLogbooks);
      await bulkDeleteMutation.mutateAsync(logbookIds);
      
      toast.custom(() => <CustomToast message={`${selectedLogbooks.size} logbook(s) deleted successfully.`} type="success" />, { duration: 3000 });
      setSelectedLogbooks(new Set());
      setSelectAll(false);
      setIsBulkDeleteModalOpen(false);
      employeeCompensationLogbookListRefetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete logbooks';
      toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 5000 });
    }
  };

  useEffect(() => {
    if (employeeCompensationLogbookData) {
      employeeCompensationLogbookData.records.map((item: any) => {
        // Safely handle date formatting with null/undefined checks
        if (item.date_of_entry) {
          item.date_of_entry = Intl.DateTimeFormat('en-US').format(new Date(item.date_of_entry));
        }
        if (item.date_of_notification) {
          item.date_of_notification = Intl.DateTimeFormat('en-US').format(new Date(item.date_of_notification));
        }
        if (item.date_of_contingency) {
          item.date_of_contingency = Intl.DateTimeFormat('en-US').format(new Date(item.date_of_contingency));
        }
        return item;
      });
      setEmployeeCompensationLogbookItems(employeeCompensationLogbookData.records);
      setPagination({
        totalPages: employeeCompensationLogbookData.total_pages,
        totalRecords: employeeCompensationLogbookData.total_records,
      });
    }
  }, [employeeCompensationLogbookData]);

  useEffect(() => {
    employeeCompensationLogbookListRefetch();
  }, [currentPage, pageSize, employeeCompensationLogbookListRefetch]);

  useEffect(() => {
    if (employeeCompensationLogbookItems) {
      const allLogbookIds = new Set(employeeCompensationLogbookItems.map((item: any) => item.id));
      const allSelected = allLogbookIds.size > 0 && 
        Array.from(allLogbookIds).every((id: any) => selectedLogbooks.has(id));
      setSelectAll(allSelected);
    }
  }, [selectedLogbooks, employeeCompensationLogbookItems]);

  const handlePrint = (items: any) => {
    // Create a new div element
    const printDiv = document.createElement('div');

    // Copy the content of the original printSection
    const originalPrintSection = document.getElementById('printSection');
    if (originalPrintSection) {
      printDiv.innerHTML = originalPrintSection.innerHTML;
    }

    // Style the new div to be off-screen
    printDiv.style.width = '1980px';
    printDiv.style.height = '100%';
    printDiv.style.position = 'absolute';
    printDiv.style.left = '-9999px';
    printDiv.style.top = '-9999px';

    // Add the new div to the body
    document.body.appendChild(printDiv);

    // Use html2canvas on the new div
    html2canvas(printDiv).then((canvas) => {
      // Remove the temporary div
      document.body.removeChild(printDiv);

      const imgData = canvas.toDataURL('image/png');
      const newWindow = window.open('', '_blank');
      newWindow?.document.write(`<img src="${imgData}" style="width:100%;height:auto;">`);
      newWindow?.document.close();
      setTimeout(() => {
        newWindow?.print();
      }, 500);
    });
  };

  const handlePrintWithBranch = () => {
    if (selectedBranch) {
      // Note: This function may need to be updated if employeeItems is no longer available
      // For now, we'll pass an empty array as the filtering logic needs to be reimplemented
      handlePrint([]);
    }
  };

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
        () => <CustomToast message='You have entered an invalid date range. Please select again.' type='error' />, { duration: 5000 }
      );
    }
    setIsSearching(true);
    setAppliedFilter({ ...pendingFilter });
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!isEmployeeCompensationLogbookListLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isEmployeeCompensationLogbookListLoading, isSearching]);

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const renderRows = () => {
    if (isSearching || isEmployeeCompensationLogbookListLoading) {
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
    if (employeeCompensationLogbookItems && employeeCompensationLogbookItems.length > 0) {
      return employeeCompensationLogbookItems.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <input
              type="checkbox"
              checked={selectedLogbooks.has(item.id)}
              onChange={() => handleLogbookSelect(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue"
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date_of_entry}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date_of_notification}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.employee}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date_of_contingency}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.place_of_contingency}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.nature_of_contingency}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.days_of_employee_absence}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.remarks}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            <div className='flex space-x-2'>
              <SmartButton
                id="edit-dole-employee-compensation-btn"
                onClick={() => setIsEmployeesCompensationLogbookEditModalOpen({ id: item.id, open: true })}
              >
                <EditIcon />
              </SmartButton>
              <SmartButton
                id="edit-dole-employee-compensation-btn"
                onClick={() => setIsEmployeesCompensationLogbookDeleteModalOpen({ id: item.id, open: true })}
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
          <td colSpan={8}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>
              Please click create to add employee compensation logbook.
            </h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24'>
        <div className='flex p-4'>
          <Link href='/dole' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>DOLE</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Employee Compensation Logbook</h2>
          <div className={classNames('mt-6 flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex-none flex flex-col lg:flex-row items-left md:items-center gap-2'>
              <div className='relative'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={pendingFilter.from}
                  pickerOnChange={(date: any) => {
                    if (pendingFilter) setPendingFilter({ ...pendingFilter, from: date });
                  }}
                  inputOnChange={(value: any) => {
                    setPendingFilter({
                      ...pendingFilter,
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
                    'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
                  }
                  selected={pendingFilter.to}
                  pickerOnChange={(date: any) => {
                    if (pendingFilter) setPendingFilter({ ...pendingFilter, to: date });
                    if (!pendingFilter) setPendingFilter(date);
                  }}
                  inputOnChange={(value: any) => {
                    setPendingFilter({
                      ...pendingFilter,
                      to: value,
                    });
                  }}
                  minDate={pendingFilter.from}
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
                  data-tooltip-content='Search for: Employee Name / Place of Contingency'
                  data-tooltip-place='bottom'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) => setPendingFilter({ ...pendingFilter, search: e.target.value })}
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
              <SmartButton
                id="create-dole-employee-compensation-btn"
                className='bg-green-500 rounded-l-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsEmployeesCompensationLogbookCreateModalOpen(true)}
              >
                CREATE
              </SmartButton>
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
                      {smartMenuOptions.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <span
                              className={classNames(
                                'block px-4 py-2 text-sm cursor-pointer text-center',
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                item.disabled ? 'bg-gray-200 cursor-not-allowed opacity-50' : ''
                              )}
                              onClick={(e) => {
                                if (item.disabled) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  return false;
                                }
                                item.action();
                              }}
                              data-permission-id={item.id}
                              data-has-permission={item.hasPermission}
                              data-is-disabled={item.disabled}
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

          {/* Bulk Actions Section - Left Side */}
          <div className="mt-8">
            <div className="flex flex-wrap justify-between items-center gap-2">
              {/* Bulk Actions - Left Side */}
              {selectedLogbooks.size > 0 && (
                <div className="flex items-center gap-3 md:pl-4 lg:pl-10">
                  <button
                    onClick={handleBulkDelete}
                    disabled={bulkDeleteMutation.isLoading || !hasActiveSubscription}
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
                    onClick={() => setSelectedLogbooks(new Set())}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Clear Selected
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    {selectedLogbooks.size} selected
                  </span>
                </div>
              )}

              {/* Right side - can be used for filters or empty */}
              <div className="flex flex-wrap justify-center md:justify-end md:pr-4 lg:pr-10 gap-2">
                {/* Add any filter tabs here if needed in the future */}
              </div>
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
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          disabled={!employeeCompensationLogbookItems || employeeCompensationLogbookItems.length === 0}
                          className="w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue disabled:opacity-50"
                        />
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date of Entry
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date of Notification
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Employee Name
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date of Contingency
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Place of Contingency
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Nature of Contingency
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        No. of Days of Employee&apos;s Absence
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Remarks
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Actions
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
      {isExportProgressModalOpen && (
        <ExportProgressModal
          isOpen={isExportProgressModalOpen}
          setIsOpen={setIsExportProgressModalOpen}
          itemsFilter={appliedFilter}
        />
      )}
      {isEmployeesCompensationLogbookCreateModalOpen && (
        <CreateEmployeeCompensationLogModal
          refetch={employeeCompensationLogbookListRefetch}
          isOpen={isEmployeesCompensationLogbookCreateModalOpen}
          setIsOpen={setIsEmployeesCompensationLogbookCreateModalOpen}
          formMethods={createFormMethods}
        />
      )}
      {isEmployeesCompensationLogbookEditModalOpen && (
        <EditEmployeeCompensationLogModal
          refetch={employeeCompensationLogbookListRefetch}
          isOpen={isEmployeesCompensationLogbookEditModalOpen}
          setIsOpen={setIsEmployeesCompensationLogbookEditModalOpen}
          formMethods={editFormMethods}
        />
      )}
      {isEmployeesCompensationLogbookDeleteModalOpen && (
        <DeleteEmployeeCompensationLogModal
          refetch={employeeCompensationLogbookListRefetch}
          isOpen={isEmployeesCompensationLogbookDeleteModalOpen}
          setIsOpen={setIsEmployeesCompensationLogbookDeleteModalOpen}
        />
      )}
      {isSelectBranchModalOpen && (
        <SelectBranchModal
          isOpen={isSelectBranchModalOpen}
          setIsOpen={setIsSelectBranchModalOpen}
          onBranchSelect={(branch) => {
            setSelectedBranch(branch);
            handlePrintWithBranch();
          }}
        />
      )}
      {isBulkDeleteModalOpen && (
        <BulkDeleteModal
          isOpen={isBulkDeleteModalOpen}
          selectedCount={selectedLogbooks.size}
          moduleName="Employee Compensation Logbook"
          onConfirm={confirmBulkDelete}
          onClose={() => setIsBulkDeleteModalOpen(false)}
          isLoading={bulkDeleteMutation.isLoading}
        />
      )}
      {/* Print Section */}
      <div className='container mx-auto p-4 hidden'>
        <div id='printSection'>
          <Image className='mx-auto my-6' src='/assets/ec-logbook.png' alt='EC Logbook' width={1500} height={1000} />
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse border border-gray-800 table-fixed'>
              <thead>
                <tr>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#011f47] text-white p-2 text-xl'>
                    DATE OF ENTRY
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#011f47] text-white p-2 text-xl'>
                    DATE OF NOTIFICATION
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#011f47] text-white p-2 text-xl'>
                    NAME OF EMPLOYEE
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#011f47] text-white p-2 text-xl'>
                    DATE OF CONTINGENCY
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#011f47] text-white p-2 text-xl'>
                    PLACE OF CONTINGENCY
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#011f47] text-white p-2 text-xl'>
                    NATURE OF CONTINGENCY
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#011f47] text-white p-2 text-xl'>
                    NUMBER OF DAYS THE WORKER WAS ABSENT FROM WORK
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#011f47] text-white p-2 text-xl'>
                    REMARKS/ OTHER INFO
                  </th>
                </tr>
              </thead>
              <tbody>
                {employeeCompensationLogbookItems.map((item: any, rowIndex: number) => (
                  <tr key={rowIndex}>
                    <td className='border-2 border-gray-800 p-2 text-xl'>{item.date_of_entry}</td>
                    <td className='border-2 border-gray-800 p-2 text-xl'>{item.date_of_notification}</td>
                    <td className='border-2 border-gray-800 p-2 text-xl'>{item.employee}</td>
                    <td className='border-2 border-gray-800 p-2 text-xl'>{item.date_of_contingency}</td>
                    <td className='border-2 border-gray-800 p-2 text-xl'>{item.place_of_contingency}</td>
                    <td className='border-2 border-gray-800 p-2 text-xl'>{item.nature_of_contingency}</td>
                    <td className='border-2 border-gray-800 p-2 text-xl'>{item.days_of_employee_absence}</td>
                    <td className='border-2 border-gray-800 p-2 text-xl'>{item.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className='mt-4 text-xl italic'>
            *Date of notification to the employer by the employee or his/her dependents or anybody on his/her behalf,
            provided the contingency is not known to the employer, his/her agents or representatives
          </p>
        </div>
      </div>

      <Tooltip id='search-tooltip'/>
    </>
  );
}

export default Content;
