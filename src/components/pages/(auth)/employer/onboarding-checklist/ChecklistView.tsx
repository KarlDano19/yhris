'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ArrowLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

import LoadingSpinner from '@/components/LoadingSpinner';

import { getCookie } from 'cookies-next';

import updateSession from '@/helpers/updateSession';

import ChecklistGroup from './ChecklistGroup';
import TutorialVideoModal from './TutorialVideoModal';
import useGetChecklist from './hooks/useGetChecklist';
import useMarkChecklistItemComplete from './hooks/useMarkChecklistItemComplete';
import { T_OnboardingChecklist } from './hooks/useGetChecklist';

const ChecklistView = () => {
  const router = useRouter();
  const { data, isLoading } = useGetChecklist();

  const [selectedItem, setSelectedItem] = useState<T_OnboardingChecklist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: markComplete, isLoading: isMarking } = useMarkChecklistItemComplete();

  const record = data;

  const lockedItemIds = useMemo(() => {
    const locked = new Set<number>();
    if (!record) return locked;
    let foundFirstIncomplete = false;
    for (const phase of record.phases) {
      for (const item of phase.checklists) {
        if (foundFirstIncomplete) {
          locked.add(item.id);
        } else if (!item.is_completed) {
          foundFirstIncomplete = true;
        }
      }
    }
    return locked;
  }, [record]);

  const handleItemClick = (item: T_OnboardingChecklist) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const handleMarkComplete = (item: T_OnboardingChecklist) => {
    markComplete(item.id, { onSuccess: handleCloseModal });
  };

  const handleProceedToAcceptanceMemo = async () => {
    await updateSession({ hasCompletedOnboarding: true });
    router.push('/setup-employer-profile/acceptance-memo');
  };

  const handleDevSkip = async () => {
    // Collect all incomplete item IDs across all phases
    const incompleteIds: number[] = [];
    if (record) {
      for (const phase of record.phases) {
        for (const item of phase.checklists) {
          if (!item.is_completed) {
            incompleteIds.push(item.id);
          }
        }
      }
    }

    // Mark all incomplete items complete in parallel
    if (incompleteIds.length > 0) {
      const token = getCookie('token');
      await Promise.all(
        incompleteIds.map((id) =>
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/employer-onboarding/checklist/${id}/complete/`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
              },
            }
          )
        )
      );
    }

    await handleProceedToAcceptanceMemo();
  };

  if (isLoading) {
    return (
      <div className='flex justify-center py-12'>
        <LoadingSpinner size='lg' color='yellow' />
      </div>
    );
  }

  if (!record) {
    return (
      <div className='p-6 text-center text-gray-500 text-sm'>No onboarding checklist found.</div>
    );
  }

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='px-2 md:px-8 lg:px-4 py-6'>
          <div className='flex p-2 mb-2'>
            <button
              onClick={() => router.push('/setup-employer-profile')}
              className='flex-none flex gap-3 items-center hover:bg-gray-200 px-2 py-1 rounded'
            >
              <ArrowLeftIcon className='h-5 w-5' />
              <h4>Back</h4>
            </button>
          </div>

          <div className='mb-6'>
            <h2 className='text-xl font-bold text-indigo-dye'>Onboarding Checklist</h2>
            <p className='text-sm text-gray-500 mt-1'>
              Complete these steps to finish your onboarding setup.
            </p>
          </div>

          {/* Checklist phases */}
          <div>
            {record.phases && record.phases.length > 0 ? (
              <>
                {/* Overall progress card */}
                <div className='bg-white rounded-xl border border-gray-200 p-5 mb-6'>
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

                {record.phases.map((phase) => (
                  <ChecklistGroup
                    key={phase.id}
                    phase={phase}
                    onItemClick={handleItemClick}
                    lockedItemIds={lockedItemIds}
                  />
                ))}

                {/* Acceptance Memo — only visible when all items are complete */}
                {record.progress_pct === 100 && (
                  <div className='flex justify-end mt-2 mb-4'>
                    <button
                      type='button'
                      onClick={handleProceedToAcceptanceMemo}
                      className='flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors bg-[#355FD0] text-white hover:bg-blue-700'
                    >
                      Proceed to Acceptance Memo
                      <ChevronRightIcon className='w-4 h-4' />
                    </button>
                  </div>
                )}

                {/* TEMPORARY: Skip button for testing — remove before production */}
                <div className='flex justify-end mt-1 mb-4'>
                  <button
                    type='button'
                    onClick={handleDevSkip}
                    className='text-xs text-gray-400 underline hover:text-gray-600'
                  >
                    [DEV] Skip to Acceptance Memo
                  </button>
                </div>
              </>
            ) : (
              <div className='text-center py-8 text-gray-500 text-sm'>
                No checklist items available.
              </div>
            )}
          </div>
        </div>
      </div>

      <TutorialVideoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
        onMarkComplete={handleMarkComplete}
        isMarking={isMarking}
      />
    </>
  );
};

export default ChecklistView;
