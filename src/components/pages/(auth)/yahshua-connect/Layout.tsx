'use client';

import { ReactNode, useState, cloneElement, isValidElement, useEffect, useCallback, useRef } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { Tooltip } from 'react-tooltip';
import { CalendarIcon, UserGroupIcon, DocumentTextIcon, BookmarkIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

// Personal mode imports
import useGetApplicantProfile from './hooks/useGetApplicantProfile';
import useGetSavedJobs from './hooks/useGetSavedJobs';
import useGetApplicationByUser from './hooks/useGetApplicationByUser';
import FloatingMenuBar from './components/FloatingMenuBar';
import ProfileCard from './components/ProfileCard';
import QuickActionsCard from './components/QuickActionsCard';
import MyApplicationsModal from './modals/MyApplicationsModal';
import SavedJobsModal from './modals/SavedJobsModal';
import TrainingsInProgressModal from './modals/TrainingsInProgressModal';

// Business mode imports
import { useMyJobsData } from './tabs/business-mode/hooks/useMyJobsData';
import { useHomeData } from './tabs/business-mode/hooks/useHomeData';
import UpcomingBookingsModal from './modals/UpcomingBookingsModal';
import MyHiresModal from './modals/MyHiresModal';
import JobChatModal from './tabs/business-mode/pages/find-work/modals/JobChatModal';

interface YahshuaConnectLayoutProps {
  children: ReactNode;
}

const YahshuaConnectLayout = ({ children }: YahshuaConnectLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  
  // Determine mode from pathname
  const isBusinessMode = pathname?.includes('business-mode') || false;

  // Business mode data hooks (always call hooks, but only use data if in business mode)
  const { activeJobs: allActiveJobs } = useMyJobsData();
  const { jobRequests: allJobRequests } = useHomeData();
  
  const activeJobs = isBusinessMode ? allActiveJobs : [];
  const initialJobRequests = isBusinessMode ? allJobRequests : [];

  // Personal mode state
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [isSavedJobsModalOpen, setIsSavedJobsModalOpen] = useState(false);
  const [isTrainingsModalOpen, setIsTrainingsModalOpen] = useState(false);

  // Business mode state
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

  // Personal mode data hooks
  const { data: applicantDetails, isLoading: isProfileLoading } = useGetApplicantProfile();
  const { data: savedJobsData } = useGetSavedJobs();
  const { data: applicationsData } = useGetApplicationByUser({});
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);

  // Populate personal mode counts when data is loaded
  useEffect(() => {
    if (savedJobsData && Array.isArray(savedJobsData)) {
      setSavedJobsCount(savedJobsData.length);
    } else {
      setSavedJobsCount(0);
    }
  }, [savedJobsData]);

  useEffect(() => {
    if (!applicationsData) {
      setApplicationsCount(0);
      return;
    }
    const applications = applicationsData.data || applicationsData;
    if (Array.isArray(applications)) {
      setApplicationsCount(applications.length);
    } else {
      setApplicationsCount(0);
    }
  }, [applicationsData]);

  // Personal mode quick actions
  const personalQuickActions = [
    {
      icon: DocumentTextIcon,
      label: 'My Applications',
      count: applicationsCount,
      badgeColor: 'blue' as const,
      onClick: () => setIsApplicationsModalOpen(true),
    },
    {
      icon: BookmarkIcon,
      label: 'Saved Jobs',
      count: savedJobsCount,
      badgeColor: 'blue' as const,
      onClick: () => setIsSavedJobsModalOpen(true),
    },
    {
      icon: AcademicCapIcon,
      label: 'Trainings in Progress',
      onClick: () => setIsTrainingsModalOpen(true),
      tooltip: 'Coming soon',
      disabled: true,
    },
  ];

  // Business mode bookings calculation
  // Use activeJobs from useMyJobsData (which already filters for accepted/scheduled jobs)
  const allUpcomingBookings = isBusinessMode ? activeJobs.map((job: any) => ({
    id: job.id,
    title: job.title,
    clientName: job.clientName,
    location: job.location,
    time: job.time,
    priceRange: job.priceRange,
    clientInitials: job.clientInitials,
  })) : [];

  const upcomingBookings = allUpcomingBookings;

  // Business mode quick actions
  const businessQuickActions = [
    {
      icon: CalendarIcon,
      label: 'Upcoming Bookings',
      count: allUpcomingBookings.length,
      badgeColor: 'purple' as const,
      onClick: () => setIsUpcomingBookingsModalOpen(true),
    },
    {
      icon: UserGroupIcon,
      label: 'My Hires',
      onClick: () => setIsMyHiresModalOpen(true),
    },
  ];

  // Mock hired applicants data for business mode
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

  const trainingsInProgress = [
    {
      id: 2,
      title: 'UX Psychology Fundamentals',
      instructor: 'Dr. Michael Park',
      duration: '5 hrs',
      level: 'Beginner',
      rating: 4.9,
      progress: 45,
      price: 'FREE',
    },
  ];

  // Handle response structure (data might be wrapped in 'data' field or at root level)
  const profileData = applicantDetails?.data || applicantDetails;
  
  // Get user data from applicant profile
  const userName = profileData 
    ? `${profileData.firstname || ''} ${profileData.lastname || ''}`.trim() 
    : 'Loading...';
  const userInitial = profileData?.firstname?.[0]?.toUpperCase() || 'U';
  const userAbout = profileData?.description || null;
  const averageRating = profileData?.average_rating ?? null;
  const profileCompletion = profileData?.profile_completion_percentage ?? 0;
  const profilePhoto = profileData?.photo || null;
  const reviewCount = profileData?.reviews_count ?? 0;

  // Business mode specific data (mock for now, can be replaced with real data)
  const businessEarnings = 45230;
  const businessSpending = 12800;

  const handleViewFullProfile = () => {
    router.push('/profile');
  };

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

  const layoutContent = (
    <>
      <FloatingMenuBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <ProfileCard
                name={userName}
                about={userAbout}
                initial={userInitial}
                profileCompletion={isBusinessMode ? undefined : profileCompletion}
                rating={averageRating}
                reviewCount={reviewCount}
                profilePhoto={profilePhoto}
                // Business mode specific props
                availableForBookings={isBusinessMode ? isAvailableForBookings : undefined}
                earnings={isBusinessMode ? businessEarnings : undefined}
                spending={isBusinessMode ? businessSpending : undefined}
                onAvailabilityChange={isBusinessMode ? setIsAvailableForBookings : undefined}
              />
              <QuickActionsCard 
                actions={isBusinessMode ? businessQuickActions : personalQuickActions}
                onViewFullProfile={handleViewFullProfile}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {isValidElement(children) 
              ? cloneElement(children, { averageRating } as any)
              : children
            }
          </div>
        </div>
      </div>

      {/* Personal Mode Modals */}
      {!isBusinessMode && (
        <>
          {isApplicationsModalOpen && (
            <MyApplicationsModal
              isOpen={isApplicationsModalOpen}
              onClose={() => setIsApplicationsModalOpen(false)}
            />
          )}

          {isSavedJobsModalOpen && (
            <SavedJobsModal
              isOpen={isSavedJobsModalOpen}
              onClose={() => setIsSavedJobsModalOpen(false)}
            />
          )}

          {isTrainingsModalOpen && (
            <TrainingsInProgressModal
              isOpen={isTrainingsModalOpen}
              onClose={() => setIsTrainingsModalOpen(false)}
              trainings={trainingsInProgress}
            />
          )}
        </>
      )}

      {/* Business Mode Modals */}
      {isBusinessMode && (
        <>
          {isUpcomingBookingsModalOpen && (
            <UpcomingBookingsModal
              isOpen={isUpcomingBookingsModalOpen}
              onClose={() => setIsUpcomingBookingsModalOpen(false)}
              bookings={upcomingBookings}
              onMessage={handleBookingMessage}
            />
          )}

          {isChatModalOpen && selectedBookingForMessage && (
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

          {isMyHiresModalOpen && (
            <MyHiresModal
              isOpen={isMyHiresModalOpen}
              onClose={() => setIsMyHiresModalOpen(false)}
              hires={hiredApplicants}
              onSendPaymentProof={handleSendPaymentProof}
            />
          )}
        </>
      )}

      <Tooltip id="quick-actions-tooltip" />
    </>
  );

  return layoutContent;
};

export default YahshuaConnectLayout;

