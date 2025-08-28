import { Dispatch, Fragment, useState, useRef, useEffect } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import Select from 'react-select';

import classNames from '@/helpers/classNames';
import { useForm, Controller } from 'react-hook-form';
import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { advertiseOptions } from '@/utils/advertiseOptions';
import SelectChevronDown from '@/svg/SelectChevronDownDummy';

interface FilterData {
  location: string[];
  gender: string;
  salary: string;
}

interface FilterModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  refetch: any;
  onFilterUpdate: (filterData: FilterData) => void;
  currentFilters?: FilterData;
}


const GENDER_OPTIONS = ['Male', 'Female', 'Any'];

const SALARY_RANGES = [
  'Below ₱15,000',
  '₱15,000 - ₱25,000',
  '₱25,000 - ₱35,000',
  '₱35,000 - ₱50,000',
  '₱50,000 - ₱75,000',
  '₱75,000 - ₱100,000',
  'Above ₱100,000',
  'Any',
];

export default function FilterModal({ isOpen, setIsOpen, refetch, onFilterUpdate, currentFilters }: FilterModalProps) {
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, reset, control, setValue, watch } = useForm<FilterData>({
    defaultValues: {
      location: [],
      gender: '',
      salary: '',
    },
  });

  const watchedLocation = watch('location');

  // Reset form when modal opens with current filters
  useEffect(() => {
    if (isOpen && currentFilters) {
      reset(currentFilters);
    }
  }, [isOpen, currentFilters, reset]);

  const onSubmit = (data: FilterData) => {
    onFilterUpdate(data);
    setIsOpen(false);
  };


  const clearAllFilters = () => {
    reset({
      location: [],
      gender: '',
      salary: '',
    });
  };


  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-[600px] max-h-[90vh] overflow-y-auto'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Filter Talent</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='px-4 pt-4 pb-2'>
                    <label className='block text-sm font-medium leading-6 text-gray-900 mb-2'>
                      Location
                    </label>
                    <Controller
                      name='location'
                      control={control}
                      render={({ field: { onChange, value } }) => (
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
                            const selectedValues = val ? val.map((item: any) => item.value).filter(Boolean) : [];
                            onChange(selectedValues);
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
                          placeholder='Select locations...'
                          menuPortalTarget={document.body}
                          menuPosition='fixed'
                          maxMenuHeight={200}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            menu: (base) => ({
                              ...base,
                              maxHeight: 200,
                            }),
                            menuList: (base) => ({
                              ...base,
                              maxHeight: 200,
                            }),
                          }}
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

                  <div className='px-4 pb-2'>
                    <label className='block text-sm font-medium leading-6 text-gray-900 mb-2'>Gender</label>
                    <select
                      {...register('gender')}
                      className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
                    >
                      <option value=''>Any Gender</option>
                      {GENDER_OPTIONS.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='px-4 pt-4 pb-2'>
                    <label className='block text-sm font-medium leading-6 text-gray-900 mb-2'>Salary Range</label>
                    <select
                      {...register('salary')}
                      className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
                    >
                      <option value=''>Any Salary Range</option>
                      {SALARY_RANGES.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='flex justify-center w-full px-4 space-x-4 pt-6 pb-7'>
                    <button
                      type='button'
                      onClick={clearAllFilters}
                      className='inline-flex justify-center drop-shadow-xl rounded-md border border-gray-300 px-6 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                    >
                      Clear All
                    </button>
                    <button
                      type='button'
                      onClick={() => setIsOpen(false)}
                      className='inline-flex justify-center drop-shadow-xl rounded-md border border-blue-600 px-6 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='inline-flex justify-center rounded-md bg-savoy-blue px-6 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90'
                    >
                      Apply Filters
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
