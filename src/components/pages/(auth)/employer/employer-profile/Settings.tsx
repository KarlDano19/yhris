import { useMemo, useEffect } from 'react';
import React from 'react';

import { Controller } from 'react-hook-form';
import Select from 'react-select';

import { timezones } from '@/utils/pytz_timezones';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';

interface Field {
  onChange: (value: any) => void;
  value: any;
}

function Settings({ register, onSubmit, isLoading, onBack, watch, setValue, control }: { register: any; onSubmit: any; isLoading: any; onBack: () => void; watch: any; setValue: any; control: any }) {
  // Transform timezones into flat array format like advertiseOptions
  const timezoneOptions = useMemo(() => {
    const options: any[] = [];
    timezones.forEach((group) => {
      // Add group header as disabled option
      options.push({
        label: <strong>- {group.group.toUpperCase()} -</strong>,
        value: null,
        isDisabled: true,
      });
      // Add timezone options
      group.zones.forEach((zone) => {
        options.push({
          value: zone.value,
          label: zone.value,
        });
      });
    });
    return options;
  }, []);

  // Time format options
  const timeFormatOptions = useMemo(() => [
    { value: '12hr', label: '12 Hour (AM/PM)' },
    { value: '24hr', label: '24 Hour' },
  ], []);

  const timezoneValue = watch('timezone');

  // Set default timezone to Asia/Manila if empty (only on mount)
  useEffect(() => {
    if (!timezoneValue) {
      setValue('timezone', 'Asia/Manila', { shouldValidate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Custom styles for react-select to match input field styling
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: '#f9fafb', // bg-gray-50
      borderColor: state.isFocused ? '#2563eb' : '#d1d5db', // border-gray-300, focus:border-primary-600
      borderRadius: '0.5rem', // rounded-lg
      borderWidth: '1px',
      boxShadow: state.isFocused ? '0 0 0 1px #2563eb' : 'none', // focus:ring-primary-600
      fontSize: '0.875rem', // sm:text-sm
      minHeight: '42px', // match input height (p-2.5 = 10px padding top/bottom)
      '&:hover': {
        borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#6b7280', // text-gray-500
      fontSize: '0.875rem',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#111827', // text-gray-900
      fontSize: '0.875rem',
    }),
    input: (base: any) => ({
      ...base,
      color: '#111827',
      fontSize: '0.875rem',
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#2563eb'
        : state.isFocused
        ? '#eff6ff'
        : 'white',
      color: state.isSelected ? 'white' : '#111827',
      fontSize: '0.875rem',
      '&:active': {
        backgroundColor: '#2563eb',
      },
    }),
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='mt-10 mb-5 flex flex-col lg:flex-row gap-6'>
        <div className='lg:basis-1/3 lg:mr-10'>
          <label htmlFor='language' className='block mb-2 text-sm font-medium text-gray-900'>
            Language
          </label>
          <input
            type='text'
            id='language'
            {...register('language', { required: true })}
            value='English'
            className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            readOnly
          />
        </div>
        <div className='lg:basis-1/3 lg:mr-10'>
          <label htmlFor='timezone' className='block mb-2 text-sm font-medium text-gray-900'>
            Timezone
          </label>
          <div className='w-full'>
            <Controller
              name='timezone'
              control={control}
              rules={{ required: false }}
              render={({ field: { onChange, value } }: { field: Field }) => (
                <Select
                  className='text-sm'
                  classNamePrefix='select'
                  options={timezoneOptions}
                  value={timezoneOptions.find((option) => option.value === value)}
                  onChange={(val) => {
                    onChange(val?.value || '');
                  }}
                  styles={selectStyles}
                  components={{
                    DropdownIndicator: () => (
                      <div className='pointer-events-none px-2'>
                        <SelectChevronDown />
                      </div>
                    ),
                    IndicatorSeparator: () => null,
                  }}
                  isClearable={false}
                  noOptionsMessage={() => 'No timezones available'}
                  placeholder='Select a timezone...'
                  isOptionDisabled={(option) => {
                    return option.isDisabled === true;
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className='lg:basis-1/3'></div>
      </div>
      <div className='mt-5 mb-5 flex flex-col lg:flex-row gap-6'>
        <div className='lg:basis-1/3 lg:mr-10'>
          <label htmlFor='currency' className='block mb-2 text-sm font-medium text-gray-900'>
            Currency
          </label>
          <input
            type='text'
            id='currency'
            {...register('currency', { required: true })}
            value='PHP'
            className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            readOnly
          />
        </div>
        <div className='lg:basis-1/3 lg:mr-10'>
          <label htmlFor='timeFormat' className='block mb-2 text-sm font-medium text-gray-900'>
            Time Format
          </label>
          <div className='w-full'>
            <Controller
              name='timeFormat'
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }: { field: Field }) => (
                <Select
                  className='text-sm'
                  classNamePrefix='select'
                  options={timeFormatOptions}
                  value={timeFormatOptions.find((option) => option.value === value)}
                  onChange={(val) => {
                    onChange(val?.value || '');
                  }}
                  styles={selectStyles}
                  components={{
                    DropdownIndicator: () => (
                      <div className='pointer-events-none px-2'>
                        <SelectChevronDown />
                      </div>
                    ),
                    IndicatorSeparator: () => null,
                  }}
                  isClearable={false}
                  noOptionsMessage={() => 'No time formats available'}
                  placeholder='Select a time format...'
                />
              )}
            />
          </div>
        </div>
        <div className='lg:basis-1/3'></div>
      </div>
      <div className='flex flex-col lg:flex-row gap-4 lg:justify-between mb-10'>
        <button
          type='button'
          className='w-full lg:w-32 uppercase text-savoy-blue bg-white border border-savoy-blue hover:bg-blue-50 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
          onClick={onBack}
        >
          Back
        </button>
        <button
          type='submit'
          className='w-full lg:w-32 uppercase text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
          disabled={isLoading}
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
          {!isLoading && 'Save'}
        </button>
      </div>
    </form>
  );
}

export default Settings;
