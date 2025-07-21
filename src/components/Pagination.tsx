import React from 'react';

import ReactPaginate from 'react-paginate';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface PaginationProps {
  pagination: {
    totalPages: number;
    totalRecords: number;
  };
  currentPage: number;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
  onPageChange: (selectedItem: { selected: number }) => void;
  pageType?: string;
}

// Reusable component for Records per page select
interface RecordsPerPageSelectProps {
  pageSize: number;
  onPageSizeChange: (value: number) => void;
  pageSizes: number[];
  selectId?: string;
  className?: string;
}

const RecordsPerPageSelect: React.FC<RecordsPerPageSelectProps> = ({ pageSize, onPageSizeChange, pageSizes, selectId = 'role', className = '' }) => (
  <div className={`flex items-center ${className}`}>
    <p className='text-sm text-gray-500 mx-2'>Records per page</p>
    <select
      id={selectId}
      className='w-14 mx-2 p-1 rounded-md border-0 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm'
      onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
      defaultValue={pageSize}
      placeholder='Select...'
    >
      {pageSizes.map((item: number, index: number) => {
        return <option key={index} value={item}>{item}</option>;
      })}
    </select>
  </div>
);

const Pagination: React.FC<PaginationProps> = ({ pagination, currentPage, pageSize, onPageSizeChange, onPageChange, pageType }) => {

  const pageSizesToUse = () => {
    let pageSizes = [5, 10, 25, 50];
    if (pageType && ['screenApplicant', 'hiredApplicant'].includes(pageType)) {
      pageSizes = [6, 12, 24];
    }
    return pageSizes;
  }

  const pageSizes = pageSizesToUse();

  return (
    <div className='my-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
      {/* Row 1: Total Records (left on all screens), Records per page (right on mobile, grouped with pagination on desktop) */}
      <div className="flex flex-row justify-between items-center w-full sm:w-auto">
        <p className='text-sm text-gray-500'>{'Total Record/s: '}{pagination.totalRecords}</p>
        {/* Records per page: visible on mobile only */}
        <div className='sm:hidden'>
          <RecordsPerPageSelect
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            pageSizes={pageSizes}
            selectId='role-mobile'
          />
        </div>
      </div>
      {/* Row 2: Pagination controls (mobile: full width, desktop: grouped with records per page) */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-end sm:w-auto gap-2">
        {/* Records per page: visible on desktop only */}
        <div className='hidden sm:flex'>
          <RecordsPerPageSelect
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            pageSizes={pageSizes}
            selectId='role-desktop'
          />
        </div>
        <ReactPaginate
          breakLabel='...'
          nextLabel={<ChevronRightIcon className='h-5 w-5' />}
          onPageChange={onPageChange}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={pagination.totalPages}
          forcePage={currentPage - 1}
          previousLabel={<ChevronLeftIcon className='h-5 w-5' />}
          renderOnZeroPageCount={null}
          containerClassName='grid grid-flow-col auto-cols-max text-sm text-gray-500 items-center justify-center sm:justify-start w-full sm:w-auto'
          pageClassName='border rounded py-1 mx-[1px]'
          previousClassName='mx-2'
          nextClassName='mx-2'
          pageLinkClassName='px-2 py-1'
          previousLinkClassName='h-full w-full'
          nextLinkClassName=''
          activeClassName='bg-gray-300'
        />
      </div>
    </div>
  );
};

export default Pagination;
