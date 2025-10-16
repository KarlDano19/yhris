import { Dispatch, Fragment, ReactNode, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import WarningRed from '@/svg/WarningRed';

/**
 * Base type for delete modal data. Extend this type to add custom properties.
 * 
 * @example
 * interface MyModalData extends DeleteModalData {
 *   id: number;
 *   name?: string;
 * }
 */
export type DeleteModalData = {
  open: boolean;
  [key: string]: any; // Allow additional data properties
};

interface DeleteModalProps<T extends DeleteModalData = DeleteModalData> {
  isOpen: T;
  setIsOpen: Dispatch<T | null>;
  onConfirm: (data?: T) => void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  customText?: string;
}

/**
 * Global reusable delete confirmation modal with warning icon.
 * 
 * @example
 * // Basic usage
 * <DeleteModal
 *   isOpen={{ open: true, id: 123 }}
 *   setIsOpen={setIsOpen}
 *   onConfirm={(data) => console.log('Deleting', data?.id)}
 *   isLoading={false}
 * />
 * 
 * @example
 * // With custom text
 * <DeleteModal
 *   isOpen={{ open: true }}
 *   setIsOpen={setIsOpen}
 *   onConfirm={() => deleteCriteria()}
 *   customText="this criteria"
 * />
 * 
 * @example
 * // With custom type
 * interface MyModalData extends DeleteModalData {
 *   id: number;
 *   name: string;
 * }
 * 
 * <DeleteModal<MyModalData>
 *   isOpen={{ open: true, id: 123, name: 'Item' }}
 *   setIsOpen={setIsOpen}
 *   onConfirm={(data) => deleteItem(data?.id)}
 *   isLoading={isDeleting}
 *   customText="this item"
 * />
 */
export default function DeleteModal<T extends DeleteModalData = DeleteModalData>({
  isOpen,
  setIsOpen,
  onConfirm,
  isLoading = false,
  confirmText = 'Yes',
  cancelText = 'No',
  customText = 'this entry',
}: DeleteModalProps<T>) {
  const cancelButtonRef = useRef(null);

  const customCloseModal = () => {
    setIsOpen(null);
  };

  const handleConfirm = () => {
    onConfirm(isOpen);
  };

  return (
    <Transition.Root show={isOpen?.open ?? false} as={Fragment}>
      <Dialog as='div' className='relative z-[9999]' initialFocus={cancelButtonRef} onClose={customCloseModal}>
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

        <div className='fixed inset-0 z-[9999] overflow-y-auto'>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-full max-w-[90vw] sm:max-w-[500px] mx-2 sm:mx-4'>
                <div className='flex justify-center py-6 sm:py-8 px-2'>
                  <WarningRed />
                </div>
                <div className='text-lg sm:text-xl px-4 sm:px-8 lg:px-20 text-center'>
                  <p className='text-lg sm:text-xl text-gray-600 font-bold leading-tight'>
                    Are you sure you want to <span className='text-red-500'>delete</span> {customText}?
                  </p>
                </div>
                <div className='flex flex-col sm:flex-row justify-center w-full px-4 space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-8 pt-6 sm:pt-10 pb-4 sm:pb-7'>
                  <button
                    type='button'
                    className='w-full sm:w-auto sm:flex-1 max-w-[200px] sm:max-w-none mx-auto rounded-md border border-blue-600 px-6 sm:px-12 lg:px-20 py-2.5 sm:py-2 bg-white text-sm sm:text-base font-bold text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 transition ease-in-out duration-150'
                    onClick={customCloseModal}
                    ref={cancelButtonRef}
                  >
                    {cancelText}
                  </button>
                  <button
                    type='button'
                    className='w-full sm:w-auto sm:flex-1 max-w-[200px] sm:max-w-none mx-auto rounded-md border border-transparent px-6 sm:px-12 lg:px-20 py-2.5 sm:py-2 bg-blue-600 text-sm sm:text-base font-bold text-white hover:bg-gray-500 focus:outline-none transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={handleConfirm}
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
                    {!isLoading && confirmText}
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

