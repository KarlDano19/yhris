import { Dispatch, Fragment, useEffect, useState, useRef, useCallback } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

export default function ImportModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: Dispatch<boolean> }) {
  const cancelButtonRef = useRef(null);
  const importHeaders = {};
  const [importJSON, setImportJSON] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxSize: 10 * 1024 * 1024,
  });

  const customCloseModal = () => {
    setIsOpen(false);
    setFile(null);
  };

  const handleUpload = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results: any) => {
          if (results.data) {
            for (const [key, value] of Object.entries(results.data)) {
              console.log(`${key}: ${value}`);
            }
            setImportJSON(results.data);
          }
        },
      });
    }
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
                    <p className='text-xl text-gray-600 font-bold'>Import Employees</p>
                  </div>
                  {importJSON.length > 0 ? (
                    <>
                      <div>
                        <table className='w-full'>
                          <thead>
                            <tr>
                              <th>Name</th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                      <div></div>
                    </>
                  ) : (
                    <>
                      <div
                        {...getRootProps()}
                        className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 cursor-pointer'
                      >
                        <input {...getInputProps()} />
                        <div className='text-center'>
                          <svg
                            className='mx-auto h-12 w-12 text-gray-300'
                            viewBox='0 0 24 24'
                            fill='currentColor'
                            aria-hidden='true'
                          >
                            <path
                              fillRule='evenodd'
                              d='M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z'
                              clipRule='evenodd'
                            />
                          </svg>
                          <div className='mt-4 flex text-sm leading-6 text-gray-600'>
                            <span className='relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500'>
                              Upload a file
                            </span>
                            <p className='pl-1'>or drag and drop</p>
                          </div>
                          <p className='text-xs leading-5 text-gray-600'>{file ? file.name : 'CSV up to 10MB'}</p>
                        </div>
                      </div>
                      <button
                        className='rounded-md border border-transparent px-20 py-2 mt-6 bg-blue-600 text-base font-bold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        onClick={handleUpload}
                        disabled={!file}
                      >
                        Upload
                      </button>
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
