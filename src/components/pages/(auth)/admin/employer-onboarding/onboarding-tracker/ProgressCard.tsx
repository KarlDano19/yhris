'use client';

type ProgressCardProps = {
  progressPct: number;
  totalItems: number;
  completedItems: number;
};

const ProgressCard = ({ progressPct, totalItems, completedItems }: ProgressCardProps) => {
  const barColor =
    progressPct === 100
      ? 'bg-green-500'
      : progressPct > 0
      ? 'bg-orange-400'
      : 'bg-gray-300';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Overall Progress</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl font-bold text-gray-800">{progressPct}%</span>
        <span className="text-sm text-gray-500">{completedItems} / {totalItems} tasks completed</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className={`${barColor} h-3 rounded-full transition-all duration-300`}
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressCard;
