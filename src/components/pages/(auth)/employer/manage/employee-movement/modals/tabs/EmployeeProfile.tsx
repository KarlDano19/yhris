'use client';

import { useEffect, useState } from 'react';

import { Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';
import useGetPositionItems from '@/components/hooks/useGetPositionItems';
import SelectChevronDown from '@/svg/SelectChevronDown';
import CustomDatePicker from '@/components/CustomDatePicker';

import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

function EmployeeProfile({
  control,
  register,
  handleSubmit,
  onValidSubmit,
  setSelectedTab,
  setValue,
  isLoading,
  watch,
  isEdit,
  employeeSearch,
  setEmployeeSearch,
  employeeSelected,
  setEmployeeSelected,
  currentPosition,
  setCurrentPosition,
  newPosition,
  setNewPosition,
  errors,
}: {
  control: any;
  register: any;
  handleSubmit: any;
  onValidSubmit: any;
  setSelectedTab: any;
  setValue: any;
  isLoading: boolean;
  watch: any;
  isEdit: boolean;
  employeeSearch: string;
  setEmployeeSearch: (v: string) => void;
  employeeSelected: boolean;
  setEmployeeSelected: (v: boolean) => void;
  currentPosition: string;
  setCurrentPosition: (v: string) => void;
  newPosition: string;
  setNewPosition: (v: string) => void;
  errors: any;
}) {
  const queryClient = useQueryClient();
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const [positionItems, setPositionItems] = useState<any>([]);
  const { data: employeeData } = useGetEmployeeItems();
  const { data: positionData } = useGetPositionItems();
  const [watchedEmployeeId, setWatchedEmployeeId] = useState('');

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

  useEffect(() => {
    const id = watch('employee');
    setWatchedEmployeeId(id ? String(id) : '');
  }, [watch, watch('employee')]);

  useEffect(() => {
    if (isEdit && employeeItems.length > 0 && watchedEmployeeId) {
      const selectedEmployee = employeeItems.find(
        (item: any) => String(item.id) === watchedEmployeeId
      );
      if (selectedEmployee) {
        setEmployeeSearch(`${selectedEmployee.firstname} ${selectedEmployee.lastname}`);
        setEmployeeSelected(true);
      } else {
        setEmployeeSearch('');
        setEmployeeSelected(false);
      }
    }
    if (isEdit && (!watchedEmployeeId || employeeItems.length === 0)) {
      setEmployeeSearch('');
      setEmployeeSelected(false);
    }
  }, [employeeItems, isEdit, watchedEmployeeId, setEmployeeSearch, setEmployeeSelected]);

  useEffect(() => {
    if (isEdit) {
      const currentPositionValue = watch('current_position');
      const newPositionValue = watch('new_position');
      
      if (currentPositionValue) {
        setCurrentPosition(String(currentPositionValue));
      }
      if (newPositionValue) {
        setNewPosition(String(newPositionValue));
      }
    }
  }, [isEdit, watch('current_position'), watch('new_position'), setCurrentPosition, setNewPosition]);

  const onSubmit = (data: any) => {
    if (isEdit) {
      setSelectedTab(2);
    } else {
      onValidSubmit(data);
    }
  };

  return (
    <form onSubmit={!isEdit ? handleSubmit(onSubmit) : onSubmit}>
      <div className='px-4 pt-4 pb-6'>
        {Object.keys(errors).length > 0 && (
          <div className='rounded-md bg-red-50 p-4 mb-3'>
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
        )}
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
              htmlFor='employee'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Employee Name
              <span className='text-red-600'>*</span>
            </label>
            <div className='relative mt-2'>
              <input
                id='employee-search'
                type='text'
                placeholder='Select...'
                value={employeeSearch}
                onChange={e => setEmployeeSearch(e.target.value)}
                className={`appearance-none bg-[#eeefee] block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black sm:text-sm sm:leading-6${isEdit ? ' opacity-60' : ''}`}
                onClick={() => {
                  if (!employeeSelected && !isEdit) {
                    const dropdown = document.getElementById('employee-dropdown');
                    if (dropdown) {
                      dropdown.classList.toggle('hidden');
                    }
                  }
                }}
                readOnly={employeeSelected || isEdit}
                disabled={isEdit}
              />
              <div
                className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'
                onClick={() => {
                  if (!employeeSelected && !isEdit) {
                    const dropdown = document.getElementById('employee-dropdown');
                    if (dropdown) {
                      dropdown.classList.toggle('hidden');
                    }
                  }
                }}
              >
                {!employeeSelected ? (
                  <span>
                    <SelectChevronDown />
                  </span>
                ) : !isEdit ? (
                  <button
                    type='button'
                    className='text-savoy-blue hover:text-red-500 focus:outline-none text-3xl pointer-events-auto'
                    onClick={() => {
                      setValue('employee', '');
                      setEmployeeSearch('');
                      setEmployeeSelected(false);
                    }}
                    tabIndex={-1}
                  >
                    ×
                  </button>
                ) : (
                  <span>
                    <SelectChevronDown />
                  </span>
                )}
              </div>
              <div id='employee-dropdown' className='hidden absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'>
                {employeeItems
                  .filter((item: any) => `${item.firstname} ${item.lastname}`.toLowerCase().includes(employeeSearch.toLowerCase()))
                  .map((item: any) => (
                    <div
                      key={item.id}
                      className='px-3 py-2 bg-[#eeefee] text-sm text-gray-900 cursor-pointer hover:bg-savoy-blue hover:text-white'
                      onClick={() => {
                        setValue('employee', item.id);
                        setEmployeeSearch(`${item.firstname} ${item.lastname}`);
                        setEmployeeSelected(true);
                        document.getElementById('employee-dropdown')?.classList.add('hidden');
                      }}
                    >
                      {`${item.firstname} ${item.lastname}`}
                    </div>
                  ))}
              </div>
              <input type="hidden" {...register('employee', { required: true })} />
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
                value={currentPosition}
                onChange={e => {
                  setCurrentPosition(e.target.value);
                  setValue('current_position', e.target.value);
                }}
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
                value={newPosition}
                onChange={e => {
                  setNewPosition(e.target.value);
                  setValue('new_position', e.target.value);
                }}
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
                    disabled={watch('proposed_rate') !== 'Apply Increase' || isEdit}
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
          {!isLoading && !isEdit && 'Submit'}
          {!isLoading && isEdit && 'Next'}
        </button>
      </div>
    </form>
  );
}

export default EmployeeProfile;
