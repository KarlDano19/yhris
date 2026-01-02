'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

interface SavedJob {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  logo: string;
  saved: boolean;
}

interface SavedJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedJobs: SavedJob[];
  onToggleSave?: (id: number) => void;
}

const SavedJobsModal = ({ isOpen, onClose, savedJobs, onToggleSave }: SavedJobsModalProps) => {
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <Dialog.Title as="h3" className="text-xl font-bold text-gray-900">
                    Saved Jobs
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    {savedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-savoy-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {job.logo}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
                          <p className="text-sm text-gray-600 mb-1">
                            {job.company} • {job.location}
                          </p>
                          <p className="text-sm font-semibold text-savoy-blue mb-2">{job.salary}</p>
                        </div>
                        <button
                          onClick={() => onToggleSave?.(job.id)}
                          className="text-savoy-blue hover:text-blue-700 transition-colors flex-shrink-0"
                        >
                          {job.saved ? (
                            <BookmarkIconSolid className="h-6 w-6" />
                          ) : (
                            <BookmarkIcon className="h-6 w-6" />
                          )}
                        </button>
                      </div>
                    ))}
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

export default SavedJobsModal;



