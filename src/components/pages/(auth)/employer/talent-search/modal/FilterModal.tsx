import { Dispatch, Fragment, useState, useRef, useEffect } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import classNames from '@/helpers/classNames';
import { useForm, Controller } from 'react-hook-form';
import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import regions from '@/utils/regions';

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

// Use the same regions as the applicant edit profile
const LOCATION_OPTIONS = regions.map((region) => region.value);

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

  // Location search state
  const [locationSearchInput, setLocationSearchInput] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(LOCATION_OPTIONS);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Reset form when modal opens with current filters
  useEffect(() => {
    if (isOpen && currentFilters) {
      reset(currentFilters);
    }
  }, [isOpen, currentFilters, reset]);

  const onSubmit = (data: FilterData) => {
    onFilterUpdate(data);
  };

  const handleLocationToggle = (location: string) => {
    const currentLocations = watchedLocation || [];
    const newLocations = currentLocations.includes(location)
      ? currentLocations.filter((loc) => loc !== location)
      : [...currentLocations, location];

    setValue('location', newLocations);
  };

  const removeLocation = (locationToRemove: string) => {
    const currentLocations = watchedLocation || [];
    setValue(
      'location',
      currentLocations.filter((loc) => loc !== locationToRemove)
    );
  };

  const clearAllFilters = () => {
    reset({
      location: [],
      gender: '',
      salary: '',
    });
    setLocationSearchInput('');
    setFilteredLocations(LOCATION_OPTIONS);
    setShowLocationDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.location-dropdown-container')) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter locations based on search input
  useEffect(() => {
    if (locationSearchInput.trim() === '') {
      setFilteredLocations(LOCATION_OPTIONS);
    } else {
      const filtered = LOCATION_OPTIONS.filter((location) =>
        location.toLowerCase().includes(locationSearchInput.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [locationSearchInput]);

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
                    <label className='block text-sm font-medium leading-6 text-gray-900 mb-2'>Location</label>

                    {/* Location dropdown with search */}
                    <div className='relative location-dropdown-container'>
                      <div>
                        <input
                          type='text'
                          value={locationSearchInput}
                          onChange={(e) => setLocationSearchInput(e.target.value)}
                          onFocus={() => setShowLocationDropdown(true)}
                          placeholder='Search and select regions...'
                          className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
                        />
                      </div>

                      {/* Location dropdown */}
                      {showLocationDropdown && (
                        <div className='absolute z-10 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg'>
                          {filteredLocations.length > 0 ? (
                            filteredLocations.map((location) => (
                              <div
                                key={location}
                                onClick={() => handleLocationToggle(location)}
                                className={`px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm ${
                                  watchedLocation?.includes(location) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                }`}
                              >
                                {location}
                                {watchedLocation?.includes(location) && <span className='ml-2 text-blue-600'>✓</span>}
                              </div>
                            ))
                          ) : (
                            <div className='px-3 py-2 text-gray-500 text-sm'>
                              No regions found matching &ldquo;{locationSearchInput}&rdquo;
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Selected locations display */}
                    {watchedLocation && watchedLocation.length > 0 && (
                      <div className='mb-3 flex flex-wrap gap-2'>
                        {watchedLocation.map((loc) => (
                          <span
                            key={loc}
                            className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                          >
                            {loc}
                            <button
                              type='button'
                              onClick={() => removeLocation(loc)}
                              className='text-blue-600 hover:text-blue-800'
                            >
                              <XMarkIcon className='h-3 w-3' />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
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
