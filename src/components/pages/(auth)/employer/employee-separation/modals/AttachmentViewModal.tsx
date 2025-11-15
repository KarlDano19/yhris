import { Dispatch, Fragment, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { XCircleIcon } from '@heroicons/react/24/solid';

function AttachmentViewModal({ 
  isOpen, 
  setIsOpen,
  attachmentUrl,
  title
}: { 
  isOpen: boolean; 
  setIsOpen: Dispatch<boolean>;
  attachmentUrl: string | null | undefined;
  title: string;
}) {
  const cancelButtonRef = useRef(null);

  const customCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={customCloseModal}>
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all my-2 sm:my-4 w-full max-w-4xl h-[98vh] sm:h-[95vh]'>
                  <div className='flex bg-savoy-blue p-2 items-center rounded-t-lg'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>
                      {title}
                    </h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={customCloseModal} />
                  </div>
                  <div className='h-full flex flex-col overflow-hidden'>
                    <div className='flex-1 p-4 overflow-hidden'>
                      <div className='flex flex-col gap-4 h-full'>
                        {attachmentUrl && (
                          <div className='flex-1'>
                            <div className='h-full overflow-hidden'>
                              <iframe 
                                src={attachmentUrl} 
                                width='100%' 
                                height='90%' 
                                className='min-h-[500px] sm:min-h-0 border-0'
                              />
                            </div>
                          </div>
                        )}
                        {!attachmentUrl && (
                          <div className='flex items-center justify-center h-full'>
                            <p className='text-gray-500'>No attachment available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default AttachmentViewModal;

