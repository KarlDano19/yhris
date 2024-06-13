'use client';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import React from 'react';
import useGetHiredApplicants from './hooks/useGetHiredApplicants';

const Content = () => {
  const { data, isLoading } = useGetHiredApplicants();
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='flex p-4'>
        <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Dashboard</h4>
        </Link>
      </div>
      <div className='px-2 md:px-8 lg:px-4'>
        <h2 className='text-xl font-bold text-indigo-dye'>Hired Applicants</h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
          {!isLoading && data
            ? data.map((hiredApplicant: any, index: number) => (
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
    </div>
  );
};

export default Content;
