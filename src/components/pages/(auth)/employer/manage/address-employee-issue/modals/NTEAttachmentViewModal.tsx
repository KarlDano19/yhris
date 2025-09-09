import { Dispatch, Fragment, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import useGetEmployeeIssueDetails from '../hooks/useGetEmployeeIssueDetails';

import { XCircleIcon } from '@heroicons/react/24/solid';

function NTEAttachmentViewModal({ isOpen, setIsOpen }: { isOpen: any; setIsOpen: Dispatch<any> }) {
  const cancelButtonRef = useRef(null);
  const { data: employeeIssueData, remove: removeEmployeeIssue } = useGetEmployeeIssueDetails(isOpen.id);
  const [isResponseView, setIsResponseView] = useState(false);

  const customCloseModal = () => {
    removeEmployeeIssue();
    setIsOpen(null);
    setIsResponseView(false);
  };

  const toggleView = () => {
    setIsResponseView(!isResponseView);
  };

  return (
    <>
      <Transition.Root show={isOpen ? true : false} as={Fragment}>
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
                <Dialog.Panel className='relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                  <div className='flex bg-savoy-blue p-2 items-center rounded-t-lg'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>NTE Attachment</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={customCloseModal} />
                  </div>
                  <div>
                    <div className='flex flex-col gap-2 p-4'>
                      <div className='flex flex-wrap gap-2 justify-start'>
                        <button 
                          className={`px-4 py-2 rounded-md transition-colors ${
                            isResponseView 
                              ? 'bg-savoy-blue text-white hover:bg-blue-700' 
                              : employeeIssueData?.is_responded 
                                ? 'bg-savoy-blue text-white hover:bg-blue-700' 
                                : 'bg-gray-400 text-white cursor-not-allowed'
                          }`}
                          onClick={toggleView}
                          disabled={!isResponseView && !employeeIssueData?.is_responded}
                        >
                          {isResponseView ? 'Back' : (employeeIssueData?.is_responded ? 'View Response' : 'View Response')}
                        </button>
                      </div>
                      
                      <div className='mt-4'>
                        {isResponseView ? (
                          <div className='space-y-4'>
                            <label htmlFor='response-message' className='block text-sm font-bold text-gray-700'>
                              Response Message:
                            </label>
                            <textarea
                              id='response-message'
                              value={employeeIssueData?.response || ''}
                              readOnly
                              className='cursor-not-allowed w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:border-transparent resize-none'
                              placeholder='No response yet'
                            />
                          </div>
                        ) : (
                          employeeIssueData?.nte_attachment && (
                            <div className='mt-4'>
                              <object data={employeeIssueData.nte_attachment} width='100%' height='500px' />
                            </div>
                          )
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

export default NTEAttachmentViewModal;
