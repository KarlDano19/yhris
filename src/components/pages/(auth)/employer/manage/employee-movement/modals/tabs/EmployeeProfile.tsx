'use client';

import { useEffect, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';
import useGetPositionItems from '@/components/hooks/useGetPositionItems';
import SelectChevronDown from '@/svg/SelectChevronDown';
import CustomDatePicker from '@/components/CustomDatePicker';

function EmployeeProfile({
  control,
  register,
  handleSubmit,
  setSelectedTab,
  setValue,
  isLoading,
  watch,
}: {
  control: any;
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  setValue: any;
  isLoading: boolean;
  watch: any;
}) {
  const queryClient = useQueryClient();
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const [positionItems, setPositionItems] = useState<any>([]);
  const { data: employeeData } = useGetEmployeeItems();
  const { data: positionData } = useGetPositionItems();

  useEffect(() => {
    if (employeeData) {
      setEmployeeItems(employeeData);
    }
  }, [employeeData]);

  useEffect(() => {
    if (positionData) {
      setPositionItems(positionData);
    }
  }, [positionData]);

  const onSubmit = handleSubmit(() => {
    setSelectedTab(2);
  });

  return (
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
        <div className='grid grid-cols-3 gap-6 mt-4 pb-6'>
          <div className='flex flex-row'>
            <h1>Reference Number: </h1>
            <h1 className='ml-2'>1234567890</h1>
          </div>
          <div className='flex flex-row'>
            <h1>Date: </h1>
            <h1 className='ml-2'>2025-01-01</h1>
          </div>
        </div>
        <div>
          <h1 className='text-lg font-semibold'>Employee Profile</h1>
        </div>
        <div className='grid grid-cols-3 gap-6 mt-4 pb-6'>
          <div>
            <label
              htmlFor='total_all_disabling_injuries_illnesses'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Employee Name
              <span className='text-red-600'>*</span>
            </label>
            <div className='relative mt-2'>
              <select
                id='employee'
                {...register('employee', { required: true })}
                className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              >
                <option value=''>Select...</option>
                {employeeItems.map((item: any) => {
                  return <option key={item.id} value={item.id}>{`${item.firstname} ${item.lastname}`}</option>;
                })}
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <SelectChevronDown />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor='total_non_disabling_injuries' className='block text-sm font-medium leading-6 text-gray-900'>
              Current Position
              <span className='text-red-600'>*</span>
            </label>
            <div className='relative mt-2'>
              <select
                id='current_position'
                {...register('current_position', { required: true })}
                className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              >
                <option value=''>Select...</option>
                {positionItems.map((item: any) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <SelectChevronDown />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor='frequency_rate' className='block text-sm font-medium leading-6 text-gray-900'>
              New Position
              <span className='text-red-600'>*</span>
            </label>
            <div className='relative mt-2'>
              <select
                id='new_position'
                {...register('new_position', { required: true })}
                className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              >
                <option value=''>Select...</option>
                {positionItems.map((item: any) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <SelectChevronDown />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
              Reason for Movement
              <span className='text-red-600'>*</span>
            </label>
            <div className='relative mt-2'>
              <div className='space-y-2'>
                <div>
                  <input
                    type='radio'
                    {...register('reason', { required: true })}
                    id='early_regularization'
                    value='Early Regularization'
                  />
                  <label htmlFor='early_regularization' className='ml-2'>
                    Early Regularization
                  </label>
                </div>
                <div>
                  <input
                    type='radio'
                    {...register('reason', { required: true })}
                    id='passed_probation'
                    value='Passed Probation Period'
                  />
                  <label htmlFor='passed_probation' className='ml-2'>
                    Passed Probation Period
                  </label>
                </div>
                <div>
                  <input
                    type='radio'
                    {...register('reason', { required: true })}
                    id='appointment'
                    value='Appointment'
                  />
                  <label htmlFor='appointment' className='ml-2'>
                    Appointment
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor='severity_rate' className='block text-sm font-medium leading-6 text-gray-900'>
              Proposed Rate
              <span className='text-red-600'>*</span>
            </label>
            <div className='relative mt-2'>
              <div className='space-y-2'>
                <div>
                  <input
                    type='radio'
                    {...register('proposed_rate', { required: true })}
                    id='No changes'
                    value='0'
                  />
                  <label htmlFor='No changes' className='ml-2'>
                    No changes
                  </label>
                </div>
                <div>
                  <input
                    type='radio'
                    {...register('proposed_rate', { required: true })}
                    id='apply_percentage_increase'
                    value='Apply % Increase'
                  />
                  <label htmlFor='apply_percentage_increase' className='ml-2'>
                    Apply % Increase
                  </label>
                </div>
                <div className='ml-6 mt-2'>
                  <input
                    type='number'
                    {...register('percentage_increase', { 
                      required: watch('proposed_rate') === 'Apply % Increase',
                      min: 0,
                      max: 100
                    })}
                    disabled={watch('proposed_rate') !== 'Apply % Increase'}
                    placeholder='Enter percentage'
                    className='rounded-md w-32 border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:text-gray-500'
                  />
                  <span className='ml-2 text-sm text-gray-500'>%</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor='severity_rate' className='block text-sm font-medium leading-6 text-gray-900'>
              Start Date
              <span className='text-red-600'>*</span>
            </label>
            <div className="relative mt-2">
                <Controller
                  control={control}
                  name="start_date"
                  render={({ field }) => (
                    <CustomDatePicker
                      id="start_date"
                      placeholder={"mm/dd/yyyy"}
                      className={
                        "block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
                      }
                      selected={field.value ? new Date(field.value) : null}
                      pickerOnChange={(date: any) => field.onChange(date)}
                      inputOnChange={(value: any) => field.onChange(value)}
                      required={true}
                    />
                  )}
                />
              </div>
          </div>
        </div>
      </div>
      <hr />
      <div className='flex justify-between py-4 px-4'>
        <button
          type='button'
          className='w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          onClick={() => setSelectedTab(1)}
        >
          Back
        </button>
        <button
          type='submit'
          className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
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
          {!isLoading && 'Submit'}
        </button>
      </div>
    </form>
  );
}

export default EmployeeProfile;
