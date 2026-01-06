'use client';

interface SpendingChartCardProps {
  data: Array<{
    day: string;
    amount: number;
  }>;
  showTitle?: boolean;
}

const SpendingChartCard = ({ data, showTitle = true }: SpendingChartCardProps) => {
  const maxAmount = Math.max(...data.map((d) => d.amount));

  return (
    <div>
      {showTitle && <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Spending</h3>}
      
      {/* Simple Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((item, index) => {
          const height = (item.amount / maxAmount) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative flex-1 w-full flex items-end">
                <div
                  className="w-full bg-orange-500 rounded-t transition-all hover:bg-orange-600"
                  style={{ height: `${height}%` }}
                  title={`₱${item.amount.toLocaleString()}`}
                />
              </div>
              <span className="text-xs text-gray-600 font-medium">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpendingChartCard;


