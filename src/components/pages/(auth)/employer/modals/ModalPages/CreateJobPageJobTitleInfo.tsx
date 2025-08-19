import { Dispatch } from 'react';

import Select from 'react-select';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';

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
  const advertiseOptions = [
    {
      label: <strong>- NATIONAL CAPITAL REGION -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Metro Manila',
      label: 'Metro Manila',
    },
    {
      label: <strong>- REGION I -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Abra',
      label: 'Abra',
    },
    {
      value: 'Apayao',
      label: 'Apayao',
    },
    {
      value: 'Benguet',
      label: 'Benguet',
    },
    {
      value: 'Ifugao',
      label: 'Ifugao',
    },
    {
      value: 'Kalinga',
      label: 'Kalinga',
    },
    {
      value: 'Mountain Province',
      label: 'Mountain Province',
    },
    {
      label: <strong>- REGION II -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Ilocos Norte',
      label: 'Ilocos Norte',
    },
    {
      value: 'Ilocos Sur',
      label: 'Ilocos Sur',
    },
    {
      value: 'La Union',
      label: 'La Union',
    },
    {
      value: 'Pangasinan',
      label: 'Pangasinan',
    },
    {
      label: <strong>- REGION III -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Aurora',
      label: 'Aurora',
    },
    {
      value: 'Bataan',
      label: 'Bataan',
    },
    {
      value: 'Bulacan',
      label: 'Bulacan',
    },
    {
      value: 'Nueva Ecija',
      label: 'Nueva Ecija',
    },
    {
      value: 'Pampanga',
      label: 'Pampanga',
    },
    {
      value: 'Tarlac',
      label: 'Tarlac',
    },
    {
      value: 'Zambales',
      label: 'Zambales',
    },
    {
      label: <strong>- REGION IV-A -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Batangas',
      label: 'Batangas',
    },
    {
      value: 'Cavite',
      label: 'Cavite',
    },
    {
      value: 'Laguna',
      label: 'Laguna',
    },
    {
      value: 'Quezon',
      label: 'Quezon',
    },
    {
      value: 'Rizal',
      label: 'Rizal',
    },
    {
      label: <strong>- REGION IV-B -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Marinduque',
      label: 'Marinduque',
    },
    {
      value: 'Occidental Mindoro',
      label: 'Occidental Mindoro',
    },
    {
      value: 'Oriental Mindoro',
      label: 'Oriental Mindoro',
    },
    {
      value: 'Palawan',
      label: 'Palawan',
    },
    {
      value: 'Romblon',
      label: 'Romblon',
    },
    {
      label: <strong>- REGION V -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Albay',
      label: 'Albay',
    },
    {
      value: 'Camarines Norte',
      label: 'Camarines Norte',
    },
    {
      value: 'Camarines Sur',
      label: 'Camarines Sur',
    },
    {
      value: 'Catanduanes',
      label: 'Catanduanes',
    },
    {
      value: 'Masbate',
      label: 'Masbate',
    },
    {
      value: 'Sorsogon',
      label: 'Sorsogon',
    },
    {
      label: <strong>- REGION VI -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Aklan',
      label: 'Aklan',
    },
    {
      value: 'Antique',
      label: 'Antique',
    },
    {
      value: 'Capiz',
      label: 'Capiz',
    },
    {
      value: 'Guimaras',
      label: 'Guimaras',
    },
    {
      value: 'Iloilo',
      label: 'Iloilo',
    },
    {
      value: 'Negros Occidental',
      label: 'Negros Occidental',
    },
    {
      label: <strong>- REGION VII -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Bohol',
      label: 'Bohol',
    },
    {
      value: 'Cebu',
      label: 'Cebu',
    },
    {
      value: 'Negros Oriental',
      label: 'Negros Oriental',
    },
    {
      value: 'Siquijor',
      label: 'Siquijor',
    },
    {
      label: <strong>- REGION VIII -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Biliran',
      label: 'Biliran',
    },
    {
      value: 'Eastern Samar',
      label: 'Eastern Samar',
    },
    {
      value: 'Leyte',
      label: 'Leyte',
    },
    {
      value: 'Northern Samar',
      label: 'Northern Samar',
    },
    {
      value: 'Samar',
      label: 'Samar',
    },
    {
      value: 'Southern Leyte',
      label: 'Southern Leyte',
    },
    {
      label: <strong>- REGION IX -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Zamboanga del Norte',
      label: 'Zamboanga del Norte',
    },
    {
      value: 'Zamboanga del Sur',
      label: 'Zamboanga del Sur',
    },
    {
      value: 'Zamboanga Sibugay',
      label: 'Zamboanga Sibugay',
    },
    {
      label: <strong>- REGION X -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Bukidnon',
      label: 'Bukidnon',
    },
    {
      value: 'Camiguin',
      label: 'Camiguin',
    },
    {
      value: 'Lanao del Norte',
      label: 'Lanao del Norte',
    },
    {
      value: 'Misamis Occidental',
      label: 'Misamis Occidental',
    },
    {
      value: 'Misamis Oriental',
      label: 'Misamis Oriental',
    },
    {
      label: <strong>- REGION XI -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Compostela Valley',
      label: 'Compostela Valley',
    },
    {
      value: 'Davao del Norte',
      label: 'Davao del Norte',
    },
    {
      value: 'Davao del Sur',
      label: 'Davao del Sur',
    },
    {
      value: 'Davao Occidental',
      label: 'Davao Occidental',
    },
    {
      value: 'Davao Oriental',
      label: 'Davao Oriental',
    },
    {
      label: <strong>- REGION XII -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Cotabato',
      label: 'Cotabato',
    },
    {
      value: 'Sarangani',
      label: 'Sarangani',
    },
    {
      value: 'South Cotabato',
      label: 'South Cotabato',
    },
    {
      value: 'Sultan Kudarat',
      label: 'Sultan Kudarat',
    },
    {
      label: <strong>- REGION XIII -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Agusan del Norte',
      label: 'Agusan del Norte',
    },
    {
      value: 'Agusan del Sur',
      label: 'Agusan del Sur',
    },
    {
      value: 'Dinagat Islands',
      label: 'Dinagat Islands',
    },
    {
      value: 'Surigao del Norte',
      label: 'Surigao del Norte',
    },
    {
      value: 'Surigao del Sur',
      label: 'Surigao del Sur',
    },
    {
      label: <strong>- AUTONOMOUS REGION OF MUSLIM MINDANAO -</strong>,
      value: null,
      isDisabled: true,
    },
    {
      value: 'Basilan',
      label: 'Basilan',
    },
    {
      value: 'Lanao del Sur',
      label: 'Lanao del Sur',
    },
    {
      value: 'Maguindanao',
      label: 'Maguindanao',
    },
    {
      value: 'Sulu',
      label: 'Sulu',
    },
    {
      value: 'Tawi-tawi',
      label: 'Tawi-tawi',
    },
  ];

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
