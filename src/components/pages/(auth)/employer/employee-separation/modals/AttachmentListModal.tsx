import { Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { XCircleIcon } from '@heroicons/react/24/outline';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';

interface Attachment {
  id?: number;
  attachment: string;
  attachment_name: string;
  created_at?: string;
}

interface AttachmentListModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  attachments: Attachment[];
  title: string;
}

export default function AttachmentListModal({
  isOpen,
  setIsOpen,
  attachments,
  title,
}: AttachmentListModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        {/* Modal Panel */}
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                {/* Header */}
                <div className="bg-savoy-blue px-4 py-3 sm:px-6 flex justify-between items-center">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-white">
                    {title}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-white hover:text-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <XCircleIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Content */}
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
                  {attachments.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No attachments available</p>
                  ) : (
                    <div className="space-y-2">
                      {attachments.map((attachment, index) => (
                        <div
                          key={attachment.id || index}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {attachment.attachment_name}
                            </p>
                            {attachment.created_at && (
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(attachment.created_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            className="ml-4 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => window.open(attachment.attachment, '_blank')}
                          >
                            View
                            <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
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
