'use client';

import { ReactNode, useState, cloneElement, isValidElement, useMemo } from 'react';

import { useRouter } from 'next/navigation';

import useGetApplicantProfile from '../../hooks/useGetApplicantProfile';
import useGetSavedJobs from '../../hooks/useGetSavedJobs';
import useGetApplicationByUser from '../../hooks/useGetApplicationByUser';
// import YahshuaConnectHeader from '../../YahshuaConnectHeader'; // Moved to header.tsx
import FloatingMenuBar from '../../components/FloatingMenuBar';
import ProfileCard from './components/cards/ProfileCard';
import QuickActionsCard from './components/cards/QuickActionsCard';
import MyApplicationsModal from '../../modals/MyApplicationsModal';
import SavedJobsModal from '../../modals/SavedJobsModal';
import TrainingsInProgressModal from '../../modals/TrainingsInProgressModal';

import { DocumentTextIcon, BookmarkIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface PersonalModeLayoutProps {
  children: ReactNode;
}

const PersonalModeLayout = ({ children }: PersonalModeLayoutProps) => {
  const router = useRouter();
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [isSavedJobsModalOpen, setIsSavedJobsModalOpen] = useState(false);
  const [isTrainingsModalOpen, setIsTrainingsModalOpen] = useState(false);

  // Fetch applicant profile for sidebar data
  const { data: applicantDetails, isLoading: isProfileLoading } = useGetApplicantProfile();
  
  // Fetch saved jobs for count
  const { data: savedJobsData } = useGetSavedJobs();
  const savedJobsCount = savedJobsData && Array.isArray(savedJobsData) ? savedJobsData.length : 0;

  // Fetch applications data for count
  const { data: applicationsData } = useGetApplicationByUser({});
  const applicationsCount = useMemo(() => {
    if (!applicationsData) return 0;
    const applications = applicationsData.data || applicationsData;
    if (!Array.isArray(applications)) return 0;
    return applications.length;
  }, [applicationsData]);

  const quickActions = [
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
    // {
    //   icon: AcademicCapIcon,
    //   label: 'Trainings in Progress',
    //   onClick: () => setIsTrainingsModalOpen(true),
    // },
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
  
  // Get user name and initial from applicant profile
  const userName = profileData 
    ? `${profileData.firstname || ''} ${profileData.lastname || ''}`.trim() 
    : 'Loading...';
  const userInitial = profileData?.firstname?.[0]?.toUpperCase() || 'U';
  
  // Get skills from applicant profile
  const userSkills = profileData?.skills || [];
  
  // Get average rating from applicant profile
  const averageRating = profileData?.average_rating ?? null;
  
  // Get profile completion percentage from applicant profile
  const profileCompletion = profileData?.profile_completion_percentage ?? 0;

  // Get profile photo from applicant profile
  const profilePhoto = profileData?.photo || null;

  // Get review count from applicant profile
  const reviewCount = profileData?.reviews_count ?? 0;

  const handleViewFullProfile = () => {
    router.push('/personal-mode/profile');
  };

  return (
    <>
      {/* <YahshuaConnectHeader /> */} {/* Moved to header.tsx */}
      <FloatingMenuBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <ProfileCard
                name={userName}
                skills={userSkills}
                initial={userInitial}
                profileCompletion={profileCompletion}
                rating={averageRating}
                reviewCount={reviewCount}
                profilePhoto={profilePhoto}
              />
              <QuickActionsCard 
                actions={quickActions}
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

      {/* Modals */}
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
  );
};

export default PersonalModeLayout;

