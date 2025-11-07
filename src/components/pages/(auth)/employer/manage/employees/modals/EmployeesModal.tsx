import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';

import useGetEmployeeDetails from '../hooks/useGetEmployeeDetails';

import { XCircleIcon } from '@heroicons/react/24/solid';
import DropDownArrow from '@/svg/DropDownArrow';

export default function EmployeesModal({
  selectedEmployeeId,
  isOpen,
  setIsOpen,
}: {
  selectedEmployeeId: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const cancelButtonRef = useRef(null);
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const { register, setValue, handleSubmit } = useForm();
  const { data: dataEmployeeDetail, remove: employeeDetailRemove } = useGetEmployeeDetails(selectedEmployeeId);

  useEffect(() => {
    if (dataEmployeeDetail) {
      setValue('firstName', dataEmployeeDetail?.firstname);
      setValue('middleName', dataEmployeeDetail?.middlename);
      setValue('lastName', dataEmployeeDetail?.lastname);
      setValue('email', dataEmployeeDetail?.email);
      setValue('mobileNo', dataEmployeeDetail?.mobile);
      setValue('address', dataEmployeeDetail?.address);
      setValue('nationality', dataEmployeeDetail?.nationality);
      setValue('religion', dataEmployeeDetail?.religion);
      setValue('portfolio', dataEmployeeDetail?.portfolio_url);
    }
  }, [dataEmployeeDetail]);

  const customCloseModal = () => {
    employeeDetailRemove();
    setIsOpen(false);
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:mx-8 sm:w-full sm:max-w-7xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>
                      Employee - {dataEmployeeDetail?.firstname} {dataEmployeeDetail?.lastname}
                    </h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                  </div>
                  <div className='md:mx-6 my-4'>
                    <form>
                      <div>
                        <h5 className='text-xl font-semibold'>Profile</h5>
                        <div className='grid lg:grid-cols-7 gap-x-8 mt-7'>
                          <div className='lg:col-span-1'>
                            <div
                              className='bg-gray-300 h-40 w-1/2 md:w-44 lg:w-full rounded-md mx-auto lg:mx-0 flex items-center justify-center'
                              style={{
                                backgroundImage: `url(${dataEmployeeDetail?.photo})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              }}
                            ></div>
                          </div>
                          <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5'>
                            <div className='grid-item'>
                              <label htmlFor='first-name' className='text-sm font-medium leading-6 text-gray-900'>
                                First Name<span className='text-red-500'>*</span>
                              </label>
                              <div className='mt-2'>
                                <input
                                  type='text'
                                  {...register('firstName', { required: !isDisable })}
                                  id='first-name'
                                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                  disabled={isDisable}
                                />
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label htmlFor='middle-name' className='text-sm font-medium leading-6 text-gray-900'>
                                Middle Name
                              </label>
                              <div className='mt-2'>
                                <input
                                  type='text'
                                  {...register('middleName')}
                                  id='middle-name'
                                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                  disabled={isDisable}
                                />
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label htmlFor='last-name' className='text-sm font-medium leading-6 text-gray-900'>
                                Last Name<span className='text-red-500'>*</span>
                              </label>
                              <div className='mt-2'>
                                <input
                                  type='text'
                                  {...register('lastName', { required: !isDisable })}
                                  id='last-name'
                                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                  disabled={isDisable}
                                />
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label htmlFor='email' className='text-sm font-medium leading-6 text-gray-900'>
                                Email Address<span className='text-red-500'>*</span>
                              </label>
                              <div className='mt-2'>
                                <input
                                  type='email'
                                  {...register('email', { required: !isDisable })}
                                  id='email'
                                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                  disabled={isDisable}
                                />
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label htmlFor='mobile-no' className='text-sm font-medium leading-6 text-gray-900'>
                                Mobile No.<span className='text-red-500'>*</span>
                              </label>
                              <div className='mt-2'>
                                <input
                                  type='tel'
                                  {...register('mobileNo', { required: !isDisable })}
                                  id='mobile-no'
                                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                  disabled={isDisable}
                                />
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label htmlFor='address' className='text-sm font-medium leading-6 text-gray-900'>
                                Address<span className='text-red-500'>*</span>
                              </label>
                              <div className='mt-2'>
                                <input
                                  type='text'
                                  {...register('address', { required: !isDisable })}
                                  id='address'
                                  className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                  disabled={isDisable}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 mt-11'>
                          <div className='grid-item'>
                            <label htmlFor='nationality' className='text-sm font-medium leading-6 text-gray-900'>
                              Nationality
                            </label>
                            <div className='mt-2'>
                              <input
                                type='text'
                                {...register('nationality')}
                                id='nationality'
                                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                disabled={isDisable}
                              />
                            </div>
                          </div>
                          <div className='grid-item'>
                            <label htmlFor='gender' className='text-sm font-medium leading-6 text-gray-900'>
                              Gender<span className='text-red-500'>*</span>
                            </label>
                            <div className='relative mt-2'>
                              <select
                                id='gender'
                                {...register('gender', { required: !isDisable })}
                                className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 disabled:bg-stone-50 disabled:text-opacity-100'
                                defaultValue='Male'
                                disabled={isDisable}
                              >
                                <option>Male</option>
                                <option>Female</option>
                              </select>
                              <div className='absolute right-3 top-[14px]'>
                                <DropDownArrow />
                              </div>
                            </div>
                          </div>
                          <div className='grid-item'>
                            <label htmlFor='religion' className='text-sm font-medium leading-6 text-gray-900'>
                              Religion
                            </label>
                            <div className='mt-2'>
                              <input
                                type='text'
                                {...register('religion')}
                                id='religion'
                                className='rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                                disabled={isDisable}
                              />
                            </div>
                          </div>
                        </div>
                        {/* <div className='flex justify-end'>
                          <button
                            type='submit'
                            className='w-full md:w-auto mt-10 md:mt-12 mb-7 rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                          >
                            NEXT
                          </button>
                        </div> */}
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
