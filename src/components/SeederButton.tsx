import { useState, Fragment } from 'react';

import { Dialog, Transition, Menu } from '@headlessui/react';
import toast from 'react-hot-toast';
import { BeakerIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

import CustomToast from '@/components/CustomToast';

interface SeederButtonProps {
  onSeed: (count: number) => Promise<void>;
  onUnseed?: () => Promise<void>;
  isLoading?: boolean;
  isUnseeding?: boolean;
  disabled?: boolean;
  maxCount?: number;
  defaultCount?: number;
  showSeeder?: boolean;
}

export default function SeederButton({
  onSeed,
  onUnseed,
  isLoading = false,
  isUnseeding = false,
  disabled = false,
  maxCount = 1000,
  defaultCount = 5,

  // showSeeder is used to hide the seeder button if it is not needed
  showSeeder = true,
  
}: SeederButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnseedModalOpen, setIsUnseedModalOpen] = useState(false);
  const [count, setCount] = useState(defaultCount);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    if (count < 1 || count > maxCount) {
      toast.custom(
        () => <CustomToast message={`Count must be between 1 and ${maxCount}`} type="error" />,
        { duration: 3000 }
      );
      return;
    }

    setIsSeeding(true);
    try {
      await onSeed(count);
      setIsModalOpen(false);
      setCount(defaultCount);
    } catch (error) {
      // Error handling is done by the parent component
      console.error('Seeding error:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleUnseed = async () => {
    if (!onUnseed) return;
    
    try {
      await onUnseed();
      setIsUnseedModalOpen(false);
    } catch (error) {
      // Error handling is done by the parent component
      console.error('Unseeding error:', error);
    }
  };

  // Don't render anything if showSeeder is false
  if (!showSeeder) {
    return null;
  }

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex items-center justify-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50 disabled:cursor-not-allowed">
            <BeakerIcon className="h-5 w-5" aria-hidden="true" />
            SEEDER
            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={disabled || isLoading}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } group flex w-full items-center px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <BeakerIcon className="mr-3 h-5 w-5 text-purple-500" aria-hidden="true" />
                    {isLoading ? 'Seeding...' : 'Seed Data'}
                  </button>
                )}
              </Menu.Item>
              
              {onUnseed && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setIsUnseedModalOpen(true)}
                      disabled={disabled || isUnseeding}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } group flex w-full items-center px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <svg className="mr-3 h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      {isUnseeding ? 'Unseeding...' : 'Unseed All'}
                    </button>
                  )}
                </Menu.Item>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsModalOpen}>
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

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                      <BeakerIcon className="h-6 w-6 text-purple-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                        Seed Data
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Generate fake data for testing and development purposes.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      {/* Count Input */}
                      <div>
                        <label htmlFor="count" className="block text-sm font-medium text-gray-700 text-left">
                          Number of Records
                        </label>
                        <input
                          type="number"
                          id="count"
                          name="count"
                          min="1"
                          max={maxCount}
                          value={count}
                          onChange={(e) => setCount(parseInt(e.target.value) || defaultCount)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm py-2 px-3 border"
                        />
                        <p className="mt-1 text-xs text-gray-500">Maximum: {maxCount} records</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSeed}
                      disabled={isSeeding}
                    >
                      {isSeeding ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Seeding...
                        </div>
                      ) : (
                        'Generate'
                      )}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isSeeding}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Unseed Confirmation Modal */}
      <Transition.Root show={isUnseedModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsUnseedModalOpen}>
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

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                        Delete All Data
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          This will permanently delete ALL data. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => setIsUnseedModalOpen(false)}
                      disabled={isUnseeding}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleUnseed}
                      disabled={isUnseeding}
                    >
                      {isUnseeding ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Deleting...
                        </div>
                      ) : (
                        'Delete All'
                      )}
                    </button>
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

