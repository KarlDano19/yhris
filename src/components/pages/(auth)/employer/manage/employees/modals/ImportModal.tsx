import { Dispatch, Fragment, useEffect, useState, useRef, useCallback } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import classNames from '@/helpers/classNames';
import useAddImportEmployeeItems from '../hooks/useAddImportEmployeeItems';

export default function ImportModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const cancelButtonRef = useRef(null);
  const allowHeaders: any = {
    'Date Hired (mm/dd/yyyy)*': 'date_hired',
    'First Name *': 'firstname',
    'Middle Name': 'middlename',
    'Last Name *': 'lastname',
    'Contact Number': 'mobile',
    Email: 'email',
    Gender: 'gender',
    Address: 'address',
  };
  const importHeaders = {
    date_hired: 'Date Hired',
    firstname: 'First Name',
    middlename: 'Middle Name',
    lastname: 'Last Name',
    mobile: 'Contact Number',
    email: 'Email',
    address: 'Address',
    gender: 'Gender',
  };
  const [importJSON, setImportJSON] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const { mutate: addImportEmployeeItems, isLoading: isLoadingAddImportEmployeeItems } = useAddImportEmployeeItems();
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

  const handleReset = () => {
    setImportJSON([]);
  };

  const handleUpload = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results: any) => {
          if (results.data) {
            const importData = [];
            for (const item of results.data) {
              if (Object.keys(item).length <= Object.keys(importHeaders).length) {
                continue;
              }

              const importItem: any = {};
              for (const [key, value] of Object.entries(item)) {
                const allowKey = allowHeaders[key];
                if (allowKey) {
                  importItem[allowKey] = value;
                }
              }
              importData.push(importItem);
            }
            setImportJSON(importData);
          }
        },
      });
    }
  };

  const onSubmit = () => {
    const displayedErrors = new Set<string>(); // To track displayed error messages

    // Check for required headers
    importJSON.forEach((item: any) => {
      if (!item.date_hired && !displayedErrors.has('Date Hired is required')) {
        toast.custom(() => <CustomToast message='Date Hired is required' type='error' />, {
          duration: 7000,
        });
        displayedErrors.add('Date Hired is required');
      }
      if (!item.firstname && !displayedErrors.has('First Name is required')) {
        toast.custom(() => <CustomToast message='First Name is required' type='error' />, {
          duration: 7000,
        });
        displayedErrors.add('First Name is required');
      }
      if (!item.lastname && !displayedErrors.has('Last Name is required')) {
        toast.custom(() => <CustomToast message='Last Name is required' type='error' />, {
          duration: 7000,
        });
        displayedErrors.add('Last Name is required');
      }
      if (!item.mobile && !displayedErrors.has('Contact Number is required')) {
        toast.custom(() => <CustomToast message='Contact Number is required' type='error' />, {
          duration: 7000,
        });
        displayedErrors.add('Contact Number is required');
      }
      if (!item.email && !displayedErrors.has('Email is required')) {
        toast.custom(() => <CustomToast message='Email is required' type='error' />, {
          duration: 7000,
        });
        displayedErrors.add('Email is required');
      }
      if (!item.address && !displayedErrors.has('Address is required')) {
        toast.custom(() => <CustomToast message='Address is required' type='error' />, {
          duration: 7000,
        });
        displayedErrors.add('Address is required');
      }
    });

    // Check if any errors were shown
    const hasErrors = displayedErrors.size > 0;

    if (hasErrors) {
      return; // Prevent submission if there are any errors
    }

    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, {
          duration: 5000,
        });
        refetch();
        customCloseModal();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    importJSON.forEach((item: any) => {
      const date = new Date(item.date_hired);
      if (!isNaN(date.getTime())) {
        item.date_hired = date.toISOString().split('T')[0];
      } else {
        console.error(`Invalid date for item: ${JSON.stringify(item)}`);
        item.date_hired = null;
      }
    });
    const data = {
      employees: importJSON,
    };
    addImportEmployeeItems(data, callbackReq);
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
              <Dialog.Panel
                className={classNames(
                  'relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8',
                  importJSON.length > 0 ? 'sm:w-full sm:max-w-7xl' : 'w-[500px]'
                )}
              >
                <div className='text-center px-8 pt-10 pb-7'>
                  <div className='text-xl pb-6'>
                    <p className='text-xl text-gray-600 font-bold'>Import Employees</p>
                  </div>
                  {importJSON.length > 0 ? (
                    <>
                      <div>
                        <table className='min-w-full divide-y divide-gray-300 text-center'>
                          <thead>
                            <tr>
                              <th className='px-3 py-3.5 text-sm font-semibold text-gray-900'>#</th>
                              {Object.values(importHeaders).map((header: string) => (
                                <th key={header} className='px-3 py-3.5 text-sm font-semibold text-gray-900'>
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className='divide-y divide-gray-200'>
                            {importJSON.map((item: any, index: number) => (
                              <tr key={index}>
                                <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>{index + 1}</td>
                                {Object.keys(importHeaders).map((header: string) => (
                                  <td key={header} className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                                    {item[header]}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className='flex justify-center gap-4'>
                        <button
                          className='rounded-md border border-transparent px-20 py-2 mt-6 bg-stone-200 text-base font-bold text-white shadow-sm hover:bg-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2'
                          onClick={customCloseModal}
                        >
                          CANCEL
                        </button>
                        <button
                          className='rounded-md border border-transparent px-20 py-2 mt-6 bg-red-600 text-base font-bold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                          onClick={handleReset}
                        >
                          RESET
                        </button>
                        <button
                          className='rounded-md border border-transparent px-20 py-2 mt-6 bg-blue-600 text-base font-bold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                          disabled={isLoadingAddImportEmployeeItems}
                          onClick={onSubmit}
                        >
                          {isLoadingAddImportEmployeeItems && (
                            <div role='status'>
                              <svg
                                aria-hidden='true'
                                className='inline w-6 h-6 mr-2 text-gray-200 animate-spin fill-blue-600'
                                viewBox='0 0 100 101'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                  fill='currentColor'
                                />
                                <path
                                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                  fill='currentFill'
                                />
                              </svg>
                              <span className='sr-only'>Loading...</span>
                            </div>
                          )}
                          {!isLoadingAddImportEmployeeItems && 'SUBMIT'}
                        </button>
                      </div>
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
                        UPLOAD
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
