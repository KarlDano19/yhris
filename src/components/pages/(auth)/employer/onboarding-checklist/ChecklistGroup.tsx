'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';

type ChecklistGroupProps = {
  group: any;
  onItemClick: (item: any) => void;
  isLast: boolean;
  onNextPhase: () => void;
};

const ChecklistGroup = ({ group, onItemClick }: ChecklistGroupProps) => {
  const { total_items, completed_items, items } = group;
  const pct = total_items > 0 ? Math.round((completed_items / total_items) * 100) : 0;

  const circleColor =
    pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-orange-400' : 'bg-gray-300';

  const barColor =
    pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-orange-400' : 'bg-gray-200';

  return (
    <div className='bg-white rounded-xl border border-gray-200 p-5 mb-4'>
      <div className='flex items-start gap-4 mb-4'>
        <div className={`flex-shrink-0 w-9 h-9 rounded-full ${circleColor} flex items-center justify-center`}>
          {pct === 100 ? (
            <CheckCircleIcon className='w-5 h-5 text-white' />
          ) : (
            <span className='text-xs font-bold text-white'>{group.order_position + 1}</span>
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='font-semibold text-gray-800'>{group.name}</h3>
          {group.description && (
            <p className='text-xs text-gray-500 mt-0.5 break-words'>{group.description}</p>
          )}
          <div className='flex items-center gap-3 mt-2'>
            <div className='flex-1 bg-gray-100 rounded-full h-1.5'>
              <div
                className={`${barColor} h-1.5 rounded-full transition-all duration-300`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className='text-xs text-gray-500 whitespace-nowrap'>
              {completed_items}/{total_items} done
            </span>
          </div>
        </div>
      </div>

      <div className='space-y-2'>
        {items.map((item: any) => (
          <button
            key={item.id}
            type='button'
            onClick={() => onItemClick(item)}
            className={`w-full text-left flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:shadow-sm ${
              item.is_completed ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {/* Completion indicator */}
            <div
              className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                item.is_completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {item.is_completed && (
                <svg
                  className='w-3 h-3 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={3}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              )}
            </div>

            <div className='flex-1 min-w-0'>
              <p
                className={`text-sm font-medium break-words ${
                  item.is_completed ? 'line-through text-gray-400' : 'text-gray-700'
                }`}
              >
                {item.title}
              </p>
              {item.description && (
                <p className='text-xs text-gray-400 mt-0.5 break-words'>{item.description}</p>
              )}
              {item.tutorial_url && (
                <span className='text-xs text-blue-500 mt-1 inline-block'>
                  Watch Tutorial →
                </span>
              )}
            </div>

          </button>
        ))}
      </div>

    </div>
  );
};

export default ChecklistGroup;
