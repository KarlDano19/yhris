'use client';

import React, { useEffect, useState, useRef } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import useGetBenefitItems from './hooks/useGetBenefitItems';
import DesignBenefitsModal from './modals/DesignBenefitsModal';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

import classNames from '@/helpers/classNames';


const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [designBenefitsItems, setDesignBenefitsItems] = useState<any>([]);
  const [itemsFilter, setItemsFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const [appliedFilter, setAppliedFilter] = useState<any>({
    from: '',
    to: '',
    search: '',
  });
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    totalRecords: number;
    totalPages: number;
  }>({
    totalPages: 1,
    totalRecords: 0,
  });
  const { data: dataBenefits, isLoading: isGetBenefitsLoading, refetch } = useGetBenefitItems({
    ...appliedFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });
  const [isDesignBenefitsModalOpen, setIsDesignBenefitsModalOpen] = useState<boolean | null>(null);
  
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (dataBenefits) {
      let items = [];
      let totalPages = 1;
      let totalRecords = 0;

      // Handle paginated response structure
      if (dataBenefits.records) {
        items = dataBenefits.records.map((benefit: any) => {
          benefit.date = Intl.DateTimeFormat('en-US').format(new Date(benefit.created_at));
          return benefit;
        });
        totalPages = dataBenefits.total_pages || 1;
        totalRecords = dataBenefits.total_records || items.length;
      } 
      // Handle array response structure (no pagination from backend)
      else if (Array.isArray(dataBenefits)) {
        items = dataBenefits.map((benefit: any) => {
          benefit.date = Intl.DateTimeFormat('en-US').format(new Date(benefit.created_at));
          return benefit;
        });
        
        // Calculate pagination locally if backend doesn't support it
        totalRecords = items.length;
        totalPages = Math.ceil(totalRecords / pageSize);
      }

      setDesignBenefitsItems(items);
      setPagination({
        totalPages,
        totalRecords
      });
    }
  }, [dataBenefits, pageSize]);

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleSearch = () => {
    const dateFrom = Date.parse(itemsFilter.from);
    const dateTo = Date.parse(itemsFilter.to);
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
    setAppliedFilter({
      ...itemsFilter,
      search: searchText
    });
  };

  useEffect(() => {
    if (!isGetBenefitsLoading && isSearching) {
      setIsSearching(false);
    }
  }, [isGetBenefitsLoading, isSearching]);

  const renderRows = () => {
    if (isSearching || isGetBenefitsLoading) {
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
    if (designBenefitsItems && designBenefitsItems.length > 0) {
      return designBenefitsItems.map((item: any) => (
        <tr key={item.id}>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.date}</td>
          <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{item.title}</td>
          <td className='px-3 py-5 text-sm text-gray-500 text-ellipsis'>{item.purpose}</td>
          <td className='px-3 py-5 text-sm text-gray-500 text-ellipsis'>{item.eligibility}</td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={7}>
            <h4 className='text-center text-gray-300 text-sm mt-4'>There{`'`}s no data yet.</h4>
            <h4 className='text-center text-gray-300 text-sm mb-4'>Please click create to add benefit.</h4>
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/manage' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Manage</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Design Benefits</h2>
        </div>

        {/* Content Section with flex-1 */}
        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          <div className={classNames('flex flex-col lg:flex-row items-left gap-4', !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
            <div className='flex-none flex flex-col lg:flex-row items-left md:items-center gap-2'>
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
              <div className='flex flex-row w-full items-center gap-2'>
                <input
                  type='text'
                  name='search'
                  id='search'
                  data-tooltip-id='search-tooltip'
                  data-tooltip-content='Search for: Title/Purpose/Eligibility'
                  data-tooltip-place='bottom'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
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
                id="create-benefit-btn"
                className='bg-green-500 rounded-md py-2 px-8 text-white text-sm font-semibold shadow enabled:hover:shadow-md enabled:focus:shadow-none enabled:focus:opacity-80 disabled:opacity-50'
                onClick={() => setIsDesignBenefitsModalOpen(true)}
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
                        Date
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Title
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Purpose
                      </th>
                      <th scope='col' className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                        Eligibility
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
      {isDesignBenefitsModalOpen && (
        <DesignBenefitsModal
          isOpen={isDesignBenefitsModalOpen}
          setIsOpen={setIsDesignBenefitsModalOpen}
          refetch={refetch}
        />
      )}

      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;
