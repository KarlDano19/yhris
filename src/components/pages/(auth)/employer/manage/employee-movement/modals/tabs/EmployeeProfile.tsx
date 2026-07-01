'use client';

import { useEffect, useState } from 'react';

import { Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { Tooltip } from 'react-tooltip';

import useGetPositionItems from '@/components/hooks/useGetPositionItems';
import useGetEmployeeStatusItems from '@/components/hooks/useGetEmployeeStatusItems';
import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';
import useGetLocationItems from '@/components/hooks/useGetLocationItems';
import EmployeeSelect from '@/components/common/EmployeeSelect';
import SelectChevronDown from '@/svg/SelectChevronDown';
import CustomDatePicker from '@/components/CustomDatePicker';

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
  isEditable = false,
  currentPosition,
  setCurrentPosition,
  newPosition,
  setNewPosition,
  currentEmploymentStatus,
  setCurrentEmploymentStatus,
  newEmploymentStatus,
  setNewEmploymentStatus,
  movementType,
  setMovementType,
  currentLocation,
  setCurrentLocation,
  newLocation,
  setNewLocation,
  employeeName,
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
  isEditable?: boolean;
  currentPosition: string;
  setCurrentPosition: (v: string) => void;
  newPosition: string;
  setNewPosition: (v: string) => void;
  currentEmploymentStatus: string;
  setCurrentEmploymentStatus: (v: string) => void;
  newEmploymentStatus: string;
  setNewEmploymentStatus: (v: string) => void;
  movementType: string;
  setMovementType: (v: string) => void;
  currentLocation: string;
  setCurrentLocation: (v: string) => void;
  newLocation: string;
  setNewLocation: (v: string) => void;
  employeeName?: string;
  errors: any;
}) {
  const [positionItems, setPositionItems] = useState<any>([]);
  const [employeeStatusItems, setEmployeeStatusItems] = useState<any>([]);
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const [locationItems, setLocationItems] = useState<any>([]);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const { data: positionData } = useGetPositionItems();
  const { data: employeeStatusData } = useGetEmployeeStatusItems();
  const { data: employeeData } = useGetEmployeeItems();
  const { data: locationData } = useGetLocationItems();

  useEffect(() => {
    if (positionData) {
      setPositionItems(positionData);
    }
  }, [positionData]);

  useEffect(() => {
    if (employeeData) {
      setEmployeeItems(employeeData);
    }
  }, [employeeData]);

  useEffect(() => {
    if (employeeStatusData) {
      setEmployeeStatusItems(employeeStatusData);
    }
  }, [employeeStatusData]);

  useEffect(() => {
    if (locationData) {
      setLocationItems(locationData);
    }
  }, [locationData]);

  useEffect(() => {
    if (isEdit) {
      const subscription = watch((value: any) => {
        const currentPositionValue = value.current_position;
        const newPositionValue = value.new_position;
        const currentEmploymentStatusValue = value.current_employment_status;
        const newEmploymentStatusValue = value.new_employment_status;
        const movementTypeValue = value.movement_type;
        const newLocationValue = value.new_location;

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
        if (movementTypeValue) {
          setMovementType(String(movementTypeValue));
        }
        if (newLocationValue) {
          setNewLocation(String(newLocationValue));
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [isEdit, watch, setCurrentPosition, setNewPosition, setCurrentEmploymentStatus, setNewEmploymentStatus, setMovementType, setNewLocation]);

  const onSubmit = (data: any) => {
    if (isEdit && !isEditable) {
      setSelectedTab(2);
    } else {
      onValidSubmit(data);
    }
  };

  const isReassignment = movementType === 'reassignment';

  return (
    <form onSubmit={isEdit && !isEditable ? onSubmit : handleSubmit(onSubmit)}>
      <div className='px-4 pt-4 pb-6'>

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
          {/* Movement Type */}
          <div className='col-span-3'>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
              Movement Type
              <span className='text-red-600'>*</span>
            </label>
            <div className='grid grid-cols-2 gap-4 mt-2'>
              {/* Change in Position card */}
              <button
                type='button'
                disabled={isEdit && !isEditable}
                onClick={() => {
                  setMovementType('change_in_position');
                  setValue('movement_type', 'change_in_position');
                }}
                className={`relative text-left rounded-lg border-2 px-4 py-3 transition-all ${
                  movementType === 'change_in_position'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } ${isEdit && !isEditable ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
              >
                <p className='text-sm font-semibold text-gray-900'>Change in Position</p>
                <p className='text-sm text-gray-500 mt-0.5'>Update title or department</p>
              </button>

              {/* Re-assignment card */}
              <button
                type='button'
                disabled={isEdit && !isEditable}
                onClick={() => {
                  setMovementType('reassignment');
                  setValue('movement_type', 'reassignment');
                }}
                className={`relative text-left rounded-lg border-2 px-4 py-3 transition-all ${
                  movementType === 'reassignment'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } ${isEdit && !isEditable ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
              >
                <p className='text-sm font-semibold text-gray-900'>Re-assignment</p>
                <p className='text-sm text-gray-500 mt-0.5'>Relocate to a new office or branch</p>
              </button>
            </div>
            {errors?.movement_type && (
              <p className='text-red-600 text-sm mt-1'>Movement type is required</p>
            )}
          </div>

          {/* Employee Name */}
          <div>
            <label
              htmlFor='employee'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Employee Name
              <span className='text-red-600'>*</span>
            </label>
            <div className='relative mt-2'>
              <EmployeeSelect
                control={control}
                name="employee"
                label=""
                required={true}
                placeholder="Select employee..."
                isMulti={false}
                isClearable={!isEdit || isEditable}
                disabled={isEdit && !isEditable}
                employeeSearch={employeeSearch}
                setEmployeeSearch={setEmployeeSearch}
                employeeName={employeeName}
                className=""
                onChange={(selectedOption: any) => {
                  if ((!isEdit || isEditable) && selectedOption && !selectedOption.isShowMore) {
                    setEmployeeSearch(selectedOption.label);

                    // Auto-fill current position from employee data
                    if (selectedOption.position) {
                      const matchingPosition = positionItems.find(
                        (item: any) => item.name === selectedOption.position
                      );
                      if (matchingPosition) {
                        setCurrentPosition(String(matchingPosition.id));
                        setValue('current_position', matchingPosition.id);
                      }
                    }

                    // Auto-fill current employment status from employee data
                    if (selectedOption.employment_status) {
                      const matchingStatus = employeeStatusItems.find(
                        (item: any) => item.name === selectedOption.employment_status
                      );
                      if (matchingStatus) {
                        setCurrentEmploymentStatus(String(matchingStatus.id));
                        setValue('current_employment_status', matchingStatus.id);
                      }
                    }

                    // Auto-fill current location from employee data
                    const matchingEmployee = employeeItems.find((item: any) => item.id === selectedOption.value);
                    if (matchingEmployee?.location) {
                      setCurrentLocation(matchingEmployee.location);
                    }
                  } else if (!isEdit || isEditable) {
                    setEmployeeSearch('');
                    setCurrentPosition('');
                    setCurrentEmploymentStatus('');
                    setCurrentLocation('');
                    setValue('current_position', '');
                    setValue('current_employment_status', '');
                  }
                }}
              />
            </div>
            {errors?.employee && (
              <p className='text-red-600 text-sm mt-1'>Employee name is required</p>
            )}
          </div>

          {/* Current Position */}
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
                disabled={true}
                data-tooltip-id="current-position-tooltip"
                data-tooltip-content="Auto-populated from selected employee"
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
              <Tooltip
                id="current-position-tooltip"
                place="bottom"
                style={{ backgroundColor: '#374151', color: 'white', fontSize: '12px' }}
              />
            </div>
          </div>

          {/* New Position — only for Change in Position */}
          {!isReassignment && (
            <div>
              <label htmlFor='new_position' className='block text-sm font-medium leading-6 text-gray-900'>
                New Position
                <span className='text-red-600'>*</span>
              </label>
              <div className='relative mt-2'>
                <select
                  id='new_position'
                  {...register('new_position', { required: !isReassignment })}
                  value={newPosition}
                  onChange={e => {
                    setNewPosition(e.target.value);
                    setValue('new_position', e.target.value);
                  }}
                  disabled={isEdit && !isEditable}
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
              {errors?.new_position && (
                <p className='text-red-600 text-sm mt-1'>New position is required</p>
              )}
            </div>
          )}

          {/* Current Employment Status — only for Change in Position */}
          {!isReassignment && (
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
                  disabled={true}
                  data-tooltip-id="current-employment-status-tooltip"
                  data-tooltip-content="Auto-populated from selected employee"
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
                <Tooltip
                  id="current-employment-status-tooltip"
                  place="bottom"
                  style={{ backgroundColor: '#374151', color: 'white', fontSize: '12px' }}
                />
              </div>
            </div>
          )}

          {/* New Employment Status — only for Change in Position */}
          {!isReassignment && (
            <div>
              <label htmlFor='new_employment_status' className='block text-sm font-medium leading-6 text-gray-900'>
                New Employment Status
                <span className='text-red-600'>*</span>
              </label>
              <div className='relative mt-2'>
                <select
                  id='new_employment_status'
                  {...register('new_employment_status', { required: !isReassignment })}
                  value={newEmploymentStatus}
                  onChange={e => {
                    setNewEmploymentStatus(e.target.value);
                    setValue('new_employment_status', e.target.value);
                  }}
                  disabled={isEdit && !isEditable}
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
              {errors?.new_employment_status && (
                <p className='text-red-600 text-sm mt-1'>New employment status is required</p>
              )}
            </div>
          )}

          {/* Current Location — only for Re-assignment */}
          {isReassignment && (
            <div>
              <label className='block text-sm font-medium leading-6 text-gray-900'>
                Current Location
              </label>
              <div className='relative mt-2'>
                <input
                  type='text'
                  value={currentLocation}
                  readOnly
                  placeholder='From Selected Employee'
                  data-tooltip-id="current-location-tooltip"
                  data-tooltip-content="From Selected Employee"
                  className='block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-100'
                />
                <Tooltip
                  id="current-location-tooltip"
                  place="bottom"
                  style={{ backgroundColor: '#374151', color: 'white', fontSize: '12px' }}
                />
              </div>
            </div>
          )}

          {/* New Location — only for Re-assignment */}
          {isReassignment && (
            <div>
              <label htmlFor='new_location' className='block text-sm font-medium leading-6 text-gray-900'>
                New Location
                <span className='text-red-600'>*</span>
              </label>
              <div className='relative mt-2'>
                <select
                  id='new_location'
                  {...register('new_location', { required: isReassignment })}
                  value={newLocation}
                  onChange={e => {
                    setNewLocation(e.target.value);
                    setValue('new_location', e.target.value);
                  }}
                  disabled={isEdit && !isEditable}
                  className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                >
                  <option value=''>Select...</option>
                  {locationItems.map((item: any) => {
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
              {errors?.new_location && (
                <p className='text-red-600 text-sm mt-1'>New location is required</p>
              )}
            </div>
          )}

          {/* Start Date */}
          <div>
            <label htmlFor='start_date' className='block text-sm font-medium leading-6 text-gray-900'>
              Start Date
              <span className='text-red-600'>*</span>
            </label>
            <div className="relative mt-2">
                <Controller
                  control={control}
                  name="start_date"
                  rules={{ required: true }}
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
                      disabled={isEdit && !isEditable}
                    />
                  )}
                />
              </div>
            {errors?.start_date && (
              <p className='text-red-600 text-sm mt-1'>Start date is required</p>
            )}
          </div>

          {/* Reason for Movement */}
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
                    disabled={isEdit && !isEditable}
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
                    disabled={isEdit && !isEditable}
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
                    disabled={isEdit && !isEditable}
                  />
                  <label htmlFor='appointment' className='ml-2'>
                    Appointment
                  </label>
                </div>
              </div>
            </div>
            {errors?.reason && (
              <p className='text-red-600 text-sm mt-1'>Reason for movement is required</p>
            )}
          </div>

          {/* Proposed Rate — only for Change in Position */}
          {!isReassignment && (
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
                      {...register('proposed_rate', { required: !isReassignment })}
                      id='No changes'
                      value='No changes'
                      disabled={isEdit && !isEditable}
                    />
                    <label htmlFor='No changes' className='ml-2'>
                      No changes
                    </label>
                  </div>
                  <div>
                    <input
                      type='radio'
                      {...register('proposed_rate', { required: !isReassignment })}
                      id='apply_percentage_increase'
                      value='Apply Increase'
                      disabled={isEdit && !isEditable}
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
                      disabled={watch('proposed_rate') !== 'Apply Increase' || (isEdit && !isEditable)}
                      placeholder='Enter percentage'
                      className='rounded-md w-32 border-0 px-3 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:text-gray-500'
                    />
                    <span className='ml-2 text-sm text-gray-500'>%</span>
                  </div>
                  {errors?.percentage_increase && (
                    <p className='text-red-600 text-sm mt-1'>Percentage increase is required</p>
                  )}
                  <div>
                    <input
                      type='radio'
                      {...register('proposed_rate', { required: !isReassignment })}
                      id='apply_amount_increase'
                      value='Apply Amount Increase'
                      disabled={isEdit && !isEditable}
                    />
                    <label htmlFor='apply_amount_increase' className='ml-2'>
                      Apply Amount Increase
                    </label>
                  </div>
                  <div className='ml-6 mt-2'>
                    <input
                      type='number'
                      step='0.01'
                      {...register('amount_increase', {
                        required: watch('proposed_rate') === 'Apply Amount Increase',
                        min: 0,
                      })}
                      disabled={watch('proposed_rate') !== 'Apply Amount Increase' || (isEdit && !isEditable)}
                      placeholder='Enter monthly amount'
                      className='rounded-md w-40 border-0 px-3 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:text-gray-500'
                    />
                    <span className='ml-2 text-sm text-gray-500'>/ month</span>
                  </div>
                  {errors?.amount_increase && (
                    <p className='text-red-600 text-sm mt-1'>Amount increase is required</p>
                  )}
                  {errors?.proposed_rate && (
                    <p className='text-red-600 text-sm mt-1'>Proposed rate is required</p>
                  )}
                </div>
              </div>
            </div>
          )}
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
          {!isLoading && isEdit && !isEditable && 'View Approvals →'}
          {!isLoading && isEdit && isEditable && 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

export default EmployeeProfile;
