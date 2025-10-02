'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { Tooltip } from 'react-tooltip';
import { useForm } from 'react-hook-form';

import LoadingSpinner from '@/components/LoadingSpinner';
import CustomToast from '@/components/CustomToast';
import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import classNames from '@/helpers/classNames';

import useGetWorkAccidentIlnessReportsItems from './hooks/useGetWorkAccidentIlnessReportsItems';
import CreateWorkAccidentIllnessReportModal from './modals/CreateWorkAccidentIllnessReportModal';
import UpdateWorkAccidentIllnessReportModal from './modals/UpdateWorkAccidentIllnessReportModal';
import DeleteWorkAccidentIllnessReportModal from './modals/DeleteWorkAccidentIllnessReportModal';
import SelectBranchModal from './modals/SelectBranchModal';
import ExportProgressModal from './modals/ExportProgressModal';
import { useBulkDeleteWorkAccidentIllnessReport } from './hooks/useBulkDeleteWorkAccidentIllnessReport';
import BulkDeleteModal from '@/components/pages/(auth)/employer/settings/general-settings/employees/modals/BulkDeleteModal';

import EditIcon from '@/svg/EditIcon';
import PrintIcon from "@/svg/PrintIcon";
import DeleteIcon from '@/svg/DeleteIcon';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const [workAccidentIlnessReportsItems, setWorkAccidentIlnessReportsItems] = useState<any>([]);
  const [isWorkAccidentIllnessReportDeleteModalOpen, setIsWorkAccidentIllnessReportDeleteModalOpen] =
    useState<T_ModalData | null>(null);
  const [isUpdateWorkAccidentIllnessReportModalOpen, setIsUpdateWorkAccidentIllnessReportModalOpen] =
    useState<T_ModalData | null>(null);
  const [isCreateWorkAccidentIllnessReportModalOpen, setIsCreateWorkAccidentIllnessReportModalOpen] =
    useState<boolean>(false);
  const [isExportProgressModalOpen, setIsExportProgressModalOpen] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [isSelectBranchModalOpen, setIsSelectBranchModalOpen] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const cachedRigths = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };

  // Form Methods
  const createFormMethods = useForm();
  const editFormMethods = useForm();
  
  // Employee Search
    // For create modal
    const [createEmployeeSearch, setCreateEmployeeSearch] = useState('');
    const [createEmployeeSelected, setCreateEmployeeSelected] = useState(false);

    // For edit modal
    const [editEmployeeSearch, setEditEmployeeSearch] = useState('');
    const [editEmployeeSelected, setEditEmployeeSelected] = useState(false);

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
  const {
    data: workAccidentIlnessReportsData,
    isLoading: isWorkAccidentIlnessReportsLoading,
    refetch: workAccidentIlnessReportsRefetch,
  } = useGetWorkAccidentIlnessReportsItems({ ...appliedFilter, pageSize: pageSize, currentPage: currentPage });
  
  const menuOptions = [
    {
      name: 'Export',
      action: () => {
        setIsExportProgressModalOpen(true);
      },
      disabled: !cachedRigths?.state?.data?.export_dole_wair,
    },
    {
      name: 'Generate Report',
      action: () => {
        setIsSelectBranchModalOpen(true);
      },
      disabled: !cachedRigths?.state?.data?.generate_dole_wair,
    },
  ];

  const [isSearching, setIsSearching] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const { mutate: bulkDeleteWorkAccidentIllnessReports, isLoading: isBulkDeleting } = useBulkDeleteWorkAccidentIllnessReport();

  useEffect(() => {
    if (workAccidentIlnessReportsData) {
      workAccidentIlnessReportsData.records.map((item: any) => {
        const incidentDate = new Date(item.date_of_incident);
        item.date_of_incident = `${incidentDate.getMonth() + 1}/${incidentDate.getDate()}/${incidentDate.getFullYear()}`;

        // Format time_of_incident to 12-hour format
        if (item.time_of_incident) {
          const [hours, minutes, seconds] = item.time_of_incident.split(":");
          const date = new Date();
          date.setHours(Number(hours), Number(minutes), Number(seconds || 0));
          item.time_of_incident = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
        }

        const returnDate = new Date(item.date_returned_to_work);
        item.date_returned_to_work = `${returnDate.getMonth() + 1}/${returnDate.getDate()}/${returnDate.getFullYear()}`;

        const returnedIllnessDate = new Date(item.date_returned_to_work_illness);
        item.date_returned_to_work_illness = `${
          returnedIllnessDate.getMonth() + 1
        }/${returnedIllnessDate.getDate()}/${returnedIllnessDate.getFullYear()}`;

        return item;
      });
      setWorkAccidentIlnessReportsItems(workAccidentIlnessReportsData.records);
      setPagination({
        totalPages: workAccidentIlnessReportsData.total_pages,
        totalRecords: workAccidentIlnessReportsData.total_records,
      });
    }
  }, [workAccidentIlnessReportsData]);

  useEffect(() => {
    workAccidentIlnessReportsRefetch();
  }, [currentPage, pageSize]);

  const handlePrintWithBranch = () => {
    if (selectedBranch) {
      const filteredItems = workAccidentIlnessReportsItems.filter((item: any) => item.branch === selectedBranch);
      handlePrint();
    }
  };

  const handlePrint = () => {
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
    if (!isWorkAccidentIlnessReportsLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isWorkAccidentIlnessReportsLoading, isSearching]);

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      toast.custom(() => <CustomToast message="Please select items to delete" type='error' />, { duration: 4000 });
      return;
    }
    setIsBulkDeleteModalOpen(true);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteWorkAccidentIllnessReports(selectedItems, {
      onSuccess: (data) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
        setSelectedItems([]);
        setIsBulkDeleteModalOpen(false);
        workAccidentIlnessReportsRefetch();
      },
      onError: (error: any) => {
        toast.custom(() => <CustomToast message={error.message} type='error' />, { duration: 4000 });
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === workAccidentIlnessReportsItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(workAccidentIlnessReportsItems.map((item: any) => item.id));
    }
  };

  const handleSelectItem = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const renderRows = () => {
    if (isSearching || isWorkAccidentIlnessReportsLoading) {
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
    if (workAccidentIlnessReportsItems && workAccidentIlnessReportsItems.length > 0) {
      return workAccidentIlnessReportsItems.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={() => handleSelectItem(item.id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date_of_incident}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.time_of_incident}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.employee}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            {item.reportable_illness ? (
              <>
                {item.reportable_illness} <br />
                {item.date_returned_to_work_illness && (
                  <>
                    (Date of Return: {item.date_returned_to_work_illness}) <br />
                  </>
                )}
                {item.days_of_absence_illness && <>(Days Lost: {item.days_of_absence_illness})</>}
              </>
            ) : null}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
            {item.nature_of_injury ? (
              <>
                {item.nature_of_injury} <br />
                {item.date_returned_to_work && (
                  <>
                    (Date of Return: {item.date_returned_to_work}) <br />
                  </>
                )}
                {item.days_of_absence && <>(Days Lost: {item.days_of_absence})</>}
              </>
            ) : null}
          </td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.part_of_body_affected}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.extent_of_injury}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            <div className='flex space-x-2'>
              <button
                onClick={() =>
                  setIsUpdateWorkAccidentIllnessReportModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={!cachedRigths?.state?.data?.edit_dole_wair}
              >
                <EditIcon />
              </button>
              <button
                onClick={() =>
                  setIsWorkAccidentIllnessReportDeleteModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={!cachedRigths?.state?.data?.edit_dole_wair}
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
          <td colSpan={100}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add work accident/illness report.</h4>
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
            <h2 className='text-xl font-bold'>DOLE</h2>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Work Accident/Illness Report</h2>
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
                    data-tooltip-content='Search for Employee Name'
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
              <button
                className='bg-green-500 rounded-l-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsCreateWorkAccidentIllnessReportModalOpen(true)}
                disabled={!cachedRigths?.state?.data?.create_dole_wair}
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
          </div>

          {/* Bulk Actions Section */}
          <div className="mt-8">
            <div className="flex flex-wrap justify-between items-center gap-2">
              {/* Bulk Actions - Left Side */}
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-3 md:pl-4 lg:pl-10">
                  <button
                    onClick={handleBulkDelete}
                    disabled={isBulkDeleting || !cachedRigths?.state?.data?.edit_dole_wair}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBulkDeleting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Deleting...
                      </div>
                    ) : (
                      'Delete Selected'
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedItems([])}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Clear Selected
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    {selectedItems.length} selected
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
                          checked={selectedItems.length === workAccidentIlnessReportsItems.length && workAccidentIlnessReportsItems.length > 0}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date of Accident
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Time of Accident
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Name of Injured Worker
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Reportable Illness
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Nature of Injury
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Parts of the Body Affected
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Extent of Disability
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
      {isCreateWorkAccidentIllnessReportModalOpen && (
        <CreateWorkAccidentIllnessReportModal
          refetch={workAccidentIlnessReportsRefetch}
          isOpen={isCreateWorkAccidentIllnessReportModalOpen}
          setIsOpen={setIsCreateWorkAccidentIllnessReportModalOpen}
          formMethods={createFormMethods}
          employeeSearch={createEmployeeSearch}
          setEmployeeSearch={setCreateEmployeeSearch}
          employeeSelected={createEmployeeSelected}
          setEmployeeSelected={setCreateEmployeeSelected}
        />
      )}
      {isWorkAccidentIllnessReportDeleteModalOpen && (
        <DeleteWorkAccidentIllnessReportModal
          refetch={workAccidentIlnessReportsRefetch}
          isOpen={isWorkAccidentIllnessReportDeleteModalOpen}
          setIsOpen={setIsWorkAccidentIllnessReportDeleteModalOpen}
        />
      )}
      {isUpdateWorkAccidentIllnessReportModalOpen && (
        <UpdateWorkAccidentIllnessReportModal
          refetch={workAccidentIlnessReportsRefetch}
          isOpen={isUpdateWorkAccidentIllnessReportModalOpen}
          setIsOpen={setIsUpdateWorkAccidentIllnessReportModalOpen}
          formMethods={editFormMethods}
          employeeSearch={editEmployeeSearch}
          setEmployeeSearch={setEditEmployeeSearch}
          employeeSelected={editEmployeeSelected}
          setEmployeeSelected={setEditEmployeeSelected}
        />
      )}
      {isExportProgressModalOpen && (
        <ExportProgressModal
          isOpen={isExportProgressModalOpen}
          setIsOpen={setIsExportProgressModalOpen}
          itemsFilter={appliedFilter}
        />
      )}
      {/* Print Section */}
      <div className='container mx-auto p-4 hidden'>
        <div id='printSection'>
          <Image
            className='mx-auto my-6'
            src='/assets/work-accident-illness-report.png'
            alt='Work Accident/Illness Report'
            width={1500}
            height={1000}
          />
          <div className='flex flex-col gap-1 text-left pb-2'>
            <h1 className='text-sm font-bold'>
              Date of Accident: {workAccidentIlnessReportsItems[0]?.date_of_incident || 'N/A'}
            </h1>
            <h1 className='text-sm font-bold'>
              Time of Accident: {workAccidentIlnessReportsItems[0]?.time_of_incident || 'N/A'}
            </h1>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse border border-gray-800 table-fixed'>
              <thead>
                <tr>
                  <th
                    colSpan={6}
                    className='border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center'
                  >
                    Personal Information
                  </th>
                  <th
                    colSpan={7}
                    className='border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center py-1'
                  >
                    Employment Details
                  </th>
                  <th
                    colSpan={5}
                    className='border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center'
                  >
                    Illness
                  </th>
                  <th
                    colSpan={7}
                    className='border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center'
                  >
                    Nature/Extent of Injury
                  </th>
                </tr>
                <tr>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Name of Injured Worker
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Age
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Civil Status
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Address
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    No. of Dependents
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Sex
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Occupation
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Employment Status
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Average Weekly Wage
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Length of Service in Establishment prior to Accident or Illness
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Years of Experience at the Occupation
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Hours of Work per day
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Hours of Work per Week
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Reportable Illness
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Date Illness Begun
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Date Returned to Work
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Days Lost
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Day/s Charged
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Extent of Disability
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Nature of Injury
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Parts of the Body Affected
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Date Disability Began
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Date Returned to Work
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Days Lost
                  </th>
                  <th className='border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal'>
                    Day/s Charged
                  </th>
                </tr>
              </thead>
              <tbody>
                {workAccidentIlnessReportsItems.map((item: any, rowIndex: number) => (
                  <tr key={rowIndex}>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.employee}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.age}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.civil_status}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.address}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.no_of_dependents}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.sex}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.occupation}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.employment_status}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.average_weekly_earnings}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.length_of_service}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.years_of_experience}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.hours_worked_per_day}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.hours_worked_per_week}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.reportable_illness}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.date_of_illness}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.date_returned_to_work_illness}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.days_of_absence_illness}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.days_chargeable_illness}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.extent_of_disability}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.nature_of_injury}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.part_of_body_affected}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.date_of_disability}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.date_returned_to_work}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.days_of_absence}
                    </td>
                    <td className='border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs'>
                      {item.days_chargeable}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className='mt-4 text-xl text-center'>-- Nothing follows --</p>
        </div>
      </div>

      <Tooltip id='search-tooltip'/>
      {isBulkDeleteModalOpen && (
        <BulkDeleteModal
          isOpen={isBulkDeleteModalOpen}
          onClose={() => setIsBulkDeleteModalOpen(false)}
          onConfirm={handleConfirmBulkDelete}
          selectedCount={selectedItems.length}
          moduleName="work accident illness report"
          isLoading={isBulkDeleting}
        />
      )}
    </>
  );
}

export default Content;
