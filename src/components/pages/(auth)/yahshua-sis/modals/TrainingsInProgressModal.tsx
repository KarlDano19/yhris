'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Training {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  level: string;
  rating: number;
  progress: number;
  price?: string;
}

interface TrainingsInProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainings: Training[];
}

const TrainingsInProgressModal = ({
  isOpen,
  onClose,
  trainings,
}: TrainingsInProgressModalProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return starValue <= rating ? (
        <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
      ) : null;
    });
  };

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
                    Trainings in Progress
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
                    {trainings.map((training) => (
                      <div
                        key={training.id}
                        className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <AcademicCapIcon className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{training.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{training.instructor}</p>
                            <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
                              <span>
                                {training.duration} • {training.level}
                              </span>
                              <div className="flex items-center gap-1">
                                {renderStars(training.rating)}
                                <span className="ml-1">{training.rating}</span>
                              </div>
                              {training.price && <span>{training.price}</span>}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-savoy-blue rounded-full transition-all"
                                  style={{ width: `${training.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {training.progress}%
                              </span>
                            </div>
                          </div>
                        </div>
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

export default TrainingsInProgressModal;



