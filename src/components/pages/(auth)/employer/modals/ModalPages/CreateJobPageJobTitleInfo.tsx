import { Dispatch } from 'react';

import Select from 'react-select';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';
import { advertiseOptions } from '../../../../../../helpers/advertiseOptions';

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

  const firstFormSubmit = handleSubmit((data: any) => {
    onSubmit(data);
  });

  return (
    <form onSubmit={firstFormSubmit}>
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
  );
}
