import { Dispatch, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import WarningRed from '@/svg/WarningRed';

type T_ModalData = {
  id: number;
  open: boolean;
  question?: string;
};

export default function CustomQuestionDeleteModal({
  isOpen,
  setIsOpen,
  onConfirmDelete,
}: {
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
  onConfirmDelete: (id: number) => void;
}) {
  const cancelButtonRef = useRef(null);

  const onSubmit = () => {
    onConfirmDelete(isOpen.id);
    customCloseModal();
  };

  const customCloseModal = () => {
    setIsOpen(null);
  };

  return (
    <Transition.Root show={isOpen.open} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => customCloseModal()}>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-full max-w-sm sm:w-[500px]'>
                <div className='flex justify-center py-6 sm:py-8 px-2'>
                  <WarningRed />
                </div>
                <div className='text-lg sm:text-xl px-4 sm:px-20 text-center'>
                  <p className='text-lg sm:text-xl text-gray-600 font-bold'>
                    Are you sure you want to <span className='text-red-500'>delete</span> this question?
                  </p>
                  {isOpen.question && (
                    <p className='text-sm text-gray-500 mt-2 italic break-words'>
                      "{isOpen.question}"
                    </p>
                  )}
                </div>
                <div className='flex flex-col sm:flex-row justify-center w-full px-4 space-y-3 sm:space-y-0 sm:space-x-8 pt-6 sm:pt-10 pb-7'>
                  <span className='flex w-full rounded-md shadow-sm sm:w-auto'>
                    <button
                      type='button'
                      className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-blue-600 px-8 sm:px-20 py-2 bg-white text-base leading-6 font-bold text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                      onClick={() => customCloseModal()}
                    >
                      No
                    </button>
                  </span>
                  <span className='flex w-full rounded-md shadow-sm sm:w-auto'>
                    <button
                      type='button'
                      className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-transparent px-8 sm:px-20 py-2 bg-blue-600 text-base leading-6 font-bold text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                      onClick={() => onSubmit()}
                    >
                      Yes
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