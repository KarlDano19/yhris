import { Fragment, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { ArrowPathIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface OrgStructure {
  id: number | string;
  description: string;
  position_name: string;
  position?: number;
  parent?: number | null;
  parent_position_name?: string;
  order?: number;
  is_active?: boolean;
  children?: OrgStructure[];
  employees?: any[];
  primary_employee?: any;
  isAddButton?: boolean;
}

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (action: 'swap' | 'move') => void;
  draggedPosition?: OrgStructure | null;
  targetPosition?: OrgStructure | null;
  isLoading?: boolean;
}

export default function MoveModal({
  isOpen,
  onClose,
  onConfirm,
  draggedPosition,
  targetPosition,
  isLoading = false
}: MoveModalProps) {
  const cancelButtonRef = useRef(null);

  const handleSwap = () => {
    onConfirm('swap');
  };

  const handleMove = () => {
    onConfirm('move');
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={onClose}>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-[500px]'>
                <div className='flex justify-center py-8 px-2'>
                  <ArrowPathIcon className='w-16 h-16 text-blue-600' />
                </div>
                
                <div className='text-xl px-20 text-center'>
                  <p className='text-xl text-gray-600 font-bold mb-4'>
                    How would you like to move this position?
                  </p>
                  
                  {draggedPosition && targetPosition && (
                    <div className='mb-6'>
                      <div className='p-3 bg-blue-50 rounded-lg mb-3'>
                        <p className='text-lg font-semibold text-blue-800'>
                          {draggedPosition.position_name}
                        </p>
                        <p className='text-sm text-blue-600'>
                          Moving from: {draggedPosition.parent_position_name || 'Root'}
                        </p>
                      </div>
                      
                      <div className='flex items-center justify-center mb-3'>
                        <ArrowDownIcon className='w-6 h-6 text-gray-400' />
                      </div>
                      
                      <div className='p-3 bg-green-50 rounded-lg'>
                        <p className='text-lg font-semibold text-green-800'>
                          {targetPosition.position_name}
                        </p>
                        <p className='text-sm text-green-600'>
                          Target position
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className='space-y-4'>
                    <div className='p-4 border border-gray-200 rounded-lg'>
                      <h3 className='font-semibold text-gray-800 mb-2 flex items-center'>
                        <ArrowPathIcon className='w-5 h-5 mr-2 text-blue-600' />
                        Swap Positions
                      </h3>
                      <p className='text-sm text-gray-600 mb-3'>
                        Exchange the positions of these two items within the same level
                      </p>
                      <button
                        onClick={handleSwap}
                        disabled={isLoading}
                        className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors'
                      >
                        Swap Positions
                      </button>
                    </div>
                    
                    <div className='p-4 border border-gray-200 rounded-lg'>
                      <h3 className='font-semibold text-gray-800 mb-2 flex items-center'>
                        <ArrowDownIcon className='w-5 h-5 mr-2 text-green-600' />
                        Move as Child
                      </h3>
                      <p className='text-sm text-gray-600 mb-3'>
                        Move the dragged position to become a child of the target position
                      </p>
                      <button
                        onClick={handleMove}
                        disabled={isLoading}
                        className='w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors'
                      >
                        Move as Child
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className='flex justify-center w-full px-4 space-x-8 pt-6 pb-7'>
                  <span className='mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto'>
                    <button
                      type='button'
                      ref={cancelButtonRef}
                      className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-gray-600 px-20 py-2 bg-white text-base leading-6 font-bold text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-gray-300 focus:shadow-outline-gray transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </span>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
