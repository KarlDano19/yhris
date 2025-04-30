import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useUpdateUserRights from '../hooks/useUpdateUserRights';

import { EyeSlashIcon, EyeIcon, XCircleIcon } from '@heroicons/react/24/solid';
import SelectChevronDown from '@/svg/SelectChevronDown';
import useGetUserRightDetails from '../hooks/useGetUserRightDetails';

type T_ModalData = {
  id: number;
  open: boolean;
};

export default function DoleRightsModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, reset, control, setValue } = useForm();
  const { data: userRightDetailsData, refetch: refetchUserRightDetails } = useGetUserRightDetails(isOpen.id);
  const { mutate: updateUserRights, isLoading: isLoadingUpdateUserRights } = useUpdateUserRights();

  useEffect(() => {
    if (isOpen) {
      refetchUserRightDetails();
    }
  }, [isOpen]);

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, {
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
    updateUserRights({ user_id: isOpen.id, data: data }, callbackReq);
  });

  useEffect(() => {
    if (userRightDetailsData) {
      setValue('create_dole_employee_compensation', userRightDetailsData.create_dole_employee_compensation);
      setValue('edit_dole_employee_compensation', userRightDetailsData.edit_dole_employee_compensation);
      setValue('create_dole_safety_health_policy', userRightDetailsData.create_dole_safety_health_policy);
      setValue('edit_dole_safety_health_policy', userRightDetailsData.edit_dole_safety_health_policy);
      setValue('create_dole_awair', userRightDetailsData.create_dole_awair);
      setValue('edit_dole_awair', userRightDetailsData.edit_dole_awair);
      setValue('create_dole_health_safety_organization', userRightDetailsData.create_dole_health_safety_organization);
      setValue('edit_dole_health_safety_organization', userRightDetailsData.edit_dole_health_safety_organization);
      setValue('create_dole_establishment_registration', userRightDetailsData.create_dole_establishment_registration);
      setValue('edit_dole_establishment_registration', userRightDetailsData.edit_dole_establishment_registration);
      setValue('create_dole_SHC_minute', userRightDetailsData.create_dole_SHC_minute);
      setValue('edit_dole_SHC_minute', userRightDetailsData.edit_dole_SHC_minute);
      setValue('create_dole_wair', userRightDetailsData.create_dole_wair);
      setValue('edit_dole_wair', userRightDetailsData.edit_dole_wair);
      setValue('create_dole_annual_medical_report', userRightDetailsData.create_dole_annual_medical_report);
      setValue('edit_dole_annual_medical_report', userRightDetailsData.edit_dole_annual_medical_report);
      setValue('create_dole_work_environment_request', userRightDetailsData.create_dole_work_environment_request);
      setValue('edit_dole_work_environment_request', userRightDetailsData.edit_dole_work_environment_request);
      setValue('create_dole_osh_program', userRightDetailsData.create_dole_osh_program);
      setValue('edit_dole_osh_program', userRightDetailsData.edit_dole_osh_program);
    }
  }, [userRightDetailsData]);

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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:mx-8 sm:w-full sm:max-w-3xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>DOLE User Rights</h3>
                    <XCircleIcon
                      className='w-8 h-8 text-white cursor-pointer'
                      onClick={() => setIsOpen({ id: 0, open: false })}
                    />
                  </div>
                  <div className='md:mx-6 my-4'>
                    <form onSubmit={onSubmit}>
                      <div className='px-4 pt-4 pb-6'>
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
                        <div className='grid lg:grid-cols-2 gap-x-8 gap-y-2 mt-2'>
                          <h1 className='text-base font-semibold mb-2'>Employee Compensation</h1>
                          <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-5 border-b border-gray-200 pb-6'>
                            <div className='grid-item'>
                              <label
                                htmlFor='create_dole_employee_compensation'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Create Employee Compensation
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='create_dole_employee_compensation'
                                  {...register('create_dole_employee_compensation', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='edit_dole_employee_compensation'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Edit Employee Compensation
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='edit_dole_employee_compensation'
                                  {...register('edit_dole_employee_compensation', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='export_dole_employee_compensation'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Export Employee Compensation
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='export_dole_employee_compensation'
                                  {...register('export_dole_employee_compensation', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='generate_dole_employee_compensation'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Generate Employee Compensation Report
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='generate_dole_employee_compensation'
                                  {...register('generate_dole_employee_compensation', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                          </div>
                          <h1 className='text-base font-semibold mb-2 mt-4'>Safety Health Policy</h1>
                          <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-5 border-b border-gray-200 pb-6'>
                            <div className='grid-item'>
                              <label
                                htmlFor='create_dole_safety_health_policy'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Create Safety Health Policy
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='create_dole_safety_health_policy'
                                  {...register('create_dole_safety_health_policy', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='edit_dole_safety_health_policy'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Edit Safety Health Policy
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='edit_dole_safety_health_policy'
                                  {...register('edit_dole_safety_health_policy', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                          </div>
                          <h1 className='text-base font-semibold mb-2 mt-4'>Annual Work Accident Incident</h1>
                          <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-5 border-b border-gray-200 pb-6'>
                            <div className='grid-item'>
                              <label
                                htmlFor='create_dole_awair'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Create Annual Work Accident Incident
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='create_dole_awair'
                                  {...register('create_dole_awair', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='edit_dole_awair'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Edit Annual Work Accident Incident
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='edit_dole_awair'
                                  {...register('edit_dole_awair', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='generate_dole_awair'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Generate Annual Work Accident Incident Report
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='generate_dole_awair'
                                  {...register('generate_dole_awair', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                          </div>
                          <h1 className='text-base font-semibold mb-2 mt-4'>Health Safety Organization</h1>
                          <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-5 border-b border-gray-200 pb-6'>
                            <div className='grid-item'>
                              <label
                                htmlFor='create_dole_health_safety_organization'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Create Health Safety Organization
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='create_dole_health_safety_organization'
                                  {...register('create_dole_health_safety_organization', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='edit_dole_health_safety_organization'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Edit Health Safety Organization
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='edit_dole_health_safety_organization'
                                  {...register('edit_dole_health_safety_organization', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='export_dole_health_safety_organization'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Export Health Safety Organization
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='export_dole_health_safety_organization'
                                  {...register('export_dole_health_safety_organization', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='generate_dole_health_safety_organization'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Generate Health Safety Organization Report
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='generate_dole_health_safety_organization'
                                  {...register('generate_dole_health_safety_organization', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                          </div>
                          <h1 className='text-base font-semibold mb-2 mt-4'>Establishment Registration</h1>
                          <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-5 border-b border-gray-200 pb-6'>
                            <div className='grid-item'>
                              <label
                                htmlFor='create_dole_establishment_registration'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Create Dole Establishment Registration
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='create_dole_establishment_registration'
                                  {...register('create_dole_establishment_registration', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='edit_employee_issue'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Edit Dole Establishment Registration
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='edit_dole_establishment_registration'
                                  {...register('edit_dole_establishment_registration', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                          </div>
                          <h1 className='text-base font-semibold mb-2 mt-4'>SHC Minute</h1>
                          <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-5 border-b border-gray-200 pb-6'>
                            <div className='grid-item'>
                              <label
                                htmlFor='create_dole_SHC_minute'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Create Dole SHC Minute
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='create_dole_SHC_minute'
                                  {...register('create_dole_SHC_minute', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='edit_dole_SHC_minute'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Edit Dole SHC Minute
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='edit_dole_SHC_minute'
                                  {...register('edit_dole_SHC_minute', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='export_dole_SHC_minute'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Export SHC Minute Report
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='export_dole_SHC_minute'
                                  {...register('export_dole_SHC_minute', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                          </div>
                          <h1 className='text-base font-semibold mb-2 mt-4'>Work Accident Injury Report</h1>
                          <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-5 border-b border-gray-200 pb-6'>
                            <div className='grid-item'>
                              <label
                                htmlFor='create_dole_wair'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Create Work Accident Injury Report
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='create_dole_wair'
                                  {...register('create_dole_wair', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='edit_employee_issue'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Edit Work Accident Injury Report
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='edit_dole_wair'
                                  {...register('edit_dole_wair', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='export_dole_wair'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Export Work Accident Injury Report
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='export_dole_wair'
                                  {...register('export_dole_wair', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='generate_dole_wair'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Generate Work Accident Injury Report
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='generate_dole_wair'
                                  {...register('generate_dole_wair', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                          </div>
                          <h1 className='text-base font-semibold mb-2 mt-4'>Annual Medical Report</h1>
                          <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-5 border-b border-gray-200 pb-6'>
                            <div className='grid-item'>
                              <label
                                htmlFor='create_dole_annual_medical_report'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Create Annual Medical Report
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='create_dole_annual_medical_report'
                                  {...register('create_dole_annual_medical_report', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label htmlFor='edit_memo' className='block text-sm font-medium leading-6 text-gray-900'>
                                Edit Annual Medical Report
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='edit_dole_annual_medical_report'
                                  {...register('edit_dole_annual_medical_report', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label htmlFor='edit_memo' className='block text-sm font-medium leading-6 text-gray-900'>
                                Export Annual Medical Report
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='export_dole_annual_medical_report'
                                  {...register('export_dole_annual_medical_report', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label htmlFor='edit_memo' className='block text-sm font-medium leading-6 text-gray-900'>
                                Generate Annual Medical Report
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='generate_dole_annual_medical_report'
                                  {...register('generate_dole_annual_medical_report', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                          </div>
                          <h1 className='text-base font-semibold mb-2 mt-4'>Work Environment Request</h1>
                          <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-5 border-b border-gray-200 pb-6'>
                            <div className='grid-item'>
                              <label
                                htmlFor='create_dole_work_environment_request'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Create Work Environment Request
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='create_dole_work_environment_request'
                                  {...register('create_dole_work_environment_request', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='edit_employee_issue'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Edit Work Environment Request
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='edit_dole_work_environment_request'
                                  {...register('edit_dole_work_environment_request', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='export_dole_work_environment_request'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Export Work Environment Request
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='export_dole_work_environment_request'
                                  {...register('export_dole_work_environment_request', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='generate_dole_work_environment_request'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Generate Work Environment Report
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='generate_dole_work_environment_request'
                                  {...register('generate_dole_work_environment_request', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                          </div>
                          <h1 className='text-base font-semibold mb-2 mt-4'>Osh Program</h1>
                          <div className='lg:col-span-6 grid mt-8 lg:mt-0 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-5'>
                            <div className='grid-item'>
                              <label
                                htmlFor='create_dole_osh_program'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Create Dole Osh Program
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='create_dole_osh_program'
                                  {...register('create_dole_osh_program', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                            <div className='grid-item'>
                              <label
                                htmlFor='edit_dole_osh_program'
                                className='block text-sm font-medium leading-6 text-gray-900'
                              >
                                Edit Dole Osh Program
                                <span className='text-red-600'>*</span>
                              </label>
                              <div className='relative mt-2'>
                                <select
                                  id='edit_dole_osh_program'
                                  {...register('edit_dole_osh_program', { required: true })}
                                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                                >
                                  <option value='true'>Yes</option>
                                  <option value='false'>No</option>
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <SelectChevronDown />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                        <button
                          type='submit'
                          className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                          disabled={isLoadingUpdateUserRights}
                        >
                          {isLoadingUpdateUserRights && (
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
                          {!isLoadingUpdateUserRights && 'Save'}
                        </button>
                        <button
                          type='button'
                          className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
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
