'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ClockIcon, MapPinIcon, CurrencyDollarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface Booking {
  id: number;
  title: string;
  clientName: string;
  location: string;
  time: string;
  priceRange: string;
}

interface UpcomingBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
}

const UpcomingBookingsModal = ({ isOpen, onClose, bookings }: UpcomingBookingsModalProps) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-6 py-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                {/* Close Button */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Title */}
                <div className="text-left mb-6">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                    Upcoming Bookings
                  </Dialog.Title>
                </div>

                {/* Bookings List */}
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-gray-900 mb-1">{booking.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{booking.clientName}</p>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                          Scheduled
                        </span>
                      </div>

                      {/* Job Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <ClockIcon className="h-4 w-4 text-gray-500" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPinIcon className="h-4 w-4 text-gray-500" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">{booking.priceRange}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                          <ChatBubbleLeftRightIcon className="h-5 w-5" />
                          Message
                        </button>
                        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                          Start
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UpcomingBookingsModal;

