'use client';

import { useState } from 'react';
import { FunnelIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import YahshuaConnectHeader from '../../../../YahshuaConnectHeader';
import FloatingMenuBar from '../../../../components/FloatingMenuBar';
import ProfileCard from '../../components/cards/ProfileCard';
import QuickActionsCard from '../../components/cards/QuickActionsCard';
import JobRequestCard from '../../components/cards/JobRequestCard';
import UpcomingBookingsModal from '../../components/modals/UpcomingBookingsModal';
import MyHiresModal from '../../components/modals/MyHiresModal';
import JobAcceptedModal from '../../components/modals/JobAcceptedModal';
import JobChatModal from '../../components/modals/JobChatModal';
import JobRequestDetailsModal from '../../components/modals/JobRequestDetailsModal';
import FilterRequestsModal from '../../components/modals/FilterRequestsModal';
import { useFindWorkData } from '../../hooks/useFindWorkData';
import { useMyJobsData } from '../../hooks/useMyJobsData';
import { useJobState } from '../../contexts/JobStateContext';

const Content = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isUpcomingBookingsModalOpen, setIsUpcomingBookingsModalOpen] = useState(false);
  const [isMyHiresModalOpen, setIsMyHiresModalOpen] = useState(false);
  const [isJobAcceptedModalOpen, setIsJobAcceptedModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedBookingForMessage, setSelectedBookingForMessage] = useState<{
    id: number;
    clientName: string;
    clientInitials?: string;
    title: string;
  } | null>(null);

  const { jobRequests: initialJobRequests, reviews } = useFindWorkData();
  const { activeJobs } = useMyJobsData();
  const { acceptedJobIds, acceptJob } = useJobState();

  // Merge initial job requests with accepted status
  const jobRequests = initialJobRequests.map((job) => ({
    ...job,
    status: acceptedJobIds.has(job.id) ? ('accepted' as const) : job.status,
  }));

  const handleSendPaymentProof = (hireId: number) => {
    // TODO: Implement payment proof upload
    console.log('Send payment proof for hire:', hireId);
  };

  // Mock hired applicants data
  const hiredApplicants = [
    {
      id: 1,
      serviceName: 'Garden Landscaping',
      providerName: 'Carlos Mendez',
      providerInitials: 'CM',
      status: 'in-progress' as const,
      price: 1500,
    },
  ];

  // Transform activeJobs for the modal, and also include newly accepted jobs from jobRequests
  const acceptedJobsFromRequests = jobRequests
    .filter((job) => acceptedJobIds.has(job.id))
    .map((job) => ({
      id: job.id,
      title: job.title,
      clientName: job.clientName,
      location: job.clientLocation,
      time: job.time,
      priceRange: job.priceRange,
      clientInitials: job.clientInitials,
    }));

  // Combine activeJobs (from hardcoded data) with newly accepted jobs
  const allUpcomingBookings = [
    ...activeJobs.map((job) => ({
      id: job.id,
      title: job.title,
      clientName: job.clientName,
      location: job.location,
      time: job.time,
      priceRange: job.priceRange,
      clientInitials: job.clientInitials,
    })),
    // Add newly accepted jobs that aren't already in activeJobs
    ...acceptedJobsFromRequests.filter(
      (newJob) => !activeJobs.some((existingJob) => existingJob.id === newJob.id)
    ),
  ];

  const upcomingBookings = allUpcomingBookings;

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
    setSelectedBookingForMessage(null); // Clear booking message context
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

  const handleMessageBooking = (booking: {
    id: number;
    title: string;
    clientName: string;
    location: string;
    time: string;
    priceRange: string;
    clientInitials?: string;
  }) => {
    setSelectedBookingForMessage({
      id: booking.id,
      clientName: booking.clientName,
      clientInitials: booking.clientInitials,
      title: booking.title,
    });
    setSelectedJobId(null); // Clear job message context
    setIsChatModalOpen(true);
  };

  const selectedJobFull = selectedJobId
    ? jobRequests.find((job) => job.id === selectedJobId)
    : null;

  return (
    <>
      {/* <YahshuaConnectHeader /> */} {/* Moved to header.tsx */}
      <FloatingMenuBar />
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <ProfileCard
                name="John Doe"
                title="Plumber • Electrician"
                rating={4.9}
                reviewsCount={27}
                initial="JD"
                availableForBookings={true}
                earnings={45230}
                spending={12800}
                onAvailabilityChange={(isAvailable) => {
                  console.log('Availability changed:', isAvailable);
                }}
              />
              <QuickActionsCard
                actions={[
                  {
                    icon: CalendarIcon,
                    label: 'Upcoming Bookings',
                    count: upcomingBookings.length,
                    badgeColor: 'purple',
                    onClick: () => setIsUpcomingBookingsModalOpen(true),
                  },
                  {
                    icon: UserGroupIcon,
                    label: 'My Hires',
                    onClick: () => setIsMyHiresModalOpen(true),
                  },
                ]}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
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
          </div>
        </div>
      </div>

      {/* Filter Requests Modal */}
      <FilterRequestsModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      {/* Upcoming Bookings Modal */}
      <UpcomingBookingsModal
        isOpen={isUpcomingBookingsModalOpen}
        onClose={() => setIsUpcomingBookingsModalOpen(false)}
        bookings={upcomingBookings}
        onMessage={handleMessageBooking}
      />

      {/* My Hires Modal */}
      <MyHiresModal
        isOpen={isMyHiresModalOpen}
        onClose={() => setIsMyHiresModalOpen(false)}
        hires={hiredApplicants}
        onSendPaymentProof={handleSendPaymentProof}
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
      {(selectedJobFull || selectedBookingForMessage) && (
        <JobChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedJobId(null);
            setSelectedBookingForMessage(null);
          }}
          clientName={selectedJobFull?.clientName || selectedBookingForMessage?.clientName || ''}
          clientInitials={selectedJobFull?.clientInitials || selectedBookingForMessage?.clientInitials || (selectedJobFull?.clientName ? selectedJobFull.clientName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '') || (selectedBookingForMessage?.clientName ? selectedBookingForMessage.clientName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '') || ''}
          jobTitle={selectedJobFull?.title || selectedBookingForMessage?.title || ''}
        />
      )}
    </>
  );
};

export default Content;
