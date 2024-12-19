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
  isScreenApplicant?: boolean;
}

const pageSizes = [5, 10, 25, 50];
const pageSizesScreenApplicant = [6, 12, 24];

const Pagination: React.FC<PaginationProps> = ({ pagination, currentPage, pageSize, onPageSizeChange, onPageChange, isScreenApplicant }) => {
  const pageSizesToUse = isScreenApplicant ? pageSizesScreenApplicant : pageSizes;
  
  return (
    <div className='flex items-center justify-between my-3'>
      <p className='text-sm text-gray-500'>Total Record/s: {pagination.totalRecords}</p>
      <div className='flex items-center'>
        <p className='text-sm text-gray-500 mx-2'>Records per page</p>
        <select
          id='role'
          className='w-20 mx-2 p-1 rounded-md border-0 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black text-sm'
          onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
          defaultValue={pageSize}
          placeholder='Select...'
        >
          {pageSizesToUse.map((item: number, index: number) => {
            return <option key={index} value={item}>{item}</option>;
          })}
        </select>
        <ReactPaginate
          breakLabel='...'
          nextLabel={<ChevronRightIcon className='h-5 w-5' />}
          onPageChange={onPageChange}
          pageRangeDisplayed={3}
          pageCount={pagination.totalPages}
          forcePage={currentPage - 1}
          previousLabel={<ChevronLeftIcon className='h-5 w-5' />}
          renderOnZeroPageCount={null}
          containerClassName='grid grid-flow-col auto-cols-max text-sm text-gray-500 items-center'
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
