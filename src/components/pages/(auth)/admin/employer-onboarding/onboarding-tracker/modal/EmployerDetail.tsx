'use client';

import { useState } from 'react';

import { ArrowLeftIcon, CheckCircleIcon, DocumentCheckIcon } from '@heroicons/react/24/solid';

import LoadingSpinner from '@/components/LoadingSpinner';

import ChecklistGroup from './ChecklistGroup';
import ChecklistItemModal from './ChecklistItemModal';
import ProgressCard from './ProgressCard';
import useGetOnboardingDetail from '../hooks/useGetOnboardingDetail';

type EmployerDetailProps = {
  recordId: string;
  onBack: () => void;
};

const EmployerDetail = ({ recordId, onBack }: EmployerDetailProps) => {
  const { data, isLoading } = useGetOnboardingDetail(recordId);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const ACCEPTANCE_MEMO_TITLE = 'Completion of the Acceptance Memo';

  const record = data?.data || data;

  if (isLoading) {
    return (
      <div className='flex justify-center py-12'>
        <LoadingSpinner size='lg' color='yellow' />
      </div>
    );
  }

  if (!record) {
    return (
      <div className='p-6 text-center text-gray-500 text-sm'>Onboarding record not found.</div>
    );
  }

  const statusLabel =
    record.progress_pct === 100 ? 'Completed'
    : record.progress_pct > 0 ? 'In Progress'
    : 'Not Started';

  const statusStyle =
    record.progress_pct === 100
      ? 'bg-green-100 text-green-700'
      : record.progress_pct > 0
      ? 'bg-orange-100 text-orange-700'
      : 'bg-gray-100 text-gray-500';

  const completedGroups = record.groups
    ? record.groups.filter((g: any) => g.completed_items === g.total_items && g.total_items > 0).length
    : 0;
  const totalGroups = record.groups ? record.groups.length : 0;

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='flex p-4'>
        <button
          onClick={onBack}
          className='flex-none flex gap-3 items-center hover:bg-gray-200 px-2 py-1 rounded'
        >
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Back to Board</h4>
        </button>
      </div>

      <div className='px-2 md:px-8 lg:px-4 py-6'>
        <div className='mb-6'>
          <div className='flex items-center gap-3 flex-wrap'>
            <h1 className='text-xl font-bold text-indigo-dye'>{record.employer_name}</h1>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle}`}>
              {statusLabel}
            </span>
          </div>
          <p className='text-sm text-gray-500 mt-1'>
            Client Onboarding Detail &nbsp;·&nbsp; {completedGroups} / {totalGroups} groups complete
          </p>
        </div>

        <ProgressCard
          progressPct={record.progress_pct}
          totalItems={record.total_items}
          completedItems={record.completed_items}
        />

        <div>
          {record.groups && record.groups.length > 0 ? (
            <>
              {record.groups.map((group: any) => {
                const filteredItems = group.items.filter((i: any) => i.title !== ACCEPTANCE_MEMO_TITLE);
                if (filteredItems.length === 0) return null;
                const filteredGroup = {
                  ...group,
                  items: filteredItems,
                  total_items: filteredItems.length,
                  completed_items: filteredItems.filter((i: any) => i.is_completed).length,
                };
                return (
                  <ChecklistGroup
                    key={group.id}
                    group={filteredGroup}
                    isReadOnly
                    onItemClick={(item) => setSelectedItem(item)}
                  />
                );
              })}

              {/* Acceptance Memo — standalone read-only status */}
              {(() => {
                const allGroupItems = record.groups.flatMap((g: any) => g.items);
                const memoItem = allGroupItems.find((i: any) => i.title === ACCEPTANCE_MEMO_TITLE);
                if (!memoItem) return null;
                return memoItem.is_completed ? (
                  <div className='bg-green-50 border-2 border-green-400 rounded-xl p-5 mb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-9 h-9 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0'>
                        <CheckCircleIcon className='w-5 h-5 text-white' />
                      </div>
                      <div>
                        <h3 className='font-semibold text-green-800'>Completion of the Acceptance Memo</h3>
                        <p className='text-xs text-green-600 mt-0.5'>Completed</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='bg-gray-50 border-2 border-gray-200 rounded-xl p-5 mb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0'>
                        <DocumentCheckIcon className='w-5 h-5 text-white' />
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-500'>Completion of the Acceptance Memo</h3>
                        <p className='text-xs text-gray-400 mt-0.5'>Not yet completed</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          ) : (
            <div className='text-center py-8 text-gray-500 text-sm'>No checklist items available.</div>
          )}
        </div>
      </div>

      {selectedItem && (
        <ChecklistItemModal
          item={selectedItem}
          recordId={recordId}
          onClose={() => setSelectedItem(null)}
          onUpdated={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default EmployerDetail;
