'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentTextIcon, BookmarkIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import YahshuaSISHeader from '../../YahshuaSISHeader';
import FloatingMenuBar from '../../components/FloatingMenuBar';
import ProfileCard from './components/cards/ProfileCard';
import QuickActionsCard from './components/cards/QuickActionsCard';
import JobCard from './components/cards/JobCard';
import AlmostThereJobCard from './components/cards/AlmostThereJobCard';
import TrainingCard from './components/cards/TrainingCard';
import ProfileChecklistCard from './components/cards/ProfileChecklistCard';
import PeopleCard from './components/cards/PeopleCard';
import BirdsEyeViewCard from './components/cards/BirdsEyeViewCard';
import MyApplicationsModal from '../../modals/MyApplicationsModal';
import SavedJobsModal from '../../modals/SavedJobsModal';
import TrainingsInProgressModal from '../../modals/TrainingsInProgressModal';
import { UserIcon } from '@heroicons/react/24/solid';

const Content = () => {
  const router = useRouter();
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [showSavedJobsModal, setShowSavedJobsModal] = useState(false);
  const [showTrainingsModal, setShowTrainingsModal] = useState(false);

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
      id: 1,
      title: 'UX Psychology Fundamentals',
      instructor: 'Dr. Michael Park',
      duration: '5 hrs',
      level: 'Beginner',
      rating: 4.9,
      progress: 45,
      price: 'FREE',
    },
  ];

  const quickActions = [
    {
      icon: UserIcon,
      label: 'Edit Profile',
      onClick: () => router.push('/yahshua-sis/personal-mode/profile'),
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

  const jobsMatched = [
    {
      id: 1,
      title: 'Junior UX/UI Designer',
      company: 'The ABBA Initiative, OPC',
      location: 'Manila',
      type: 'Full-time',
      salary: '₱ 30,000 - ₱ 35,000',
      tags: ['UX Research', 'Wireframing', 'Prototyping'],
      logo: 'AI',
      saved: false,
      match: 92,
      applied: true,
    },
    {
      id: 2,
      title: 'Junior UX/UI Designer',
      company: 'ABC Company',
      location: 'Cebu',
      type: 'Full-time',
      salary: '₱ 50,000 - ₱ 55,000',
      tags: ['UX Research', 'Wireframing', 'Prototyping'],
      logo: 'AC',
      saved: true,
      match: 88,
      applied: false,
    },
  ];

  const almostThereJob = {
    title: 'Senior UX/UI Designer',
    company: 'The ABBA Initiative, OPC',
    matchPercentage: 85,
    missingSkills: ['Design System', 'UX Psychology'],
    logo: 'A',
  };

  const recommendedTraining = {
    title: 'Mastering Design System',
    duration: '3 hrs',
    level: 'Intermediate',
    price: 'FREE',
  };

  const profileChecklist = [
    { label: 'Basic Information', completed: true },
    { label: 'Work Experience', completed: true },
    { label: 'Skills & Certifications', completed: false },
  ];

  const peopleYouMayKnow = [
    {
      id: 1,
      name: 'Harry Stylinson',
      title: 'Senior UX Designer',
      initials: 'HS',
      color: 'bg-purple-400',
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

  return (
    <>
      <YahshuaSISHeader />
      <FloatingMenuBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <ProfileCard
                name="Yuri Shimizu"
                title="Aspiring UX/UI Designer"
                initial="Y"
                profileCompletion={65}
              />
              <QuickActionsCard actions={quickActions} />
              <BirdsEyeViewCard
                userName="Yuri Shimizu"
                userInitial="Y"
                rating={4.9}
                reviewCount={27}
                reviews={reviews}
              />
            </div>
          </div>

          {/* Center Content */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Jobs Matched */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Jobs Matched</h2>
                  <p className="text-sm text-gray-600">Jobs that match with you!</p>
                </div>

                <div className="space-y-4">
                  {jobsMatched.map((job) => (
                    <JobCard key={job.id} {...job} />
                  ))}
                </div>
              </div>

              {/* Single Column Layout for Almost-There Jobs and Recommended Training */}
              <div className="space-y-6">
                <AlmostThereJobCard {...almostThereJob} />
                <TrainingCard {...recommendedTraining} />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          {/* <div className="lg:col-span-3">
            <div className="space-y-6">
              <ProfileChecklistCard items={profileChecklist} />
              <PeopleCard people={peopleYouMayKnow} />
            </div>
          </div> */}
        </div>
      </div>

      {/* Modals - Lazy loaded */}
      {showApplicationsModal && (
        <MyApplicationsModal
          isOpen={showApplicationsModal}
          onClose={() => setShowApplicationsModal(false)}
          applications={applications}
        />
      )}
      {showSavedJobsModal && (
        <SavedJobsModal
          isOpen={showSavedJobsModal}
          onClose={() => setShowSavedJobsModal(false)}
          savedJobs={savedJobs}
        />
      )}
      {showTrainingsModal && (
        <TrainingsInProgressModal
          isOpen={showTrainingsModal}
          onClose={() => setShowTrainingsModal(false)}
          trainings={trainingsInProgress}
        />
      )}
    </>
  );
};

export default Content;
