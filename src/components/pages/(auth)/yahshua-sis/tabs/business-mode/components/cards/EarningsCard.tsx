'use client';

interface EarningsCardProps {
  thisMonth: number;
  jobsDone: number;
}

const EarningsCard = ({ thisMonth, jobsDone }: EarningsCardProps) => {
  const formattedAmount = `₱${thisMonth.toLocaleString()}`;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="min-w-0 overflow-hidden">
          <h3 
            className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-600 truncate cursor-help"
            title={formattedAmount}
          >
            {formattedAmount}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">This Month</p>
        </div>
        <div className="min-w-0 overflow-hidden">
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-savoy-blue">
            {jobsDone}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Jobs Done</p>
        </div>
      </div>
    </div>
  );
};

export default EarningsCard;
