'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';

interface HiredApplicant {
  id: number;
  serviceName: string;
  providerName: string;
  providerInitials?: string;
  status: 'in-progress' | 'completed' | 'pending';
  price: number;
}

interface MyHiresModalProps {
  isOpen: boolean;
  onClose: () => void;
  hires: HiredApplicant[];
  onSendPaymentProof?: (hireId: number) => void;
}

const MyHiresModal = ({
  isOpen,
  onClose,
  hires,
  onSendPaymentProof,
}: MyHiresModalProps) => {
  // Generate initials from provider name if not provided
  const getInitials = (name: string, initials?: string) => {
    if (initials) return initials;
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatPrice = (price: number): string => {
    return `₱${price.toLocaleString()}`;
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
                  <Dialog.Title as="h3" className="text-lg font-bold text-gray-900">
                    My Hires
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-4">
                    {hires.map((hire) => (
                      <div
                        key={hire.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        {/* Service Name and Status */}
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-base font-bold text-gray-900">
                            {hire.serviceName}
                          </h4>
                          <span
                            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              hire.status
                            )}`}
                          >
                            {hire.status}
                          </span>
                        </div>

                        {/* Provider Name */}
                        <p className="text-sm text-gray-600 mb-3">
                          Provider: {hire.providerName}
                        </p>

                        {/* Price */}
                        <p className="text-base font-semibold text-orange-600 mb-4">
                          {formatPrice(hire.price)}
                        </p>

                        {/* Action Button */}
                        {hire.status === 'in-progress' && (
                          <button
                            onClick={() => onSendPaymentProof?.(hire.id)}
                            className="w-full px-4 py-2.5 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors flex items-center justify-center gap-2"
                          >
                            <DocumentArrowUpIcon className="h-5 w-5" />
                            Send Payment Proof
                          </button>
                        )}
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

export default MyHiresModal;

