'use client';

import { Fragment, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import LoadingSpinner from '@/components/LoadingSpinner';

import ChecklistGroup from '../ChecklistGroup';
import TutorialVideoModal from './TutorialVideoModal';
import useGetChecklist from '../hooks/useGetChecklist';
import { T_OnboardingChecklist } from '../hooks/useGetChecklist';

interface ChecklistViewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChecklistViewModal = ({ isOpen, onClose }: ChecklistViewModalProps) => {
  const { data: record, isLoading } = useGetChecklist();
  const [selectedItem, setSelectedItem] = useState<T_OnboardingChecklist | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handleViewItem = (item: T_OnboardingChecklist) => {
    setSelectedItem(item);
    setIsVideoOpen(true);
  };

  const handleCloseVideo = () => {
    setIsVideoOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <>
    <Transition show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-[20]' onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter='ease-in-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in-out duration-300'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-30' />
        </Transition.Child>

        {/* Side panel */}
        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-300'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-300'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
              >
                <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                  <div className='flex h-full flex-col bg-gray-50 shadow-xl overflow-y-auto'>
                    {/* Header */}
                    <div className='bg-white px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0'>
                      <div>
                        <Dialog.Title className='text-base font-semibold text-gray-900'>
                          HRIS Implementation Checklist
                        </Dialog.Title>
                        <span className='inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700'>
                          Completed — View Only
                        </span>
                      </div>
                      <button
                        type='button'
                        onClick={onClose}
                        className='rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                      >
                        <span className='sr-only'>Close panel</span>
                        <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                      </button>
                    </div>

                    {/* Content */}
                    <div className='flex-1 px-5 py-5'>
                      {isLoading ? (
                        <div className='flex justify-center py-12'>
                          <LoadingSpinner size='lg' color='yellow' />
                        </div>
                      ) : !record ? (
                        <p className='text-sm text-gray-500 text-center py-8'>
                          No onboarding checklist found.
                        </p>
                      ) : (
                        <>
                          {/* Overall progress */}
                          <div className='bg-white rounded-xl border border-gray-200 p-4 mb-5'>
                            <div className='flex justify-between items-center mb-2'>
                              <span className='text-sm font-medium text-gray-700'>Overall Progress</span>
                              <span className='text-sm font-semibold text-gray-800'>
                                {record.completed_items} of {record.total_items} steps completed
                              </span>
                            </div>
                            <div className='w-full bg-gray-200 rounded-full h-2.5'>
                              <div
                                className='bg-orange-400 h-2.5 rounded-full transition-all'
                                style={{ width: `${record.progress_pct}%` }}
                              />
                            </div>
                            <p className='text-right text-xs text-gray-400 mt-1'>{record.progress_pct}%</p>
                          </div>

                          {/* Phases */}
                          {record.phases.map((phase) => (
                            <ChecklistGroup
                              key={phase.id}
                              phase={phase}
                              onItemClick={() => {}}
                              lockedItemIds={new Set<number>()}
                              onItemView={handleViewItem}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>

    <TutorialVideoModal
      isOpen={isVideoOpen}
      onClose={handleCloseVideo}
      item={selectedItem}
      onMarkComplete={() => {}}
      isMarking={false}
      viewOnly={true}
    />
    </>
  );
};

export default ChecklistViewModal;
