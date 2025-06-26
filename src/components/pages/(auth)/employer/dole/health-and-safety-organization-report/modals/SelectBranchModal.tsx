import { Dispatch, Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import useGetLocationItems from '@/components/hooks/useGetLocationItems';

import { XCircleIcon } from '@heroicons/react/24/solid';
import SelectChevronDown from '@/svg/SelectChevronDown';

type SelectBranchModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  onBranchSelect: (branch: string) => void;
};

export default function SelectBranchModal({ isOpen, setIsOpen, onBranchSelect }: SelectBranchModalProps) {
  const { data: locationItems } = useGetLocationItems();

  const handleBranchSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBranch = event.target.value;
    onBranchSelect(selectedBranch);
    setIsOpen(false);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={() => setIsOpen(false)}>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:mx-8 sm:w-full sm:max-w-2xl'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Select Location</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                <div className='mt-4 px-4'>
                  <label htmlFor='location' className='text-sm font-medium leading-6 text-gray-900'>
                    Location<span className='text-red-500'>*</span>
                  </label>
                  <div className='relative mt-2'>
                    <select
                      id='location'
                      onChange={handleBranchSelect}
                      className='rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6 disabled:bg-stone-50 disabled:text-opacity-100'
                    >
                      {locationItems && locationItems.map((item: any) => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                    <div className='absolute right-3 top-[14px]'>
                      <SelectChevronDown />
                    </div>
                  </div>
                </div>
                <div className='mt-6 px-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    onClick={() => setIsOpen(false)} // Close modal without selection
                  >
                    Cancel
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
