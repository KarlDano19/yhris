import { Dispatch, Fragment, useEffect, useState, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import useGetExportEmployeeItems from '../hooks/useGetExportEmployeeItems';

export default function ExportProgressModal({
  isOpen,
  setIsOpen,
  itemsFilter,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  itemsFilter: any;
}) {
  const cancelButtonRef = useRef(null);
  const [progress, setProgress] = useState<number>(3);
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  const {
    data: exportEmployeeListData,
    isLoading: isExportEmployeeListLoading,
    refetch: exportEmployeeListRefetch,
    remove: exportEmployeeListRemove,
  } = useGetExportEmployeeItems(itemsFilter);

  useEffect(() => {
    exportEmployeeListRefetch();
  }, []);

  useEffect(() => {
    if (isExportEmployeeListLoading) {
      const interval = setInterval(() => {
        const increment = Math.floor(Math.random() * 5) + 1;
        setProgress((prevProgress) => (prevProgress < 95 ? prevProgress + increment : prevProgress));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isExportEmployeeListLoading]);

  useEffect(() => {
    if (exportEmployeeListData) {
      setProgress(100);
      setDownloadUrl(exportEmployeeListData);
    }
  }, [exportEmployeeListData]);

  const customCloseModal = () => {
    setIsOpen(false);
    exportEmployeeListRemove();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={customCloseModal}>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-[500px]'>
                <div className='text-center px-8 pt-10 pb-7'>
                  <div className='text-xl pb-6'>
                    <p className='text-xl text-gray-600 font-bold'>Exporting Employees, please wait...</p>
                  </div>
                  <div className='w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700'>
                    <div
                      className='h-6 bg-[#FFC107] font-medium text-blue-100 text-center p-0.5 leading-none rounded-full transition-all ease-in'
                      style={{ width: `${progress}%` }}
                    >
                      {progress}%
                    </div>
                  </div>
                  <button
                    className='rounded-md border border-transparent px-20 py-2 mt-6 bg-blue-600 text-base font-bold text-white shadow-sm enabled:hover:bg-gray-500 disabled:opacity-50'
                    onClick={() => window.open(downloadUrl)}
                    disabled={!!!downloadUrl}
                  >
                    Download
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
