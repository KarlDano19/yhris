'use client';

import SelectChevronDown from '@/svg/SelectChevronDown';

function EvaluationInfoTab({
  register,
  handleSubmit,
  setSelectedTab,
}: {
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
}) {
  const onSubmit = handleSubmit(() => {
    setSelectedTab(2);
  });

  return (
    <form onSubmit={onSubmit}>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-6'>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Evaluation Name<span className='text-red-600'>*</span>
          </label>
          <input
            id='name'
            type='text'
            {...register('name', { required: true })}
            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
          />
        </div>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Evaluation Type<span className='text-red-600'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='evaluation_type'
              {...register('evaluation_type', { required: true })}
              className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              defaultValue=''
            >
              <option value='' disabled>
                Select...
              </option>
              <option value='individual'>Individual</option>
              <option value='team'>Team</option>
              <option value='manager'>Manager</option>
              <option value='custom'>Custom</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
              <SelectChevronDown />
            </div>
          </div>
        </div>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Frequency<span className='text-red-600'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='frequency'
              {...register('frequency', { required: true })}
              className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              defaultValue=''
            >
              <option value='' disabled>
                Select...
              </option>
              <option value='weekly'>Weekly</option>
              <option value='bimonthly'>Bi-Monthly</option>
              <option value='monthly'>Monthly</option>
              <option value='quarterly'>Quarterly</option>
              <option value='annual'>Annual</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
              <SelectChevronDown />
            </div>
          </div>
        </div>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Format<span className='text-red-600'>*</span>
          </label>
          <div className='relative mt-2'>
            <select
              id='evaluation_format'
              {...register('evaluation_format', { required: true })}
              className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
              defaultValue=''
            >
              <option value='' disabled>
                Select...
              </option>
              {/* <option value='sheet'>Sheet</option> */}
              <option value='form'>Form</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
              <SelectChevronDown />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className='py-4 px-4 text-right'>
        <button
          type='submit'
          className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default EvaluationInfoTab;
