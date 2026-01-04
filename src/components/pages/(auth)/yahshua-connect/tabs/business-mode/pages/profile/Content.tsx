'use client';

import YahshuaConnectHeader from '../../../../YahshuaConnectHeader';
import FloatingMenuBar from '../../../../components/FloatingMenuBar';
import ProfileCard from '../../components/cards/ProfileCard';
import QuickActionsCard from '../../components/cards/QuickActionsCard';
import Profile from '../../../../components/Profile';
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useMyJobsData } from '../../hooks/useMyJobsData';
import { useState } from 'react';
import UpcomingBookingsModal from '../../components/modals/UpcomingBookingsModal';
import MyHiresModal from '../../components/modals/MyHiresModal';
import JobChatModal from '../../components/modals/JobChatModal';

const Content = () => {
  const [isUpcomingBookingsModalOpen, setIsUpcomingBookingsModalOpen] = useState(false);
  const [isMyHiresModalOpen, setIsMyHiresModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedBookingForMessage, setSelectedBookingForMessage] = useState<{
    id: number;
    title: string;
    clientName: string;
    location: string;
    time: string;
    priceRange: string;
  } | null>(null);
  const { activeJobs } = useMyJobsData();

  // Transform activeJobs for the modal
  const upcomingBookings = activeJobs.map((job) => ({
    id: job.id,
    title: job.title,
    clientName: job.clientName,
    location: job.location,
    time: job.time,
    priceRange: job.priceRange,
  }));

  const userProfile = {
    name: 'John Doe',
    title: 'Plumber • Electrician',
    initial: 'JD',
    rating: 4.9,
    reviews: 27,
    basicInfo: {
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+63 912 345 6789',
      location: 'Cagayan de Oro, Philippines',
    },
  };

  const reviews = [
    {
      id: 1,
      reviewerName: 'Maria Santos',
      reviewerInitials: 'MS',
      role: 'Client',
      quote: 'Excellent work!',
      date: 'Dec 2025',
      rating: 5,
    },
    {
      id: 2,
      reviewerName: 'Juan Cruz',
      reviewerInitials: 'JC',
      role: 'Client',
      quote: 'Great service!',
      date: 'Nov 2025',
      rating: 5,
    },
  ];

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
      count: activeJobs.length,
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
      <YahshuaConnectHeader />
      <FloatingMenuBar />
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <ProfileCard
                name={userProfile.name}
                title={userProfile.title}
                rating={userProfile.rating}
                reviewsCount={userProfile.reviews}
                initial={userProfile.initial}
                availableForBookings={true}
                earnings={45230}
                spending={12800}
                onAvailabilityChange={(isAvailable) => {
                  console.log('Availability changed:', isAvailable);
                }}
              />
              <QuickActionsCard actions={quickActions} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="space-y-6">
              {/* Profile Sections */}
              <Profile 
                mode="business"
                basicInfo={userProfile.basicInfo}
                onSave={(data) => {
                  // Update userProfile.basicInfo with data
                  console.log('Save basic info:', data);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings Modal */}
      <UpcomingBookingsModal
        isOpen={isUpcomingBookingsModalOpen}
        onClose={() => setIsUpcomingBookingsModalOpen(false)}
        bookings={upcomingBookings}
        onMessage={handleBookingMessage}
      />

      {/* Chat Modal */}
      {selectedBookingForMessage && (
        <JobChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedBookingForMessage(null);
          }}
          clientName={selectedBookingForMessage.clientName}
          clientInitials={selectedBookingForMessage.clientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          jobTitle={selectedBookingForMessage.title}
        />
      )}

      {/* My Hires Modal */}
      <MyHiresModal
        isOpen={isMyHiresModalOpen}
        onClose={() => setIsMyHiresModalOpen(false)}
        hires={hiredApplicants}
        onSendPaymentProof={handleSendPaymentProof}
      />
    </>
  );
};

export default Content;

