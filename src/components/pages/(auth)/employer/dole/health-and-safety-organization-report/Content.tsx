'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';

import CustomToast from '@/components/CustomToast';
import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import classNames from '@/helpers/classNames';

import { ArrowLeftIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import useGetHealthAndSafetyReportItems from './hooks/useGetHealthAndSafetyReportItems';
import EmailLogo from '@/svg/EmailLogo';
import CreateHealthAndSafetyReportModal from './modals/CreateHealthAndSafetyReportModal';
import DeleteHealthAndSafetyReportModal from './modals/DeleteHealthAndSafetyReportModal';
import EditHealthAndSafetyReportModal from './modals/EditHealthAndSafetyReportModal';
import SendEmailModal from './modals/SendEmailModal';
import SelectBranchModal from './modals/SelectBranchModal';
import { useQueryClient } from '@tanstack/react-query';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

type T_ModalData = {
  id: number;
  open: boolean;
};

function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const [healthAndSafetyReportItems, setHealthAndSafetyReportItems] = useState<any>([]);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState<T_ModalData | null>(null);
  const [isDeleteHealthAndSafetyReportModalOpen, setIsDeleteHealthAndSafetyReportModalOpen] =
    useState<T_ModalData | null>(null);
  const [isCreateHealthAndSafetyReportModalOpen, setIsCreateHealthAndSafetyReportModalOpen] = useState<boolean>(false);
  const [isEditHealthAndSafetyReportModalOpen, setIsEditHealthAndSafetyReportModalOpen] = useState<T_ModalData | null>(
    null
  );
  const [isExportProgressModalOpen, setIsExportProgressModalOpen] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });
  const [itemsFilter, setItemsFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });

  const {
    data: healthAndSafetyReportItemsData,
    isLoading: isHealthAndSafetyReportItemsLoading,
    refetch: healthAndSafetyReportItemsRefetch,
  } = useGetHealthAndSafetyReportItems({
    ...itemsFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });

  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [isSelectBranchModalOpen, setIsSelectBranchModalOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const cachedRigths = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };

  const menuOptions = [
    {
      name: 'Export',
      action: () => {
        setIsExportProgressModalOpen(true);
      },
      disabled: !cachedRigths?.state?.data?.export_dole_health_safety_organization,
    },
    {
      name: 'Generate Report',
      action: () => {
        setIsSelectBranchModalOpen(true);
      },
      disabled: !cachedRigths?.state?.data?.generate_dole_health_safety_organization,
    },
  ];

  useEffect(() => {
    if (healthAndSafetyReportItemsData) {
      healthAndSafetyReportItemsData.records.map((item: any) => {
        const applicationDate = new Date(item.date_of_application);
        item.date_of_application = `${
          applicationDate.getMonth() + 1
        }/${applicationDate.getDate()}/${applicationDate.getFullYear()}`;
        return item;
      });
      setHealthAndSafetyReportItems(healthAndSafetyReportItemsData.records);
      setPagination({
        totalPages: healthAndSafetyReportItemsData.total_pages,
        totalRecords: healthAndSafetyReportItemsData.total_records,
      });
    }
  }, [healthAndSafetyReportItemsData]);

  useEffect(() => {
    healthAndSafetyReportItemsRefetch();
  }, [currentPage, pageSize]);

  const handlePrintWithBranch = () => {
    if (selectedBranch) {
      const filteredItems = healthAndSafetyReportItems.filter((item: any) => item.branch === selectedBranch);
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
    healthAndSafetyReportItemsRefetch();
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
    if (isHealthAndSafetyReportItemsLoading) {
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
    if (healthAndSafetyReportItems && healthAndSafetyReportItems.length > 0) {
      return healthAndSafetyReportItems.map((item: any) => (
        <tr key={item.id} className='cursor-pointer'>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date_of_report}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.person_employed}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.comittee_type}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.chairman_name}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center'>
            <div className='flex space-x-2'>
              <button
                onClick={() =>
                  setIsEditHealthAndSafetyReportModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={!cachedRigths?.state?.data?.edit_dole_health_safety_organization}
              >
                <EditIcon />
              </button>
              <button
                onClick={() =>
                  setIsSendEmailModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
              >
                <EmailLogo />
              </button>
              <button
                onClick={() =>
                  setIsDeleteHealthAndSafetyReportModalOpen({
                    id: item.id,
                    open: true,
                  })
                }
                disabled={!cachedRigths?.state?.data?.edit_dole_health_safety_organization}
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
            <h4 className='text-center text-gray-300 text-sm mb-4'>
              Please click create to add health and safety organization report.
            </h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/dole' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>DOLE</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Health and Safety Organization Report</h2>
          <div className='mt-6 flex flex-col lg:flex-row items-left gap-4'>
            <div className='flex-none flex flex-col lg:flex-row items-left gap-2'>
              <div className='relative'>
                <CustomDatePicker
                  id='from-datepicker'
                  placeholder={'mm/dd/yyyy'}
                  className={
                    'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
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
                    'appearance-none block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6'
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
            <div className='flex gap-2 lg:w-1/3'>
              <div className='flex-none w-full lg:w-1/3'>
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
            </div>
            <div className='flex-1 flex justify-start lg:justify-end'>
              <button
                className='bg-green-500 rounded-l-md py-2 px-5 text-white text-sm font-semibold shadow hover:shadow-md focus:shadow-none disabled:opacity-50'
                onClick={() => setIsCreateHealthAndSafetyReportModalOpen(true)}
                disabled={!hasActiveSubscription || !cachedRigths?.state?.data?.create_dole_health_safety_organization}
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

          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='min-w-full py-2 sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-300 text-center'>
                  <thead>
                    <tr>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date of Report
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Number of Employees
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Safety Committee Type
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Chairman/ Officer in Charge
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Actions
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
      {isCreateHealthAndSafetyReportModalOpen && (
        <CreateHealthAndSafetyReportModal
          refetch={null}
          isOpen={isCreateHealthAndSafetyReportModalOpen}
          setIsOpen={setIsCreateHealthAndSafetyReportModalOpen}
        />
      )}
      {isDeleteHealthAndSafetyReportModalOpen && (
        <DeleteHealthAndSafetyReportModal
          refetch={null}
          isOpen={isDeleteHealthAndSafetyReportModalOpen}
          setIsOpen={setIsDeleteHealthAndSafetyReportModalOpen}
        />
      )}
      {isEditHealthAndSafetyReportModalOpen && (
        <EditHealthAndSafetyReportModal
          refetch={null}
          isOpen={isEditHealthAndSafetyReportModalOpen}
          setIsOpen={setIsEditHealthAndSafetyReportModalOpen}
        />
      )}
      {isSendEmailModalOpen && (
        <SendEmailModal refetch={null} isOpen={isSendEmailModalOpen} setIsOpen={setIsSendEmailModalOpen} />
      )}
      {/* Print Section */}
      {/* <div className="container mx-auto p-4 hidden">
        <div id="printSection">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-800 table-fixed">
              <thead>
                <tr>
                  <th
                    colSpan={6}
                    className="border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center"
                  >
                    Basic Information
                  </th>
                  <th
                    colSpan={3}
                    className="border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center py-1"
                  >
                    Risk and Safety Information
                  </th>
                  <th
                    colSpan={3}
                    className="border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center"
                  >
                    WEM Details Request
                  </th>
                  <th
                    colSpan={4}
                    className="border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center"
                  >
                    Monitoring Capability
                  </th>
                  <th
                    colSpan={3}
                    className="border-2 border-gray-800 bg-navy-blue bg-[#aeaaaa] text-black p-1 text-sm whitespace-normal text-center"
                  >
                    Hazards
                  </th>
                </tr>
                <tr>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Date of Application
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Company Name
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Type of Industry
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Number of Workers Male
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Number of Workers Female
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Number of Workers Total
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Risk Classification
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Name of Safety Officer
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Safety Officer Level
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Purpose of WEM Request
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    WEM Conducted by
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Last WEM Date
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    WEM Internal Monitoring Capability
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    WEM Equipment Owned by Company
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Conducting Internal WEM
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Date of Internal Monitoring
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Purpose of WEM Request
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Chemical Hazards
                  </th>
                  <th className="border-2 border-gray-800 bg-navy-blue bg-[#e7e7e7] text-black p-1 text-sm whitespace-normal">
                    Ventilation
                  </th>
                </tr>
              </thead>
              <tbody>
                {workEnvironmentRequestItems.map(
                  (item: any, rowIndex: number) => (
                    <tr key={rowIndex}>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.date_of_application}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.company_name}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.type_of_industry}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.number_of_workers_male}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.number_of_workers_female}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.number_of_workers_total}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.risk_classification}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.name_of_safety_officer}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.safety_officer_levels}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.purpose_of_wem_request}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.wem_conducted_by}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.last_wem_date}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.wem_internal_monitoring_capability}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.wem_equipment_owned_by_company}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.conducting_internal_wem ? 'Yes' : 'No'}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.date_of_internal_monitoring}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.hazards_purpose_of_wem_request}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.chemical_hazards}
                      </td>
                      <td className="border-2 border-gray-800 p-1 text-sm whitespace-normal break-words max-w-xs">
                        {item.ventilation}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xl text-center">-- Nothing follows --</p>
        </div>
      </div> */}
    </>
  );
}

export default Content;
