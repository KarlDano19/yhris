'use client';

import { CheckIcon, LockClosedIcon } from '@heroicons/react/24/solid';

import EyePassword from '@/svg/EyePassword';

import { T_OnboardingChecklist, T_OnboardingPhase } from './hooks/useGetChecklist';

type ChecklistGroupProps = {
  phase: T_OnboardingPhase;
  onItemClick: (item: T_OnboardingChecklist) => void;
  lockedItemIds: Set<number>;
  onItemView?: (item: T_OnboardingChecklist) => void;
};

const ChecklistGroup = ({ phase, onItemClick, lockedItemIds, onItemView }: ChecklistGroupProps) => {
  const allDone = phase.completed_items === phase.total_items && phase.total_items > 0;
  const inProgress = phase.completed_items > 0 && !allDone;
  const phasePct = phase.total_items > 0
    ? Math.round((phase.completed_items / phase.total_items) * 100)
    : 0;

  return (
    <div className='bg-white rounded-xl border border-gray-200 p-5 mb-4'>
      <div className='mb-1 flex items-start gap-3'>
        {/* Phase status badge */}
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 ${
            allDone ? 'bg-green-500' : inProgress ? 'bg-orange-400' : 'bg-gray-300'
          }`}
        >
          {allDone ? (
            <CheckIcon className='w-4 h-4' />
          ) : (
            <span>{phase.completed_items}</span>
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='font-semibold text-gray-800'>{phase.name}</h3>
          {phase.description && (
            <p className='text-xs text-gray-500 mt-0.5 break-words'>{phase.description}</p>
          )}
        </div>
      </div>

      {/* Phase progress bar */}
      <div className='w-full bg-gray-200 rounded-full h-1.5 mt-2 mb-1'>
        <div
          className='bg-orange-400 h-1.5 rounded-full transition-all'
          style={{ width: `${phasePct}%` }}
        />
      </div>
      <span className='text-xs text-gray-400'>{phase.completed_items}/{phase.total_items} done</span>

      <div className='space-y-2 mt-3'>
        {phase.checklists.map((item) => {
          const isLocked = lockedItemIds.has(item.id);
          const isCompleted = item.is_completed;

          if (isCompleted) {
            return (
              <div
                key={item.id}
                className='w-full text-left flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200'
              >
                <CheckIcon className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-gray-400 line-through break-words'>{item.name}</p>
                  {item.description && (
                    <p className='text-xs text-gray-300 mt-0.5 break-words line-through'>{item.description}</p>
                  )}
                </div>
                {onItemView && (
                  <button
                    type='button'
                    onClick={() => onItemView(item)}
                    className='flex-shrink-0'
                    title='View details'
                  >
                    <EyePassword visible={true} />
                  </button>
                )}
              </div>
            );
          }

          if (isLocked) {
            return (
              <div
                key={item.id}
                className='w-full text-left flex items-start gap-3 p-3 rounded-lg bg-gray-50 opacity-50 cursor-not-allowed'
              >
                <LockClosedIcon className='w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5' />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-gray-500 break-words'>{item.name}</p>
                  {item.description && (
                    <p className='text-xs text-gray-400 mt-0.5 break-words'>{item.description}</p>
                  )}
                </div>
                {onItemView && (
                  <button
                    type='button'
                    onClick={() => onItemView(item)}
                    className='flex-shrink-0'
                    title='View details'
                  >
                    <EyePassword visible={true} />
                  </button>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.id}
              type='button'
              onClick={() => onItemClick(item)}
              className='w-full text-left flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer hover:shadow-sm transition-colors'
            >
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-700 break-words'>{item.name}</p>
                {item.description && (
                  <p className='text-xs text-gray-400 mt-0.5 break-words'>{item.description}</p>
                )}
                {item.video_url && (
                  <span className='text-xs text-blue-500 mt-1 inline-block'>Watch Video →</span>
                )}
              </div>
              {onItemView && (
                <button
                  type='button'
                  onClick={(e) => { e.stopPropagation(); onItemView(item); }}
                  className='flex-shrink-0'
                  title='View details'
                >
                  <EyePassword visible={true} />
                </button>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChecklistGroup;
