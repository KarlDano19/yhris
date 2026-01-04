'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';

interface JobDetails {
  title: string;
  clientName: string;
  time: string;
  priceRange: string;
}

interface JobAcceptedModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobDetails: JobDetails;
  onMessageClient: () => void;
}

const JobAcceptedModal = ({
  isOpen,
  onClose,
  jobDetails,
  onMessageClient,
}: JobAcceptedModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Content */}
                <div className="p-6">
                  {/* Success Indicator */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckIcon className="h-8 w-8 text-green-600" />
                    </div>
                  </div>

                  {/* Heading */}
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold text-gray-900 text-center mb-3"
                  >
                    Job Accepted!
                  </Dialog.Title>

                  {/* Confirmation Message */}
                  <p className="text-sm text-gray-600 text-center mb-6">
                    You've accepted the job request from {jobDetails.clientName}. Make sure to arrive on time!
                  </p>

                  {/* Job Details Card */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          {jobDetails.title}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {jobDetails.time}
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        {jobDetails.priceRange}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={onMessageClient}
                      className="flex-1 px-4 py-2.5 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors"
                    >
                      Message Client
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default JobAcceptedModal;

