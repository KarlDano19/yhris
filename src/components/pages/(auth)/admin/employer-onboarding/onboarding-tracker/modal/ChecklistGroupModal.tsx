'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';

type T_OnboardingChecklist = {
  id: number;
  name: string;
  description: string;
  video_url?: string;
  is_completed: boolean;
};

type T_OnboardingPhase = {
  id: number;
  name: string;
  description: string;
  total_items: number;
  completed_items: number;
  checklists: T_OnboardingChecklist[];
};

type ChecklistGroupProps = {
  phase: T_OnboardingPhase;
};

const ChecklistGroup = ({ phase }: ChecklistGroupProps) => {
  const phasePct =
    phase.total_items > 0 ? Math.round((phase.completed_items / phase.total_items) * 100) : 0;

  return (
    <div className='bg-white rounded-xl border border-gray-200 p-5 mb-4'>
      <div className='mb-3'>
        <h3 className='font-semibold text-gray-800'>{phase.name}</h3>
        {phase.description && (
          <p className='text-xs text-gray-500 mt-0.5'>{phase.description}</p>
        )}
        <div className='mt-2'>
          <div className='flex justify-between items-center mb-1'>
            <span className='text-xs text-gray-500'>
              {phase.completed_items}/{phase.total_items} done
            </span>
            <span className='text-xs text-gray-400'>{phasePct}%</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-1.5'>
            <div
              className='bg-orange-400 h-1.5 rounded-full transition-all'
              style={{ width: `${phasePct}%` }}
            />
          </div>
        </div>
      </div>

      <div className='space-y-2'>
        {phase.checklists.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              item.is_completed ? 'bg-green-50' : 'bg-gray-50'
            }`}
          >
            <div className='flex-shrink-0 mt-0.5'>
              {item.is_completed ? (
                <CheckCircleIcon className='w-4 h-4 text-green-500' />
              ) : (
                <div className='w-4 h-4 rounded-full border-2 border-gray-300' />
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <p
                className={`text-sm font-medium ${
                  item.is_completed ? 'line-through text-gray-400' : 'text-gray-700'
                }`}
              >
                {item.name}
              </p>
              {item.description && (
                <p className='text-xs text-gray-400 mt-0.5'>{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChecklistGroup;
