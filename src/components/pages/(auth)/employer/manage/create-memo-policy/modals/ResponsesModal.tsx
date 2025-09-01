import React, { Dispatch, Fragment, useRef, useState, useEffect } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import ReactPaginate from 'react-paginate';

import useDirectiveReadStatus from '../hooks/useDirectiveReadStatus';

import { XCircleIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

import { ReadData } from '@/types/directives';

export default function EmployeeResponsesModal({
  isOpen,
  setIsOpen,
  memoTitle,
  directiveId,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  memoTitle?: any;
  directiveId?: number;
}) {
  const cancelButtonRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [noResponsePage, setNoResponsePage] = useState(1);
  const itemsPerPage = 5;

  // Use our custom hook to fetch read status
  const { 
    data: readStatus, 
    isLoading, 
    error,
    refetch 
  } = useDirectiveReadStatus(directiveId || 0, {
    enabled: isOpen && !!directiveId,
    // Query params can be added to the key for cache invalidation
    queryKey: ['directive-read-status', directiveId, { pageSize: 1000 }]
  });

  // Reset pagination when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setNoResponsePage(1);
      refetch();
    }
  }, [isOpen, refetch]);

  // Client-side pagination for responded employees
  const indexOfLastResponded = currentPage * itemsPerPage;
  const indexOfFirstResponded = indexOfLastResponded - itemsPerPage;
  const currentResponded = readStatus?.verified_reads?.slice(indexOfFirstResponded, indexOfLastResponded) || [];
  const totalRespondedPages = Math.ceil((readStatus?.verified_reads?.length || 0) / itemsPerPage);

  // Client-side pagination for no response employees
  const indexOfLastNoResponse = noResponsePage * itemsPerPage;
  const indexOfFirstNoResponse = indexOfLastNoResponse - itemsPerPage;
  const currentNoResponse = readStatus?.unresponded_emails?.slice(indexOfFirstNoResponse, indexOfLastNoResponse) || [];
  const totalNoResponsePages = Math.ceil((readStatus?.unresponded_emails?.length || 0) / itemsPerPage);

  // Handle page change for responded employees
  const handleRespondedPageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Handle page change for no response employees
  const handleNoResponsePageChange = (selectedItem: { selected: number }) => {
    setNoResponsePage(selectedItem.selected + 1);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl'>
                <div className='flex bg-[#355FD0] p-4 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold text-lg'>Employee Response/s</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                
                <div className='px-6 pt-6 pb-6'>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#355FD0]"></div>
                    </div>
                  ) : error ? (
                    <div className="text-red-500 text-center py-4">
                      Error loading response data. Please try again.
                    </div>
                  ) : (
                    <>
                      {/* Responded Employees */}
                      <div className='mb-8'>
                        <h5 className='text-md font-semibold mb-4 text-gray-700'>RESPONDED:</h5>
                        <div className='border-t border-b border-gray-200'>
                          <table className='min-w-full'>
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className='py-3 text-left text-sm font-medium text-gray-500 w-7/12 pl-4'>Email</th>
                                <th className='py-3 text-left text-sm font-medium text-gray-500 w-5/12'>Read At</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentResponded.length > 0 ? (
                                currentResponded.map((read: ReadData) => (
                                  <tr key={read.id} className="border-b border-gray-200">
                                    <td className='py-4 text-sm text-gray-900 pl-4'>{read.email}</td>
                                    <td className='py-4 text-sm text-gray-900' dangerouslySetInnerHTML={{ __html: read.read_at }}></td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={2} className='py-4 text-sm text-gray-500 text-center'>
                                    No responses yet
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                          <p className='text-sm text-gray-500'>Total Record/s: {readStatus?.responded_count || 0}</p>
                          <div className='flex items-center'>
                            <ReactPaginate
                              breakLabel='...'
                              nextLabel={<ChevronRightIcon className='h-5 w-5' />}
                              onPageChange={handleRespondedPageChange}
                              pageRangeDisplayed={1}
                              pageCount={totalRespondedPages}
                              forcePage={currentPage - 1}
                              previousLabel={<ChevronLeftIcon className='h-5 w-5' />}
                              renderOnZeroPageCount={null}
                              containerClassName='flex items-center text-sm text-gray-500'
                              pageClassName='mx-1'
                              previousClassName='mx-1'
                              nextClassName='mx-1'
                              activeClassName='text-[#355FD0] font-semibold'
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* No Response Employees */}
                      <div>
                        <h5 className='text-md font-semibold mb-4 text-gray-700'>NO RESPONSE:</h5>
                        <div className='border-t border-b border-gray-200'>
                          <table className='min-w-full'>
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className='py-3 text-left text-sm font-medium text-gray-500 w-7/12 pl-4'>Email</th>
                                <th className='py-3 text-left text-sm font-medium text-gray-500 w-5/12'>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentNoResponse.length > 0 ? (
                                currentNoResponse.map((email: string, index: number) => (
                                  <tr key={index} className="border-b border-gray-200">
                                    <td className='py-4 text-sm text-gray-900 pl-4'>{email}</td>
                                    <td className='py-4 text-sm text-gray-900'>
                                      <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'>
                                        Pending
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={2} className='py-4 text-sm text-gray-500 text-center'>
                                    No pending responses
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                          <p className='text-sm text-gray-500'>Total Record/s: {readStatus?.unresponded_count || 0}</p>
                          <div className='flex items-center'>
                            <ReactPaginate
                              breakLabel='...'
                              nextLabel={<ChevronRightIcon className='h-5 w-5' />}
                              onPageChange={handleNoResponsePageChange}
                              pageRangeDisplayed={1}
                              pageCount={totalNoResponsePages}
                              forcePage={noResponsePage - 1}
                              previousLabel={<ChevronLeftIcon className='h-5 w-5' />}
                              renderOnZeroPageCount={null}
                              containerClassName='flex items-center text-sm text-gray-500'
                              pageClassName='mx-1'
                              previousClassName='mx-1'
                              nextClassName='mx-1'
                              activeClassName='text-[#355FD0] font-semibold'
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 