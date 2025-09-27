import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useCreatePermission from '../hooks/useCreatePermission';
import useUpdatePermission from '../hooks/useUpdatePermission';
import useGetPermissionDetails from '../hooks/useGetPermissionDetails';
import useGetPermissionCategories from '../hooks/useGetPermissionCategories';

import { XCircleIcon } from '@heroicons/react/24/solid';
import SelectChevronDown from '@/svg/SelectChevronDown';

type T_ModalData = {
  id: number | null;
  open: boolean;
  mode: 'create' | 'edit';
};

export default function CreateEditPermissionModal({
  refetch, 
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm();
  const { data: permissionDetailsData, refetch: refetchPermissionDetails } = useGetPermissionDetails(isOpen.id);
  const { data: categoriesData } = useGetPermissionCategories();
  const { mutate: createPermission, isLoading: isLoadingCreatePermission } = useCreatePermission();
  const { mutate: updatePermission, isLoading: isLoadingUpdatePermission } = useUpdatePermission();

  const isEditing = isOpen.mode === 'edit';
  const isLoading = isLoadingCreatePermission || isLoadingUpdatePermission;

  useEffect(() => {
    if (isOpen.open && isEditing && isOpen.id) {
      refetchPermissionDetails();
    }
  }, [isOpen, refetchPermissionDetails, isEditing]);

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (responseData: any) => {
        toast.custom(() => <CustomToast message={responseData.message} type='success' />, {
          duration: 5000,
        });
        setIsOpen(null);
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };

    if (isEditing && isOpen.id) {
      updatePermission({ permission_id: isOpen.id, data: data }, callbackReq);
    } else {
      createPermission(data, callbackReq);
    }
  });

  useEffect(() => {
    if (permissionDetailsData && isEditing) {
      setValue('name', permissionDetailsData.name);
      setValue('display_name', permissionDetailsData.display_name);
      setValue('category', permissionDetailsData.category);
      setValue('description', permissionDetailsData.description);
    }
  }, [permissionDetailsData, setValue, isEditing]);

  const customCloseModal = () => {
    reset();
    setIsOpen(null);
  };

  return (
    <>
      <Transition.Root show={isOpen.open} as={Fragment}>
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:mx-8 sm:w-full sm:max-w-2xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>
                      {isEditing ? 'Edit Permission' : 'Create Permission'}
                    </h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                  </div>
                  <div className='md:mx-6 my-4'>
                    <form onSubmit={onSubmit}>
                      <div className='px-4 pt-4 pb-6'>
                        <div className={`${Object.keys(errors).length > 0 ? 'block' : 'hidden'} rounded-md bg-red-50 p-4 mb-3`}>
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

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
                          <div>
                            <label
                              htmlFor='name'
                              className='block text-sm font-medium leading-6 text-gray-900'
                            >
                              Permission Name (Code)
                              <span className='text-red-600'>*</span>
                            </label>
                            <div className='mt-2'>
                              <input
                                type='text'
                                id='name'
                                {...register('name', { required: 'Permission name is required' })}
                                className='block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
                                placeholder='e.g. create_employee'
                              />
                              <p className='text-xs text-gray-500 mt-1'>
                                Use lowercase with underscores (e.g., create_employee)
                              </p>
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor='display_name'
                              className='block text-sm font-medium leading-6 text-gray-900'
                            >
                              Display Name
                              <span className='text-red-600'>*</span>
                            </label>
                            <div className='mt-2'>
                              <input
                                type='text'
                                id='display_name'
                                {...register('display_name', { required: 'Display name is required' })}
                                className='block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
                                placeholder='e.g. Create Employee'
                              />
                              <p className='text-xs text-gray-500 mt-1'>
                                Human-readable name for this permission
                              </p>
                            </div>
                          </div>

                          <div className='md:col-span-2'>
                            <label
                              htmlFor='category'
                              className='block text-sm font-medium leading-6 text-gray-900'
                            >
                              Category
                              <span className='text-red-600'>*</span>
                            </label>
                            <div className='mt-2'>
                              <input
                                type='text'
                                id='category'
                                list='category-options'
                                {...register('category', { required: 'Category is required' })}
                                className='block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
                                placeholder='Enter or select category'
                              />
                              <datalist id='category-options'>
                                {categoriesData?.map((category: any) => (
                                  <option key={category} value={category} />
                                ))}
                                {/* Common default categories */}
                                <option value='Employee Management' />
                                <option value='Recruitment' />
                                <option value='Payroll' />
                                <option value='HR Operations' />
                                <option value='Settings' />
                                <option value='Reports' />
                                <option value='System' />
                              </datalist>
                              <p className='text-xs text-gray-500 mt-1'>
                                Type a new category or select from existing ones
                              </p>
                            </div>
                          </div>

                          <div className='md:col-span-2'>
                            <label
                              htmlFor='description'
                              className='block text-sm font-medium leading-6 text-gray-900'
                            >
                              Description
                            </label>
                            <div className='mt-2'>
                              <textarea
                                id='description'
                                rows={3}
                                {...register('description')}
                                className='block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
                                placeholder='Enter permission description (optional)'
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                        <button
                          type='submit'
                          className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                          disabled={isLoading}
                        >
                          {isLoading && (
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
                          {!isLoading && (isEditing ? 'Update' : 'Create')}
                        </button>
                        <button
                          type='button'
                          className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:mt-0 sm:w-auto'
                          onClick={() => customCloseModal()}
                          ref={cancelButtonRef}
                        >
                          Cancel
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
