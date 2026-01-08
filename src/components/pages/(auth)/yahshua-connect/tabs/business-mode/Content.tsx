'use client';

import { useState } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import BusinessJobCard from './pages/find-work/components/BusinessJobCard';
import FilterRequestsModal from './pages/hire/modals/FilterRequestsModal';
import JobAcceptedModal from './pages/find-work/modals/JobAcceptedModal';
import JobChatModal from './pages/find-work/modals/JobChatModal';
import BusinessJobDetailsModal from './pages/find-work/modals/BusinessJobDetailsModal';

const Content = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isJobAcceptedModalOpen, setIsJobAcceptedModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // Data
  const thisMonthEarnings = 45230;

  const weeklyData = [
    { day: 'W1', amount: 12500 },
    { day: 'W2', amount: 9800 },
    { day: 'W3', amount: 15200 },
    { day: 'W4', amount: 7700 },
  ];

  // All Jobs
  const jobRequests = [
    {
      id: 1,
      title: 'Fix Leaking Kitchen Sink',
      clientName: 'Maria Santos',
      clientInitials: 'MS',
      clientLocation: 'Carmen, Cagayan de Oro',
      distance: '0.8 km',
      rating: 4.7,
      hiresCount: 15,
      description: 'Kitchen sink has been leaking for 2 days.',
      time: 'Today, 2:00 PM',
      priceRange: '₱800 - ₱1,200',
      tags: ['Plumbing', 'Sink Repair'],
      status: 'accepted' as const,
      urgent: true,
    },
    {
      id: 2,
      title: 'Install Ceiling Fan',
      clientName: 'Juan Cruz',
      clientInitials: 'JC',
      clientLocation: 'Gusa, Cagayan de Oro',
      distance: '1.5 km',
      rating: 5,
      hiresCount: 28,
      description: 'Need electrician to install ceiling fan.',
      time: 'Tomorrow, 9:00 AM',
      priceRange: '₱600 - ₱900',
      tags: ['Electrical', 'Installation'],
      status: 'pending' as const,
      urgent: false,
    },
    {
      id: 3,
      title: 'House Deep Cleaning',
      clientName: 'Ana Garcia',
      clientInitials: 'AG',
      clientLocation: 'Macasandig, Cagayan de Oro',
      distance: '2.1 km',
      rating: 4.5,
      hiresCount: 5,
      description: 'Need deep cleaning service for 3-bedroom house. All cleaning materials will be provided.',
      time: 'Tomorrow, 10:00 AM - 2:00 PM',
      priceRange: '₱1,500 - ₱2,000',
      tags: ['Cleaning'],
      status: 'pending' as const,
      urgent: false,
    },
    {
      id: 4,
      title: 'Garden Landscaping',
      clientName: 'Robert Tan',
      clientInitials: 'RT',
      clientLocation: 'Lapasan, Cagayan de Oro',
      distance: '3.5 km',
      rating: 4.9,
      hiresCount: 15,
      description: 'Need landscaping work for front yard garden. Plants and materials will be provided.',
      time: 'Dec 5, 8:00 AM',
      priceRange: '₱2,000 - ₱3,000',
      tags: ['Landscaping'],
      status: 'pending' as const,
      urgent: false,
    },
  ];

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
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyData.map((item, index) => {
            const maxAmount = Math.max(...weeklyData.map((d) => d.amount));
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
