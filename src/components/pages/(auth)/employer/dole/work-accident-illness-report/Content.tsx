'use client';

import React, { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import Pagination from '@/components/Pagination';
import CustomDatePicker from '@/components/CustomDatePicker';
import classNames from '@/helpers/classNames';
import CreateWorkAccidentIllnessReportModal from './modals/CreateWorkAccidentIllnessReportModal';

import { ArrowLeftIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

function Content() {
  const [isCreateWorkAccidentIllnessReportModalOpen, setIsCreateWorkAccidentIllnessReportModalOpen] = useState<boolean>(false);
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
  const menuOptions = [
    {
      name: 'Export',
      action: () => {
        // setIsExportProgressModalOpen(true);
      },
    },
    {
      name: 'Generate Report',
      action: () => {
        // handlePrint();
      },
    },
  ];

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
    // workAccidentIllnessReportListRefetch();
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
          <h2 className='text-xl font-bold text-indigo-dye'>Work Accident/Illness Report</h2>
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
                onClick={() => setIsCreateWorkAccidentIllnessReportModalOpen(true)}
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
                        Date of Accident
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Time of Accident
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Name of Injured Worker
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Reportable Illness/Nature of Injury
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Parts of the Body Affected
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Date Returned to Work
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Days Lost
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Extent of Disability
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {/* <tbody className='divide-y divide-gray-200'>{renderRows()}</tbody> */}
                </table>
                <hr />
                {/* <Pagination
                  pagination={pagination}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onPageSizeChange={pageSizeChange}
                  onPageChange={paginationChange}
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isCreateWorkAccidentIllnessReportModalOpen && (
        <CreateWorkAccidentIllnessReportModal
          refetch={null}
          isOpen={isCreateWorkAccidentIllnessReportModalOpen}
          setIsOpen={setIsCreateWorkAccidentIllnessReportModalOpen}
        />
      )}
    </>
  );
}

export default Content;
