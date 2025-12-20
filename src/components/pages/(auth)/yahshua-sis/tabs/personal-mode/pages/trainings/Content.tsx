'use client';

import { AcademicCapIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import YahshuaSISHeader from '../../../../YahshuaSISHeader';
import FloatingMenuBar from '../../../../components/FloatingMenuBar';
import ProfileCard from '../../components/cards/ProfileCard';
import QuickActionsCard from '../../components/cards/QuickActionsCard';
import BirdsEyeViewCard from '../../components/cards/BirdsEyeViewCard';
import { DocumentTextIcon, BookmarkIcon, AcademicCapIcon as AcademicCapIconOutline } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MyApplicationsModal from '../../../../modals/MyApplicationsModal';
import SavedJobsModal from '../../../../modals/SavedJobsModal';
import TrainingsInProgressModal from '../../../../modals/TrainingsInProgressModal';

const Content = () => {
  const router = useRouter();
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [showSavedJobsModal, setShowSavedJobsModal] = useState(false);
  const [showTrainingsModal, setShowTrainingsModal] = useState(false);

  const quickActions = [
    {
      icon: UserIcon,
      label: 'Edit Profile',
      onClick: () => router.push('/yahshua-sis/profile'),
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
      icon: AcademicCapIconOutline,
      label: 'Trainings in Progress',
      count: 1,
      onClick: () => setShowTrainingsModal(true),
    },
  ];

  const allTrainings = [
    {
      id: 1,
      title: 'Mastering Design System',
      duration: '3 hrs',
      level: 'Intermediate',
      instructor: 'Sarah Chen',
      rating: 4.8,
      students: 1250,
      free: true,
      progress: 0,
    },
    {
      id: 2,
      title: 'UX Psychology Fundamentals',
      duration: '5 hrs',
      level: 'Beginner',
      instructor: 'Dr. Michael Park',
      rating: 4.9,
      students: 3420,
      free: true,
      progress: 45,
    },
    {
      id: 3,
      title: 'Advanced Prototyping',
      duration: '4 hrs',
      level: 'Advanced',
      instructor: 'Lisa Wong',
      rating: 4.7,
      students: 890,
      free: false,
      price: 499,
      progress: 0,
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return starValue <= rating ? (
        <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
      ) : null;
    });
  };

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
              {/* Training Hub Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Training Hub</h2>

                {/* Training List */}
                <div className="space-y-4">
                  {allTrainings.map((training) => (
                    <div
                      key={training.id}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <AcademicCapIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{training.title}</h3>
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <span>
                            {training.duration} • {training.level}
                          </span>
                          <div className="flex items-center gap-1">
                            {renderStars(training.rating)}
                            <span className="ml-1">{training.rating}</span>
                          </div>
                          {training.free ? (
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                              FREE
                            </span>
                          ) : (
                            <span className="text-sm font-semibold text-gray-700">
                              ₱{training.price}
                            </span>
                          )}
                        </div>
                        {training.progress > 0 && (
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-savoy-blue rounded-full transition-all"
                                style={{ width: `${training.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {training.progress}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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

export default Content;
