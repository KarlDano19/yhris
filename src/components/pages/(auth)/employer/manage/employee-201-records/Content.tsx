'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import Link from 'next/link';

import { useEmployees } from './hooks/useEmployees';
import SearchBar from './components/SearchBar';
import FilterPopover from './components/FilterPopover';
import EmployeeGrid from './components/EmployeeGrid';
import SkeletonGrid from './components/SkeletonGrid';
import Pagination from '@/components/Pagination';
import useBulkSyncToYP from './hooks/useBulkSyncToYP';

import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';
import useGetUserDetails from '@/components/hooks/useGetUserDetails';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';

export default function Content({ loginType, hasActiveSubscription }: { loginType: string, hasActiveSubscription: boolean }) {
  const [q, setQ] = useState('');

  // Stable initial options (no 'q' here; search is driven via setSearch)
  const baseOpts = useMemo(
    () => ({
      location: 'ALL',
      department: 'ALL',
      position: 'ALL',
      onlyIncomplete: false,
      isActive: ['true'],
      page: 1,
      pageSize: 12,
    }),
    []
  );

  const {
    data,
    meta,
    isLoading,
    error,
    refetch,
    query, // includes current q/page/pageSize/etc managed by the hook
    setSearch, // drive search term here (debounced below)
    applyFilters, // updates filters + resets page inside the hook
    setPage,
    setPageSize,
  } = useEmployees(baseOpts);

  const { mutate: bulkSyncToYP, isLoading: isBulkSyncToYPLoading } = useBulkSyncToYP();

  const { data: employeeItems } = useGetEmployeeItems();

  // Debounce search → setSearch, skip first run (initial fetch already happened)
  const didInit = useRef(false);
  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      return;
    }

    const t = setTimeout(() => {
      if (q !== (query.q ?? '')) setSearch(q);
    }, 300);

    return () => clearTimeout(t);
  }, [q, setSearch, query.q]);

  // filter popover plumbing
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!filterRef.current?.contains(e.target as Node)) setShowFilter(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowFilter(false);
    };
    document.addEventListener('mousedown', onDocClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleBulkSyncToYP = () => {
    bulkSyncToYP(
      {
        sync_type: 'all',
        sync_mode: 'all',
        employee_ids: employeeItems?.map((employee: any) => employee.id) ?? [],
      },
      {
        onSuccess: (data) => {
          const { summary } = data;
          const message = `Sync complete: ${summary.created} created, ${summary.updated} updated${summary.errors > 0 ? `, ${summary.errors} errors` : ''}`;
          toast.custom(() => <CustomToast message={message} type="success" />);
        },
        onError: (error: any) => {
          const errorMessage = typeof error === 'string' ? error : 'Failed to sync employees to Payroll';
          toast.custom(() => <CustomToast message={errorMessage} type="error" />);
        },
      }
    );
  };

  return (
    <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 mb-20 min-h-[80vh] flex flex-col'>
      <div className='flex p-4'>
        <Link
          data-testid='back-link'
          href='/manage'
          className='flex-none flex gap-3 items-center rounded-md px-2 py-1 hover:bg-gray-100'
        >
          <ArrowLeftIcon className='h-5 w-5 text-gray-700' />
          <h4 className='text-gray-700'>Manage</h4>
        </Link>
      </div>

      <div className='px-2 md:px-8 lg:px-4'>
        <h2 className='text-xl font-bold text-indigo-dye'>Employee 201 Records</h2>
      </div>

      {/* actions */}
      <div className='mt-6 px-2 md:px-8 lg:px-4 flex items-center gap-3'>
        <SearchBar value={q} onChange={setQ} />

        <div className='relative flex items-center gap-2' ref={filterRef}>
          <FilterPopover
            open={showFilter}
            onOpenChange={setShowFilter}
            initial={{
              location: query.location,
              department: query.department,
              position: query.position,
              recordStatus: query.recordStatus,
              isActive: query.isActive,
            }}
            onApply={(vals) => {
              // triggers API + resets to page 1 inside the hook
              applyFilters(vals);
            }}
          />
          
          {['yahshua-payroll', 'yg-payroll'].includes(loginType) && (
          <button
            className='px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
            onClick={() => {
              handleBulkSyncToYP();
            }}
            disabled={isBulkSyncToYPLoading}
          >
            {isBulkSyncToYPLoading && <ArrowPathIcon className='w-4 h-4 animate-spin' />}
              <span>Sync to YP</span>
            </button>
          )}
        </div>
      </div>

      {/* content */}
      <div className='px-2 md:px-8 lg:px-4 mt-6 flex-1'>
        {isLoading ? (
          <SkeletonGrid />
        ) : error ? (
          <div className='rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 text-sm'>
            Failed to load employees.{' '}
            <button className='underline' onClick={() => refetch()}>
              Retry
            </button>
          </div>
        ) : (
          <EmployeeGrid locked={!hasActiveSubscription} employees={data ?? []} />
        )}
        {!isLoading && (data?.length ?? 0) === 0 && (
          <div className='mt-4 rounded-2xl border-2 border-dashed border-gray-300 min-h-[350px] flex flex-col items-center justify-center gap-4 bg-gray-50'>
            <span className='text-xl font-semibold text-gray-600'>No results</span>
            <p className='text-sm text-gray-400'>Try adjusting your filters or search.</p>
          </div>
        )}
      </div>

      {/* footer */}
      <div className='px-2 md:px-8 lg:px-4 mt-8 mb-0 md:sticky md:bottom-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t'>
        <Pagination
          pagination={{ totalPages: meta?.totalPages ?? 1, totalRecords: meta?.total ?? 0 }}
          currentPage={query.page}
          pageSize={query.pageSize}
          onPageSizeChange={(n: number) => setPageSize(n)}
          onPageChange={({ selected }) => setPage(selected + 1)}
          pageType='employee201'
        />
      </div>
    </div>
  );
}
