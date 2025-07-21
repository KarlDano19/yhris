'use client';

import React, { useState, useEffect } from 'react';
import { useRef } from 'react';

import Link from 'next/link';

import { Tooltip } from 'react-tooltip';

import PostJobCard from './PostJobCard';
import useGetJobPostItems from './hooks/useGetJobPostItems';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Pagination from '@/components/Pagination';

type PaginationProps = {
  totalRecords: number;
  totalPages: number;
};

const Content = ({ hasActiveSubscription }: { hasActiveSubscription: boolean }) => {
  const [itemsFilter, setItemsFilter] = useState<any>({
    search: '',
  });
  const [jobPostHistoryItems, setJobPostHistoryItems] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [pagination, setPagination] = useState<PaginationProps>({
    totalPages: 1,
    totalRecords: 0,
  });
  const { data: dataJobPost, refetch: refetchJobPost } = useGetJobPostItems({
    ...itemsFilter,
    pageSize: pageSize,
    currentPage: currentPage,
  });
  useEffect(() => {
    refetchJobPost();
  }, [currentPage, pageSize]);

  const paginationChange = (event: any) => {
    const newCurrentPage = event.selected + 1;
    setCurrentPage(newCurrentPage);
  };

  const pageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  useEffect(() => {
    if (dataJobPost?.records) {
      dataJobPost.records.map((jobPost: any) => {
        jobPost['jobTitle'] = jobPost['job_title'];
        jobPost['jobType'] = jobPost['job_type'];
        jobPost['jobDescription'] = jobPost['job_description'];
        jobPost['applicantApplied'] = jobPost['applicant_applied_no'];
        jobPost['placeAdvertise'] = jobPost['advertise_to'];
        jobPost['schedule'] = jobPost['job_schedule'];
        jobPost['hireCount'] = jobPost['required_slot'];
        jobPost['postIn'] = jobPost['shared_to'].split(',');
        jobPost['hiredApplicant'] = jobPost['hired_applicant_applied_no'];
      });
      setJobPostHistoryItems(dataJobPost.records);
      setPagination({
        totalPages: dataJobPost.total_pages,
        totalRecords: dataJobPost.total_records,
      });
    }
  }, [dataJobPost]);

  const lastSearchedValue = useRef('');

  return (
    <div className='min-h-screen'>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-smooth`}>
        <div className='flex px-4 pt-4 pb-2'>
          <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Dashboard</h4>
          </Link>
        </div>
        <div className='p-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Screen Applicants</h2>
          <div className='mt-6 mb-10 flex flex-col lg:flex-row items-left gap-4'>
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
                  value={itemsFilter.search}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setItemsFilter({ ...itemsFilter, search: newValue });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      refetchJobPost();
                    }
                  }}
                  placeholder='Search ...'
                />
                <Tooltip id='search-tooltip' />
              </div>
            </div>
            <button
              className='bg-white border border-gray-300 rounded-md p-2 ml-1 hover:bg-gray-100'
              onClick={() => refetchJobPost()}
            >
                <MagnifyingGlassIcon className='h-5 w-5' />
              </button>
            </div>
          </div>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
            {jobPostHistoryItems.map((item: any) => {
              return (
                <div key={item.id} className='rounded-lg px-8 py-14 shadow text-indigo-dye text-center bg-white'>
                  <h2 className='font-semibold text-xl'>{item.jobTitle}</h2>
                  <p className='text-[15px] mb-12'>{item.placeAdvertise}</p>
                  <Link
                    href={`screen-applicants/${item.id}`}
                    className='bg-[#EAC645] text-[#2C3F58] font-semibold px-10 py-4 rounded-md hover:bg-opacity-90'
                  >
                    {item.applicantApplied - item.hiredApplicant} New Applicant/s
                  </Link>
                </div>
              );
            })}
            {/* ensuring cards displayed are always six */}
            {jobPostHistoryItems.length <= 6 &&
              Array.from({ length: 6 - jobPostHistoryItems.length }).map((_, index) => {
                return <PostJobCard key={index} hasActiveSubscription={hasActiveSubscription} />;
              })}
            {jobPostHistoryItems.length > 6 &&
              Array.from({ length: 1 }).map((_, index) => {
                return <PostJobCard key={index} hasActiveSubscription={hasActiveSubscription} />;
              })}
          </div>
        </div>
        <Pagination
          pagination={pagination}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageSizeChange={pageSizeChange}
          onPageChange={paginationChange}
          pageType='screenApplicant'
        />
      </div>
      <Tooltip id='search-tooltip'/>
    </div>
  );
};

export default Content;
