'use client';

import { ReactNode, useState, cloneElement, isValidElement, useEffect, useCallback, useRef, useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Tooltip } from 'react-tooltip';
import { CalendarIcon, UserGroupIcon, DocumentTextIcon, BookmarkIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

// Personal mode imports
import useGetApplicantProfile from './hooks/useGetApplicantProfile';
import useGetSavedJobs from './hooks/useGetSavedJobs';
import useGetApplicationByUser from './hooks/useGetApplicationByUser';
import useGetMyHires from './hooks/useGetMyHires';
import useGetUpcomingBookings from './hooks/useGetUpcomingBookings';
import FloatingMenuBar from './components/FloatingMenuBar';
import ProfileCard from './components/ProfileCard';
import QuickActionsCard from './components/QuickActionsCard';
import MyApplicationsModal from './modals/MyApplicationsModal';
import SavedJobsModal from './modals/SavedJobsModal';
import TrainingsInProgressModal from './modals/TrainingsInProgressModal';

// Business mode imports
import UpcomingBookingsModal from './modals/UpcomingBookingsModal';
import MyHiresModal from './modals/MyHiresModal';
import ChatModal from '@/components/common/chat/ChatModal';

interface YahshuaConnectLayoutProps {
  children: ReactNode;
}

const YahshuaConnectLayout = ({ children }: YahshuaConnectLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  
  // Determine mode from pathname
  const isBusinessMode = pathname?.includes('business-mode') || false;

  // My Hires data hook (for business mode)
  const { data: myHiresData, isLoading: isMyHiresLoading } = useGetMyHires();

  // Upcoming Bookings data hook (for business mode)
  const { data: upcomingBookingsData, isLoading: isUpcomingBookingsLoading } = useGetUpcomingBookings();

  // Personal mode state
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [isSavedJobsModalOpen, setIsSavedJobsModalOpen] = useState(false);
  const [isTrainingsModalOpen, setIsTrainingsModalOpen] = useState(false);
  const [savedJobsHighlightId, setSavedJobsHighlightId] = useState<number | null>(null);
  const searchParams = useSearchParams();

  // Open SavedJobsModal when URL contains openSavedJobs param (used by notifications)
  useEffect(() => {
    if (isBusinessMode) return;
    try {
      const open = searchParams?.get?.('openSavedJobs');
      const highlight = searchParams?.get?.('highlight');
      if (open) {
        setSavedJobsHighlightId(highlight ? parseInt(highlight, 10) : null);
        setIsSavedJobsModalOpen(true);
        // clear the query params from URL
        try {
          router.replace(pathname || '/personal-mode');
        } catch (err) {}
      }
    } catch (e) {
      // ignore
    }
  }, [searchParams?.toString(), isBusinessMode, router, pathname]);

  // Personal mode data hooks
  const { data: applicantDetails, isLoading: isProfileLoading } = useGetApplicantProfile();
  const { data: savedJobsData } = useGetSavedJobs();

  // Handle response structure (data might be wrapped in 'data' field or at root level)
  const profileData = applicantDetails?.data || applicantDetails;

  // Business mode state
  const [isUpcomingBookingsModalOpen, setIsUpcomingBookingsModalOpen] = useState(false);
  const [isMyHiresModalOpen, setIsMyHiresModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isAvailableForBookings, setIsAvailableForBookings] = useState<boolean | undefined>(undefined);
  const [selectedBookingForMessage, setSelectedBookingForMessage] = useState<{
    jobId: number;
    title: string;
    clientId: number;
    clientName: string;
    clientInitials: string;
    clientPhoto: string | null;
    location: string;
    time: string;
    priceRange: string;
  } | null>(null);

  // Memoize empty filters object to prevent unnecessary re-renders
  const applicationFilters = useMemo(() => ({}), []);
  const { data: applicationsData } = useGetApplicationByUser(applicationFilters);

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

  // Sync availability state with API data when profile loads (business mode only)
  useEffect(() => {
    if (isBusinessMode && profileData && profileData.available_for_bookings !== undefined) {
      setIsAvailableForBookings(profileData.available_for_bookings);
    }
  }, [isBusinessMode, profileData]);

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
  // Transform upcoming bookings data from API to modal format
  const allUpcomingBookings = isBusinessMode && upcomingBookingsData && Array.isArray(upcomingBookingsData)
    ? upcomingBookingsData.map((booking) => {
        // Generate client initials
        const clientInitials = booking.client_name
          ? booking.client_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase()
          : 'UN';

        // Format price range
        let priceRange = '';
        if (booking.budget_type === 'fixed_rate') {
          if (booking.min_amount && booking.max_amount) {
            priceRange = `₱${booking.min_amount.toLocaleString()} - ₱${booking.max_amount.toLocaleString()}`;
          } else if (booking.max_amount) {
            priceRange = `₱${booking.max_amount.toLocaleString()}`;
          } else if (booking.min_amount) {
            priceRange = `₱${booking.min_amount.toLocaleString()}`;
          }
        } else if (booking.budget_type === 'hourly_rate' && booking.hourly_rate) {
          priceRange = `₱${booking.hourly_rate.toLocaleString()}/hr`;
        }

        // Format time
        let time = '';
        if (booking.contract_start_date) {
          const startDate = new Date(booking.contract_start_date);
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          if (startDate.toDateString() === today.toDateString()) {
            time = 'Today';
          } else if (startDate.toDateString() === tomorrow.toDateString()) {
            time = 'Tomorrow';
          } else {
            time = startDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: startDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
          }

          if (booking.time_from) {
            time += `, ${booking.time_from}`;
          }
        } else if (booking.date) {
          const jobDate = new Date(booking.date);
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          if (jobDate.toDateString() === today.toDateString()) {
            time = 'Today';
          } else if (jobDate.toDateString() === tomorrow.toDateString()) {
            time = 'Tomorrow';
          } else {
            time = jobDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: jobDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
          }

          if (booking.time_from) {
            time += `, ${booking.time_from}`;
          }
        }

        return {
          id: booking.id, // Job posting ID
          applicationId: booking.application_id,
          title: booking.job_title,
          clientId: booking.client_id || 0,
          clientName: booking.client_name || 'Unknown Client',
          clientInitials,
          clientPhoto: booking.client_photo || null,
          location: booking.location || 'Location not specified',
          time: time || 'Not scheduled',
          priceRange: priceRange || 'Not specified',
        };
      })
    : [];

  const upcomingBookings = allUpcomingBookings;

  // Transform my hires data from API to the format expected by MyHiresModal
  const hiredApplicants = isBusinessMode && myHiresData?.records
    ? myHiresData.records.map((hire) => {
        // Map work_status to modal status
        let status: 'in-progress' | 'completed' | 'pending' = 'pending';
        if (hire.application_work_status === 'started') {
          status = 'in-progress';
        } else if (hire.application_work_status === 'completed') {
          status = 'completed';
        } else if (hire.application_work_status === 'not_started') {
          status = 'pending';
        }
        
        // Calculate price from job posting budget
        let price = 0;
        if (hire.application_payment_amount) {
          price = hire.application_payment_amount;
        } else if (hire.budget_type === 'fixed_rate') {
          price = hire.max_amount || hire.min_amount || 0;
        } else if (hire.budget_type === 'hourly_rate') {
          price = hire.hourly_rate || 0;
        }
        
        // Generate initials from hired applicant name
        const providerInitials = hire.hired_applicant_name
          ? hire.hired_applicant_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase()
          : 'UN';
        
        return {
          id: hire.application_id,
          serviceName: hire.job_title,
          providerName: hire.hired_applicant_name || 'Unknown',
          providerInitials,
          status,
          price,
        };
      })
    : [];

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
      count: hiredApplicants.length,
      badgeColor: 'purple' as const,
      onClick: () => setIsMyHiresModalOpen(true),
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
    clientId: number;
    clientName: string;
    clientInitials: string;
    clientPhoto: string | null;
    location: string;
    time: string;
    priceRange: string;
  }) => {
    setSelectedBookingForMessage({
      jobId: booking.id,
      title: booking.title,
      clientId: booking.clientId,
      clientName: booking.clientName,
      clientInitials: booking.clientInitials,
      clientPhoto: booking.clientPhoto,
      location: booking.location,
      time: booking.time,
      priceRange: booking.priceRange,
    });
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
              onClose={() => {
                setIsSavedJobsModalOpen(false);
                setSavedJobsHighlightId(null);
                try {
                  router.replace(pathname || '/personal-mode');
                } catch (err) {}
              }}
              highlightJobId={savedJobsHighlightId}
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
            <ChatModal
              isOpen={isChatModalOpen}
              onClose={() => {
                setIsChatModalOpen(false);
                setSelectedBookingForMessage(null);
              }}
              recipientId={selectedBookingForMessage.clientId}
              recipientName={selectedBookingForMessage.clientName}
              recipientInitials={selectedBookingForMessage.clientInitials}
              recipientPhoto={selectedBookingForMessage.clientPhoto}
              jobId={selectedBookingForMessage.jobId}
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
