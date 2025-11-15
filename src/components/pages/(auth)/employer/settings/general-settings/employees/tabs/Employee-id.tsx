// D:\YAHSHUA\HRIS\yahshua-hris-fe\src\components\pages\(auth)\employer\settings\general-settings\employees\tabs\Employee-id.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import useGetEmployeeIdSettings from '../hooks/employee-id-settings/useGetEmployeeIdSettings';
import usePatchEmployeeIdSettings from '../hooks/employee-id-settings/usePatchEmployeeIdSettings';
import useGenerateEmployeeId from '../hooks/employee-id-settings/useGenerateEmployeeId';
import useBulkGenerateEmployeeIds from '../hooks/employee-id-settings/useBulkGenerateEmployeeIds';

import SelectChevronDown from '@/svg/SelectChevronDown';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';

const EmployeeId = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [previewId, setPreviewId] = useState<string>('');
  const [previewDate, setPreviewDate] = useState<string>('');

  const { register, handleSubmit, reset, control, setValue, watch, getValues } = useForm();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const { data: employeeIdSettings, isLoading: isLoadingEmployeeIdSettings } = useGetEmployeeIdSettings();
  const { mutate: patchEmployeeIdSettings, isLoading: isLoadingPatchEmployeeIdSettings } = usePatchEmployeeIdSettings();
  const { mutate: generateEmployeeId, isLoading: isGeneratingPreview } = useGenerateEmployeeId();
  const { mutate: bulkGenerateEmployeeIds, isLoading: isBulkGenerating } = useBulkGenerateEmployeeIds();

  // Watch form values for preview generation
  const watchedValues = watch(['employee-id-series-format', 'employee-id-start-of-series', 'employee-id-year-format']);

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

  const generatePreview = () => {
    // Get current form values to determine if date is needed
    const formData = getValues();
    const yearFormat = formData['employee-id-year-format'];

    // If "Hiring Year" is selected but no date provided, show error
    if (yearFormat === 'Hiring Year' && !previewDate) {
      toast.custom(
        () => (
          <CustomToast message="Please select a hiring date for preview when using 'Hiring Year' format" type='error' />
        ),
        {
          duration: 5000,
        }
      );
      return;
    }

    const data = previewDate ? { date_hired: previewDate } : {};

    generateEmployeeId(data, {
      onSuccess: (response: any) => {
        setPreviewId(response.data.employee_id);
        toast.custom(() => <CustomToast message={response.data.message} type='success' />, {
          duration: 4000,
        });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={String(err)} type='error' />, {
          duration: 5000,
        });
      },
    });
  };

  const handleBulkGenerate = () => {
    bulkGenerateEmployeeIds(undefined as any, {
      onSuccess: (response: any) => {
        toast.custom(() => <CustomToast message={response.message} type='success' />, {
          duration: 5000,
        });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={String(err)} type='error' />, {
          duration: 5000,
        });
      },
    });
  };

  const onSubmit = handleSubmit((data: any) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, {
          duration: 5000,
        });
        setPreviewId(''); // Clear preview after saving
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    patchEmployeeIdSettings(
      {
        data: {
          is_enabled: data['employee-id-enabled'],
          series_format: data['employee-id-series-format'],
          start_of_series: parseInt(data['employee-id-start-of-series']) || null,
          year_format: data['employee-id-year-format'],
        },
      },
      callbackReq
    );
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
                    <option value='YYYYXXXX'>YYYYXXXX (Full Year + 4 digits)</option>
                    <option value='YYXXXX'>YYXXXX (2-digit Year + 4 digits)</option>
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
                  type='number'
                  min='1'
                  id='employee-id-start-of-series'
                  className='mt-2 rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 disabled:bg-stone-50 disabled:text-opacity-100'
                  {...register('employee-id-start-of-series', { required: true })}
                  placeholder='Enter Start of Series (e.g., 1 or 1001)'
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

            {/* Preview Section */}
            {isChecked && watchedValues.every(Boolean) && (
              <div className='flex flex-col gap-2 py-4 px-4 bg-gray-50 rounded-md mx-4'>
                <h3 className='text-md font-semibold text-gray-800'>Preview Employee ID</h3>
                <div className='flex gap-2 items-end'>
                  <div className='flex-1'>
                    <label htmlFor='preview-date' className='text-sm font-medium leading-6 text-gray-700'>
                      Hiring Date {watchedValues[2] === 'Hiring Year' ? '(Required)' : '(Optional)'}
                      <span className={watchedValues[2] === 'Hiring Year' ? 'text-red-500' : 'text-gray-400'}>
                        {watchedValues[2] === 'Hiring Year' ? '*' : ''}
                      </span>
                    </label>
                    <input
                      type='date'
                      id='preview-date'
                      value={previewDate}
                      onChange={(e) => setPreviewDate(e.target.value)}
                      className='mt-1 rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                    />
                    {watchedValues[2] === 'Current Year' && (
                      <p className='text-xs text-gray-500 mt-1'>
                        Leave empty to use current year ({new Date().getFullYear()})
                      </p>
                    )}
                  </div>
                  <button
                    type='button'
                    onClick={generatePreview}
                    disabled={isGeneratingPreview}
                    className='rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50'
                  >
                    {isGeneratingPreview ? 'Generating...' : 'Generate Preview'}
                  </button>
                </div>
                {previewId && (
                  <div className='mt-2 p-3 bg-white rounded border'>
                    <span className='text-sm text-gray-600'>Preview ID: </span>
                    <span className='text-lg font-mono font-bold text-blue-600'>{previewId}</span>
                  </div>
                )}
              </div>
            )}

            <div className='flex gap-4 px-4 mt-6'>
              <button
                type='submit'
                disabled={isLoadingPatchEmployeeIdSettings}
                className='rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50'
              >
                {isLoadingPatchEmployeeIdSettings ? 'Saving...' : 'Save Settings'}
              </button>

              {isChecked && (
                <button
                  type='button'
                  onClick={handleBulkGenerate}
                  disabled={isBulkGenerating}
                  className='rounded-md bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50'
                >
                  {isBulkGenerating ? 'Generating...' : 'Generate IDs for All Employees'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmployeeId;
