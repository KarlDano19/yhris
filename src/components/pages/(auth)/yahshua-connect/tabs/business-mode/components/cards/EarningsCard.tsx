

interface EarningsCardProps {
  thisMonth: number;
  jobsDone: number;
}

const EarningsCard = ({ thisMonth, jobsDone }: EarningsCardProps) => {
  // Format amount with K notation if >= 1000
  const formatAmount = (amount: number): string => {
    if (amount >= 1000) {
      const kValue = amount / 1000;
      // Show one decimal place if needed, otherwise no decimal
      return `₱${kValue % 1 === 0 ? kValue.toFixed(0) : kValue.toFixed(1)}K`;
    }
    return `₱${amount.toLocaleString()}`;
  };

  const formattedAmount = formatAmount(thisMonth);
  const fullAmount = `₱${thisMonth.toLocaleString()}`;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="min-w-0 overflow-hidden">
          <h3 
            className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-600"
            title={fullAmount}
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
