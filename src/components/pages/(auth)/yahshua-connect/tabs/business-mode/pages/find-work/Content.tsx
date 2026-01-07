'use client';

import { useState } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import BusinessModeLayout from '../../BusinessModeLayout';
import JobRequestCard from '../../components/cards/JobRequestCard';
import JobAcceptedModal from '../../components/modals/JobAcceptedModal';
import JobChatModal from '../../components/modals/JobChatModal';
import JobRequestDetailsModal from '../../components/modals/JobRequestDetailsModal';
import FilterRequestsModal from '../../components/modals/FilterRequestsModal';
import { useFindWorkData } from '../../hooks/useFindWorkData';
import { useJobState } from '../../contexts/JobStateContext';

const Content = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isJobAcceptedModalOpen, setIsJobAcceptedModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const { jobRequests: initialJobRequests, reviews } = useFindWorkData();
  const { acceptedJobIds, acceptJob } = useJobState();

  // Merge initial job requests with accepted status
  const jobRequests = initialJobRequests.map((job) => ({
    ...job,
    status: acceptedJobIds.has(job.id) ? ('accepted' as const) : job.status,
  }));


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
    <BusinessModeLayout>
      <div className="space-y-6">
              {/* Find Work Header */}
              <div className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Find Work</h2>
                    <p className="text-sm text-gray-600">Browse available job requests near you</p>
                  </div>
                  <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FunnelIcon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Filters</span>
                  </button>
                </div>

                {/* Job Requests List */}
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
    </BusinessModeLayout>
  );
};

export default Content;
