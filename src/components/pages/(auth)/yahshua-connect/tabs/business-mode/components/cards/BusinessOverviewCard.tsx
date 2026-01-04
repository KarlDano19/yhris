'use client';

interface BusinessOverviewCardProps {
  userName: string;
  monthlyEarnings: number;
  jobsCompleted: number;
  urgentRequests: number;
  rating: number;
}

const BusinessOverviewCard = ({
  userName,
  monthlyEarnings,
  jobsCompleted,
  urgentRequests,
  rating,
}: BusinessOverviewCardProps) => {
  // Format amount with K notation
  const formatAmount = (amount: number): string => {
    if (amount >= 1000) {
      const kValue = amount / 1000;
      return `₱${kValue % 1 === 0 ? kValue.toFixed(0) : kValue.toFixed(1)}k`;
    }
    return `₱${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-gradient-to-br from-savoy-blue to-blue-600 rounded-lg shadow-lg p-6 text-white">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">
          Welcome back, {userName.split(' ')[0]}! 👋
        </h2>
        <p className="text-blue-100 text-sm">
          Here's your business overview for today
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Monthly Earnings */}
        <div className="bg-blue-500/30 backdrop-blur-sm rounded-lg p-4">
          <p className="text-2xl font-bold mb-1">{formatAmount(monthlyEarnings)}</p>
          <p className="text-blue-100 text-xs">Monthly Earnings</p>
        </div>

        {/* Jobs Completed */}
        <div className="bg-blue-500/30 backdrop-blur-sm rounded-lg p-4">
          <p className="text-2xl font-bold mb-1">{jobsCompleted}</p>
          <p className="text-blue-100 text-xs">Jobs Completed</p>
        </div>

        {/* Urgent Requests */}
        <div className="bg-blue-500/30 backdrop-blur-sm rounded-lg p-4">
          <p className="text-2xl font-bold mb-1">{urgentRequests}</p>
          <p className="text-blue-100 text-xs">Urgent Requests</p>
        </div>

        {/* Rating */}
        <div className="bg-blue-500/30 backdrop-blur-sm rounded-lg p-4">
          <p className="text-2xl font-bold mb-1">{rating}</p>
          <p className="text-blue-100 text-xs">Your Rating</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessOverviewCard;

