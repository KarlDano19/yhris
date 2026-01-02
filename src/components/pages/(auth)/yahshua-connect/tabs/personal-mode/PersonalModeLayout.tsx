'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import useGetApplicantProfile from '@/components/hooks/useGetApplicantProfile';
import YahshuaConnectHeader from '../../YahshuaConnectHeader';
import FloatingMenuBar from '../../components/FloatingMenuBar';
import ProfileCard from './components/cards/ProfileCard';
import QuickActionsCard from './components/cards/QuickActionsCard';
import BirdsEyeViewCard from './components/cards/BirdsEyeViewCard';
import MyApplicationsModal from '../../modals/MyApplicationsModal';
import SavedJobsModal from '../../modals/SavedJobsModal';
import TrainingsInProgressModal from '../../modals/TrainingsInProgressModal';
import { useState } from 'react';
import { DocumentTextIcon, BookmarkIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';

interface PersonalModeLayoutProps {
  children: ReactNode;
}

const PersonalModeLayout = ({ children }: PersonalModeLayoutProps) => {
  const router = useRouter();
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [showSavedJobsModal, setShowSavedJobsModal] = useState(false);
  const [showTrainingsModal, setShowTrainingsModal] = useState(false);

  // Fetch applicant profile for sidebar data
  const { data: applicantDetails, isLoading: isProfileLoading } = useGetApplicantProfile();

  const quickActions = [
    {
      icon: UserIcon,
      label: 'Edit Profile',
      onClick: () => router.push('/personal-mode/profile'),
    },
    {
      icon: DocumentTextIcon,
      label: 'My Applications',
      count: 1,
      onClick: () => setShowApplicationsModal(true),
    },
    {
      icon: BookmarkIcon,
      label: 'Saved Jobs',
      count: 1,
      onClick: () => setShowSavedJobsModal(true),
    },
    {
      icon: AcademicCapIcon,
      label: 'Trainings in Progress',
      count: 1,
      onClick: () => setShowTrainingsModal(true),
    },
  ];

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

  const applications = [
    {
      id: 1,
      title: 'Junior UX/UI Designer',
      company: 'The ABBA Initiative, OPC',
      logo: 'AI',
      appliedDate: 'Dec 10, 2025',
      status: 'Under Review',
    },
  ];

  const savedJobs = [
    {
      id: 2,
      title: 'Junior UX/UI Designer',
      company: 'ABC Company',
      location: 'Cebu',
      salary: '₱50,000 - ₱55,000',
      logo: 'AC',
      saved: true,
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

  // Get user name and initial from applicant profile
  const userName = applicantDetails 
    ? `${applicantDetails.firstname || ''} ${applicantDetails.lastname || ''}`.trim() 
    : 'Loading...';
  const userInitial = applicantDetails?.firstname?.[0]?.toUpperCase() || 'U';
  const userTitle = applicantDetails?.resume_summary || 'Aspiring Professional';

  return (
    <>
      <YahshuaConnectHeader />
      <FloatingMenuBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <ProfileCard
                name={userName}
                title={userTitle}
                initial={userInitial}
                profileCompletion={65} // TODO: Calculate actual profile completion
              />
              <QuickActionsCard actions={quickActions} />
              <BirdsEyeViewCard
                userName={userName}
                userInitial={userInitial}
                rating={4.9}
                reviewCount={27}
                reviews={reviews}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            {children}
          </div>
        </div>
      </div>

      {/* Modals */}
      <MyApplicationsModal
        isOpen={showApplicationsModal}
        onClose={() => setShowApplicationsModal(false)}
        applications={applications}
      />
      <SavedJobsModal
        isOpen={showSavedJobsModal}
        onClose={() => setShowSavedJobsModal(false)}
        savedJobs={savedJobs}
      />
      <TrainingsInProgressModal
        isOpen={showTrainingsModal}
        onClose={() => setShowTrainingsModal(false)}
        trainings={trainingsInProgress}
      />
    </>
  );
};

export default PersonalModeLayout;

