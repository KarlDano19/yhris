import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useGetEmployeeDetails from '../hooks/useGetEmployeeDetails';
import useEditEmployeeDetails from '../hooks/useEditEmployeeDetails';

import { XCircleIcon } from '@heroicons/react/24/solid';
import DropDownArrow from '@/svg/DropDownArrow';

type T_ModalData = {
  id: number;
  open: boolean;
};

export default function EditEmployeeDetailsModal({
  refetch,
  isOpen,
  setIsOpen,
  locationItems,
  departmentItems,
  positionItems,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
  locationItems: any[];
  departmentItems: any[];
  positionItems: any[];
}) {
  const cancelButtonRef = useRef(null);
  const {
    data: employeeDetailsData,
    refetch: refetchEmployeeDetails,
    remove: removeEmployeeDetails,
  } = useGetEmployeeDetails(isOpen.id);
  const { register, handleSubmit, reset, control, setValue } = useForm();
  const { mutate, isLoading: isLoadingEditEmployeeDetails } = useEditEmployeeDetails();

  useEffect(() => {
    if (isOpen) {
      refetchEmployeeDetails();
    }
  }, [isOpen]);

  useEffect(() => {
    if (employeeDetailsData) {
      setValue('firstname', employeeDetailsData.firstname);
      setValue('middlename', employeeDetailsData.middlename);
      setValue('lastname', employeeDetailsData.lastname);
      setValue('email', employeeDetailsData.email);
      setValue('mobile', employeeDetailsData.mobile);
      setValue('address', employeeDetailsData.address);
      setValue('nationality', employeeDetailsData.nationality);
      setValue('religion', employeeDetailsData.religion);
      setValue('gender', employeeDetailsData.gender);
      setValue('location', employeeDetailsData.location);
      
      // Find department ID from department name
      if (employeeDetailsData.department && departmentItems) {
        const departmentItem = departmentItems.find((item: any) => item.name === employeeDetailsData.department);
        setValue('department', departmentItem ? departmentItem.id : '');
      } else {
        setValue('department', '');
      }

      // Find position ID from position name - FIX: Use position_name instead of position
      if (employeeDetailsData.position_name && positionItems) {
        const positionItem = positionItems.find((item: any) => item.name === employeeDetailsData.position_name);
        setValue('position', positionItem ? positionItem.id : '');
      } else {
        setValue('position', '');
      }
    }
  }, [employeeDetailsData, departmentItems, positionItems]);

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, {
          duration: 5000,
        });
        customCloseModal();
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate({ employee_id: isOpen.id, data: data }, callbackReq);
  });

  const customCloseModal = () => {
    reset();
    removeEmployeeDetails();
    setIsOpen(null);
  };

  return (
    <>
      <Transition.Root show={isOpen ? true : false} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => customCloseModal()}>
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all w-full mx-4 sm:my-8 sm:mx-8 sm:max-w-7xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>
                      Employee - {employeeDetailsData?.firstname} {employeeDetailsData?.lastname}
                    </h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                  </div>
                  <div className='mx-4 md:mx-6 my-4'>
                    <form onSubmit={onSubmit}>
                      <div className='px-2 sm:px-4 pt-4 pb-6'>
                        <div className={`hidden rounded-md bg-red-50 p-4 mb-3`}>
                          <div className='flex'>
                            <div className='flex-shrink-0'>
                              <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
                            </div>
                            <div className='ml-3'>
                              <h3 className='text-sm font-medium text-red-800'>
                                You cannot proceed due to incomplete fields. Please review.
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className='grid lg:grid-cols-7 gap-x-8 mt-7'>
                          <div className='lg:col-span-1'>
                            <div
                              className='bg-gray-300 h-40 w-1/2 md:w-44 lg:w-full rounded-md mx-auto lg:mx-0 flex items-center justify-center'
                              style={{
                                backgroundImage: `url(${employeeDetailsData?.photo})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              }}
                            ></div>
                          </div>
                          <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5'>
                            <div className='grid-item'>
                              <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                                First Name
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='mt-2'>
                                <input
                                  id='firstname'
                                  {...register('firstname', { required: true })}
                                  type='text'
                                  className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                                />
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                                Middle Name
                              </label>
                              <div className='mt-2'>
                                <input
                                  id='middlename'
                                  {...register('middlename')}
                                  type='text'
                                  className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                                />
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                                Last Name
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='mt-2'>
                                <input
                                  id='lastname'
                                  {...register('lastname', { required: true })}
                                  type='text'
                                  className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                                />
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                                Email Address
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='mt-2'>
                                <input
                                  id='email'
                                  {...register('email', { required: true })}
                                  type='text'
                                  className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                                />
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                                Mobile No.
                              </label>
                              <div className='mt-2'>
                                <input
                                  id='mobile'
                                  {...register('mobile')}
                                  type='text'
                                  className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                                />
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                                Address
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='mt-2'>
                                <input
                                  id='address'
                                  {...register('address', { required: true })}
                                  type='text'
                                  className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-4'>
                          <div>
                            <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                              Nationality
                              <span className='text-red-600'>*</span>
                            </label>
                            <div className='mt-2'>
                              <input
                                id='nationality'
                                {...register('nationality', { required: true })}
                                type='text'
                                className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor='gender' className='text-sm font-medium leading-6 text-gray-900'>
                              Gender<span className='text-red-500'>*</span>
                            </label>
                            <div className='relative mt-2'>
                              <select
                                id='gender'
                                {...register('gender', { required: true })}
                                className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 disabled:bg-stone-50 disabled:text-opacity-100'
                              >
                                <option value="">Select Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                              </select>
                              <div className='absolute right-3 top-[14px]'>
                                <DropDownArrow />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                              Religion
                              <span className='text-red-600'>*</span>
                            </label>
                            <div className='mt-2'>
                              <input
                                id='religion'
                                {...register('religion', { required: true })}
                                type='text'
                                className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                              />
                            </div>
                          </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-4'>
                          <div>
                            <label htmlFor='location' className='text-sm font-medium leading-6 text-gray-900'>
                              Location<span className='text-red-500'>*</span>
                            </label>
                            <div className='relative mt-2'>
                              <select
                                id='location'
                                {...register('location', { required: true })}
                                className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 disabled:bg-stone-50 disabled:text-opacity-100'
                              > 
                                <option value="">Select Location</option>
                                {locationItems && locationItems.map((item: any) => (
                                  <option key={item.id} value={item.name}>{item.name}</option>
                                ))}
                              </select>
                              <div className='absolute right-3 top-[14px]'>
                                <DropDownArrow />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label htmlFor='position' className='text-sm font-medium leading-6 text-gray-900'>
                              Position<span className='text-red-500'>*</span>
                            </label>
                            <div className='relative mt-2'>
                              <select
                                id='position'
                                {...register('position', { required: true })}
                                className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 disabled:bg-stone-50 disabled:text-opacity-100'
                              >
                                <option value="">Select Position</option>
                                {positionItems && positionItems.map((item: any) => (
                                  <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                              </select>
                              <div className='absolute right-3 top-[14px]'>
                                <DropDownArrow />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label htmlFor='department' className='text-sm font-medium leading-6 text-gray-900'>
                              Department<span className='text-red-500'>*</span>
                            </label>
                            <div className='relative mt-2'>
                              <select
                                id='department'
                                {...register('department', { required: true })}
                                className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 disabled:bg-stone-50 disabled:text-opacity-100'
                              >
                                <option value="">Select Department</option>
                                {departmentItems && departmentItems.map((item: any) => (
                                  <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                              </select>
                              <div className='absolute right-3 top-[14px]'>
                                <DropDownArrow />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className='mt-5 sm:mt-4 flex flex-col-reverse sm:flex-row-reverse gap-3 px-2 sm:px-4'>
                        <button
                          type='submit'
                          className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                          disabled={isLoadingEditEmployeeDetails}
                        >
                          {isLoadingEditEmployeeDetails && (
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
                          {!isLoadingEditEmployeeDetails && 'Save'}
                        </button>
                        <button
                          type='button'
                          className='inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:w-auto'
                          onClick={() => customCloseModal()}
                          ref={cancelButtonRef}
                        >
                          Close
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
