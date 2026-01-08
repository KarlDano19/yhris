'use client';

import { useState } from 'react';
import { FunnelIcon, BoltIcon, SparklesIcon } from '@heroicons/react/24/outline';
import BusinessJobCard from './pages/find-work/components/BusinessJobCard';
import EarningsChartCard from './components/cards/EarningsChartCard';
import FilterRequestsModal from './pages/hire/modals/FilterRequestsModal';
import JobAcceptedModal from './pages/find-work/modals/JobAcceptedModal';
import JobChatModal from './pages/find-work/modals/JobChatModal';
import BusinessJobDetailsModal from './pages/find-work/modals/BusinessJobDetailsModal';
import ToolsIcon from '@/svg/ToolsIcons';
import { useHomeData } from './hooks/useHomeData';

const Content = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isJobAcceptedModalOpen, setIsJobAcceptedModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const { thisMonthEarnings, weeklyData, jobRequests: initialJobRequests, trendingServices } = useHomeData();

  // Use job requests as-is from the data
  const jobRequests = initialJobRequests;

  // Calculate urgent requests count
  const urgentRequestsCount = jobRequests.filter((job) => job.urgent && job.status !== 'accepted').length;

  const handleApplyFilters = (filters: {
    location: string;
    skills: string[];
    urgentOnly: boolean;
  }) => {
    // TODO: Implement filter logic
    console.log('Applied filters:', filters);
  };

  const handleAcceptJob = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsJobAcceptedModalOpen(true);
  };

  const handleMessage = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsChatModalOpen(true);
  };

  const handleViewDetails = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsJobDetailsModalOpen(true);
  };

  const handleMessageClient = () => {
    setIsJobAcceptedModalOpen(false);
    setIsChatModalOpen(true);
  };

  const selectedJobFull = selectedJobId
    ? jobRequests.find((job) => job.id === selectedJobId)
    : null;

  // Format amount with K notation
  const formatAmount = (amount: number): string => {
    if (amount >= 1000) {
      const kValue = amount / 1000;
      return `₱${kValue % 1 === 0 ? kValue.toFixed(0) : kValue.toFixed(1)}k`;
    }
    return `₱${amount.toLocaleString()}`;
  };

  const userName = "John Doe";
  const monthlyEarnings = 45230;
  const jobsCompleted = 23;
  const rating = 4.9;

  return (
    <div className="space-y-6">
      {/* Business Overview */}
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
            <p className="text-2xl font-bold mb-1">{urgentRequestsCount}</p>
            <p className="text-blue-100 text-xs">Urgent Jobs</p>
          </div>

          {/* Rating */}
          <div className="bg-blue-500/30 backdrop-blur-sm rounded-lg p-4">
            <p className="text-2xl font-bold mb-1">{rating}</p>
            <p className="text-blue-100 text-xs">Your Rating</p>
          </div>
        </div>
      </div>

      {/* Nearby Job Requests */}
      <div className="bg-white rounded-lg shadow-sm  p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Nearby Business Jobs</h2>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </button>
        </div>

        <div className="space-y-4">
          {jobRequests.map((job) => (
            <BusinessJobCard
              key={job.id}
              {...job}
              onAcceptJob={handleAcceptJob}
              onMessage={handleMessage}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>

      {/* Earnings This Month */}
      {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Earnings This Month</h2>
        <EarningsChartCard data={weeklyData} showTitle={false} />
      </div> */}

      {/* Trending Services */}
      {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Trending Services</h2>
        <div className="space-y-4">
          {trendingServices.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  {service.iconType === 'tools' ? (
                    <ToolsIcon className="h-6 w-6" />
                  ) : service.iconType === 'bolt' ? (
                    <BoltIcon className="h-6 w-6 text-blue-600" />
                  ) : (
                    <SparklesIcon className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.active} active</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${service.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                  {service.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Page-specific Modals */}
      {isFilterModalOpen && (
        <FilterRequestsModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
        />
      )}

      {/* Job Accepted Modal */}
      {isJobAcceptedModalOpen && selectedJobFull && (
        <JobAcceptedModal
          isOpen={isJobAcceptedModalOpen}
          onClose={() => {
            setIsJobAcceptedModalOpen(false);
            setSelectedJobId(null);
          }}
          jobDetails={{
            title: selectedJobFull.title,
            clientName: selectedJobFull.clientName,
            time: selectedJobFull.time,
            priceRange: selectedJobFull.priceRange,
          }}
          onMessageClient={handleMessageClient}
        />
      )}

      {/* Business Job Details Modal */}
      {isJobDetailsModalOpen && selectedJobId && (
        <BusinessJobDetailsModal
          isOpen={isJobDetailsModalOpen}
          onClose={() => {
            setIsJobDetailsModalOpen(false);
            setSelectedJobId(null);
          }}
          jobId={selectedJobId}
          onAcceptJob={handleAcceptJob}
        />
      )}

      {/* Chat Modal */}
      {isChatModalOpen && selectedJobFull && (
        <JobChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedJobId(null);
          }}
          clientName={selectedJobFull.clientName}
          clientInitials={selectedJobFull.clientInitials || ''}
          jobTitle={selectedJobFull.title}
        />
      )}
    </div>
  );
};

export default Content;
