import { Dispatch, useState, useMemo } from 'react';

import Select from 'react-select';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';
import { advertiseOptions } from '@/utils/advertiseOptions';
import CreateModal from '../../settings/general-settings/employees/modals/CreateModal';
import useGetPositionItems from '../../settings/general-settings/employees/hooks/position/useGetPositionItems';
import React from 'react'; // Added missing import

interface Field {
  onChange: (value: any) => void;
  value: any;
}

export default function CreateJobPageTitleInfo({
  control,
  Controller,
  register,
  handleSubmit,
  setPageNumber,
  onSubmit,
  errors,
}: {
  control: any;
  Controller: any;
  register: any;
  handleSubmit: any;
  setPageNumber: Dispatch<number>;
  onSubmit: (data: any) => void;
  errors?: any;
}) {
  const [isAddPositionModalOpen, setIsAddPositionModalOpen] = useState(false);
  const [newlyAddedPositions, setNewlyAddedPositions] = useState<number[]>([]);
  
  // Fetch positions for the dropdown with a large page size to get all positions
  const { data: positionData, refetch: refetchPositions } = useGetPositionItems({ 
    pageSize: 1000,  // Large page size to get all positions
    currentPage: 1
  });
  
  // Transform position data for react-select with separation for newly added positions
  const positionOptions = useMemo(() => {
    if (!positionData?.records) return [];
    
    const allPositions = positionData.records.map((position: any) => ({
      value: position.id,
      label: position.name,
      isNew: newlyAddedPositions.includes(position.id)
    }));
    
    // Separate newly added positions from regular positions
    const newPositions = allPositions.filter((pos: any) => pos.isNew);
    const regularPositions = allPositions.filter((pos: any) => !pos.isNew);
    
    // Create options with separation
    const options = [];
    
    // Add newly added positions at the top with "New" label
    if (newPositions.length > 0) {
      options.push({
        label: "New Positions",
        options: newPositions.map((pos: any) => ({
          ...pos,
          label: `${pos.label} (New)`
        })),
        isDisabled: true
      });
    }
    
    // Add separator if there are both new and regular positions
    if (newPositions.length > 0 && regularPositions.length > 0) {
      options.push({
        label: "───────────────",
        options: [],
        isDisabled: true
      });
    }
    
    // Add regular positions
    if (regularPositions.length > 0) {
      options.push({
        label: "All Positions",
        options: regularPositions,
        isDisabled: true
      });
    }
    
    return options;
  }, [positionData?.records, newlyAddedPositions]);

  const firstFormSubmit = handleSubmit((data: any) => {
    onSubmit(data);
  });

  const handleAddPosition = () => {
    setIsAddPositionModalOpen(true);
  };

  const handlePositionCreated = () => {
    // Refresh positions list and get the latest position
    refetchPositions().then(() => {
      // Find the most recently created position (highest ID)
      if (positionData?.records && positionData.records.length > 0) {
        const latestPosition = positionData.records.reduce((prev: any, current: any) => 
          (prev.id > current.id) ? prev : current
        );
        setNewlyAddedPositions(prev => [...prev, latestPosition.id]);
      }
    });
  };

  const handleJobCompleted = () => {
    // Clear newly added positions when job is completed
    setNewlyAddedPositions([]);
  };

  // Call handleJobCompleted when the form is submitted
  const firstFormSubmitWithCleanup = handleSubmit((data: any) => {
    handleJobCompleted();
    onSubmit(data);
  });

  return (
    <>
      <form onSubmit={firstFormSubmitWithCleanup}>
        <div className='px-4 pb-6'>
          <div className='sm:col-span-4 mt-4'>
            <label htmlFor='country' className='block text-sm font-medium leading-6 text-gray-900'>
              Country
              <span className='text-red-600'>*</span>
            </label>
            <div className='relative mt-2'>
              <select
                id='country'
                {...register('country', { required: true })}
                className='appearance-none block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              >
                <option>Philippines</option>
                <option>Indonesia</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <SelectChevronDown />
              </div>
            </div>
          </div>
          <div className='sm:col-span-4 mt-4'>
            <label htmlFor='language' className='block text-sm font-medium leading-6 text-gray-900'>
              Language
              <span className='text-red-600'>*</span>
            </label>
            <div className='relative mt-2'>
              <select
                id='language'
                {...register('language', { required: true })}
                className='appearance-none block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              >
                <option>English</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <SelectChevronDown />
              </div>
            </div>
          </div>
          <div className='sm:col-span-4 mt-4'>
            <div>
              <label htmlFor='jobTitle' className='block text-sm font-medium leading-6 text-gray-900'>
                Job Title<span className='text-red-600'>*</span>
              </label>
              <div className='mt-2'>
                <input
                  id='jobTitle'
                  {...register('jobTitle', { required: true })}
                  type='text'
                  className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                />
              </div>
            </div>
          </div>
          <div className='sm:col-span-4 mt-4'>
            <div>
              <div className='flex items-center justify-between'>
                <label htmlFor='position' className='block text-sm font-medium leading-6 text-gray-900'>
                  Position
                  <span className='text-red-600'>*</span>
                </label>
                <button
                  type='button'
                  onClick={handleAddPosition}
                  className='text-sm text-savoy-blue hover:text-blue-700 font-medium'
                >
                  + Add New Position
                </button>
              </div>
              <div className='mt-2'>
                <Controller
                  name='position'
                  control={control}
                  rules={{ required: "Please select a position" }}
                  render={({ field: { onChange, value } }: { field: Field }) => (
                    <Select
                      className='text-sm'
                      classNamePrefix='select'
                      options={positionOptions}
                      value={positionOptions.flatMap(group => group.options).find((item: any) => item.value === value)}
                      onChange={(val) => onChange(val?.value || '')}
                      components={{
                        DropdownIndicator: () => (
                          <div className='pointer-events-none px-2'>
                            <SelectChevronDown />
                          </div>
                        ),
                        IndicatorSeparator: () => null,
                      }}
                      isClearable={false}
                      noOptionsMessage={() => 'No positions available'}
                      placeholder='Select a position...'
                      formatGroupLabel={(group) => (
                        <div className="text-xs font-semibold text-gray-500 py-1">
                          {group.label}
                        </div>
                      )}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className='sm:col-span-4 mt-4'>
            <div>
              <label htmlFor='placeAdvertise' className='block text-sm font-medium leading-6 text-gray-900'>
                Where would you like to advertise this job?
                <span className='text-red-600'>*</span>
              </label>
              {errors.placeAdvertise && (
                <p className='text-xs text-red-600 mt-1'>
                  {errors.placeAdvertise.message || "Please select at least one location to advertise the job."}
                </p>
              )}
              <div className='mt-2'>
                <Controller
                  name='placeAdvertise'
                  control={control}
                  rules={{
                    required: "Please select at least one location to advertise the job",
                    validate: (value: any) => (Array.isArray(value) && value.length > 0) || "Please select at least one location",
                  }}
                  render={({ field: { onChange, value } }: { field: Field }) => (
                    <Select
                      className='text-sm'
                      classNamePrefix='select'
                      options={advertiseOptions}
                      value={advertiseOptions.filter((item: any) => 
                        Array.isArray(value) 
                          ? value.includes(item.value) 
                          : item.value === value
                      )}
                      onChange={(val) => {
                        const selectedValues = val ? val.map((item: any) => item.value) : [];
                        if (selectedValues.length <= 10) {
                          onChange(selectedValues);
                        }
                      }}
                      components={{
                        DropdownIndicator: () => (
                          <div className='pointer-events-none px-2'>
                            <SelectChevronDown />
                          </div>
                        ),
                        IndicatorSeparator: () => null,
                      }}
                      isClearable={false}
                      isMulti
                      noOptionsMessage={() => null}
                      placeholder='Select locations... (max 10)'
                      isOptionDisabled={(option) => {
                        // First check if it's a region header (these should always be disabled)
                        if (option.isDisabled) return true;
                        
                        // Then check if we've reached the selection limit
                        const currentSelections = Array.isArray(value) ? value.length : 0;
                        return currentSelections >= 10;
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
          <button
            id='pageTitleInfoNextBtn'
            type='submit'
            className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
          >
            Next
          </button>
        </div>
      </form>

      {/* Position Creation Modal */}
      <CreateModal
        module='position'
        isOpen={isAddPositionModalOpen}
        setIsOpen={setIsAddPositionModalOpen}
        refetch={handlePositionCreated}
      />
    </>
  );
}
