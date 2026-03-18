'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ArrowLeftIcon, ChevronRightIcon, DocumentCheckIcon } from '@heroicons/react/24/solid';

import toast from 'react-hot-toast';

import updateSession from '@/helpers/updateSession';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';

import { T_OnboardingItem } from '@/components/pages/(auth)/admin/employer-onboarding/onboarding-tracker/modal/dummyData';

import ChecklistGroup from './ChecklistGroup';
import TutorialVideoModal from './TutorialVideoModal';
import useGetChecklist from './hooks/useGetChecklist';
import useMarkItemComplete from './hooks/useMarkItemComplete';

const ChecklistView = () => {
  const router = useRouter();
  const { data, isLoading } = useGetChecklist();
  const markItem = useMarkItemComplete();

  const [selectedItem, setSelectedItem] = useState<T_OnboardingItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openedAtMap = useRef<Record<number, number>>({});
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);

  const ACCEPTANCE_MEMO_TITLE = 'Completion of the Acceptance Memo';

  const record = data || data;
  const allItems: T_OnboardingItem[] = record?.groups?.flatMap((g: any) => g.items) ?? [];
  const memoItem = allItems.find((i) => i.title === ACCEPTANCE_MEMO_TITLE) ?? null;
  const nonMemoItems = allItems.filter((i) => i.title !== ACCEPTANCE_MEMO_TITLE);
  const allNonMemoComplete = nonMemoItems.length > 0 && nonMemoItems.every((i) => i.is_completed);

  useEffect(() => {
    if (record?.progress_pct === 100) {
      updateSession({ hasCompletedOnboarding: true }).then(() => {
        router.push('/dashboard');
      });
    }
  }, [record?.progress_pct]);

  const handleItemClick = (item: T_OnboardingItem) => {
    if (!openedAtMap.current[item.id]) {
      openedAtMap.current[item.id] = Date.now();
    }
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleNextPhase = (currentIndex: number) => {
    const nextRef = groupRefs.current[currentIndex + 1];
    if (nextRef) {
      nextRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const handleMarkComplete = (itemId: number, isCompleted: boolean) => {
    markItem.mutate(
      { itemId, is_completed: isCompleted },
      {
        onSuccess: () => {
          toast.custom(
            <CustomToast
              type='success'
              message={isCompleted ? 'Task marked as complete.' : 'Task marked as incomplete.'}
            />
          );
          handleCloseModal();
        },
        onError: () => {
          toast.custom(<CustomToast type='error' message='Failed to update task.' />);
        },
      }
    );
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

  const progressPct = record.progress_pct ?? 0;
  const totalItems = record.total_items ?? 0;
  const completedItems = record.completed_items ?? 0;

  const barColor =
    progressPct === 100 ? 'bg-green-500' : progressPct > 0 ? 'bg-orange-400' : 'bg-gray-300';

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

          {/* Overall progress card */}
          <div className='bg-white rounded-xl border border-gray-200 p-6 mb-6'>
            <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>
              Overall Progress
            </h3>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-3xl font-bold text-gray-800'>{progressPct}%</span>
              <span className='text-sm text-gray-500'>
                {completedItems} / {totalItems} tasks completed
              </span>
            </div>
            <div className='w-full bg-gray-100 rounded-full h-3'>
              <div
                className={`${barColor} h-3 rounded-full transition-all duration-300`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Checklist groups */}
          <div>
            {record.groups && record.groups.length > 0 ? (
              <>
                {record.groups.map((group: any, index: number) => {
                  const filteredItems = group.items.filter((i: any) => i.title !== ACCEPTANCE_MEMO_TITLE);
                  if (filteredItems.length === 0) return null;
                  const filteredGroup = {
                    ...group,
                    items: filteredItems,
                    total_items: filteredItems.length,
                    completed_items: filteredItems.filter((i: any) => i.is_completed).length,
                  };
                  return (
                    <div key={group.id} ref={el => { groupRefs.current[index] = el; }}>
                      <ChecklistGroup
                        group={filteredGroup}
                        onItemClick={handleItemClick}
                        isLast={index === record.groups.length - 1}
                        onNextPhase={() => handleNextPhase(index)}
                      />
                    </div>
                  );
                })}

                {/* Acceptance Memo — standalone final step */}
                {memoItem && (
                  memoItem.is_completed ? (
                    <div className='bg-green-50 border-2 border-green-400 rounded-xl p-5 mb-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0'>
                          <DocumentCheckIcon className='w-5 h-5 text-white' />
                        </div>
                        <div>
                          <h3 className='font-semibold text-green-800'>Completion of the Acceptance Memo</h3>
                          <p className='text-xs text-green-600 mt-0.5'>Completed — proceeding to dashboard</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='flex justify-end mt-2 mb-4'>
                      <button
                        type='button'
                        onClick={() => router.push(`/onboarding-checklist/acceptance-memo?itemId=${memoItem.id}`)}
                        disabled={!allNonMemoComplete}
                        title={!allNonMemoComplete ? 'Complete all prior steps to unlock the Acceptance Memo' : undefined}
                        className='flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-[#355FD0] text-white hover:bg-blue-700'
                      >
                        Proceed to Acceptance Memo
                        <ChevronRightIcon className='w-4 h-4' />
                      </button>
                    </div>
                  )
                )}
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
        isLoading={markItem.isLoading}
        openedAt={selectedItem ? (openedAtMap.current[selectedItem.id] ?? null) : null}
      />
    </>
  );
};

export default ChecklistView;
