'use client';

interface EarningsChartCardProps {
  data: Array<{
    day: string;
    amount: number;
  }>;
}

const EarningsChartCard = ({ data }: EarningsChartCardProps) => {
  const maxAmount = Math.max(...data.map((d) => d.amount));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Earnings Overview</h3>
      
      {/* Simple Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-32 mb-2">
        {data.map((item, index) => {
          const height = (item.amount / maxAmount) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative flex-1 w-full flex items-end">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${height}%` }}
                  title={`₱${item.amount.toLocaleString()}`}
                />
              </div>
              <span className="text-xs text-gray-600 font-medium">{item.day}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-sm text-savoy-blue font-medium hover:underline">
          Detailed Report
        </button>
      </div>
    </div>
  );
};

export default EarningsChartCard;

