'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

import FloatingMenuBar from '../../components/FloatingMenuBar';
import ProfileCard from './components/cards/ProfileCard';
import QuickActionsCard from './components/cards/QuickActionsCard';
import UpcomingBookingsModal from './components/modals/UpcomingBookingsModal';
import MyHiresModal from './components/modals/MyHiresModal';
import JobChatModal from './components/modals/JobChatModal';

import { useMyJobsData } from './hooks/useMyJobsData';
import { useJobState } from './contexts/JobStateContext';
import { useHomeData } from './hooks/useHomeData';

interface BusinessModeLayoutProps {
  children: ReactNode;
}

const BusinessModeLayout = ({ children }: BusinessModeLayoutProps) => {
  const router = useRouter();
  const [isUpcomingBookingsModalOpen, setIsUpcomingBookingsModalOpen] = useState(false);
  const [isMyHiresModalOpen, setIsMyHiresModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isAvailableForBookings, setIsAvailableForBookings] = useState(true);
  const [selectedBookingForMessage, setSelectedBookingForMessage] = useState<{
    id: number;
    title: string;
    clientName: string;
    location: string;
    time: string;
    priceRange: string;
  } | null>(null);

  const { activeJobs } = useMyJobsData();
  const { acceptedJobIds } = useJobState();
  const { jobRequests: initialJobRequests } = useHomeData();

  // Merge initial job requests with accepted status
  const jobRequests = initialJobRequests.map((job) => ({
    ...job,
    status: acceptedJobIds.has(job.id) ? ('accepted' as const) : job.status,
  }));

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

  const handleBookingMessage = (booking: {
    id: number;
    title: string;
    clientName: string;
    location: string;
    time: string;
    priceRange: string;
  }) => {
    setSelectedBookingForMessage(booking);
    setIsUpcomingBookingsModalOpen(false);
    setIsChatModalOpen(true);
  };

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

  const quickActions = [
    {
      icon: CalendarIcon,
      label: 'Upcoming Bookings',
      count: upcomingBookings.length,
      badgeColor: 'purple' as const,
      onClick: () => setIsUpcomingBookingsModalOpen(true),
    },
    {
      icon: UserGroupIcon,
      label: 'My Hires',
      onClick: () => setIsMyHiresModalOpen(true),
    },
  ];

  return (
    <>
      <FloatingMenuBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
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
                availableForBookings={isAvailableForBookings}
                earnings={45230}
                spending={12800}
                onAvailabilityChange={setIsAvailableForBookings}
              />
              <QuickActionsCard actions={quickActions} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {children}
          </div>
        </div>
      </div>

      {/* Global Modals */}
      <UpcomingBookingsModal
        isOpen={isUpcomingBookingsModalOpen}
        onClose={() => setIsUpcomingBookingsModalOpen(false)}
        bookings={upcomingBookings}
        onMessage={handleBookingMessage}
      />

      {selectedBookingForMessage && (
        <JobChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedBookingForMessage(null);
          }}
          clientName={selectedBookingForMessage.clientName}
          clientInitials={
            selectedBookingForMessage.clientName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase() || ''
          }
          jobTitle={selectedBookingForMessage.title}
        />
      )}

      <MyHiresModal
        isOpen={isMyHiresModalOpen}
        onClose={() => setIsMyHiresModalOpen(false)}
        hires={hiredApplicants}
        onSendPaymentProof={handleSendPaymentProof}
      />
    </>
  );
};

export default BusinessModeLayout;

