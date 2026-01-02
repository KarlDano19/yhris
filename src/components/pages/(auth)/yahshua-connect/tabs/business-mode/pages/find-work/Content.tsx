'use client';

import { useState } from 'react';
import { FunnelIcon, UserIcon, BriefcaseIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import YahshuaConnectHeader from '../../../../YahshuaConnectHeader';
import FloatingMenuBar from '../../../../components/FloatingMenuBar';
import ProfileCard from '../../components/cards/ProfileCard';
import QuickActionsCard from '../../components/cards/QuickActionsCard';
import EarningsCard from '../../components/cards/EarningsCard';
import BirdsEyeViewCard from '../../components/cards/BirdsEyeViewCard';
import JobRequestCard from '../../components/cards/JobRequestCard';
import UpcomingBookingsModal from '../../components/modals/UpcomingBookingsModal';
import FilterRequestsModal from '../../components/modals/FilterRequestsModal';
import { useFindWorkData } from '../../hooks/useFindWorkData';
import { useMyJobsData } from '../../hooks/useMyJobsData';

const Content = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isUpcomingBookingsModalOpen, setIsUpcomingBookingsModalOpen] = useState(false);

  const { jobRequests, reviews } = useFindWorkData();
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

  const handleApplyFilters = (filters: {
    location: string;
    skills: string[];
    urgentOnly: boolean;
  }) => {
    // TODO: Implement filter logic
    console.log('Applied filters:', filters);
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
              {/* Find Work Header */}
              <div className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Find Work</h2>
                    <p className="text-sm text-gray-600">Browse available job requests near you</p>
                  </div>
                  <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FunnelIcon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Filters</span>
                  </button>
                </div>

                {/* Job Requests List */}
                <div className="space-y-4">
                  {jobRequests.map((job) => (
                    <JobRequestCard key={job.id} {...job} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Requests Modal */}
      <FilterRequestsModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
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
