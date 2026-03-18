'use client';

import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

type EmployerCardProps = {
  record: any;
  onSelect: (id: string) => void;
};

const statusLabel: Record<string, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

const statusBadgeClass: Record<string, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-orange-100 text-orange-600',
  COMPLETED: 'bg-green-100 text-green-600',
};

const EmployerCard = ({ record, onSelect }: EmployerCardProps) => {
  const barColor =
    record.derived_status === 'COMPLETED'
      ? 'bg-green-500'
      : record.derived_status === 'IN_PROGRESS'
      ? 'bg-orange-400'
      : 'bg-gray-200';

  const addedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(record.created_at)
  );

  return (
    <div onClick={() => onSelect(String(record.id))} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gray-100 p-2 rounded-lg">
            <BuildingOfficeIcon className="w-5 h-5 text-gray-500" />
          </div>
          <span className="font-semibold text-gray-800 truncate">{record.employer_name}</span>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-semibold text-gray-700">{record.progress_pct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`${barColor} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${record.progress_pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadgeClass[record.derived_status] || statusBadgeClass['NOT_STARTED']}`}>
            {statusLabel[record.derived_status] || 'Not Started'}
          </span>
          <span className="text-xs text-gray-400">Added {addedDate}</span>
        </div>
      </div>
  );
};

export default EmployerCard;
