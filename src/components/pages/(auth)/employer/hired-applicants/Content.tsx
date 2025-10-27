'use client';

import React, { useEffect, useState } from 'react';
import { useRef } from 'react';

import Link from 'next/link';

import { Tooltip } from 'react-tooltip';

import Pagination from '@/components/Pagination';
import useGetHiredApplicants from './hooks/useGetHiredApplicants';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';


type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

const Content = () => {
  const [inputValue, setInputValue] = useState('');
  const [itemsFilter, setItemsFilter] = useState<any>({
    search: '',
    is_active: 'true', // Only show active job postings
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });
  const { data, refetch, isLoading } = useGetHiredApplicants({
    ...itemsFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });
  const lastSearchedValue = useRef(itemsFilter.search || '');
  useEffect(() => {
    refetch();
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (data && data.total_pages && data.total_records) {
      // Sort: records with hired_applicant_applied_no > 0 first
      if (data.records && Array.isArray(data.records)) {
        data.records = [...data.records].sort((a, b) => {
          const aHasHired = (a.hired_applicant_applied_no || 0) > 0 ? 1 : 0;
          const bHasHired = (b.hired_applicant_applied_no || 0) > 0 ? 1 : 0;
          return bHasHired - aHasHired;
        });
      }
      setPagination({
        totalPages: data.total_pages,
        totalRecords: data.total_records,
      });
    }
  }, [data]);

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };
  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 min-h-[80vh] flex flex-col'>
        <div className='flex p-4'>
          <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Dashboard</h4>
          </Link>
        </div>
        
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Hired Applicants</h2>
        </div>

        {/* Content Section with flex-1 */}
        <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
          {/* Search bar */}
          <div className='mb-10 flex flex-col lg:flex-row items-left gap-4'>
          <div className='flex gap-2 lg:w-1/3 pr-5 md:pr-16'>
            <div className='flex-none w-11/12 lg:w-full'>
              <div className='relative flex items-center'>
                <input
                  type='text'
                  name='search'
                  id='search'
                  data-tooltip-id='search-tooltip'
                  data-tooltip-content='Search for: Job Title'
                  data-tooltip-place='bottom'
                  className='block w-full rounded-md border-0 py-1.5 px-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setItemsFilter({ ...itemsFilter, search: inputValue });
                    }
                  }}
                  placeholder='Search ...'
                />
              </div>
            </div>
            <button
              className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
              onClick={() => setItemsFilter({ ...itemsFilter, search: inputValue })}
            >
              <MagnifyingGlassIcon className='h-5 w-5' />
            </button>
          </div>
        </div>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
          {!isLoading && data?.records
            ? data.records.map((hiredApplicant: any, index: number) => (
                <div
                  key={index}
                  className='rounded-lg px-8 py-14 shadow text-indigo-dye text-center bg-white'
                >
                  <h2 className='font-semibold text-xl'>{hiredApplicant.job_title}</h2>
                  <p className='text-[15px] mb-12'>{hiredApplicant.advertise_to}</p>
                  <Link
                    href={'/orient/' + hiredApplicant.id}
                    className='bg-[#EAC645] text-[#2C3F58] font-semibold px-10 py-4 rounded-md hover:bg-opacity-90'
                  >
                    {hiredApplicant.hired_applicant_applied_no} Hired Applicant/s
                  </Link>
                </div>
              ))
            : ''}
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
            pageType='hiredApplicant'
          />
        </div>
      </div>
      <Tooltip id='search-tooltip'/>
    </>
  );
};

export default Content;
