'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ArrowDownTrayIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface Transaction {
  id: number;
  description: string;
  clientName: string;
  amount: number;
  date: string;
  category: string;
}

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onDownloadReceipt: () => void;
}

const TransactionDetailsModal = ({
  isOpen,
  onClose,
  transaction,
  onDownloadReceipt,
}: TransactionDetailsModalProps) => {
  if (!transaction) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-8 py-8 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                {/* Close Button */}
                <div className="absolute top-5 right-5">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Title */}
                <div className="text-left mb-8">
                  <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                    Transaction Details
                  </Dialog.Title>
                </div>

                {/* Transaction Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <CurrencyDollarIcon className="h-10 w-10 text-green-600" />
                  </div>
                </div>

                {/* Amount */}
                <div className="text-center mb-3">
                  <p className="text-4xl font-bold text-green-600">
                    +₱{transaction.amount.toLocaleString()}
                  </p>
                </div>

                {/* Date */}
                <div className="text-center mb-8">
                  <p className="text-base text-gray-600">{formatDate(transaction.date)}</p>
                </div>

                {/* Details Section */}
                <div className="border-t border-gray-200 pt-6 mb-8">
                  <div className="space-y-5">
                    <div className="flex justify-between items-start">
                      <span className="text-lg font-medium text-gray-500">Description</span>
                      <span className="text-lg font-bold text-gray-900 text-right max-w-[65%]">
                        {transaction.description} - {transaction.clientName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-500">Category</span>
                      <span className="text-lg font-bold text-gray-900">{transaction.category}</span>
                    </div>
                  </div>
                </div>

                {/* Download Receipt Button */}
                <div>
                  <button
                    onClick={onDownloadReceipt}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-4 rounded-lg transition-colors"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    <span>Download Receipt</span>
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default TransactionDetailsModal;

