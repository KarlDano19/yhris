import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { UserIcon, InformationCircleIcon, PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface JobCapacityModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  jobTitle: string;
  hiredCount: number;
  requiredSlot: number;
  applicantName: string;
  onSetInactive: () => void;
  onIncreaseLimit: () => void;
  onKeepActive: () => void;
  isLoading: boolean;
}

export default function JobCapacityModal({
  isOpen,
  setIsOpen,
  jobTitle,
  hiredCount,
  requiredSlot,
  applicantName,
  onSetInactive,
  onIncreaseLimit,
  onKeepActive,
  isLoading,
}: JobCapacityModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={() => setIsOpen(false)}>
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

        <div className='fixed inset-0 z-50 overflow-y-auto'>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-6 py-8 text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md'>
                {/* Title */}
                <Dialog.Title as='h3' className='text-xl font-semibold text-gray-900 mb-2'>
                  Job posting &quot;{jobTitle}&quot; is full
                </Dialog.Title>

                {/* Subtitle with capacity info */}
                <div className='flex items-center justify-center gap-2 mb-4'>
                  <InformationCircleIcon className='h-5 w-5 text-red-500' aria-hidden='true' />
                  <p className='text-sm text-red-600 font-medium'>
                    {hiredCount} / {requiredSlot} Capacity Reached
                  </p>
                </div>

                {/* Description */}
                <p className='text-sm text-gray-600 mb-6'>
                  Would you like to close the posting or expand
                  the capacity to hire this applicant?
                </p>

                {/* Primary Button - Hire & Increase Limit */}
                <button
                  type='button'
                  className='w-full mb-3 inline-flex justify-center items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={onIncreaseLimit}
                  disabled={isLoading}
                >
                  <PlusCircleIcon className='h-5 w-5' aria-hidden='true' />
                  Hire &amp; Increase Limit to {requiredSlot + 1}
                </button>

                {/* Secondary Button - Set to Inactive */}
                <button
                  type='button'
                  className='w-full mb-4 inline-flex justify-center items-center gap-2 rounded-md bg-savoy-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={onSetInactive}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        aria-hidden='true'
                        className='inline w-5 h-5 text-white animate-spin'
                        viewBox='0 0 100 101'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                          fill='currentColor'
                          fillOpacity='0.3'
                        />
                        <path
                          d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                          fill='currentFill'
                        />
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <XMarkIcon className='w-5 h-5' aria-hidden='true' />
                      Set to Inactive
                    </>
                  )}
                </button>

                {/* Tertiary Action - Cancel Link */}
                <button
                  type='button'
                  className='text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed underline'
                  onClick={onKeepActive}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
