'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ForwardIcon } from '@heroicons/react/24/outline';

type ChecklistGroupProps = {
  group: any;
  onToggleItem?: (itemId: number, isCompleted: boolean) => void;
  onItemClick?: (item: any) => void;
  isReadOnly?: boolean;
};

const ChecklistGroup = ({ group, onToggleItem, onItemClick, isReadOnly = true }: ChecklistGroupProps) => {
  const { total_items, completed_items, items } = group;
  const pct = total_items > 0 ? Math.round((completed_items / total_items) * 100) : 0;

  const circleColor =
    pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-orange-400' : 'bg-gray-300';

  const barColor =
    pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-orange-400' : 'bg-gray-200';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <div className="flex items-start gap-4 mb-4">
        <div className={`flex-shrink-0 w-9 h-9 rounded-full ${circleColor} flex items-center justify-center`}>
          {pct === 100 ? (
            <CheckCircleIcon className="w-5 h-5 text-white" />
          ) : (
            <span className="text-xs font-bold text-white">{group.order_position + 1}</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{group.name}</h3>
          {group.description && <p className="text-xs text-gray-500 mt-0.5">{group.description}</p>}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
              <div
                className={`${barColor} h-1.5 rounded-full transition-all duration-300`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">{completed_items}/{total_items} done</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item: any) => (
          <div
            key={item.id}
            onClick={() => onItemClick && onItemClick(item)}
            className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
              item.is_skipped
                ? 'bg-yellow-50'
                : item.is_completed
                ? 'bg-green-50'
                : 'bg-gray-50'
            } ${onItemClick ? 'cursor-pointer hover:bg-gray-100' : ''}`}
          >
            <button
              type="button"
              disabled={isReadOnly}
              onClick={(e) => {
                e.stopPropagation();
                onToggleItem && onToggleItem(item.id, !item.is_completed);
              }}
              className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                item.is_skipped
                  ? 'bg-yellow-400 border-yellow-400'
                  : item.is_completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 bg-white'
              } ${!isReadOnly ? 'cursor-pointer hover:border-green-400' : 'cursor-default'}`}
            >
              {item.is_skipped ? (
                <ForwardIcon className="w-3 h-3 text-white" />
              ) : item.is_completed ? (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : null}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-medium ${item.is_completed || item.is_skipped ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {item.title}
                </p>
                {item.is_skipped && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium">
                    Skipped
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ChecklistGroup;
