import { Dispatch } from 'react';

import Select from 'react-select';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';

interface Field {
  onChange: (value: any) => void;
  value: any;
}

export default function CreateJobPageOne({
  control,
  Controller,
  register,
  handleSubmit,
  setPageNumber,
  onSubmit,
}: {
  control: any;
  Controller: any;
  register: any;
  handleSubmit: any;
  setPageNumber: Dispatch<number>;
  onSubmit: (data: any) => void;
}) {
  const advertiseOptions = [
    {
      value: 'Abra',
      label: 'Abra',
    },
    {
      value: 'Agusan Del Norte',
      label: 'Agusan Del Norte',
    },
    {
      value: 'Agusan Del Sur',
      label: 'Agusan Del Sur',
    },
    {
      value: 'Aklan',
      label: 'Aklan',
    },
    {
      value: 'Albay',
      label: 'Albay',
    },
    {
      value: 'Antique',
      label: 'Antique',
    },
    {
      value: 'Apayao',
      label: 'Apayao',
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
      value: 'Basilan',
      label: 'Basilan',
    },
    {
      value: 'Batanes',
      label: 'Batanes',
    },
    {
      value: 'Batangas',
      label: 'Batangas',
    },
    {
      value: 'Benguet',
      label: 'Benguet',
    },
    {
      value: 'Biliran',
      label: 'Biliran',
    },
    {
      value: 'Bohol',
      label: 'Bohol',
    },
    {
      value: 'Bukidnon',
      label: 'Bukidnon',
    },
    {
      value: 'Bulacan',
      label: 'Bulacan',
    },
    {
      value: 'Cagayan',
      label: 'Cagayan',
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
      value: 'Capiz',
      label: 'Capiz',
    },
    {
      value: 'Catanduanes',
      label: 'Catanduanes',
    },
    {
      value: 'Cavite',
      label: 'Cavite',
    },
    {
      value: 'Cebu',
      label: 'Cebu',
    },
    {
      value: 'Cotabato',
      label: 'Cotabato',
    },
    {
      value: 'Davao De Oro',
      label: 'Davao De Oro',
    },
    {
      value: 'Davao Del Norte',
      label: 'Davao Del Norte',
    },
    {
      value: 'Davao Del Sur',
      label: 'Davao Del Sur',
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
      value: 'Eastern Samar',
      label: 'Eastern Samar',
    },
    {
      value: 'Guimaras',
      label: 'Guimaras',
    },
    {
      value: 'Ifugao',
      label: 'Ifugao',
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
      value: 'Iloilo',
      label: 'Iloilo',
    },
    {
      value: 'Isabela',
      label: 'Isabela',
    },
    {
      value: 'Kalinga',
      label: 'Kalinga',
    },
    {
      value: 'Laguna',
      label: 'Laguna',
    },
    {
      value: 'Lanao Del Norte',
      label: 'Lanao Del Norte',
    },
    {
      value: 'Lanao Del Sur',
      label: 'Lanao Del Sur',
    },
    {
      value: 'Leyte',
      label: 'Leyte',
    },
    {
      value: 'Maguindanao',
      label: 'Maguindanao',
    },
    {
      value: 'Marinduque',
      label: 'Marinduque',
    },
    {
      value: 'Masbate',
      label: 'Masbate',
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
      value: 'Mountain Province',
      label: 'Mountain Province',
    },
    {
      value: 'Negros Occidental',
      label: 'Negros Occidental',
    },
    {
      value: 'Negros Oriental',
      label: 'Negros Oriental',
    },
    {
      value: 'Northern Samar',
      label: 'Northern Samar',
    },
    {
      value: 'Nueva Ecija',
      label: 'Nueva Ecija',
    },
    {
      value: 'Nueva Vizcaya',
      label: 'Nueva Vizcaya',
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
      value: 'Pampanga',
      label: 'Pampanga',
    },
    {
      value: 'Pangasinan',
      label: 'Pangasinan',
    },
    {
      value: 'Quezon',
      label: 'Quezon',
    },
    {
      value: 'Quirino',
      label: 'Quirino',
    },
    {
      value: 'Rizal',
      label: 'Rizal',
    },
    {
      value: 'Romblon',
      label: 'Romblon',
    },
    {
      value: 'Samar',
      label: 'Samar',
    },
    {
      value: 'Sarangani',
      label: 'Sarangani',
    },
    {
      value: 'Siquijor',
      label: 'Siquijor',
    },
    {
      value: 'Sorsogon',
      label: 'Sorsogon',
    },
    {
      value: 'South Cotabato',
      label: 'South Cotabato',
    },
    {
      value: 'Southern Leyte',
      label: 'Southern Leyte',
    },
    {
      value: 'Sultan Kudarat',
      label: 'Sultan Kudarat',
    },
    {
      value: 'Sulu',
      label: 'Sulu',
    },
    {
      value: 'Surigao Del Norte',
      label: 'Surigao Del Norte',
    },
    {
      value: 'Surigao Del Sur',
      label: 'Surigao Del Sur',
    },
    {
      value: 'Tarlac',
      label: 'Tarlac',
    },
    {
      value: 'Tawi-Tawi',
      label: 'Tawi-Tawi',
    },
    {
      value: 'Zamboanga Del Norte',
      label: 'Zamboanga Del Norte',
    },
    {
      value: 'Zamboanga Del Sur',
      label: 'Zamboanga Del Sur',
    },
    {
      value: 'Zamboanga Sibugay',
      label: 'Zamboanga Sibugay',
    },
    {
      value: 'Zambales',
      label: 'Zambales',
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
              <option>Chinese</option>
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
            <div className='mt-2'>
              <Controller
                name='placeAdvertise'
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }: { field: Field }) => (
                  <Select
                    className='text-sm'
                    classNamePrefix='select'
                    options={advertiseOptions}
                    value={advertiseOptions.find((item: any) => item.value === value)}
                    onChange={(val) => onChange(val ? val.value : [])}
                    components={{
                      DropdownIndicator: () => (
                        <div className='pointer-events-none px-2'>
                          <SelectChevronDown />
                        </div>
                      ),
                      IndicatorSeparator: () => null,
                    }}
                    isClearable={false}
                    noOptionsMessage={() => null}
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
          id='pageOneNextBtn'
          type='submit'
          className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
        >
          Next
        </button>
      </div>
    </form>
  );
}
