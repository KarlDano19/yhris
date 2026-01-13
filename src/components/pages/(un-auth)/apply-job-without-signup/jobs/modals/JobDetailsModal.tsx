import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';



import JobDetails from '../components/tabs/company-jobs/components/JobDetails';

import { XMarkIcon } from '@heroicons/react/24/outline';



interface JobDetailsModalProps {
  open: boolean;
  onClose: () => void;
  jobId: any;
}

const JobDetailsModal = ({ open, onClose, jobId }: JobDetailsModalProps) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className={`relative z-10 block lg:hidden `} onClose={onClose}>
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
        <div className='fixed inset-0 z-10 overflow-y-auto'>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6'>
                <div className='flex justify-end px-3 mt-2'>
                  <button onClick={onClose}>
                    <XMarkIcon className='h-5 w-5 text-indigo-dye' />
                  </button>
                </div>
                <JobDetails jobId={jobId} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default JobDetailsModal;
