import { Dispatch, Fragment, useRef, useState, useMemo } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';

import { XCircleIcon } from '@heroicons/react/24/solid';
import CustomToast from '@/components/CustomToast';

import useAddLocation from '../hooks/location/useAddLocation';
import useAddDepartment from '../hooks/department/useAddDepartment';
import useAddPosition from '../hooks/position/useAddPosition';
import useAddEmployeeStatus from '../hooks/employee-status/useAddEmployeeStatus';

import { QUILL_FORMATS, QUILL_MODULES } from '@/helpers/constants';
import 'react-quill/dist/quill.snow.css';

export default function CreateLocationModal({
  module,
  isOpen,
  setIsOpen,
  refetch,
  hideDescription = false,
}: {
  module: string;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  refetch: any;
  hideDescription?: boolean;
}) {
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, reset, control } = useForm();
  const [description, setDescription] = useState('');
  const { mutate: addLocation, isLoading: isLoadingAddLocation } = useAddLocation();
  const { mutate: addDepartment, isLoading: isLoadingAddDepartment } = useAddDepartment();
  const { mutate: addPosition, isLoading: isLoadingAddPosition } = useAddPosition();
  const { mutate: addEmployeeStatus, isLoading: isLoadingAddEmployeeStatus } = useAddEmployeeStatus();

  // Dynamic import for React Quill
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    [isOpen]
  );

  const onSubmit = handleSubmit((data) => {
    // Add description to data if it's a position
    const submitData = module === 'position' ? { ...data, description } : data;
    
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, {
          duration: 5000,
        });
        setIsOpen(false);
        reset();
        setDescription('');
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    if (module === 'location') {
      addLocation(submitData, callbackReq);
    } else if (module === 'department') {
      addDepartment(submitData, callbackReq);
    } else if (module === 'position') {
      addPosition(submitData, callbackReq);
    } else if (module === 'employee-status') {
      addEmployeeStatus(submitData, callbackReq);
    }
  });

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => setIsOpen(false)}>
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
              <Dialog.Panel className={`relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 ${module === 'position' ? 'w-[750px]' : 'w-[500px]'}`}>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Create {module}</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                <form onSubmit={onSubmit}>      
                  <div className='px-4 pt-4 pb-6'>
                    <label htmlFor='name' className='block text-sm font-medium leading-6 text-gray-900'>
                      Name<span className='text-red-600'> *</span>
                    </label>
                    <input
                      id='name'
                      type='text'
                      {...register('name', { required: true })}
                      className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                    />
                  </div>
                  {module === 'position' && !hideDescription && (
                    <div className='px-4 pb-6'>
                      <label htmlFor='description' className='block text-sm font-medium leading-6 text-gray-900 mb-2'>
                        Description
                      </label>
                      <div className='h-48'>
                        <ReactQuill
                          value={description}
                          onChange={setDescription}
                          formats={QUILL_FORMATS}
                          modules={QUILL_MODULES}
                          style={{ height: "100%", padding: "5px 8px !important" }}
                          placeholder='Enter position description, responsibilities, and requirements...'
                        />
                      </div>
                    </div>
                  )}
                  <div className='flex justify-center w-full px-4 space-x-8 pt-10 pb-7'>
                    <span className='mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto'>
                      <button
                        type='button'
                        className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-blue-600 px-20 py-2 bg-white text-base leading-6 font-bold text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </button>
                    </span>
                    <button
                      type='submit'
                      className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                      disabled={isLoadingAddLocation || isLoadingAddDepartment || isLoadingAddPosition || isLoadingAddEmployeeStatus}
                    >
                      {(isLoadingAddLocation || isLoadingAddDepartment || isLoadingAddPosition || isLoadingAddEmployeeStatus) && (
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
                      {!isLoadingAddLocation && !isLoadingAddDepartment && !isLoadingAddPosition && !isLoadingAddEmployeeStatus && 'Save'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}