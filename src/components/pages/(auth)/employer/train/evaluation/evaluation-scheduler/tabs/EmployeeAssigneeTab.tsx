import { useEffect, useState } from 'react';

import Select from 'react-select';

import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';

import SelectChevronDown from '@/svg/SelectChevronDown';
import Link from 'next/link';

interface Field {
  onChange: (value: any) => void;
  value: any;
}

function EmployeeAssigneeTab({
  control,
  Controller,
  register,
  watch,
  onSubmit,
  isLoading,
  setSelectedTab,
}: {
  control: any;
  Controller: any;
  register: any;
  watch: any;
  onSubmit: any;
  isLoading: boolean;
  setSelectedTab: (tab: number) => void;
}) {
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const { data: dataEmployee } = useGetEmployeeItems();

  useEffect(() => {
    if (dataEmployee) {
      const employeeItems = dataEmployee.map((item: any) => ({
        value: item.id,
        label: `${item.firstname} ${item.lastname}`,
      }));
      setEmployeeItems(employeeItems);
    }
  }, [dataEmployee]);

  const getFilename = (file: string) => {
    return file.split('/').pop();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-6 pt-6 pb-8'>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Send to<span className='text-red-600'>*</span>
          </label>
          <Controller
            name='employees'
            control={control}
            render={({ field: { onChange, value } }: { field: Field }) => (
              <Select
                className='basic-multi-select'
                classNamePrefix='select'
                options={employeeItems}
                value={employeeItems.filter((item: any) => value?.includes(item.value))}
                onChange={(val) => onChange(val ? val.map((item: any) => item.value) : [])}
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
              />
            )}
          />
        </div>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Message<span className='text-red-600'>*</span>
          </label>
          <textarea
            id='message'
            {...register('message', { required: true })}
            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
          />
        </div>
        <div className='sm:col-span-4 mt-2 w-full'>
          <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
            Attachment
          </label>
          <input
            id='attachment'
            type='file'
            {...register('attachment')}
            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
            accept='image/jpeg, image/png, application/msword, application/pdf, text/csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
          />
          {typeof watch('attachment') === 'string' && (
            <div className='flex text-sm mt-1 ml-1'>
              <p>Upload file:</p>&nbsp;
              <Link href={watch('attachment')} className='text-blue-500' target='_blank'>
                {getFilename(watch('attachment'))}
              </Link>
            </div>
          )}
        </div>
      </div>
      <hr />
      <div className='py-4 px-4 flex justify-between'>
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

export default EmployeeAssigneeTab;
