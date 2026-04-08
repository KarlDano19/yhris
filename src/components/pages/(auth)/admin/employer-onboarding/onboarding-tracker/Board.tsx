'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

import LoadingSpinner from '@/components/LoadingSpinner';

import EmployerCard from './EmployerCard';
import useGetOnboardingList from './hooks/useGetOnboardingList';

type BoardProps = {
  onSelect: (id: string) => void;
};

const Board = ({ onSelect }: BoardProps) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useGetOnboardingList(debouncedSearch);

  const records: any[] = data || [];

  const total = records.length;
  const completed = records.filter((r) => r.status === 'COMPLETED').length;
  const inProgress = records.filter((r) => r.status === 'IN_PROGRESS').length;
  const notStarted = records.filter((r) => r.status === 'NOT_STARTED').length;

  const statCards = [
    { label: 'Total Clients', count: total, color: 'bg-blue-50 text-blue-700' },
    { label: 'Completed', count: completed, color: 'bg-green-50 text-green-700' },
    { label: 'In Progress', count: inProgress, color: 'bg-orange-50 text-orange-700' },
    { label: 'Not Started', count: notStarted, color: 'bg-gray-50 text-gray-600' },
  ];

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='flex p-4'>
        <Link href='/admin/employer-onboarding' className='flex-none flex gap-3 items-center hover:bg-gray-200 px-2 py-1 rounded'>
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Back</h4>
        </Link>
      </div>

      <div className='px-2 md:px-8 lg:px-4'>
        <div className='mb-6'>
          <h1 className='text-xl font-bold text-indigo-dye'>Client Onboarding</h1>
          <p className='text-sm text-gray-500 mt-1'>HRIS Onboarding Tracker</p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          {statCards.map((card) => (
            <div key={card.label} className={`rounded-xl p-4 ${card.color}`}>
              <p className='text-3xl font-bold'>{card.count}</p>
              <p className='text-sm font-medium mt-1'>{card.label}</p>
            </div>
          ))}
        </div>

        <div className='mb-6'>
          <div className='relative w-full max-w-sm'>
            <MagnifyingGlassIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              placeholder='Search clients...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400'
            />
          </div>
        </div>

        {isLoading ? (
          <div className='flex justify-center py-12'>
            <LoadingSpinner size='lg' color='yellow' />
          </div>
        ) : records.length === 0 ? (
          <div className='text-center py-12 text-gray-500 text-sm'>No onboarding records found.</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {records.map((record) => (
              <EmployerCard key={record.id} record={record} onSelect={onSelect} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
