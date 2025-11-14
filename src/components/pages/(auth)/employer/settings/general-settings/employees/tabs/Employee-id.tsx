'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import useGetEmployeeIdSettings from '../hooks/employee-id-settings/useGetEmployeeIdSettings';
import usePatchEmployeeIdSettings from '../hooks/employee-id-settings/usePatchEmployeeIdSettings';

import SelectChevronDown from '@/svg/SelectChevronDown';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';

const EmployeeId = () => {

  const [isChecked, setIsChecked] = useState(false);
  const { register, handleSubmit, reset, control, setValue } = useForm();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const { data: employeeIdSettings, isLoading: isLoadingEmployeeIdSettings } = useGetEmployeeIdSettings();
  const { mutate: patchEmployeeIdSettings, isLoading: isLoadingPatchEmployeeIdSettings } = usePatchEmployeeIdSettings();

  useEffect(() => {
    if (employeeIdSettings) {
      setIsChecked(employeeIdSettings.is_enabled);
      setValue('employee-id-enabled', employeeIdSettings.is_enabled);
      setValue('employee-id-series-format', employeeIdSettings.series_format || '');
      setValue('employee-id-start-of-series', employeeIdSettings.start_of_series || '');
      setValue('employee-id-year-format', employeeIdSettings.year_format || '');
    }
    console.log(employeeIdSettings);
  }, [employeeIdSettings]);
  

  const onSubmit = handleSubmit((data: any) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, {
          duration: 5000,
        });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    patchEmployeeIdSettings({ data: {
      is_enabled: data['employee-id-enabled'],
      series_format: data['employee-id-series-format'],
      start_of_series: data['employee-id-start-of-series'],
      year_format: data['employee-id-year-format'],
    } }, callbackReq);
  });

  return (
    <>
      <div className='flex flex-col min-h-[70vh]'>
        <h2 className='text-xl font-bold text-indigo-dye'>Employee ID Settings</h2>
        <div className='flex flex-col gap-4'>
          <form onSubmit={onSubmit}>
          <div className='flex items-center gap-2 py-2 px-4'>
            <input
              type='checkbox'
              id='employee-id'
              className='w-5 h-5 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue'
              checked={isChecked}
              {...register('employee-id-enabled', { required: true })}
              onChange={handleCheckboxChange}
            />
            <label htmlFor='employee-id'>Enable Employee ID</label>
          </div>
          <div className='flex flex-col gap-2 py-2 px-4'>
            <div className='w-1/3'>
              <label htmlFor='employee-id-series-format' className='text-sm font-medium leading-6 text-gray-900'>
                Series Format<span className='text-red-500'>*</span>
              </label>
              <div className='relative mt-2'>
                <select
                  disabled={!isChecked}
                  id='employee-id-series-format'
                  className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 disabled:bg-stone-50 disabled:text-opacity-100'
                  {...register('employee-id-series-format', { required: true })}
                >
                  <option value=''>Select Series Format</option>
                  <option value='YYYYXXXX'>YYYYXXXX</option>
                  <option value='YYYYXX'>YYYYXX</option>
                </select>
                <div className='absolute right-3 top-[14px]'>
                  <SelectChevronDown />
                </div>
              </div>
            </div>
            <div className='w-1/3'>
              <label htmlFor='employee-id-start-of-series' className='text-sm font-medium leading-6 text-gray-900'>
                Start of Series<span className='text-red-500'>*</span>
              </label>
              <input
                disabled={!isChecked}
                type='text'
                id='employee-id-start-of-series'
                className='mt-2 rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 disabled:bg-stone-50 disabled:text-opacity-100'
                {...register('employee-id-start-of-series', { required: true })}
                placeholder='Enter Start of Series'
              />
            </div>
            <div className='w-1/3'>
              <label htmlFor='employee-id-year-format' className='text-sm font-medium leading-6 text-gray-900'>
                Year Format<span className='text-red-500'>*</span>
              </label>
              <div className='relative mt-2'>
                <select
                  disabled={!isChecked}
                  id='employee-id-year-format'
                  className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 disabled:bg-stone-50 disabled:text-opacity-100'
                  {...register('employee-id-year-format', { required: true })}
                >
                  <option value=''>Select Year Format</option>
                  <option value='Hiring Year'>Hiring Year</option>
                  <option value='Current Year'>Current Year</option>
                </select>
                <div className='absolute right-3 top-[14px]'>
                  <SelectChevronDown />
                </div>
              </div>
            </div>
          </div>
          <button type='submit' className='w-full md:w-auto mt-10 md:mt-12 mb-7 rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
            Save
          </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmployeeId;
