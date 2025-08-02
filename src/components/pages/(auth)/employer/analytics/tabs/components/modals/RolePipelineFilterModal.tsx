import { Dispatch, Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { XCircleIcon } from '@heroicons/react/24/solid';

type RolePipelineFilterModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  onFilterApply?: (filters: any) => void;
};

export default function RolePipelineFilterModal({ isOpen, setIsOpen, onFilterApply }: RolePipelineFilterModalProps) {
  const handleSave = () => {
    // Placeholder for filter application logic
    if (onFilterApply) {
      onFilterApply({});
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
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
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Filter Role Pipeline</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={handleClose} />
                </div>
                
                <div className='px-4 pt-4 pb-6 relative'>
                  {/* Placeholder content - to be defined later */}
                  <div className='text-center py-12'>
                    <div className='text-gray-600 mb-2'>Filter Options</div>
                    <div className='text-sm text-gray-500'>Coming soon...</div>
                    <div className='text-xs text-gray-400 mt-2'>Filter functionality will be implemented based on requirements</div>
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
