'use client';

import { useState } from 'react';
import { FunnelIcon, BoltIcon, SparklesIcon } from '@heroicons/react/24/outline';
import JobRequestCard from './components/cards/JobRequestCard';
import EarningsChartCard from './components/cards/EarningsChartCard';
import BusinessOverviewCard from './components/cards/BusinessOverviewCard';
import FilterRequestsModal from './components/modals/FilterRequestsModal';
import JobAcceptedModal from './components/modals/JobAcceptedModal';
import JobChatModal from './components/modals/JobChatModal';
import JobRequestDetailsModal from './components/modals/JobRequestDetailsModal';
import ToolsIcon from '@/svg/ToolsIcons';
import { useHomeData } from './hooks/useHomeData';
import { useJobState } from './contexts/JobStateContext';

const Content = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isJobAcceptedModalOpen, setIsJobAcceptedModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const { acceptedJobIds, acceptJob } = useJobState();

  const { thisMonthEarnings, weeklyData, jobRequests: initialJobRequests, trendingServices } = useHomeData();

  // Merge initial job requests with accepted status
  const jobRequests = initialJobRequests.map((job) => ({
    ...job,
    status: acceptedJobIds.has(job.id) ? ('accepted' as const) : job.status,
  }));

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
    acceptJob(jobId);
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

  return (
    <div className="space-y-6">
              {/* Business Overview */}
              <BusinessOverviewCard
                userName="John Doe"
                monthlyEarnings={45230}
                jobsCompleted={23}
                urgentRequests={urgentRequestsCount}
                rating={4.9}
              />

              {/* Nearby Job Requests */}
              <div className="bg-white rounded-lg shadow-sm  p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Nearby Job Requests</h2>
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
                    <JobRequestCard
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
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
              </div>

      {/* Page-specific Modals */}
      <FilterRequestsModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      {/* Job Accepted Modal */}
      {selectedJobFull && (
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

      {/* Job Request Details Modal */}
      {selectedJobFull && (
        <JobRequestDetailsModal
          isOpen={isJobDetailsModalOpen}
          onClose={() => {
            setIsJobDetailsModalOpen(false);
            setSelectedJobId(null);
          }}
          job={selectedJobFull}
          onAcceptJob={handleAcceptJob}
        />
      )}

      {/* Chat Modal */}
      {selectedJobFull && (
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
