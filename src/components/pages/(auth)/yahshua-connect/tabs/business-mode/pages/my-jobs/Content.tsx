'use client';

import { useState } from 'react';
import { CheckCircleIcon, ClockIcon, MapPinIcon, CurrencyDollarIcon, ChatBubbleLeftRightIcon, UserIcon, BriefcaseIcon, CalendarIcon } from '@heroicons/react/24/outline';
import YahshuaConnectHeader from '../../../../YahshuaConnectHeader';
import FloatingMenuBar from '../../../../components/FloatingMenuBar';
import ProfileCard from '../../components/cards/ProfileCard';
import QuickActionsCard from '../../components/cards/QuickActionsCard';
import EarningsCard from '../../components/cards/EarningsCard';
import BirdsEyeViewCard from '../../components/cards/BirdsEyeViewCard';
import UpcomingBookingsModal from '../../components/modals/UpcomingBookingsModal';
import { useMyJobsData } from '../../hooks/useMyJobsData';

const Content = () => {
  const [isUpcomingBookingsModalOpen, setIsUpcomingBookingsModalOpen] = useState(false);

  const { activeJobs, reviews } = useMyJobsData();

  // Transform activeJobs for the modal
  const upcomingBookings = activeJobs.map((job) => ({
    id: job.id,
    title: job.title,
    clientName: job.clientName,
    location: job.location,
    time: job.time,
    priceRange: job.priceRange,
  }));

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
                    href: '/yahshua-connect/edit-profile',
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
              {/* My Jobs Header */}
              <div className="bg-white rounded-lg shadow-sm p-5">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900">My Active Jobs</h2>
                  <p className="text-sm text-gray-600">Manage your active and upcoming jobs</p>
                </div>

                {/* Active Jobs List */}
                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <div
                      key={job.id}
                      className={`bg-white border-2 rounded-xl p-5 hover:shadow-md transition-all ${
                        job.urgent ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      {/* Header with Status Badges */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {job.urgent && (
                              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                                Urgent
                              </span>
                            )}
                            {job.status === 'accepted' && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                                Scheduled
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{job.title}</h3>
                        </div>
                      </div>

                      {/* Client Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold">
                          {job.clientInitials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{job.clientName}</p>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <ClockIcon className="h-4 w-4 text-gray-500" />
                          <span>{job.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPinIcon className="h-4 w-4 text-gray-500" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">{job.priceRange}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                          <ChatBubbleLeftRightIcon className="h-5 w-5" />
                          Message
                        </button>
                        <button className="flex-1 px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                          Start
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
