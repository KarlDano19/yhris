'use client';

import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

import useGetExportClientItems from '../client-monitoring/hooks/useGetExportClientItems';

type T_ExportFormat = 'csv' | 'pdf';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  format: T_ExportFormat;
};

const LABEL: Record<T_ExportFormat, string> = {
  csv: 'CSV',
  pdf: 'PDF',
};

const ExportClientProgressModal = ({ isOpen, setIsOpen, format }: Props) => {
  const cancelButtonRef = useRef(null);
  const [progress, setProgress] = useState(3);
  const [downloadUrl, setDownloadUrl] = useState('');

  const {
    data: exportData,
    isLoading: isExportLoading,
    refetch: exportRefetch,
    remove: exportRemove,
  } = useGetExportClientItems(format);

  useEffect(() => {
    exportRefetch();
  }, []);

  // Animate progress bar while backend generates the file
  useEffect(() => {
    if (isExportLoading) {
      const interval = setInterval(() => {
        const increment = Math.floor(Math.random() * 5) + 1;
        setProgress((prev) => (prev < 95 ? prev + increment : prev));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isExportLoading]);

  // Set download URL when backend responds
  useEffect(() => {
    if (exportData) {
      setProgress(100);
      setDownloadUrl(exportData);
    }
  }, [exportData]);

  const handleClose = () => {
    setIsOpen(false);
    exportRemove();
    setProgress(3);
    setDownloadUrl('');
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={handleClose}
      >
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </TransitionChild>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <DialogPanel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-[500px]'>
                <div className='text-center px-8 pt-10 pb-7'>
                  <p className='text-xl text-gray-600 font-bold pb-6'>
                    Exporting as {LABEL[format]}, please wait...
                  </p>
                  <div className='w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700'>
                    <div
                      className='h-6 bg-[#FFC107] font-medium text-blue-100 text-center p-0.5 leading-none rounded-full transition-all ease-in'
                      style={{ width: `${progress}%` }}
                    >
                      {progress}%
                    </div>
                  </div>
                  <button
                    ref={cancelButtonRef}
                    className='rounded-md border border-transparent px-20 py-2 mt-6 bg-blue-600 text-base font-bold text-white shadow-sm enabled:hover:bg-gray-500 disabled:opacity-50'
                    onClick={() => window.open(downloadUrl)}
                    disabled={!downloadUrl}
                  >
                    Download
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ExportClientProgressModal;
