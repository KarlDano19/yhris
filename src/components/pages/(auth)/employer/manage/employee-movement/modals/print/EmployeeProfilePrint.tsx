'use client';

import { useEffect, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';
import useGetPositionItems from '@/components/hooks/useGetPositionItems';
import SelectChevronDown from '@/svg/SelectChevronDown';
import CustomDatePicker from '@/components/CustomDatePicker';

function EmployeeProfilePrint({
  control,
  register,
  handleSubmit,
  setValue,
  isLoading,
  watch,
  isEdit,
}: {
  control: any;
  register: any;
  handleSubmit: any;
  setValue: any;
  isLoading: boolean;
  watch: any;
  isEdit: boolean;
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

  const onSubmit = (data: any) => {
    if (isEdit) {
      handleSubmit(data);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      employee: watch('employee'),
      current_position: watch('current_position'),
      new_position: watch('new_position'),
      reason: watch('reason'),
      start_date: watch('start_date'),
      proposed_rate: watch('proposed_rate'),
      percentage_increase: watch('percentage_increase')
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={!isEdit ? handleFormSubmit : onSubmit}>
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
          {isEdit && (
            <>
              <div className='flex flex-row'>
                <h1>Reference Number: </h1>
                <h1 className='ml-2'>{watch('id')}</h1>
              </div>
              <div className='flex flex-row'>
                <h1>Date: </h1>
                <h1 className='ml-2'>{watch('created_at')}</h1>
              </div>
            </>
          )}
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
                disabled={isEdit}
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
                disabled={isEdit}
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
                disabled={isEdit}
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
                    disabled={isEdit}
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
                    disabled={isEdit}
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
                    disabled={isEdit}
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
                    value='No changes'
                    disabled={isEdit}
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
                    value='Apply Increase'
                    disabled={isEdit}
                  />
                  <label htmlFor='apply_percentage_increase' className='ml-2'>
                    Apply % Increase
                  </label>
                </div>
                <div className='ml-6 mt-2'>
                  <input
                    type='number'
                    {...register('percentage_increase', { 
                      required: watch('proposed_rate') === 'Apply Increase',  
                      min: 0,
                      max: 100
                    })}
                    disabled={watch('proposed_rate') !== 'Apply Increase'}
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
                      disabled={isEdit}
                    />
                  )}
                />
              </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default EmployeeProfilePrint;
