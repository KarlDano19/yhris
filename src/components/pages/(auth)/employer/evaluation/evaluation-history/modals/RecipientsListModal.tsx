import { Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { XCircleIcon } from '@heroicons/react/24/solid';
import { UsersIcon } from '@heroicons/react/24/solid';

interface RecipientsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: string;
  employeeName: string;
  department?: string;
}

const RecipientsListModal = ({
  isOpen,
  onClose,
  recipients,
  employeeName,
  department
}: RecipientsListModalProps) => {
  // Parse recipients string into array
  const recipientsList = recipients
    .split(',')
    .map(name => name.trim())
    .filter(name => name.length > 0);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-20' onClose={onClose}>
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

        <div className='fixed inset-0 z-20 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl'>
                {/* Header */}
                <div className='flex bg-savoy-blue p-4 items-center'>
                  <h3 className='flex-1 text-white text-lg font-semibold'>
                    Evaluators List
                  </h3>
                  <XCircleIcon
                    className='w-8 h-8 text-white cursor-pointer hover:text-gray-200 transition-colors'
                    onClick={onClose}
                  />
                </div>

                {/* Content */}
                <div className='p-6'>
                  {/* Employee Info */}
                  <div className='mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm text-gray-600 font-medium'>Employee Evaluated</p>
                        <p className='text-base text-gray-900 mt-1'>{employeeName}</p>
                      </div>
                      {department && (
                        <div>
                          <p className='text-sm text-gray-600 font-medium'>Department</p>
                          <p className='text-base text-gray-900 mt-1'>{department}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recipients List */}
                  <div className='mb-4'>
                    <h4 className='text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2'>
                      <UsersIcon className='h-4 w-4 text-gray-600' />
                      Evaluators ({recipientsList.length})
                    </h4>
                    
                    {recipientsList.length > 0 ? (
                      <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
                        <ul className='divide-y divide-gray-200'>
                          {recipientsList.map((recipient, index) => (
                            <li
                              key={index}
                              className='px-4 py-3 hover:bg-gray-50 transition-colors'
                            >
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                  <div className='flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center'>
                                    <span className='text-sm font-medium text-blue-600'>
                                      {recipient.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <span className='text-sm font-medium text-gray-900'>
                                    {recipient}
                                  </span>
                                </div>
                                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                  Evaluator {index + 1}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className='text-center py-8 bg-gray-50 rounded-lg border border-gray-200'>
                        <UsersIcon className='h-12 w-12 text-gray-400 mx-auto mb-2' />
                        <p className='text-sm text-gray-500'>No evaluators found</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className='mt-6 flex justify-end'>
                    <button
                      onClick={onClose}
                      className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium text-sm'
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default RecipientsListModal;

