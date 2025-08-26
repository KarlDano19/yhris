import { Dispatch, Fragment, useState, useRef, useEffect } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { XCircleIcon } from '@heroicons/react/24/solid';
import SelectChevronDown from '@/svg/SelectChevronDown';

type DemographicBreakdownFilterModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  onFilterApply?: (filters: any) => void;
  jobItems?: any[];
  currentSelectedJob?: string;
};

export default function DemographicBreakdownFilterModal({ isOpen, setIsOpen, onFilterApply, jobItems, currentSelectedJob }: DemographicBreakdownFilterModalProps) {
  const [selectedJob, setSelectedJob] = useState(currentSelectedJob || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use provided job items
  const jobs = jobItems || [];

  // Update selectedJob when currentSelectedJob prop changes
  useEffect(() => {
    setSelectedJob(currentSelectedJob || '');
  }, [currentSelectedJob]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    if (onFilterApply) {
      onFilterApply({ selectedJob });
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedJob(currentSelectedJob || '');
  };

  const handleJobSelect = (job: string) => {
    setSelectedJob(job);
    setIsDropdownOpen(false);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={handleClose}>
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
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-[500px]'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Select Job</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={handleClose} />
                </div>
                
                <div className='px-4 pt-4 pb-6 relative'>
                  <label htmlFor='job' className='block text-sm font-medium leading-6 text-gray-900'>
                    Job
                  </label>
                  <div className='relative mt-2' ref={dropdownRef}>
                    <button
                      type='button'
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className='w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6 appearance-none text-left flex items-center justify-between'
                    >
                      <span className={selectedJob ? 'text-gray-900' : 'text-gray-400'}>
                        {selectedJob || 'Select a job position...'}
                      </span>
                      <SelectChevronDown />
                    </button>
                    
                    {isDropdownOpen && (
                      <div className='absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto'>
                        <button
                          type='button'
                          onClick={() => handleJobSelect('All Jobs')}
                          className={`block w-full text-left px-3 py-2 text-sm hover:bg-savoy-blue hover:text-white focus:bg-savoy-blue focus:text-white focus:outline-none transition-colors duration-150 ${
                            selectedJob === 'All Jobs' ? 'bg-savoy-blue text-white' : 'text-gray-900'
                          }`}
                        >
                          All Jobs
                        </button>
                        {jobs.map((job) => (
                          <button
                            key={job.id}
                            type='button'
                            onClick={() => handleJobSelect(job.job_title)}
                            className={`block w-full text-left px-3 py-2 text-sm hover:bg-savoy-blue hover:text-white focus:bg-savoy-blue focus:text-white focus:outline-none transition-colors duration-150 ${
                              selectedJob === job.job_title ? 'bg-savoy-blue text-white' : 'text-gray-900'
                            }`}
                          >
                            {job.job_title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className='flex justify-end w-full px-4 space-x-4 pt-6 pb-6'>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-blue-600 px-6 py-2 bg-white text-sm font-medium text-blue-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
                    onClick={handleClose}
                  >
                    Close
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md bg-savoy-blue px-6 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:ring-offset-2 transition-colors'
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
