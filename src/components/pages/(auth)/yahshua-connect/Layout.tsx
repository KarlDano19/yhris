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
import { JobStateProvider, useJobState } from './tabs/business-mode/contexts/JobStateContext';
import { useMyJobsData } from './tabs/business-mode/hooks/useMyJobsData';
import { useHomeData } from './tabs/business-mode/hooks/useHomeData';
import UpcomingBookingsModal from './tabs/business-mode/components/modals/UpcomingBookingsModal';
import MyHiresModal from './tabs/business-mode/components/modals/MyHiresModal';
import JobChatModal from './tabs/business-mode/components/modals/JobChatModal';

interface YahshuaConnectLayoutProps {
  children: ReactNode;
}

// Business mode content component that uses hooks requiring JobStateProvider
const BusinessModeContent = ({ 
  children, 
  onBookingsDataReady 
}: { 
  children: ReactNode;
  onBookingsDataReady: (data: {
    activeJobs: any[];
    acceptedJobIds: Set<number>;
    jobRequests: any[];
  }) => void;
}) => {
  const { activeJobs } = useMyJobsData();
  const { acceptedJobIds } = useJobState();
  const { jobRequests: initialJobRequests } = useHomeData();

  // Convert Set to array for stable comparison in useEffect
  const acceptedJobIdsArray = Array.from(acceptedJobIds).sort().join(',');
  // Create stable string representations for arrays
  const activeJobsKey = activeJobs.map(j => j.id).sort().join(',');
  const jobRequestsKey = initialJobRequests.map(j => j.id).sort().join(',');
  
  // Use ref to track previous values and prevent unnecessary calls
  const prevDataRef = useRef<string>('');
  const currentDataKey = `${activeJobsKey}|${acceptedJobIdsArray}|${jobRequestsKey}`;

  useEffect(() => {
    // Only call if data actually changed
    if (prevDataRef.current !== currentDataKey) {
      try {
        onBookingsDataReady({ activeJobs, acceptedJobIds, jobRequests: initialJobRequests });
        prevDataRef.current = currentDataKey;
      } catch (error) {
        console.error('Error in onBookingsDataReady:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDataKey, onBookingsDataReady]);

  return <>{children}</>;
};

const YahshuaConnectLayout = ({ children }: YahshuaConnectLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  
  // Determine mode from pathname
  const isBusinessMode = pathname?.includes('business-mode') || false;

  // Business mode data state
  const [businessModeData, setBusinessModeData] = useState<{
    activeJobs: any[];
    acceptedJobIds: Set<number>;
    jobRequests: any[];
  }>({
    activeJobs: [],
    acceptedJobIds: new Set(),
    jobRequests: [],
  });

  // Memoize the callback to prevent infinite re-renders
  const handleBookingsDataReady = useCallback((data: {
    activeJobs: any[];
    acceptedJobIds: Set<number>;
    jobRequests: any[];
  }) => {
    setBusinessModeData(data);
  }, []);

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
      onClick: () => setIsApplicationsModalOpen(true),
    },
    {
      icon: BookmarkIcon,
      label: 'Saved Jobs',
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
  const acceptedJobsFromRequests = isBusinessMode ? businessModeData.jobRequests
    .filter((job: any) => businessModeData.acceptedJobIds.has(job.id))
    .map((job: any) => ({
      id: job.id,
      title: job.title,
      clientName: job.clientName,
      location: job.clientLocation,
      time: job.time,
      priceRange: job.priceRange,
      clientInitials: job.clientInitials,
    })) : [];

  const allUpcomingBookings = isBusinessMode ? [
    ...businessModeData.activeJobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      clientName: job.clientName,
      location: job.location,
      time: job.time,
      priceRange: job.priceRange,
      clientInitials: job.clientInitials,
    })),
    ...acceptedJobsFromRequests.filter(
      (newJob: any) => !businessModeData.activeJobs.some((existingJob: any) => existingJob.id === newJob.id)
    ),
  ] : [];

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
  const businessTitle = 'Plumber • Electrician';
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
                about={isBusinessMode ? undefined : userAbout}
                title={isBusinessMode ? businessTitle : undefined}
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
      )}

      <Tooltip id="quick-actions-tooltip" />
    </>
  );

  // Wrap with JobStateProvider if in business mode
  if (isBusinessMode) {
    return (
      <JobStateProvider>
        <BusinessModeContent onBookingsDataReady={handleBookingsDataReady}>
          {layoutContent}
        </BusinessModeContent>
      </JobStateProvider>
    );
  }

  return layoutContent;
};

export default YahshuaConnectLayout;

