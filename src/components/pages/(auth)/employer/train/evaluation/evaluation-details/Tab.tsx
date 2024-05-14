'use client';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import SelectChevronDown from '@/svg/SelectChevronDown';

const Tab = ({ onNameChange }: any) => {
  const { register, watch } = useFormContext();
  const name = watch('name'); // Watch for changes in the name input

  // Call the onNameChange callback whenever the name input changes
  const handleNameChange = (event: any) => {
    onNameChange(event.target.value);
  };

  return (
    <>
      <div className='px-4 pt-4 pb-6'>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Evaluation Name<span className='text-red-600'>*</span>
          </label>
          <input
            id='name'
            type='text'
            {...register('name', { required: true })}
            onChange={handleNameChange}
            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
          />
        </div>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Evaluation Type<span className='text-red-600'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='evaluation_type'
              {...register('evaluation_type', { required: true })}
              className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              defaultValue=''
            >
              <option value='' disabled>
                Select...
              </option>
              <option value='individual'>Individual</option>
              <option value='team'>Team</option>
              <option value='manager'>Manager</option>
              <option value='custom'>Custom</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
              <SelectChevronDown />
            </div>
          </div>
        </div>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Frequency<span className='text-red-600'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='frequency'
              {...register('frequency', { required: true })}
              className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              defaultValue=''
            >
              <option value='' disabled>
                Select...
              </option>
              <option value='weekly'>Weekly</option>
              <option value='bimonthly'>Bi-Monthly</option>
              <option value='monthly'>Monthly</option>
              <option value='quarterly'>Quarterly</option>
              <option value='annual'>Annual</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
              <SelectChevronDown />
            </div>
          </div>
        </div>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Format<span className='text-red-600'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='evaluation_format'
              {...register('evaluation_format', { required: true })}
              className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              defaultValue=''
            >
              <option value='' disabled>
                Select...
              </option>
              <option value='sheet'>Sheet</option>
              <option value='form'>Form</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
              <SelectChevronDown />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tab;
