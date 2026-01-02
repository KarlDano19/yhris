'use client';

import { useState } from 'react';
import { PlusIcon, PencilIcon, EyeIcon, UserIcon, BriefcaseIcon, CalendarIcon, CurrencyDollarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import YahshuaConnectHeader from '../../../../YahshuaConnectHeader';
import FloatingMenuBar from '../../../../components/FloatingMenuBar';
import ProfileCard from '../../components/cards/ProfileCard';
import QuickActionsCard from '../../components/cards/QuickActionsCard';
import EarningsCard from '../../components/cards/EarningsCard';
import BirdsEyeViewCard from '../../components/cards/BirdsEyeViewCard';
import PostJobModal from '../../components/modals/PostJobModal';
import UpcomingBookingsModal from '../../components/modals/UpcomingBookingsModal';
import { useHireData } from '../../hooks/useHireData';
import { useMyJobsData } from '../../hooks/useMyJobsData';

const Content = () => {
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isUpcomingBookingsModalOpen, setIsUpcomingBookingsModalOpen] = useState(false);
  const { jobPostings, reviews } = useHireData();
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

  const handlePostJob = (data: {
    jobTitle: string;
    category: string;
    description: string;
    location: string;
    budgetMin: string;
    budgetMax: string;
    scheduleDate: string;
    scheduleTime: string;
  }) => {
    // TODO: Implement API call to post job
    console.log('Posting job:', data);
    // For now, just log the data
  };

  return (
    <>
      <YahshuaConnectHeader />
      <FloatingMenuBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Three Column Layout */}
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
              />
              <EarningsCard thisMonth={45230} jobsDone={23} />
              <QuickActionsCard
                actions={[
                  {
                    icon: UserIcon,
                    label: 'Edit Profile',
                    href: '/yahshua-connect/business-mode/edit-profile',
                  },
                  {
                    icon: BriefcaseIcon,
                    label: 'Active Jobs',
                    count: activeJobs.length,
                    badgeColor: 'green',
                    href: '/yahshua-connect/business-mode/my-jobs',
                  },
                  {
                    icon: CalendarIcon,
                    label: 'Upcoming Bookings',
                    count: activeJobs.length,
                    badgeColor: 'purple',
                    onClick: () => setIsUpcomingBookingsModalOpen(true),
                  },
                  {
                    icon: CurrencyDollarIcon,
                    label: 'View Earnings',
                    href: '/yahshua-connect/business-mode/earnings',
                  },
                ]}
              />
              <BirdsEyeViewCard
                userName="John Doe"
                userInitial="JD"
                rating={4.9}
                reviewCount={27}
                reviews={reviews}
              />
            </div>
          </div>

          {/* Center Content */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Hire Header */}
              <div className="bg-white rounded-lg shadow-sm  p-5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Hire Someone</h2>
                  <button
                    onClick={() => setIsPostJobModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-savoy-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Post a Job</span>
                  </button>
                </div>

                {/* Job Postings List */}
                <div className="space-y-4">
                  {jobPostings.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {job.category} • {job.location}
                          </p>
                          <p className="text-sm text-gray-700 mb-4">{job.description}</p>
                        </div>
                        {job.status === 'active' && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Job Details */}
                      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4" />
                          <span>
                            {job.date}, {job.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="h-4 w-4" />
                          <span className="font-semibold text-green-600">{job.priceRange}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserGroupIcon className="h-4 w-4" />
                          <span>{job.applicants} applicants</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button className="flex-1 px-4 py-2 border border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-blue-50 transition-colors">
                          View Applicants
                        </button>
                        <button className="flex-1 px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                          Edit Post
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onSubmit={handlePostJob}
      />

      {/* Upcoming Bookings Modal */}
      <UpcomingBookingsModal
        isOpen={isUpcomingBookingsModalOpen}
        onClose={() => setIsUpcomingBookingsModalOpen(false)}
        bookings={upcomingBookings}
      />
    </>
  );
};

export default Content;
