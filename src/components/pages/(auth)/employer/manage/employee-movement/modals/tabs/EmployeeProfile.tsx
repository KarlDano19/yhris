'use client';

import { useEffect, useState, useRef } from 'react';

import { Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import Select, { components } from 'react-select';

import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';
import useGetPositionItems from '@/components/hooks/useGetPositionItems';
import useGetEmployeeStatusItems from '@/components/hooks/useGetEmployeeStatusItems';
import useGetEmployeeDetails from '@/components/pages/(auth)/employer/manage/employees/hooks/useGetEmployeeDetails';
import SelectChevronDown from '@/svg/SelectChevronDown';
import CustomDatePicker from '@/components/CustomDatePicker';

import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

// Custom Option component to display department/position in dropdown
const CustomOption = (props: any) => {
  const { data, isSelected } = props;
  return (
    <components.Option {...props}>
      <div>
        <div className="font-medium">{data.label}</div>
        {(data.department || data.position) && (
          <div className={`text-sm ${isSelected ? 'text-blue-100' : 'text-gray-600'}`}>
            • {data.department && data.position 
              ? `${data.department} | ${data.position}`
              : data.department || data.position
            }
          </div>
        )}
      </div>
    </components.Option>
  );
};

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
  currentPosition,
  setCurrentPosition,
  newPosition,
  setNewPosition,
  currentEmploymentStatus,
  setCurrentEmploymentStatus,
  newEmploymentStatus,
  setNewEmploymentStatus,
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
  currentPosition: string;
  setCurrentPosition: (v: string) => void;
  newPosition: string;
  setNewPosition: (v: string) => void;
  currentEmploymentStatus: string;
  setCurrentEmploymentStatus: (v: string) => void;
  newEmploymentStatus: string;
  setNewEmploymentStatus: (v: string) => void;
  errors: any;
}) {
  const queryClient = useQueryClient();
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const [positionItems, setPositionItems] = useState<any>([]);
  const [employeeStatusItems, setEmployeeStatusItems] = useState<any>([]);
  const [reactSelectEmployeeItems, setReactSelectEmployeeItems] = useState<any[]>([]);
  const { data: employeeData } = useGetEmployeeItems();
  const { data: positionData } = useGetPositionItems();
  const { data: employeeStatusData } = useGetEmployeeStatusItems();
  const [watchedEmployeeId, setWatchedEmployeeId] = useState('');

  // Fetch employee details when employee is selected
  const { data: selectedEmployeeDetails, isLoading: isLoadingEmployeeDetails } = useGetEmployeeDetails(watchedEmployeeId);

  useEffect(() => {
    if (employeeData) {
      setEmployeeItems(employeeData);
      // Transform employee items for React Select
      const selectItems = employeeData.map((item: any) => ({
        value: item.id,
        label: `${item.firstname} ${item.lastname}`,
        department: item.department,
        position: item.position,
      }));
      setReactSelectEmployeeItems(selectItems);
    }
  }, [employeeData]);

  useEffect(() => {
    if (positionData) {
      setPositionItems(positionData);
    }
  }, [positionData]);

  useEffect(() => {
    if (employeeStatusData) {
      setEmployeeStatusItems(employeeStatusData);
    }
  }, [employeeStatusData]);

  useEffect(() => {
    const subscription = watch((value: any) => {
      const id = value.employee;
      setWatchedEmployeeId(id ? String(id) : '');
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Auto-populate current position and employment status when employee is selected
  useEffect(() => {
    if (selectedEmployeeDetails && !isEdit && positionItems.length > 0 && employeeStatusItems.length > 0) {
      // Find the position ID that matches the employee's current position
      const matchingPosition = positionItems.find((pos: any) => 
        pos.name === selectedEmployeeDetails.position
      );
      
      if (matchingPosition) {
        setCurrentPosition(matchingPosition.id);
        setValue('current_position', matchingPosition.id);
      }

      // Find the employment status ID that matches the employee's current employment status
      const matchingEmploymentStatus = employeeStatusItems.find((status: any) => 
        status.name === selectedEmployeeDetails.employment_status
      );
      
      if (matchingEmploymentStatus) {
        setCurrentEmploymentStatus(matchingEmploymentStatus.id);
        setValue('current_employment_status', matchingEmploymentStatus.id);
      }
    }
  }, [selectedEmployeeDetails, positionItems, employeeStatusItems, setCurrentPosition, setValue, isEdit]);

  useEffect(() => {
    if (isEdit) {
      const subscription = watch((value: any) => {
        const currentPositionValue = value.current_position;
        const newPositionValue = value.new_position;
        const currentEmploymentStatusValue = value.current_employment_status;
        const newEmploymentStatusValue = value.new_employment_status;
        
        if (currentPositionValue) {
          setCurrentPosition(String(currentPositionValue));
        }
        if (newPositionValue) {
          setNewPosition(String(newPositionValue));
        }
        if (currentEmploymentStatusValue) {
          setCurrentEmploymentStatus(String(currentEmploymentStatusValue));
        }
        if (newEmploymentStatusValue) {
          setNewEmploymentStatus(String(newEmploymentStatusValue));
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [isEdit, watch, setCurrentPosition, setNewPosition, setCurrentEmploymentStatus, setNewEmploymentStatus]);

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
              <Controller
                name="employee"
                control={control}
                rules={{ required: "Please select an employee" }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }: {
                  field: { onChange: (value: any) => void; value: any };
                  fieldState: { error?: { message?: string } };
                }) => (
                  <>
                    <Select
                      className="basic-single-select"
                      classNamePrefix="select"
                      options={reactSelectEmployeeItems}
                      value={reactSelectEmployeeItems.find((item: any) => item.value === value)}
                      onChange={(selectedOption) => {
                        if (!isEdit) {
                          onChange(selectedOption ? selectedOption.value : '');
                        }
                      }}
                      components={{
                        Option: CustomOption,
                        DropdownIndicator: () => (
                          <div className="pointer-events-none px-2">
                            <SelectChevronDown />
                          </div>
                        ),
                        IndicatorSeparator: () => null,
                      }}
                      isClearable={!isEdit}
                      placeholder="Select employee..."
                      isSearchable={!isEdit}
                      isDisabled={isEdit}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minHeight: '38px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          backgroundColor: '#f3f4f6',
                          opacity: isEdit ? 0.6 : 1,
                        }),
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999,
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected 
                            ? '#3b82f6' 
                            : state.isFocused 
                              ? '#dbeafe' 
                              : 'white',
                          color: state.isSelected ? 'white' : '#374151',
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: '#374151',
                        }),
                      }}
                    />
                    {error && !isEdit && (
                      <p className="text-red-500 text-sm mt-1 ml-1">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div>
            <label htmlFor='current_position' className='block text-sm font-medium leading-6 text-gray-900'>
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
                disabled={true} // Disabled since it's auto-populated
                className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-100'
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
            <label htmlFor='new_position' className='block text-sm font-medium leading-6 text-gray-900'>
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
            <label htmlFor='current_employment_status' className='block text-sm font-medium leading-6 text-gray-900'>
              Current Employment Status
              <span className='text-red-600'>*</span>
            </label>
            <div className='relative mt-2'>
              <select
                id='current_employment_status'
                value={currentEmploymentStatus}
                onChange={e => {
                  setCurrentEmploymentStatus(e.target.value);
                  setValue('current_employment_status', e.target.value);
                }}
                disabled={true} // Disabled since it's auto-populated
                className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-100'
              >
                <option value=''>Select...</option>
                {employeeStatusItems.map((item: any) => {
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
            <label htmlFor='new_employment_status' className='block text-sm font-medium leading-6 text-gray-900'>
              New Employment Status
              <span className='text-red-600'>*</span>
            </label>
            <div className='relative mt-2'>
              <select
                id='new_employment_status'
                value={newEmploymentStatus}
                onChange={e => {
                  setNewEmploymentStatus(e.target.value);
                  setValue('new_employment_status', e.target.value);
                }}
                disabled={isEdit}
                className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              >
                <option value=''>Select...</option>
                {employeeStatusItems.map((item: any) => {
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
            <label htmlFor='start_date' className='block text-sm font-medium leading-6 text-gray-900'>
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
                        "block w-full rounded-md py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
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
            <label htmlFor='proposed_rate' className='block text-sm font-medium leading-6 text-gray-900'>
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
        </div>
      </div>
      <hr />
      <div className='flex justify-end py-4 px-4'>
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
